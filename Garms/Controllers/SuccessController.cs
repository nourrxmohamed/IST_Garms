using Microsoft.AspNetCore.Mvc;

namespace Garms.Controllers
{
    public class SuccessController : Controller
    {
        public IActionResult Success() => View();
    }
}