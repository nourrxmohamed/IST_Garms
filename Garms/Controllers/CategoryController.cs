using Microsoft.AspNetCore.Mvc;

namespace Garms.Controllers
{
    public class CategoryController : Controller
    {
        public IActionResult Category() => View();
    }
}