using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Garms.Models;

namespace Garms.Controllers
{
    public class CategoryController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Category()
        {
            var products = await _context.Products
                .AsNoTracking()
                .ToListAsync();

            return View(products);
        }
    }
}