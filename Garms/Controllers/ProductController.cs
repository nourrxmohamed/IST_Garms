using Microsoft.AspNetCore.Mvc;

namespace Garms.Controllers
{
    public class ProductController : Controller
    {
        public IActionResult Product() => View();
    }
}