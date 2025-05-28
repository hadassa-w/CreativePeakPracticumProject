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
                    // החזרת true גם אם המשתמש לא קיים (מסיבות אבטחה)
                    return true;
                }

                // יצירת סיסמה זמנית
                var temporaryPassword = GenerateTemporaryPassword();
                Console.WriteLine(temporaryPassword);
                // עדכון המשתמש עם הסיסמה הזמנית (מוצפנת)
                // השארת הסיסמה הישנה כגיבוי עד שהמשתמש יחליף אותה
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

        // פונקציה חדשה להתחברות עם סיסמה זמנית או רגילה
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
                <html>
                <body>
                    <h2>Password Reset - CreativePeak Team</h2>
                    <p>Hello {firstName},</p>
                    <p>We received a request to reset your password. Here is your temporary password:</p>
                    <div style='background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0; text-align: center;'>
                        <strong style='font-size: 24px; color: #512da8; font-family: monospace;'>{temporaryPassword}</strong>
                    </div>
                    <p><strong>Instructions:</strong></p>
                    <ul>
                        <li>Use this temporary password to log in to your account (valid for 24 hours).</li>
                        <li>After logging in, we strongly recommend you change your password to a new one.</li>
                        <li>You can use either your old password or this temporary password to log in.</li>
                        <li>Once you change your password, this temporary password will no longer work.</li>
                    </ul>
                    <p><strong>Security Notice:</strong> If you did not request a password reset, please contact our support team immediately.</p>
                    <br/>
                    <p>Best regards,<br/>Creative Peak Team</p>
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
    }
}