const CART_KEY = "garmsCart";
const WISHLIST_KEY = "garmsWishlist";


// =====================================================
// STORAGE HELPERS
// =====================================================

function getCart() {
    try {
        const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
        return Array.isArray(cart) ? cart : [];
    }
    catch {
        return [];
    }
}


function getWishlist() {
    try {
        const wishlist =
            JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];

        return Array.isArray(wishlist) ? wishlist : [];
    }
    catch {
        return [];
    }
}


function saveCart(cart) {
    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );
}


function saveWishlist(wishlist) {
    localStorage.setItem(
        WISHLIST_KEY,
        JSON.stringify(wishlist)
    );
}


function formatMoney(price) {
    return `EGP ${Number(price).toLocaleString()}`;
}


// =====================================================
// NAVIGATION COUNTERS
// =====================================================

function updateProductNavigation() {

    const cart = getCart();

    const wishlist = getWishlist();


    const cartCount =
        document.getElementById("cartCount");

    const wishlistCount =
        document.getElementById("wishlistCount");


    if (cartCount) {

        cartCount.textContent =
            cart.reduce(
                (total, item) =>
                    total + Number(item.quantity || 0),
                0
            );

    }


    if (wishlistCount) {

        wishlistCount.textContent =
            wishlist.length;

    }
}


// =====================================================
// GET PRODUCT ID FROM URL
// =====================================================

function getProductId() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get("id");
}


// =====================================================
// GET PRODUCT
// =====================================================

function getCurrentProduct() {

    const productId =
        getProductId();


    if (!productId) {

        console.error(
            "GARMS: No product ID found in URL."
        );

        return null;
    }


    const products =
        Array.isArray(window.garmsProducts)
            ? window.garmsProducts
            : [];


    console.log(
        "GARMS: Looking for product:",
        productId
    );


    console.log(
        "GARMS: Available products:",
        products
    );


    const product =
        products.find(
            item =>
                String(item.id) ===
                String(productId)
        );


    return product || null;
}


// =====================================================
// PRODUCT SIZES
// =====================================================

function getSizes(category) {

    const categoryName =
        String(category || "").toLowerCase();


    if (
        categoryName.includes("shoe")
    ) {

        return [
            "36",
            "37",
            "38",
            "39",
            "40",
            "41"
        ];

    }


    if (
        categoryName.includes("bag") ||
        categoryName.includes("accessor")
    ) {

        return [
            "ONE SIZE"
        ];

    }


    return [
        "XS",
        "S",
        "M",
        "L",
        "XL"
    ];
}


// =====================================================
// RENDER PRODUCT
// =====================================================

function renderProduct() {

    const container =
        document.getElementById(
            "productDetail"
        );


    if (!container) {

        console.error(
            "GARMS: #productDetail was not found."
        );

        return;
    }


    const product =
        getCurrentProduct();


    // -------------------------------------------------
    // PRODUCT NOT FOUND
    // -------------------------------------------------

    if (!product) {

        container.innerHTML = `
            <div class="product-not-found">

                <h2>
                    This item is no longer available.
                </h2>

                <a href="/#drop">
                    View all items →
                </a>

            </div>
        `;

        return;
    }


    // -------------------------------------------------
    // PRODUCT DATA
    // -------------------------------------------------

    const productId =
        String(product.id);

    const productName =
        product.name || "Unnamed Product";

    const category =
        product.category || "GARMS";

    const price =
        Number(product.price || 0);


    let image =
        product.image;


    if (!image) {

        image =
            "/images/image.jpg";

    }


    // -------------------------------------------------
    // SIZES
    // -------------------------------------------------

    const sizes =
        getSizes(category);


    const sizeButtons =
        sizes
            .map(
                (size, index) => `
                    <button
                        type="button"
                        class="size-button ${index === 0 ? "" : ""}"
                        data-size="${size}"
                    >
                        ${size}
                    </button>
                `
            )
            .join("");


    // -------------------------------------------------
    // HTML
    // -------------------------------------------------

    container.innerHTML = `

        <div class="garms-product-layout">


            <!-- =========================================
                 PRODUCT IMAGE
            ========================================== -->

            <div class="garms-product-image">

                <img
                    src="${image}"
                    alt="${productName}"
                    onerror="this.src='/images/image.jpg'"
                >

            </div>


            <!-- =========================================
                 PRODUCT INFORMATION
            ========================================== -->

            <div class="garms-product-info">


                <div class="product-category">
                    GARMS / ${category}
                </div>


                <h1>
                    ${productName}
                </h1>


                <div class="product-price">
                    ${formatMoney(price)}
                </div>


                <div class="product-divider"></div>


                <!-- SIZE -->

                <div class="size-section">

                    <div class="size-header">

                        <strong>
                            Select size
                        </strong>

                        <span id="sizeMessage">
                            Choose a size
                        </span>

                    </div>


                    <div class="size-buttons">

                        ${sizeButtons}

                    </div>

                </div>


                <div class="product-divider"></div>


                <!-- QUANTITY -->

                <div class="quantity-section">

                    <strong>
                        Quantity
                    </strong>


                    <div class="quantity-control">

                        <button
                            type="button"
                            id="quantityMinus"
                        >
                            −
                        </button>


                        <span id="quantityValue">
                            1
                        </span>


                        <button
                            type="button"
                            id="quantityPlus"
                        >
                            +
                        </button>

                    </div>

                </div>


                <!-- ACTIONS -->

                <div class="product-actions">

                    <button
                        type="button"
                        id="addToCart"
                        class="add-cart-button"
                    >
                        ADD TO CART
                    </button>


                    <button
                        type="button"
                        id="addToWishlist"
                        class="wishlist-button"
                    >
                        ADD TO WISHLIST
                    </button>

                </div>


            </div>

        </div>

    `;


    // =================================================
    // PRODUCT INTERACTION
    // =================================================

    let selectedSize = null;

    let quantity = 1;


    const sizeMessage =
        document.getElementById(
            "sizeMessage"
        );


    const quantityValue =
        document.getElementById(
            "quantityValue"
        );


    // -------------------------------------------------
    // SIZE BUTTONS
    // -------------------------------------------------

    document
        .querySelectorAll(".size-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".size-button"
                        )
                        .forEach(btn => {

                            btn.classList.remove(
                                "selected"
                            );

                        });


                    button.classList.add(
                        "selected"
                    );


                    selectedSize =
                        button.dataset.size;


                    if (sizeMessage) {

                        sizeMessage.textContent =
                            selectedSize;

                    }

                }
            );

        });


    // -------------------------------------------------
    // QUANTITY -
    // -------------------------------------------------

    document
        .getElementById("quantityMinus")
        ?.addEventListener(
            "click",
            () => {

                if (quantity > 1) {

                    quantity--;

                    quantityValue.textContent =
                        quantity;

                }

            }
        );


    // -------------------------------------------------
    // QUANTITY +
    // -------------------------------------------------

    document
        .getElementById("quantityPlus")
        ?.addEventListener(
            "click",
            () => {

                quantity++;

                quantityValue.textContent =
                    quantity;

            }
        );


    // -------------------------------------------------
    // ADD TO CART
    // -------------------------------------------------

    document
        .getElementById("addToCart")
        ?.addEventListener(
            "click",
            () => {

                if (!selectedSize) {

                    alert(
                        "Please select a size first."
                    );

                    return;
                }


                const cart =
                    getCart();


                const cartId =
                    `${productId}-${selectedSize}`;


                const existing =
                    cart.find(
                        item =>
                            String(item.id) ===
                            cartId
                    );


                if (existing) {

                    existing.quantity +=
                        quantity;

                }
                else {

                    cart.push({

                        id: cartId,

                        productId: productId,

                        name: productName,

                        price: price,

                        image: image,

                        category: category,

                        size: selectedSize,

                        quantity: quantity

                    });

                }


                saveCart(cart);


                updateProductNavigation();


                alert(
                    `${productName} added to cart!`
                );

            }
        );


    // -------------------------------------------------
    // ADD TO WISHLIST
    // -------------------------------------------------

    document
        .getElementById("addToWishlist")
        ?.addEventListener(
            "click",
            () => {

                const wishlist =
                    getWishlist();


                const exists =
                    wishlist.some(
                        item =>
                            String(item.id) ===
                            productId
                    );


                if (exists) {

                    alert(
                        "This item is already in your wishlist."
                    );

                    return;
                }


                wishlist.push({

                    id: productId,

                    name: productName,

                    price: price,

                    image: image,

                    category: category

                });


                saveWishlist(
                    wishlist
                );


                updateProductNavigation();


                alert(
                    `${productName} added to wishlist!`
                );

            }
        );

}


// =====================================================
// PAGE INITIALIZATION
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateProductNavigation();

        renderProduct();

    }
);