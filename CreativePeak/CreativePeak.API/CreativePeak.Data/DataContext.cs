﻿using CreativePeak.Core.Models;
using Microsoft.EntityFrameworkCore;
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
        public DbSet<Image> Images { get; set; }
        public DbSet<DesignerDetails> DesignersDetails { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<View> Views { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=CreativePeak");
            optionsBuilder.LogTo(message => Debug.WriteLine(message));
        }

    }
}
