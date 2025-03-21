using CreativePeak.Data;
using CreativePeak.Core.IRepositories;
using CreativePeak.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CreativePeak.Data.Repositories
{
    public class RepositoryManager : IRepositoryManager
    {
        private readonly DataContext _context;
        private readonly IRepository<User> _users;
        private readonly IRepository<Image> _images;
        private readonly IRepository<DesignerDetails> _designerDetails;
        private readonly IRepository<Category> _categories;
        private readonly IRepository<View> _views;

        public RepositoryManager(DataContext context, IRepository<User> userRepository, IRepository<Image> imageRepository,IRepository<DesignerDetails> designerDetailsRepository, IRepository<Category> categoriesRepository, IRepository<View> views)
        {
            _context = context;
            _users = userRepository;
            _images = imageRepository;
            _designerDetails = designerDetailsRepository;
            _categories = categoriesRepository;
            _views = views;
        }

        public IRepository<User> Users => _users;
        public IRepository<Image> Images => _images;
        public IRepository<DesignerDetails> DesignersDetails => _designerDetails;
        public IRepository<Category> Categories => _categories;
        public IRepository<View> Views => _views;

        public void Save()
        {
            _context.SaveChanges();
        }
    }
}
