using Microsoft.EntityFrameworkCore;
using ShowrealPro.Core.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CreativePeak.Data
{
    public class DataContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=sample_db");
            optionsBuilder.LogTo(message => Debug.WriteLine(message));
        }

    }
}
