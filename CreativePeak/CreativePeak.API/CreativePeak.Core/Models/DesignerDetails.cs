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
        public int Id { get; set; }
        public string FullName { get; set; }
        public string AddressSite { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public int YearsExperience { get; set; }
        public int PriceRangeMin { get; set; }
        public int PriceRangeMax { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public List<Category> Categories { get; set; }
        public List<Image> Images { get; set; }
    }
}
