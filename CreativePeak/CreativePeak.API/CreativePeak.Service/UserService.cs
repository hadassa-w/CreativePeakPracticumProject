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

                // עדכון המשתמש עם הסיסמה הזמנית (מוצפנת)
                user.Password = _passwordService.HashPassword(temporaryPassword);
                user.PasswordResetToken = null; // ניקוי טוקן ישן אם קיים
                user.PasswordResetTokenExpiry = null;
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

        public async Task<bool> ResetPasswordAsync(string token, string newPassword)
        {
            try
            {
                var user = await _userRepository.GetByPasswordResetTokenAsync(token);
                if (user == null)
                {
                    return false;
                }

                // עדכון הסיסמה
                user.Password = _passwordService.HashPassword(newPassword);
                user.PasswordResetToken = null;
                user.PasswordResetTokenExpiry = null;

                await _userRepository.UpdateAsync(user);

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in ResetPasswordAsync: {ex.Message}");
                return false;
            }
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _userRepository.GetByEmailAsync(email);
        }

        private string GenerateTemporaryPassword()
        {
            // יצירת סיסמה זמנית באורך 8 תווים עם אותיות וספרות
            const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, 8)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        private async Task SendTemporaryPasswordEmailAsync(string email, string temporaryPassword, string firstName)
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
                        <li>Use this temporary password to log in to your account.</li>
                        <li>After logging in, we recommend you change your password to a new one.</li>
                        <li>This temporary password will remain valid until you change it.</li>
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