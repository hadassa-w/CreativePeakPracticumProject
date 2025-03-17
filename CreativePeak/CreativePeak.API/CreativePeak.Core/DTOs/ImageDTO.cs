using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CreativePeak.Core.DTOs
{
    public class ImageDTO
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
