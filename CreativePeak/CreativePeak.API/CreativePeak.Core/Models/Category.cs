using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CreativePeak.Core.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string CategoryName { get; set; }
        public string Description { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public int DesignerDetailsId { get; set; }
        public DesignerDetails DesignerDetails { get; set; }

        public List<Image> Images { get; set; }
    }
}
