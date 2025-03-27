using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CreativePeak.Core.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string Role { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public DesignerDetails DesignersDetails { get; set; }
    }
}
