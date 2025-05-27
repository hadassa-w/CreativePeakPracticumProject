using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using System.Net;
using CreativePeak.Core.Models;

namespace CreativePeak.API.Controllers
{
    public class ForgotPasswordController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public ForgotPasswordController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpPost("ForgotPassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            try
            {
                // חיפוש המשתמש לפי email
                var normalizedEmail = _userManager.NormalizeEmail(request.Email);
                var user = await _userManager.FindByEmailAsync(normalizedEmail);
                //var user = await _userManager.FindByEmailAsync(request.Email.Trim().ToLower());
                if (user == null)
                {
                    // מחזירים הודעה כללית כדי לא לחשוף מידע על קיום המשתמש
                    return Ok(new { message = "If the email exists, a temporary password has been sent." });
                }

                // יצירת סיסמה זמנית
                string temporaryPassword = GenerateTemporaryPassword();

                // עדכון הסיסמה בבסיס הנתונים
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var result = await _userManager.ResetPasswordAsync(user, token, temporaryPassword);

                if (!result.Succeeded)
                {
                    return BadRequest(new { message = "Failed to reset password" });
                }

                // שליחת המייל
                await SendTemporaryPasswordEmail(user.Email, temporaryPassword);

                return Ok(new { message = "Temporary password sent successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return StatusCode(500, new { message = "An error occurred while processing your request" });
            }
        }

        private string GenerateTemporaryPassword()
        {
            // יצירת סיסמה זמנית בטוחה
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, 12)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        private async Task SendTemporaryPasswordEmail(string email, string temporaryPassword)
        {
            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential("wh.33681@gmail.com", Environment.GetEnvironmentVariable("Gmail_key")),
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress("wh.33681@gmail.com", "Creative Peak"), // כתובת השולח
                Subject = "Your Temporary Password - Creative Peak",
                Body = $@"
            <html>
            <body>
                <h2>Password Reset - Creative Peak</h2>
                <p>Hello!</p>
                <p>You requested a password reset. Here is your temporary password:</p>
                <div style='background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;'>
                    <strong style='font-size: 18px; color: #512da8;'>{temporaryPassword}</strong>
                </div>
                <p>Please use this temporary password to log in, and we recommend changing it to a new password after logging in.</p>
                <p>If you didn't request this password reset, please contact our support team.</p>
                <br>
                <p>Best regards,<br>Creative Peak Team</p>
            </body>
            </html>",
                IsBodyHtml = true
            };

            mailMessage.To.Add(email);

            await smtpClient.SendMailAsync(mailMessage);
        }
    }
}
