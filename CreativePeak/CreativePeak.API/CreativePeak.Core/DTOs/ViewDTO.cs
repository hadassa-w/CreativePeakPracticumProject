using CreativePeak.Core.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CreativePeak.Core.DTOs
{
    public class ViewDTO
    {
        public int Id { get; set; }
        public ImageDTO Image { get; set; }
        public UserDTO User { get; set; }
        public DateTime Date { get; set; }
    }
}
