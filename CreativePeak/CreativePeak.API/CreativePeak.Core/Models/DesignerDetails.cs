using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CreativePeak.Core.Models
{
    public class DesignerDetails
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Full Name is required.")]
        [StringLength(100, ErrorMessage = "Full Name cannot be longer than 100 characters.")]
        public string FullName { get; set; }

        public string AddressSite { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid Email Address.")]
        public string Email { get; set; }

        [Phone(ErrorMessage = "Invalid Phone Number.")]
        public string Phone { get; set; }

        [Required(ErrorMessage = "Number of years experience is required.")]
        public int YearsExperience { get; set; }

        [Required(ErrorMessage = "Price range min is required.")]
        [Range(0, int.MaxValue, ErrorMessage = "Price range min must be greater than or equal to 0.")]
        public int PriceRangeMin { get; set; }

        [Required(ErrorMessage = "Price range max is required.")]
        [Range(0, int.MaxValue, ErrorMessage = "Price range max must be greater than Price range min.")]
        public int PriceRangeMax { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        [Required(ErrorMessage = "Choosing user is required.")]
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
