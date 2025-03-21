using CreativePeak.Core.Models;
using System.ComponentModel.DataAnnotations;

namespace CreativePeak.API.PostModels
{
    public class ViewPostModel
    {
        public int ImageId { get; set; }
        public int UserId { get; set; }
    }
}
