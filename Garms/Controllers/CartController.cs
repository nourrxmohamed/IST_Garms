using Microsoft.AspNetCore.Mvc;

namespace Garms.Controllers
{
    public class CartController : Controller
    {
        public IActionResult Cart() => View();
    }
}