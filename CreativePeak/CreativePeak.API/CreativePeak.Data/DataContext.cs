using CreativePeak.Core.Models;
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
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<DesignerDetails> DesignersDetails { get; set; }
        public DbSet<Category> Categories { get; set; }
        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=CreativePeak");
        //    optionsBuilder.LogTo(message => Debug.WriteLine(message));
        //}
        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    optionsBuilder.UseMySql(
        //          @"Server=bvby4mfwdafihsjtbziq-mysql.services.clever-cloud.com;
        //     Port=3306;
        //     Database=bvby4mfwdafihsjtbziq;
        //     User=ujan10sw5dwrp8nh;
        //     Password=IhXEc6xGBkz5Qy5znuDV",
        //        new MySqlServerVersion(new Version(9, 0, 0))
        //    );
        //}
    }
}
