using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CreativePeak.Core.DTOs
{
    public class Reports
    {
        public string Month { get; set; } = string.Empty;
        public int NewUsers { get; set; }
        public int NewPortfolios { get; set; }
    }
}
