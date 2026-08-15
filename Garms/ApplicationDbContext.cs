using Microsoft.EntityFrameworkCore;
using Garms.Models;

namespace Garms
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Products> Products { get; set; }

        public DbSet<Customers> Customers { get; set; }
    }
}