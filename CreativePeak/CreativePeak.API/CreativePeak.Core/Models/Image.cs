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
        public int Id { get; set; }

        public string FileName { get; set; }

        public string Description { get; set; }
        public string LinkURL { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }


        //public int DesignerDetailsId { get; set; }
        //public DesignerDetails DesignerDetails { get; set; }

        public int CategoryId { get; set; }
        public Category Category { get; set; }
    }
}
