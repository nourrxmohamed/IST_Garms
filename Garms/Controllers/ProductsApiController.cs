using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;

namespace Garms.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly string _connectionString;

        public ProductsController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? "Server=localhost\\SQLEXPRESS;Database=GARMS;Trusted_Connection=True;TrustServerCertificate=True;";
        }

        // GET: api/products
        [HttpGet]
        public IActionResult GetProducts()
        {
            var products = new List<Dictionary<string, object>>();

            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                using (var command = new SqlCommand(@"
                    SELECT ProductID, ProductName, Category, Price, Image, ImagePath
                    FROM Products
                    ORDER BY ProductID", connection))
                {
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var product = new Dictionary<string, object>();
                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                product[reader.GetName(i)] = reader.GetValue(i);
                            }
                            products.Add(product);
                        }
                    }
                }
            }

            return Ok(products);
        }

        // GET: api/products/5
        [HttpGet("{id}")]
        public IActionResult GetProduct(int id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                using (var command = new SqlCommand(@"
                    SELECT ProductID, ProductName, Category, Price, Image, ImagePath
                    FROM Products
                    WHERE ProductID = @ProductID", connection))
                {
                    command.Parameters.AddWithValue("@ProductID", id);

                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            var product = new Dictionary<string, object>();
                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                product[reader.GetName(i)] = reader.GetValue(i);
                            }
                            return Ok(product);
                        }
                    }
                }
            }

            return NotFound(new { error = "Product not found" });
        }
    }
}
