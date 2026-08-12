// ==========================================
// GARMS ASP.NET Core API
// ==========================================

const API_URL = "/api/products";


// ==========================================
// NAVIGATION COUNTS
// ==========================================

function refreshNavigationCounts() {
    if (typeof updateNavigation === "function") {
        updateNavigation();
        return;
    }

    try {
        const cart =
            JSON.parse(localStorage.getItem("garmsCart")) || [];

        const wishlist =
            JSON.parse(localStorage.getItem("garmsWishlist")) || [];

        const cartCount =
            document.getElementById("cartCount");

        const wishlistCount =
            document.getElementById("wishlistCount");


        if (cartCount) {
            cartCount.textContent = cart.reduce(
                (total, item) =>
                    total + (Number(item.quantity) || 0),
                0
            );
        }


        if (wishlistCount) {
            wishlistCount.textContent =
                wishlist.length;
        }

    } catch {
        // Ignore invalid browser storage.
    }
}


// ==========================================
// LOAD PRODUCTS FROM SQL (ASP.NET Core API)
// ==========================================

async function loadProducts() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(
                `Failed to load products: ${response.status}`
            );
        }

        const data = await response.json();


        return data.map((item) => ({

            // REAL SQL ProductID
            id: String(item.ProductID),

            category:
                String(item.Category || "")
                    .toLowerCase(),

            name: item.ProductName,

            price: Number(item.Price),

            image:
                item.ImagePath ||
                item.Image ||
                "images/image.jpg"

        }));

    } catch (error) {

        console.error(
            "Could not load products:",
            error
        );

        return [];
    }
}


// ==========================================
// CATEGORY / SHOP PAGE
// ==========================================

async function loadProductGrid() {

    const grid =
        document.getElementById("productGrid");

    if (!grid) {
        return;
    }


    const products =
        await loadProducts();


    // Make SQL products available globally
    window.garmsProducts = products;


    const params =
        new URLSearchParams(
            window.location.search
        );


    const search =
        (params.get("search") || "")
            .trim()
            .toLowerCase();


    const category =
        (params.get("category") || "all")
            .trim()
            .toLowerCase();


    const filteredProducts =
        products.filter((product) => {

            const categoryMatch =
                category === "all" ||
                product.category === category;


            const searchMatch =
                !search ||
                product.name
                    .toLowerCase()
                    .includes(search) ||
                product.category
                    .toLowerCase()
                    .includes(search);


            return categoryMatch && searchMatch;
        });


    grid.innerHTML = "";


    if (!filteredProducts.length) {

        grid.innerHTML = `
            <p>No products found.</p>
        `;

        return;
    }


    filteredProducts.forEach((product) => {

        const card =
            document.createElement("article");


        card.className =
            "catalogue-card";


        card.innerHTML = `
            <img
                src="${product.image}"
                alt="${product.name}"
                onerror="this.src='images/image.jpg'"
            >

            <h2>${product.name}</h2>

            <p>
                EGP ${product.price.toLocaleString()}
            </p>

            <div class="actions">

                <button
                    type="button"
                    class="button button-green"
                    onclick="addToCart('${product.id}')"
                >
                    Add to Cart
                </button>

                <button
                    type="button"
                    onclick="addToWishlist('${product.id}')"
                >
                    ♡ Wishlist
                </button>

            </div>
        `;


        // Open product details
        card.addEventListener(
            "click",
            (event) => {

                if (
                    event.target.closest("button")
                ) {
                    return;
                }


                window.location.href =
                    `/Product/Product?id=${encodeURIComponent(
                        product.id
                    )}`;
            }
        );


        grid.appendChild(card);

    });
}


// ==========================================
// HOME PAGE
// ==========================================

async function loadHomeProducts() {

    const grid =
        document.getElementById(
            "homeProductGrid"
        );

    if (!grid) {
        return;
    }


    const products =
        await loadProducts();


    if (!products.length) {

        grid.innerHTML = `
            <p>Unable to load products.</p>
        `;

        return;
    }


    window.garmsProducts =
        products;


    grid.innerHTML = "";


    // Show first 4 SQL products
    products.slice(0, 4).forEach(
        (product) => {

            const column =
                document.createElement("div");

            column.className =
                "col-12 col-sm-6 col-lg-3";


            const card =
                document.createElement("div");

            card.className =
                "product";


            card.dataset.id =
                product.id;

            card.dataset.name =
                product.name;

            card.dataset.price =
                product.price;

            card.dataset.image =
                product.image;

            card.dataset.category =
                product.category;


            card.innerHTML = `
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    onerror="this.src='images/image.jpg'"
                >

                <h5>${product.name}</h5>

                <p>
                    EGP ${product.price.toLocaleString()}
                </p>

                <button
                    type="button"
                    class="addCart"
                >
                    Add to Cart
                </button>

                <button
                    type="button"
                    class="addWishlist"
                >
                    ♡ Wishlist
                </button>
            `;


            // Open product details
            card.addEventListener(
                "click",
                (event) => {

                    if (
                        !event.target.closest("button")
                    ) {

                        window.location.href =
                            `/Product/Product?id=${encodeURIComponent(
                                product.id
                            )}`;
                    }
                }
            );


            // Add to cart
            card
                .querySelector(".addCart")
                .addEventListener(
                    "click",
                    (event) => {

                        event.stopPropagation();

                        addToCart(
                            product.id
                        );
                    }
                );


            // Add to wishlist
            card
                .querySelector(".addWishlist")
                .addEventListener(
                    "click",
                    (event) => {

                        event.stopPropagation();

                        addToWishlist(
                            product.id
                        );
                    }
                );


            column.appendChild(card);

            grid.appendChild(column);
        }
    );
}


// ==========================================
// PRODUCT DETAIL PAGE
// ==========================================

async function loadProductDetail() {

    const detail =
        document.getElementById(
            "productDetail"
        );


    if (!detail) {
        return;
    }


    const id =
        new URLSearchParams(
            window.location.search
        ).get("id");


    if (!id) {

        detail.innerHTML = `
            <p>Product not found.</p>
        `;

        return;
    }


    try {

        // IMPORTANT:
        // Uses the REAL SQL ProductID
        const response =
            await fetch(
                `${API_URL}/${encodeURIComponent(id)}`
            );


        if (!response.ok) {

            throw new Error(
                "Product not found"
            );
        }


        const item =
            await response.json();


        const product = {

            id: String(
                item.ProductID
            ),

            category:
                String(
                    item.Category || ""
                ).toLowerCase(),

            name:
                item.ProductName,

            price:
                Number(item.Price),

            image:
                item.ImagePath ||
                item.Image ||
                "images/image.jpg"
        };


        document.title =
            `${product.name} | GARMS`;


        // ==========================================
        // SIZES
        // ==========================================

        let sizes;


        if (
            product.category === "shoes"
        ) {

            sizes = [
                "36",
                "37",
                "38",
                "39",
                "40",
                "41"
            ];

        } else if (
            product.category === "bags" ||
            product.category === "accessories"
        ) {

            sizes = [
                "One size"
            ];

        } else {

            sizes = [
                "XS",
                "S",
                "M",
                "L",
                "XL"
            ];
        }


        // ==========================================
        // PRODUCT HTML
        // ==========================================

        detail.innerHTML = `

            <article class="product-detail">

                <div class="product-detail-image">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        onerror="this.src='images/image.jpg'"
                    >

                </div>


                <div class="product-detail-info">

                    <p class="product-category">
                        GARMS / ${product.category}
                    </p>


                    <h1>
                        ${product.name}
                    </h1>


                    <p class="product-price">
                        EGP ${product.price.toLocaleString()}
                    </p>


                    <div class="detail-section">

                        <div class="detail-label">

                            <strong>
                                Select size
                            </strong>

                            <span id="selectedSize">
                                Choose a size
                            </span>

                        </div>


                        <div class="size-options">

                            ${sizes.map(
                                (size) => `
                                    <button
                                        type="button"
                                        class="size-button"
                                        data-size="${size}"
                                    >
                                        ${size}
                                    </button>
                                `
                            ).join("")}

                        </div>

                    </div>


                    <div class="detail-section quantity-picker">

                        <strong>
                            Quantity
                        </strong>


                        <div>

                            <button
                                type="button"
                                id="decreaseQuantity"
                                aria-label="Decrease quantity"
                            >
                                -
                            </button>


                            <span id="productQuantity">
                                1
                            </span>


                            <button
                                type="button"
                                id="increaseQuantity"
                                aria-label="Increase quantity"
                            >
                                +
                            </button>

                        </div>

                    </div>


                    <button
                        type="button"
                        id="addProductToCart"
                        class="button button-green detail-action"
                    >
                        ADD TO CART
                    </button>


                    <button
                        type="button"
                        id="addProductToWishlist"
                        class="detail-action"
                    >
                        ADD TO WISHLIST
                    </button>

                </div>

            </article>
        `;


        // ==========================================
        // PRODUCT STATE
        // ==========================================

        let selectedSize = "";

        let quantity = 1;


        // ==========================================
        // SIZE SELECTION
        // ==========================================

        document
            .querySelectorAll(".size-button")
            .forEach((button) => {

                button.addEventListener(
                    "click",
                    () => {

                        document
                            .querySelectorAll(
                                ".size-button"
                            )
                            .forEach(
                                (btn) =>
                                    btn.classList.remove(
                                        "is-selected"
                                    )
                            );


                        button.classList.add(
                            "is-selected"
                        );


                        selectedSize =
                            button.dataset.size;


                        document.getElementById(
                            "selectedSize"
                        ).textContent =
                            selectedSize;
                    }
                );

            });


        // ==========================================
        // INCREASE QUANTITY
        // ==========================================

        document
            .getElementById(
                "increaseQuantity"
            )
            .addEventListener(
                "click",
                () => {

                    quantity++;


                    document.getElementById(
                        "productQuantity"
                    ).textContent =
                        quantity;
                }
            );


        // ==========================================
        // DECREASE QUANTITY
        // ==========================================

        document
            .getElementById(
                "decreaseQuantity"
            )
            .addEventListener(
                "click",
                () => {

                    if (quantity > 1) {

                        quantity--;


                        document.getElementById(
                            "productQuantity"
                        ).textContent =
                            quantity;
                    }
                }
            );


        // ==========================================
        // ADD TO CART
        // ==========================================

        document
            .getElementById(
                "addProductToCart"
            )
            .addEventListener(
                "click",
                () => {

                    if (!selectedSize) {

                        document.getElementById(
                            "selectedSize"
                        ).textContent =
                            "Please choose a size";

                        return;
                    }


                    const cart =
                        JSON.parse(
                            localStorage.getItem(
                                "garmsCart"
                            )
                        ) || [];


                    const cartId =
                        `${product.id}-${selectedSize}`;


                    const existing =
                        cart.find(
                            (item) =>
                                item.id === cartId
                        );


                    if (existing) {

                        existing.quantity +=
                            quantity;

                    } else {

                        cart.push({

                            ...product,

                            id: cartId,

                            productId:
                                product.id,

                            size:
                                selectedSize,

                            quantity:
                                quantity
                        });
                    }


                    localStorage.setItem(
                        "garmsCart",
                        JSON.stringify(cart)
                    );


                    refreshNavigationCounts();


                    const button =
                        document.getElementById(
                            "addProductToCart"
                        );


                    button.textContent =
                        "ADDED TO CART";


                    setTimeout(() => {

                        button.textContent =
                            "ADD TO CART";

                    }, 1200);
                }
            );


        // ==========================================
        // ADD TO WISHLIST
        // ==========================================

        document
            .getElementById(
                "addProductToWishlist"
            )
            .addEventListener(
                "click",
                () => {

                    const wishlist =
                        JSON.parse(
                            localStorage.getItem(
                                "garmsWishlist"
                            )
                        ) || [];


                    const exists =
                        wishlist.some(
                            (item) =>
                                String(item.id) ===
                                String(product.id)
                        );


                    if (!exists) {

                        wishlist.push(
                            product
                        );


                        localStorage.setItem(
                            "garmsWishlist",
                            JSON.stringify(
                                wishlist
                            )
                        );
                    }


                    refreshNavigationCounts();


                    const button =
                        document.getElementById(
                            "addProductToWishlist"
                        );


                    button.textContent =
                        "SAVED TO WISHLIST";


                    setTimeout(() => {

                        button.textContent =
                            "ADD TO WISHLIST";

                    }, 1200);
                }
            );


    } catch (error) {

        console.error(
            "Error loading product:",
            error
        );


        detail.innerHTML = `

            <div class="product-not-found">

                <h2>
                    Product not found
                </h2>

                <p>
                    This product could not be loaded.
                </p>

                <a href="/Category/Category">
                    View all items →
                </a>

            </div>
        `;
    }
}


// ==========================================
// ADD TO CART FROM PRODUCT GRID
// ==========================================

async function addToCart(id) {

    const products =
        await loadProducts();


    const product =
        products.find(
            (item) =>
                item.id === String(id)
        );


    if (!product) {

        console.error(
            "Product not found:",
            id
        );

        return;
    }


    const cart =
        JSON.parse(
            localStorage.getItem(
                "garmsCart"
            )
        ) || [];


    const existing =
        cart.find(
            (item) =>
                item.id === product.id
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            ...product,

            quantity: 1
        });
    }


    localStorage.setItem(
        "garmsCart",
        JSON.stringify(cart)
    );


    refreshNavigationCounts();
}


// ==========================================
// ADD TO WISHLIST FROM PRODUCT GRID
// ==========================================

async function addToWishlist(id) {

    const products =
        await loadProducts();


    const product =
        products.find(
            (item) =>
                item.id === String(id)
        );


    if (!product) {

        console.error(
            "Product not found:",
            id
        );

        return;
    }


    const wishlist =
        JSON.parse(
            localStorage.getItem(
                "garmsWishlist"
            )
        ) || [];


    const exists =
        wishlist.some(
            (item) =>
                String(item.id) ===
                String(product.id)
        );


    if (!exists) {

        wishlist.push(product);


        localStorage.setItem(
            "garmsWishlist",
            JSON.stringify(
                wishlist
            )
        );
    }


    refreshNavigationCounts();
}


// ==========================================
// START
// ==========================================

loadProductGrid();

loadProductDetail();

loadHomeProducts();
