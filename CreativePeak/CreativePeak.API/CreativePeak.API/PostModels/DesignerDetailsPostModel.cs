using System.ComponentModel.DataAnnotations;

namespace CreativePeak.API.PostModels
{
    public class DesignerDetailsPostModel
    {
        public string FullName { get; set; }
        public string AddressSite { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public int YearsExperience { get; set; }
        public int PriceRangeMin { get; set; }
        public int PriceRangeMax { get; set; }
    }
}
