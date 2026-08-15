// =========================================================
// GARMS CATEGORY PAGE
// =========================================================


// =========================================================
// GET PRODUCTS FROM DATABASE
// =========================================================

const products =
    Array.isArray(window.garmsProducts)
        ? window.garmsProducts
        : [];


// =========================================================
// URL PARAMETERS
// =========================================================

const parameters =
    new URLSearchParams(
        window.location.search
    );


// Category from URL
const searchTerm =
    parameters
        .get("search")
        ?.trim()
        .toLowerCase() || "";


const requestedCategory =
    parameters
        .get("category")
        ?.trim()
        .toLowerCase() || "";


// =========================================================
// VALID CATEGORIES
// =========================================================

const validCategories = [
    "tops",
    "jeans",
    "jackets",
    "accessories",
    "shoes",
    "bags"
];


// =========================================================
// DETERMINE CATEGORY
// =========================================================

let category =
    requestedCategory || "tops";


if (
    category !== "all" &&
    !validCategories.includes(category)
) {

    category = "all";

}


// =========================================================
// PAGE TITLE
// =========================================================

let displayCategory;


if (searchTerm) {

    displayCategory =
        `Results for "${parameters.get("search")}"`;

}
else if (category === "all") {

    displayCategory =
        "All items";

}
else {

    displayCategory =
        category.charAt(0).toUpperCase() +
        category.slice(1);

}


document.title =
    `${displayCategory} | GARMS`;


// =========================================================
// CATEGORY HEADING
// =========================================================

const categoryTitle =
    document.getElementById(
        "categoryTitle"
    );


if (categoryTitle) {

    categoryTitle.textContent =
        `${displayCategory}.`;

}


// =========================================================
// PRODUCT GRID
// =========================================================

const grid =
    document.getElementById(
        "productGrid"
    );


// =========================================================
// FILTER PRODUCTS
// =========================================================

const matchingProducts =
    products.filter(product => {

        const productCategory =
            String(
                product.category || ""
            )
                .trim()
                .toLowerCase();


        const matchesCategory =
            category === "all" ||
            productCategory === category;


        const matchesSearch =
            !searchTerm ||
            `${product.name} ${productCategory}`
                .toLowerCase()
                .includes(searchTerm);


        return (
            matchesCategory &&
            matchesSearch
        );

    });


// =========================================================
// EMPTY RESULT
// =========================================================

if (
    grid &&
    matchingProducts.length === 0
) {

    grid.innerHTML = `

        <p class="empty">

            No pieces match that search.

            <a href="/Category/Category?category=all">
                View all items →
            </a>

        </p>

    `;

}


// =========================================================
// CREATE PRODUCT CARDS
// =========================================================

matchingProducts.forEach(product => {

    if (!grid) {
        return;
    }


    const card =
        document.createElement("article");


    card.className =
        "catalogue-card";


    card.tabIndex = 0;


    card.setAttribute(
        "role",
        "link"
    );


    // -----------------------------------------------------
    // SAFE IMAGE PATH
    // -----------------------------------------------------

    let image =
        product.image;


    if (!image) {

        image =
            "/images/image.jpg";

    }
    else {

        image =
            "/" +
            String(image)
                .replace(/^\/+/, "")
                .replace(/\\/g, "/");

    }


    // -----------------------------------------------------
    // CARD HTML
    // -----------------------------------------------------

    card.innerHTML = `

        <img
            src="${image}"
            alt="${product.name}"
            loading="lazy"
            onerror="this.onerror=null; this.src='/images/image.jpg';"
        >

        <div class="catalogue-card-content">

            <h2>
                ${product.name}
            </h2>

            <p>
                EGP ${Number(product.price).toLocaleString()}
            </p>

            <div class="actions">

                <button
                    type="button"
                    class="button-green"
                    data-action="add-category-cart"
                    data-id="${product.id}"
                >
                    Add to Cart
                </button>

                <button
                    type="button"
                    data-action="add-category-wishlist"
                    data-id="${product.id}"
                >
                    ♡ Wishlist
                </button>

            </div>

        </div>

    `;


    // =====================================================
    // CLICK PRODUCT
    // =====================================================

    card.addEventListener(
        "click",
        event => {

            // Don't open the product when clicking a button
            if (
                event.target.closest("button")
            ) {

                return;

            }


            // IMPORTANT:
            // Use the REAL SQL ProductID

            window.location.href =
                `/Product/Product?id=${encodeURIComponent(product.id)}`;

        }
    );


    // =====================================================
    // KEYBOARD ACCESS
    // =====================================================

    card.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();


                window.location.href =
                    `/Product/Product?id=${encodeURIComponent(product.id)}`;

            }

        }
    );


    // =====================================================
    // ADD CARD TO PAGE
    // =====================================================

    grid.appendChild(card);

});


// =========================================================
// CATEGORY BUTTON ACTIONS
// =========================================================

document.addEventListener(
    "click",
    event => {

        const action =
            event.target.closest(
                "button[data-action]"
            );


        if (!action) {
            return;
        }


        const actionType =
            action.dataset.action;


        if (
            !actionType.startsWith(
                "add-category"
            )
        ) {

            return;

        }


        const productId =
            String(
                action.dataset.id
            );


        const product =
            products.find(
                item =>
                    String(item.id) ===
                    productId
            );


        if (!product) {

            console.error(
                "GARMS: Product not found:",
                productId
            );

            return;

        }


        // =================================================
        // ADD TO CART
        // =================================================

        if (
            actionType ===
            "add-category-cart"
        ) {

            const cart =
                typeof getCart === "function"
                    ? getCart()
                    : JSON.parse(
                        localStorage.getItem(
                            "garmsCart"
                        )
                    ) || [];


            const existing =
                cart.find(
                    item =>
                        String(item.productId || item.id) ===
                        productId
                );


            if (existing) {

                existing.quantity =
                    Number(
                        existing.quantity || 0
                    ) + 1;

            }
            else {

                cart.push({

                    id: productId,

                    productId: productId,

                    name: product.name,

                    price: Number(product.price),

                    image: product.image,

                    category: product.category,

                    quantity: 1

                });

            }


            localStorage.setItem(
                "garmsCart",
                JSON.stringify(cart)
            );


            action.textContent =
                "Added!";

        }


        // =================================================
        // ADD TO WISHLIST
        // =================================================

        else if (
            actionType ===
            "add-category-wishlist"
        ) {

            const wishlist =
                typeof getWishlist === "function"
                    ? getWishlist()
                    : JSON.parse(
                        localStorage.getItem(
                            "garmsWishlist"
                        )
                    ) || [];


            const alreadySaved =
                wishlist.some(
                    item =>
                        String(item.id) ===
                        productId
                );


            if (alreadySaved) {

                action.textContent =
                    "Already Saved";

            }
            else {

                wishlist.push({

                    id: productId,

                    name: product.name,

                    price: Number(product.price),

                    image: product.image,

                    category: product.category

                });


                localStorage.setItem(
                    "garmsWishlist",
                    JSON.stringify(wishlist)
                );


                action.textContent =
                    "Saved!";

            }

        }


        // =================================================
        // UPDATE NAVIGATION
        // =================================================

        if (
            typeof updateNavigation ===
            "function"
        ) {

            updateNavigation();

        }
        else if (
            typeof updateProductNavigation ===
            "function"
        ) {

            updateProductNavigation();

        }


        // =================================================
        // RESET BUTTON TEXT
        // =================================================

        window.setTimeout(
            () => {

                if (
                    actionType ===
                    "add-category-cart"
                ) {

                    action.textContent =
                        "Add to Cart";

                }
                else {

                    action.textContent =
                        "♡ Wishlist";

                }

            },
            1200
        );

    }
);