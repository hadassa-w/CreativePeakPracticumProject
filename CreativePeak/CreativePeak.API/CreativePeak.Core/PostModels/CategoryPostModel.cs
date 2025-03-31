using System.ComponentModel.DataAnnotations;

namespace CreativePeak.Core.PostModels
{
    public class CategoryPostModel
    {
        public string CategoryName { get; set; }
        public string Description { get; set; }
        public int UserId { get; set; }
    }
}
