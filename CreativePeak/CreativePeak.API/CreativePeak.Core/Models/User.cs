using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CreativePeak.Core.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Full Name is required.")]
        [StringLength(50, ErrorMessage = "Full Name cannot be longer than 50 characters.")]
        public string FullName { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        [StringLength(100, ErrorMessage = "Email cannot be longer than 100 characters.")]
        [EmailAddress(ErrorMessage = "Invalid Email Address.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters long.")]
        public string Password { get; set; }

        [Phone(ErrorMessage = "Invalid Phone Number.")]
        public string Phone { get; set; }

        public string Address { get; set; }
        public string Role { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public DesignerDetails DesignersDetails { get; set; }
    }
}
