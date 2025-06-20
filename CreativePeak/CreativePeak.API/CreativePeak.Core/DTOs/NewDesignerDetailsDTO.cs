﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CreativePeak.Core.DTOs
{
    public class NewDesignerDetailsDTO
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string AddressSite { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public int YearsExperience { get; set; }
        public int PriceRangeMin { get; set; }
        public int PriceRangeMax { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }


        public int UserId { get; set; }
    }
}
