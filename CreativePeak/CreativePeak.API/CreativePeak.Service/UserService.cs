using CreativePeak.Core.IServices;
using CreativePeak.Core.IRepositories;
using CreativePeak.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net.Mail;
using System.Net;
using System.Security.Cryptography;
using Microsoft.Extensions.Configuration;

namespace CreativePeak.Service
{
    public class UserService : IUserService
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IUserRepository _userRepository;
        private readonly PasswordService _passwordService;

        public UserService(IRepositoryManager repositoryManager, IUserRepository userRepository, PasswordService passwordService)
        {
            _repositoryManager = repositoryManager;
            _userRepository = userRepository;
            _passwordService = passwordService;
        }

        public async Task<User> AddAsync(User user)
        {
            var newUser = await _repositoryManager.Users.AddAsync(user);
            _repositoryManager.Save();
            return newUser;
        }

        public void Delete(User user)
        {
            _repositoryManager.Users.Delete(user);
            _repositoryManager.Save();
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _repositoryManager.Users.GetAllAsync();
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _repositoryManager.Users.GetByIdAsync(id);
        }

        public async Task<User?> UpdateAsync(int id, User user)
        {
            var dbUser = await GetByIdAsync(id);
            if (dbUser == null)
            {
                return null;
            }
            dbUser.FullName = user.FullName;
            dbUser.Email = user.Email;
            dbUser.Password = user.Password;
            dbUser.Phone = user.Phone;
            dbUser.Address = user.Address;
            dbUser.CreatedAt = user.CreatedAt;
            dbUser.UpdatedAt = user.UpdatedAt;

            await _repositoryManager.Users.UpdateAsync(dbUser);
            _repositoryManager.Save();
            return dbUser;
        }

        public async Task<bool> ForgotPasswordAsync(string email)
        {
            try
            {
                // חיפוש המשתמש בטבלת User
                var user = await _userRepository.GetByEmailAsync(email);
                if (user == null)
                {
                    return true;
                }

                // יצירת סיסמה זמנית
                var temporaryPassword = GenerateTemporaryPassword();
                Console.WriteLine(temporaryPassword);
                user.TempPassword = _passwordService.HashPassword(temporaryPassword);
                user.TempPasswordExpiry = DateTime.UtcNow.AddHours(24); // תוקף של 24 שעות
                user.UpdatedAt = DateTime.UtcNow;

                await _userRepository.UpdateAsync(user);

                // שליחת המייל עם הסיסמה הזמנית
                await SendTemporaryPasswordEmailAsync(email, temporaryPassword, user.FullName);

                return true;
            }
            catch (Exception ex)
            {
                // לוג השגיאה
                Console.WriteLine($"Error in ForgotPasswordAsync: {ex.Message}");
                return false;
            }
        }

        public async Task<User?> AuthenticateAsync(string email, string password)
        {
            try
            {
                var user = await _userRepository.GetByEmailAsync(email);
                if (user == null)
                {
                    return null;
                }

                    Console.WriteLine(user.TempPassword);
                    Console.WriteLine(password);
                // בדיקה אם הסיסמה הרגילה נכונה
                if (_passwordService.VerifyPassword(user.Password, password))
                {
                    return user;
                }

                // בדיקה אם יש סיסמה זמנית בתוקף
                if (!string.IsNullOrEmpty(user.TempPassword) &&
                    user.TempPasswordExpiry.HasValue &&
                    user.TempPasswordExpiry.Value > DateTime.UtcNow)
                {
                    // בדיקה אם הסיסמה הזמנית נכונה
                    if (_passwordService.VerifyPassword(user.TempPassword, password))
                    {
                        return user;
                    }
                }

                return null; // שתי הסיסמאות לא נכונות
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in AuthenticateAsync: {ex.Message}");
                return null;
            }
        }

        // פונקציה לשינוי סיסמה (מבטלת את הסיסמה הזמנית)
        public async Task<bool> ChangePasswordAsync(string email, string newPassword)
        {
            try
            {
                var user = await _userRepository.GetByEmailAsync(email);
                if (user == null)
                {
                    return false;
                }

                // עדכון הסיסמה הרגילה
                user.Password = _passwordService.HashPassword(newPassword);

                // ביטול הסיסמה הזמנית
                user.TempPassword = null;
                user.TempPasswordExpiry = null;
                user.UpdatedAt = DateTime.UtcNow;

                await _userRepository.UpdateAsync(user);

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in ChangePasswordAsync: {ex.Message}");
                return false;
            }
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _userRepository.GetByEmailAsync(email);
        }

        public string GenerateTemporaryPassword()
        {
            const string upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
            const string lower = "abcdefghijkmnpqrstuvwxyz";
            const string digits = "23456789";
            const string special = "!@#$%^&*";

            var random = new Random();
            var passwordChars = new List<char>
            {
                upper[random.Next(upper.Length)],
                lower[random.Next(lower.Length)],
                digits[random.Next(digits.Length)],
                special[random.Next(special.Length)]
            };

            // השארת 4 תווים נוספים באופן רנדומלי מתוך כל התווים
            string allChars = upper + lower + digits + special;
            for (int i = 0; i < 4; i++)
            {
                passwordChars.Add(allChars[random.Next(allChars.Length)]);
            }

            // ערבוב הסיסמה כדי שהתווים לא יהיו תמיד באותו סדר
            return new string(passwordChars.OrderBy(x => random.Next()).ToArray());
        }

        public async Task SendTemporaryPasswordEmailAsync(string email, string temporaryPassword, string firstName)
        {
            try
            {
                var gmailKey = Environment.GetEnvironmentVariable("Gmail_key");

                using (var client = new SmtpClient("smtp.gmail.com", 587))
                {
                    client.EnableSsl = true;
                    client.Credentials = new NetworkCredential("wh.33681@gmail.com", gmailKey);

                    var mailMessage = new MailMessage();
                    mailMessage.From = new MailAddress("wh.33681@gmail.com", "CreativePeak");
                    mailMessage.To.Add(email);
                    mailMessage.Subject = "Temporary Password - CreativePeak";

                    mailMessage.Body = $@"
                    <!DOCTYPE html>
                    <html lang='en'>
                    <head>
                        <meta charset='UTF-8'>
                        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                        <title>Password Reset</title>
                        <style>
                            body {{
                                font-family: Arial, sans-serif;
                                background-color: #f9f9f9;
                                margin: 0;
                                padding: 0;
                            }}
                            .email-container {{
                                max-width: 600px;
                                margin: 30px auto;
                                background-color: white;
                                border-radius: 8px;
                                box-shadow: 0 0 8px rgba(0,0,0,0.1);
                                overflow: hidden;
                            }}
                            header {{
                                background-color: #512da8;
                                color: white;
                                text-align: center;
                                padding: 30px 20px;
                            }}
                            header .lock-icon {{
                                font-size: 40px;
                                margin-bottom: 10px;
                            }}
                            main {{
                                padding: 25px 20px;
                                color: #333;
                            }}
                            .temporary-password {{
                                background-color: #f5f5f5;
                                padding: 15px;
                                border-radius: 5px;
                                margin: 10px 0;
                                text-align: center;
                                font-size: 24px;
                                font-family: monospace;
                                color: #512da8;
                                font-weight: bold;
                            }}
                            ul {{
                                margin-left: 20px;
                            }}
                            footer {{
                                background-color: #f0f0f0;
                                text-align: center;
                                padding: 20px;
                                font-size: 14px;
                                color: #666;
                            }}
                        </style>
                    </head>
                    <body>
                        <div class='email-container'>
                            <header>
                                <div class='lock-icon' aria-hidden='true'>🔒</div>
                                <h1>Password Reset Requested</h1>
                                <p>CreativePeak - Your Design Hub</p>
                            </header>
                            <main>
                                <p>Hello {firstName},</p>
                                <p>We have received a request to reset your password. Below you will find your temporary password. Please use it to log in and change your password immediately for security reasons.</p>
                                <div class='temporary-password' aria-live='polite' aria-atomic='true'>{temporaryPassword}</div>
                                <p><strong>Important Instructions</strong></p>
                                <ul>
                                    <li>Use the temporary password above only once to log in.</li>
                                    <li>Change your password immediately after login to secure your account.</li>
                                    <li>If you did not request this reset, please contact our support team immediately.</li>
                                    <li>Keep your password confidential and do not share it with anyone.</li>
                                </ul>
                                <p><strong>Security Notice:</strong> This temporary password will expire within 24 hours. After that, you will need to request a new password reset if necessary.</p>
                            </main>
                            <footer>
                                <p>Best regards,<br/>The CreativePeak Team</p>
                                <p>CreativePeak - Inspiring creativity, one design at a time.</p>
                            </footer>
                        </div>
                    </body>
                    </html>";

                    mailMessage.IsBodyHtml = true;

                    await client.SendMailAsync(mailMessage);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending email: {ex.Message}");
                throw;
            }
        }
        public async Task SendWelcomeEmailAsync(string email, string firstName)
        {
            try
            {
                var gmailKey = Environment.GetEnvironmentVariable("Gmail_key");

                using (var client = new SmtpClient("smtp.gmail.com", 587))
                {
                    client.EnableSsl = true;
                    client.Credentials = new NetworkCredential("wh.33681@gmail.com", gmailKey);

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress("wh.33681@gmail.com", "CreativePeak"),
                        Subject = "Welcome to CreativePeak!",
                        IsBodyHtml = true,
                        Body = $@"
                        <!DOCTYPE html>
                        <html lang='en' dir='ltr'>
                        <head>
                            <meta charset='UTF-8'>
                            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                            <title>Welcome to CreativePeak</title>
                            <style>
                                body {{
                                    font-family: Arial, sans-serif;
                                    direction: ltr;
                                    background-color: #f6f6f6;
                                    margin: 0;
                                    padding: 0;
                                }}
                                .email-container {{
                                    max-width: 600px;
                                    margin: auto;
                                    background-color: #ffffff;
                                    padding: 40px;
                                    border-radius: 10px;
                                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                                }}
                                .header {{
                                    background-color: #512da8;
                                    color: white;
                                    padding: 20px;
                                    border-radius: 10px 10px 0 0;
                                    text-align: center;
                                }}
                                .logo {{
                                    font-size: 24px;
                                    font-weight: bold;
                                }}
                                .welcome-title {{
                                    font-size: 28px;
                                    margin-top: 10px;
                                }}
                                .content {{
                                    padding: 30px;
                                }}
                                .greeting {{
                                    font-size: 20px;
                                    font-weight: bold;
                                    margin-bottom: 15px;
                                }}
                                .excitement {{
                                    font-size: 18px;
                                    color: #512da8;
                                    margin-bottom: 20px;
                                }}
                                .main-text {{
                                    font-size: 16px;
                                    margin-bottom: 20px;
                                    line-height: 1.6;
                                }}
                                .tips-section {{
                                    margin-top: 20px;
                                }}
                                .tips-title {{
                                    font-weight: bold;
                                    font-size: 16px;
                                    margin-bottom: 10px;
                                }}
                                .tips-list {{
                                    padding-left: 20px;
                                }}
                                .tips-list li {{
                                    margin-bottom: 8px;
                                }}
                                .divider {{
                                    border-top: 1px solid #ddd;
                                    margin: 30px 0;
                                }}
                                .support-section {{
                                    font-size: 16px;
                                    color: #333;
                                }}
                                .footer {{
                                    text-align: center;
                                    margin-top: 30px;
                                }}
                                .signature {{
                                    font-size: 16px;
                                    font-weight: bold;
                                }}
                                .team-name {{
                                    font-size: 14px;
                                    color: #888;
                                }}
                            </style>
                        </head>
                        <body>
                            <div class='email-container'>
                                <div class='header'>
                                    <div class='logo'>CreativePeak</div>
                                    <div class='welcome-title'>Welcome!</div>
                                </div>
        
                                <div class='content'>
                                    <div class='greeting'>Hello {firstName},</div>
            
                                    <div class='excitement'>
                                        <strong>We're excited to have you join us! 🎉</strong><br/>
                                        CreativePeak is your space to showcase, discover, and grow as a creative professional.
                                    </div>
            
                                    <div class='main-text'>
                                        Here you can connect with creators, stay updated with the latest trends, and present your work to a wide audience of professionals.
                                    </div>
            
                                    <div class='tips-section'>
                                        <div class='tips-title'>A few tips to get started:</div>
                                        <ul class='tips-list'>
                                            <li>Explore inspiring projects and connect with other creatives</li>
                                            <li>Update your profile so others can get to know you better</li>
                                            <li>Start uploading your projects and creations</li>
                                        </ul>
                                    </div>
            
                                    <div class='divider'></div>
            
                                    <div class='support-section'>
                                        <strong>Have questions?</strong><br/>
                                        Our support team is here for you and ready to help anytime! 💬
                                    </div>
                                </div>
        
                                <div class='footer'>
                                    <div class='signature'>Enjoy your journey!</div>
                                    <div class='team-name'>The CreativePeak Team</div>
                                </div>
                            </div>
                        </body>
                        </html>"
                    };

                    mailMessage.To.Add(email);

                    await client.SendMailAsync(mailMessage);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending email: {ex.Message}");
                throw;
            }
        }
    }
}