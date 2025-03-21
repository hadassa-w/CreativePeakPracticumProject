using CreativePeak.Core.IServices;
using CreativePeak.Core.IRepositories;
using CreativePeak.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CreativePeak.Service
{
    public class ViewService : IViewService
    {
        private readonly IRepositoryManager _repositoryManager;

        public ViewService(IRepositoryManager repositoryManager)
        {
            _repositoryManager = repositoryManager;
        }

        public async Task<View> AddAsync(View view)
        {
            var newView = await _repositoryManager.Views.AddAsync(view);
            _repositoryManager.Save();
            return newView;
        }

        public void Delete(View view)
        {
            _repositoryManager.Views.Delete(view);
            _repositoryManager.Save();
        }

        public async Task<IEnumerable<View>> GetAllAsync()
        {
            return await _repositoryManager.Views.GetAllAsync();
        }

        public View? GetById(int id)
        {
            return _repositoryManager.Views.GetById(id);
        }

        public View? Update(int id, View view)
        {
            var dbUser = GetById(id);
            if (dbUser == null)
            {
                return null;
            }
            dbUser.UserId = view.UserId;
            dbUser.User = view.User;
            dbUser.ImageId = view.ImageId;
            dbUser.Image = view.Image;
            dbUser.Date = view.Date;

            _repositoryManager.Views.Update(dbUser);
            _repositoryManager.Save();
            return dbUser;
        }

    }
}
