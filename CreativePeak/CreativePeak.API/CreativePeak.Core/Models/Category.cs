using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

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

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        //public int DesignerDetailsId { get; set; }
        //public DesignerDetails DesignerDetails { get; set; }

        public List<Image> Images { get; set; }
    }
}
