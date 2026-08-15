// ============================================================
// GARMS SHOP.JS
// Cart + Wishlist + Checkout + Navigation Counts
// ============================================================


const CART_KEY = "garmsCart";
const WISHLIST_KEY = "garmsWishlist";


// ============================================================
// REMOVED PRODUCTS
// ============================================================

const REMOVED_PRODUCT_IDS = new Set([
    "jeans-4",
    "accessory-9",
    "fit-jeans-4"
]);


// ============================================================
// GET PRODUCT ID
// Works with both JavaScript products and SQL products
// ============================================================

function getProductId(item) {

    return String(
        item?.id ??
        item?.productId ??
        item?.ProductID ??
        ""
    );

}


// ============================================================
// READ LOCAL STORAGE
// ============================================================

const read = (key) => {

    try {

        const items =
            JSON.parse(
                localStorage.getItem(key)
            ) || [];


        if (!Array.isArray(items)) {
            return [];
        }


        return items.filter((item) => {

            const id =
                getProductId(item);


            return !REMOVED_PRODUCT_IDS.has(id);

        });

    }

    catch (error) {

        console.error(
            "GARMS localStorage error:",
            error
        );

        return [];

    }

};


// ============================================================
// WRITE LOCAL STORAGE
// ============================================================

const write = (key, value) => {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

    }

    catch (error) {

        console.error(
            "GARMS could not save data:",
            error
        );

    }

};


// ============================================================
// MONEY FORMAT
// ============================================================

const money = (value) => {

    return `EGP ${Number(value || 0).toLocaleString()}`;

};


// ============================================================
// CLEAN OLD / REMOVED DATA
// ============================================================

write(
    CART_KEY,
    read(CART_KEY)
);

write(
    WISHLIST_KEY,
    read(WISHLIST_KEY)
);


// ============================================================
// CART COUNT
// ============================================================

const countCart = () => {

    return read(CART_KEY).reduce(
        (sum, item) => {

            return sum +
                Number(item.quantity || 1);

        },
        0
    );

};


// ============================================================
// WISHLIST COUNT
// ============================================================

const countWishlist = () => {

    return read(WISHLIST_KEY).length;

};


// ============================================================
// UPDATE NAVIGATION COUNTS
// ============================================================

function updateNavigation() {

    const cart =
        document.getElementById(
            "cartCount"
        );


    const wishlist =
        document.getElementById(
            "wishlistCount"
        );


    if (cart) {

        cart.textContent =
            countCart();

    }


    if (wishlist) {

        wishlist.textContent =
            countWishlist();

    }

}


// ============================================================
// CREATE BUTTON
// ============================================================

function button(
    text,
    action,
    id,
    className = ""
) {

    const element =
        document.createElement(
            "button"
        );


    element.type = "button";

    element.textContent = text;

    element.dataset.action =
        action;

    element.dataset.id =
        id;

    element.className =
        className;


    return element;

}


// ============================================================
// SAFE HTML
// ============================================================

function escapeHtml(value) {

    return String(value ?? "")

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ============================================================
// GET ITEM NAME
// ============================================================

function getItemName(item) {

    return (
        item.name ??
        item.productName ??
        item.ProductName ??
        "Product"
    );

}


// ============================================================
// GET ITEM IMAGE
// ============================================================

function getItemImage(item) {

    let image =
        item.image ??
        item.ImagePath ??
        item.imagePath ??
        item.Image ??
        "";


    if (!image) {

        return "/images/image.jpg";

    }


    image =
        String(image).trim();


    // Make image paths work from every page

    if (
        image.startsWith("images/") ||
        image.startsWith("Images/")
    ) {

        image =
            "/" + image;

    }


    // Remove accidental double slash

    if (
        image.startsWith("//")
    ) {

        image =
            image.substring(1);

    }


    return image;

}


// ============================================================
// GET ITEM PRICE
// ============================================================

function getItemPrice(item) {

    return Number(
        item.price ??
        item.Price ??
        0
    );

}


// ============================================================
// RENDER CART
// ============================================================

function renderCart() {

    const list =
        document.getElementById(
            "cartItems"
        );


    if (!list) {
        return;
    }


    const cart =
        read(CART_KEY);


    list.replaceChildren();


    // --------------------------------------------------------
    // EMPTY CART
    // --------------------------------------------------------

    if (!cart.length) {

        list.innerHTML = `

            <p class="empty">

                Your cart is empty.

                <a href="/#drop">
                    Shop the drop →
                </a>

            </p>

        `;


        return;

    }


    // --------------------------------------------------------
    // CART PRODUCTS
    // --------------------------------------------------------

    cart.forEach((item) => {

        const row =
            document.createElement(
                "article"
            );


        row.className =
            "shop-item";


        const image =
            getItemImage(item);


        const name =
            getItemName(item);


        const price =
            getItemPrice(item);


        const size =
            item.size ??
            "";


        row.innerHTML = `

            ${image

                ?

                `
                <img
                    src="${escapeHtml(image)}"
                    alt="${escapeHtml(name)}"
                >
                `

                :

                `
                <div class="shop-item-image">
                    No image
                </div>
                `
            }


            <div>

                <h2>
                    ${escapeHtml(name)}
                </h2>

                <p>
                    ${money(price)}
                </p>

                ${size

                ?

                `
                    <p>
                        Size:
                        <strong>
                            ${escapeHtml(size)}
                        </strong>
                    </p>
                    `

                :

                ""
            }

            </div>

        `;


        // ----------------------------------------------------
        // ACTIONS
        // ----------------------------------------------------

        const actions =
            document.createElement(
                "div"
            );


        actions.className =
            "actions";


        const itemId =
            getProductId(item);


        // Minus

        actions.append(

            button(
                "−",
                "decrease",
                itemId,
                "quantity"
            )

        );


        // Quantity

        const quantity =
            document.createElement(
                "span"
            );


        quantity.textContent =
            Number(
                item.quantity || 1
            );


        actions.append(
            quantity
        );


        // Plus

        actions.append(

            button(
                "+",
                "increase",
                itemId,
                "quantity"
            )

        );


        // Remove

        actions.append(

            button(
                "Remove",
                "remove-cart",
                itemId
            )

        );


        row.append(
            actions
        );


        list.append(
            row
        );

    });


    // ========================================================
    // TOTAL
    // ========================================================

    const total =
        cart.reduce(
            (sum, item) => {

                return sum +
                    getItemPrice(item) *
                    Number(
                        item.quantity || 1
                    );

            },
            0
        );


    const summary =
        document.createElement(
            "div"
        );


    summary.className =
        "summary";


    summary.innerHTML = `

        <strong>
            Total: ${money(total)}
        </strong>

        <a
            class="button button-green"
            href="/Checkout/Checkout"
        >
            CHECKOUT
        </a>

    `;


    list.append(
        summary
    );

}


// ============================================================
// RENDER WISHLIST
// ============================================================

function renderWishlist() {

    const list =
        document.getElementById(
            "wishlistItems"
        );


    if (!list) {
        return;
    }


    const wishlist =
        read(WISHLIST_KEY);


    list.replaceChildren();


    // --------------------------------------------------------
    // EMPTY WISHLIST
    // --------------------------------------------------------

    if (!wishlist.length) {

        list.innerHTML = `

            <p class="empty">

                Your wishlist is empty.

                <a href="/#drop">
                    Find your next piece →
                </a>

            </p>

        `;


        return;

    }


    // --------------------------------------------------------
    // WISHLIST PRODUCTS
    // --------------------------------------------------------

    wishlist.forEach((item) => {

        const row =
            document.createElement(
                "article"
            );


        row.className =
            "shop-item";


        const image =
            getItemImage(item);


        const name =
            getItemName(item);


        const price =
            getItemPrice(item);


        const itemId =
            getProductId(item);


        row.innerHTML = `

            ${image

                ?

                `
                <img
                    src="${escapeHtml(image)}"
                    alt="${escapeHtml(name)}"
                >
                `

                :

                `
                <div class="shop-item-image">
                    No image
                </div>
                `
            }


            <div>

                <h2>
                    ${escapeHtml(name)}
                </h2>

                <p>
                    ${money(price)}
                </p>

            </div>

        `;


        // ----------------------------------------------------
        // ACTIONS
        // ----------------------------------------------------

        const actions =
            document.createElement(
                "div"
            );


        actions.className =
            "actions";


        // Add to cart

        actions.append(

            button(
                "Add to Cart",
                "add-from-wishlist",
                itemId,
                "button-green"
            )

        );


        // Remove

        actions.append(

            button(
                "Remove",
                "remove-wishlist",
                itemId
            )

        );


        row.append(
            actions
        );


        list.append(
            row
        );

    });

}


// ============================================================
// CHECKOUT TOTAL
// ============================================================

function renderCheckoutTotal() {

    const target =
        document.getElementById(
            "checkoutTotal"
        );


    if (!target) {
        return;
    }


    const cart =
        read(CART_KEY);


    const total =
        cart.reduce(
            (sum, item) => {

                return sum +
                    getItemPrice(item) *
                    Number(
                        item.quantity || 1
                    );

            },
            0
        );


    target.textContent =
        money(total);

}


// ============================================================
// FIND CART ITEM
// ============================================================

function findCartItem(
    cart,
    id
) {

    return cart.find(
        (item) =>
            getProductId(item) ===
            String(id)
    );

}


// ============================================================
// FIND WISHLIST ITEM
// ============================================================

function findWishlistItem(
    wishlist,
    id
) {

    return wishlist.find(
        (item) =>
            getProductId(item) ===
            String(id)
    );

}


// ============================================================
// BUTTON CLICK HANDLER
// ============================================================

document.addEventListener(
    "click",
    (event) => {

        const target =
            event.target.closest(
                "button[data-action]"
            );


        if (!target) {
            return;
        }


        const cart =
            read(CART_KEY);


        const wishlist =
            read(WISHLIST_KEY);


        const id =
            target.dataset.id;


        const action =
            target.dataset.action;


        // ====================================================
        // INCREASE
        // ====================================================

        if (
            action ===
            "increase"
        ) {

            const item =
                findCartItem(
                    cart,
                    id
                );


            if (item) {

                item.quantity =
                    Number(
                        item.quantity || 1
                    ) + 1;


                write(
                    CART_KEY,
                    cart
                );

            }

        }


        // ====================================================
        // DECREASE
        // ====================================================

        else if (
            action ===
            "decrease"
        ) {

            const item =
                findCartItem(
                    cart,
                    id
                );


            if (item) {

                if (
                    Number(
                        item.quantity || 1
                    ) > 1
                ) {

                    item.quantity--;

                }

                else {

                    const index =
                        cart.indexOf(
                            item
                        );


                    if (index !== -1) {

                        cart.splice(
                            index,
                            1
                        );

                    }

                }


                write(
                    CART_KEY,
                    cart
                );

            }

        }


        // ====================================================
        // REMOVE FROM CART
        // ====================================================

        else if (
            action ===
            "remove-cart"
        ) {

            const newCart =
                cart.filter(
                    (item) =>
                        getProductId(item) !==
                        String(id)
                );


            write(
                CART_KEY,
                newCart
            );

        }


        // ====================================================
        // REMOVE FROM WISHLIST
        // ====================================================

        else if (
            action ===
            "remove-wishlist"
        ) {

            const newWishlist =
                wishlist.filter(
                    (item) =>
                        getProductId(item) !==
                        String(id)
                );


            write(
                WISHLIST_KEY,
                newWishlist
            );

        }


        // ====================================================
        // ADD FROM WISHLIST TO CART
        // ====================================================

        else if (
            action ===
            "add-from-wishlist"
        ) {

            const item =
                findWishlistItem(
                    wishlist,
                    id
                );


            if (!item) {
                return;
            }


            const existing =
                findCartItem(
                    cart,
                    id
                );


            if (existing) {

                existing.quantity =
                    Number(
                        existing.quantity || 1
                    ) + 1;

            }

            else {

                cart.push({

                    ...item,

                    id:
                        getProductId(item),

                    productId:
                        getProductId(item),

                    name:
                        getItemName(item),

                    price:
                        getItemPrice(item),

                    image:
                        getItemImage(item),

                    quantity: 1

                });

            }


            write(
                CART_KEY,
                cart
            );

        }


        // ====================================================
        // REFRESH EVERYTHING
        // ====================================================

        updateNavigation();

        renderCart();

        renderWishlist();

        renderCheckoutTotal();

    }
);


// ============================================================
// CHECKOUT FORM
// ============================================================
// IMPORTANT:
// Do NOT prevent the normal form submission.
// ASP.NET Core needs to receive the POST request.
// ============================================================

document
    .getElementById(
        "checkoutForm"
    )
    ?.addEventListener(
        "submit",
        (event) => {

            const cart =
                read(CART_KEY);


            // Stop checkout if the cart is empty

            if (!cart.length) {

                event.preventDefault();

                alert(
                    "Your cart is empty."
                );

                return;

            }


            // IMPORTANT:
            // We intentionally DO NOT call:
            //
            // event.preventDefault();
            //
            // here.
            //
            // The browser must submit the form to:
            //
            // POST /Checkout/Create
            //
            // so CheckoutController can save
            // the customer to SQL Server.

        }
    );


// ============================================================
// INITIAL LOAD
// ============================================================

updateNavigation();

renderCart();

renderWishlist();

renderCheckoutTotal();