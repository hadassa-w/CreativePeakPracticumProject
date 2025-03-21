using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CreativePeak.Core.Models
{
    public class Image
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Full Name is required.")]
        [StringLength(100, ErrorMessage = "Full Name cannot be longer than 100 characters.")]
        public string FileName { get; set; }

        [Required(ErrorMessage = "Description is required.")]
        public string Description { get; set; }
        //public string URLLink { get; set; }

        public string LinkURL { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }


        [Required(ErrorMessage = "Choosing designer is required.")]
        public int DesignerDetailsId { get; set; }
        public DesignerDetails DesignerDetails { get; set; }

        [Required(ErrorMessage = "Choosing category is required.")]
        public int CategoryId { get; set; }
        public Category Category { get; set; }
    }
}
