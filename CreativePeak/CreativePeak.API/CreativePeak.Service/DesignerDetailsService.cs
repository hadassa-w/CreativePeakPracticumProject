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
    public class DesignerDetailsService : IDesignerDetailsService
    {
        private readonly IRepositoryManager _repositoryManager;

        public DesignerDetailsService(IRepositoryManager repositoryManager)
        {
            _repositoryManager = repositoryManager;
        }

        public async Task<DesignerDetails> AddAsync(DesignerDetails designerDetails)
        {
            var newDesignerDetails = await _repositoryManager.DesignersDetails.AddAsync(designerDetails);
            _repositoryManager.Save();
            return newDesignerDetails;
        }

        public void Delete(DesignerDetails designerDetails)
        {
            _repositoryManager.DesignersDetails.Delete(designerDetails);
            _repositoryManager.Save();
        }

        public async Task<IEnumerable<DesignerDetails>> GetAllAsync()
        {
            return await _repositoryManager.DesignersDetails.GetAllAsync();
        }

        public DesignerDetails? GetById(int id)
        {
            return _repositoryManager.DesignersDetails.GetById(id);
        }

        public DesignerDetails? Update(int id, DesignerDetails designerDetails)
        {
            var dbDesignerDetails = GetById(id);
            if (dbDesignerDetails == null)
            {
                return null;
            }
            dbDesignerDetails.FullName = designerDetails.FullName;
            dbDesignerDetails.AddressSite = designerDetails.AddressSite;
            dbDesignerDetails.Email = designerDetails.Email;
            dbDesignerDetails.Phone = designerDetails.Phone;
            dbDesignerDetails.YearsExperience = designerDetails.YearsExperience;
            dbDesignerDetails.PriceRangeMin = designerDetails.PriceRangeMin;
            dbDesignerDetails.PriceRangeMax = designerDetails.PriceRangeMax;
            dbDesignerDetails.CreatedAt = designerDetails.CreatedAt;
            dbDesignerDetails.UpdatedAt = designerDetails.UpdatedAt;

            _repositoryManager.DesignersDetails.Update(dbDesignerDetails);
            _repositoryManager.Save();
            return dbDesignerDetails;
        }

    }
}
