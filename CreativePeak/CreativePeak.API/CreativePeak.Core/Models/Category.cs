using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CreativePeak.Core.Models
{
    public class Category
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Category Name is required.")]
        [StringLength(100, ErrorMessage = "Category Name cannot be longer than 100 characters.")]
        public string CategoryName { get; set; }

        [Required(ErrorMessage = "Description is required.")]
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
