const express = require("express");
const sql = require("mssql/msnodesqlv8");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));


// ==========================================
// SQL SERVER CONFIGURATION
// ==========================================

const config = {
    connectionString:
        "Driver={ODBC Driver 18 for SQL Server};" +
        "Server=localhost\\SQLEXPRESS;" +
        "Database=GARMS;" +
        "Trusted_Connection=Yes;" +
        "TrustServerCertificate=Yes;"
};


// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api/health", (req, res) => {
    res.json({
        message: "GARMS API is running 🚀",
        status: "success"
    });
});


// ==========================================
// GET ALL PRODUCTS
// ==========================================

app.get("/api/products", async (req, res) => {

    try {

        const result = await sql.query(`
            SELECT
                ProductID,
                ProductName,
                Category,
                Price,
                Image,
                ImagePath
            FROM Products
            ORDER BY ProductID
        `);

        res.json(result.recordset);

    } catch (error) {

        console.error("❌ Error getting products:");
        console.error(error);

        res.status(500).json({
            error: "Failed to get products"
        });
    }
});


// ==========================================
// GET ONE PRODUCT
// ==========================================

app.get("/api/products/:id", async (req, res) => {

    try {

        const productID =
            parseInt(req.params.id);


        if (isNaN(productID)) {

            return res.status(400).json({
                error: "Invalid product ID"
            });
        }


        const result =
            await sql.query`

                SELECT
                    ProductID,
                    ProductName,
                    Category,
                    Price,
                    Image,
                    ImagePath

                FROM Products

                WHERE ProductID = ${productID}
            `;


        if (result.recordset.length === 0) {

            return res.status(404).json({
                error: "Product not found"
            });
        }


        res.json(result.recordset[0]);

    } catch (error) {

        console.error(
            "❌ Error getting product:"
        );

        console.error(error);

        res.status(500).json({
            error: "Failed to get product"
        });
    }
});


// ==========================================
// START SERVER
// ==========================================

const PORT = Number(process.env.PORT) || 3001;


async function startServer() {

    try {

        await sql.connect(config);

        console.log(
            "✅ Connected to GARMS database!"
        );


        app.listen(PORT, () => {

            console.log(
                `🚀 GARMS server running at http://localhost:${PORT}`
            );

        });

    } catch (error) {

        console.error(
            "❌ Database connection failed:"
        );

        console.error(error);

        process.exit(1);
    }
}


startServer();