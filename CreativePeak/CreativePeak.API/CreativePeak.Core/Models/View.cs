using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace CreativePeak.Core.Models
{
    public class View
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ImageId { get; set; }
        public Image Image { get; set; }

        [Required]
        public int UserId { get; set; }
        public User User { get; set; }

        public DateTime Date { get; set; }
    }
}
