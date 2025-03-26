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

        [MaxLength(20, ErrorMessage = "Phone number cannot be longer than 20 characters.")]
        public string Phone { get; set; }

        [MaxLength(255, ErrorMessage = "Address cannot be longer than 255 characters.")]
        public string Address { get; set; }

        [MaxLength(50, ErrorMessage = "Role cannot be longer than 50 characters.")]
        public string Role { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public DesignerDetails DesignersDetails { get; set; }
    }
}
