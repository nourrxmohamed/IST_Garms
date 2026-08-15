using Garms.Models;
using Microsoft.AspNetCore.Mvc;

namespace Garms.Controllers
{
    public class CheckoutController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CheckoutController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: /Checkout/Checkout
        [HttpGet]
        public IActionResult Checkout()
        {
            return View();
        }


        // POST: /Checkout/Create
        [HttpPost]
        public IActionResult Create(Customers model)
        {
            if (!ModelState.IsValid)
            {
                return View("Checkout", model);
            }

            _context.Customers.Add(model);

            _context.SaveChanges();

            return RedirectToAction(
                "Success",
                "Success"
            );
        }
    }
}