using Microsoft.AspNetCore.Mvc;

namespace Garms.Controllers
{
    public class CheckoutController : Controller
    {
        public IActionResult Checkout() => View();
    }
}