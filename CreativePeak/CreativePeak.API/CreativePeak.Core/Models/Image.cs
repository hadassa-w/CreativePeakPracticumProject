﻿using System;
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
        [Required(ErrorMessage = "FileType is required.")]
        public string FileType { get; set; }
        [Required(ErrorMessage = "LinkURL is required.")]
        public string LinkURL { get; set; }
        [Required(ErrorMessage = "IsDeleted is required.")]
        public bool IsDeleted { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }


        [Required(ErrorMessage = "Choosing user is required.")]
        public int UserId { get; set; }
        public User User { get; set; }

        [Required(ErrorMessage = "Choosing category is required.")]
        public int CategoryId { get; set; }
        public Category Category { get; set; }
    }
}
