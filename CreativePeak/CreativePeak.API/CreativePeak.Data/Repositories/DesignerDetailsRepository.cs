﻿using CreativePeak.Core.IRepositories;
using CreativePeak.Data;
using Microsoft.EntityFrameworkCore;
using CreativePeak.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CreativePeak.Core.DTOs;

namespace CreativePeak.Data.Repositories
{
    public class DesignerDetailsRepository : IDesignerDetailsRepository
    {
        private readonly DataContext _context;
        private readonly DbSet<DesignerDetails> _dbSet;

        public DesignerDetailsRepository(DataContext dataContext)
        {
            _context = dataContext;
            _dbSet = _context.Set<DesignerDetails>();
        }
        public async Task<bool> UserExists(int userId)
        {
            return await _context.Users.AnyAsync(u => u.Id == userId);
        }
        public DesignerDetails Add(DesignerDetails designerDetails)
        {
            _dbSet.Add(designerDetails);
            _context.SaveChanges();
            return designerDetails;
        }

        public void Delete(DesignerDetails designerDetails)
        {
            _dbSet.Remove(designerDetails);
            _context.SaveChanges();
        }

        public IEnumerable<DesignerDetails> GetAll()
        {
            return _context.DesignersDetails.ToList();
        }

        public DesignerDetails? GetById(int id)
        {
            return _dbSet.Find(id);
        }

        public DesignerDetails Update(DesignerDetails designerDetails)
        {
            _dbSet.Update(designerDetails);
            _context.SaveChanges();
            return designerDetails;
        }

        public DesignerDetails UpdateYearsExperience(DesignerDetails designerDetails)
        {
            var now = DateTime.Now;
            int yearsPassed = now.Year - designerDetails.UpdatedAt.Year;

            if (now.Month < designerDetails.UpdatedAt.Month ||
            (now.Month == designerDetails.UpdatedAt.Month && now.Day < designerDetails.UpdatedAt.Day))
            {
                yearsPassed--;
            }

            designerDetails.YearsExperience += yearsPassed;
            designerDetails.UpdatedAt = now;

            _dbSet.Update(designerDetails);
            _context.SaveChanges();
            return designerDetails;
        }
    }
}
