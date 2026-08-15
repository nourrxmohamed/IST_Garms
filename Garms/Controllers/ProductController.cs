using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Garms;
using Garms.Models;

namespace Garms.Controllers
{
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================
        // GET ALL PRODUCTS
        // =========================================================
        [HttpGet]
        public async Task<IActionResult> Product(int? id)
        {
            // Get all products from the GARMS database
            var products = await _context.Products
                .AsNoTracking()
                .ToListAsync();

            // If no products exist
            if (products == null || products.Count == 0)
            {
                return View(products);
            }

            // If an ID was provided, check that the product exists
            if (id.HasValue)
            {
                var productExists = products.Any(
                    p => p.ProductID == id.Value
                );

                if (!productExists)
                {
                    return View(products);
                }
            }

            // Send all products to Product.cshtml
            return View(products);
        }


        // =========================================================
        // GET ONE PRODUCT
        // =========================================================
        [HttpGet]
        public async Task<IActionResult> Details(int id)
        {
            var product = await _context.Products
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.ProductID == id);

            if (product == null)
            {
                return NotFound();
            }

            return View(product);
        }


        // =========================================================
        // CREATE PRODUCT - GET
        // =========================================================
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }


        // =========================================================
        // CREATE PRODUCT - POST
        // =========================================================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Products model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            _context.Products.Add(model);
            await _context.SaveChangesAsync();

            return RedirectToAction(nameof(Product));
        }


        // =========================================================
        // EDIT PRODUCT - GET
        // =========================================================
        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.ProductID == id);

            if (product == null)
            {
                return NotFound();
            }

            return View(product);
        }


        // =========================================================
        // EDIT PRODUCT - POST
        // =========================================================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Products model)
        {
            if (id != model.ProductID)
            {
                return NotFound();
            }

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            _context.Products.Update(model);
            await _context.SaveChangesAsync();

            return RedirectToAction(nameof(Product));
        }


        // =========================================================
        // DELETE PRODUCT - GET
        // =========================================================
        [HttpGet]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.ProductID == id);

            if (product == null)
            {
                return NotFound();
            }

            return View(product);
        }


        // =========================================================
        // DELETE PRODUCT - POST
        // =========================================================
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.ProductID == id);

            if (product != null)
            {
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
            }

            return RedirectToAction(nameof(Product));
        }
    }
}