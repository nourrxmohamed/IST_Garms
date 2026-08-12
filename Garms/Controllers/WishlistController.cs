using Microsoft.AspNetCore.Mvc;

namespace Garms.Controllers
{
    public class WishlistController : Controller
    {
        public IActionResult Wishlist() => View();
    }
}