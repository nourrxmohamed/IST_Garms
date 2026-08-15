using System.ComponentModel.DataAnnotations;

namespace Garms.Models
{
    public class Products
    {
        [Key]
        public int ProductID { get; set; }

        public string ProductName { get; set; } = string.Empty;

        public string Category { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public string? Image { get; set; }

        public string? ImagePath { get; set; }
    }
}