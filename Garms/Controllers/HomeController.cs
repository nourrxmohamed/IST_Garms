using Microsoft.AspNetCore.Mvc;

namespace Garms.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index() => View();
    }
}