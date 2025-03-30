using CreativePeak.Core.Models;
using System.ComponentModel.DataAnnotations;

namespace CreativePeak.Core.PostModels
{
    public class ImagePostModel
    {
        public string FileName { get; set; }
        public string Description { get; set; }
        public string LinkURL { get; set; }

        public int DesignerId { get; set; }
        public int CategoryId { get; set; }

    }
}
