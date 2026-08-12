const CART_KEY = "garmsCart";
const WISHLIST_KEY = "garmsWishlist";
const REMOVED_PRODUCT_IDS = new Set(["jeans-4", "accessory-9", "fit-jeans-4"]);

const read = (key) => {
    try {
        const items = JSON.parse(localStorage.getItem(key)) || [];
        return Array.isArray(items) ? items.filter((item) => !REMOVED_PRODUCT_IDS.has(item.id)) : [];
    }
    catch { return []; }
};
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const money = (value) => `EGP ${Number(value).toLocaleString()}`;
write(CART_KEY, read(CART_KEY));
write(WISHLIST_KEY, read(WISHLIST_KEY));
const countCart = () => read(CART_KEY).reduce((sum, item) => sum + item.quantity, 0);

function updateNavigation() {
    const cart = document.getElementById("cartCount");
    const wishlist = document.getElementById("wishlistCount");
    if (cart) cart.textContent = countCart();
    if (wishlist) wishlist.textContent = read(WISHLIST_KEY).length;
}

function button(text, action, id, className = "") {
    const element = document.createElement("button");
    element.type = "button";
    element.textContent = text;
    element.dataset.action = action;
    element.dataset.id = id;
    element.className = className;
    return element;
}

function renderCart() {
    const list = document.getElementById("cartItems");
    if (!list) return;
    const cart = read(CART_KEY);
    list.replaceChildren();

    if (!cart.length) {
        list.innerHTML = '<p class="empty">Your cart is empty. <a href="/#drop">Shop the drop →</a></p>';
        return;
    }

    cart.forEach((item) => {
        const row = document.createElement("article");
        row.className = "shop-item";
        row.innerHTML = `<img src="${item.image}" alt="${item.name}"><div><h2>${item.name}</h2><p>${money(item.price)}</p></div>`;
        const actions = document.createElement("div");
        actions.className = "actions";
        actions.append(button("−", "decrease", item.id, "quantity"));
        actions.append(Object.assign(document.createElement("span"), { textContent: item.quantity }));
        actions.append(button("+", "increase", item.id, "quantity"));
        actions.append(button("Remove", "remove-cart", item.id));
        row.append(actions);
        list.append(row);
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const summary = document.createElement("div");
    summary.className = "summary";
    summary.innerHTML = `<strong>Total: ${money(total)}</strong><a class="button button-green" href="/Checkout/Checkout">CHECKOUT</a>`;
    list.append(summary);
}

function renderWishlist() {
    const list = document.getElementById("wishlistItems");
    if (!list) return;
    const wishlist = read(WISHLIST_KEY);
    list.replaceChildren();

    if (!wishlist.length) {
        list.innerHTML = '<p class="empty">Your wishlist is empty. <a href="/#drop">Find your next piece →</a></p>';
        return;
    }

    wishlist.forEach((item) => {
        const row = document.createElement("article");
        row.className = "shop-item";
        row.innerHTML = `<img src="${item.image}" alt="${item.name}"><div><h2>${item.name}</h2><p>${money(item.price)}</p></div>`;
        const actions = document.createElement("div");
        actions.className = "actions";
        actions.append(button("Add to Cart", "add-from-wishlist", item.id, "button-green"));
        actions.append(button("Remove", "remove-wishlist", item.id));
        row.append(actions);
        list.append(row);
    });
}

function renderCheckoutTotal() {
    const target = document.getElementById("checkoutTotal");
    if (!target) return;
    const total = read(CART_KEY).reduce((sum, item) => sum + item.price * item.quantity, 0);
    target.textContent = money(total);
}

document.addEventListener("click", (event) => {
    const target = event.target.closest("button[data-action]");
    if (!target) return;
    const cart = read(CART_KEY);
    const wishlist = read(WISHLIST_KEY);
    const id = target.dataset.id;
    const action = target.dataset.action;

    if (action === "increase") cart.find((item) => item.id === id).quantity += 1;
    if (action === "decrease") {
        const item = cart.find((product) => product.id === id);
        if (item.quantity > 1) item.quantity -= 1;
        else cart.splice(cart.indexOf(item), 1);
    }
    if (action === "remove-cart") write(CART_KEY, cart.filter((item) => item.id !== id));
    else if (action === "remove-wishlist") write(WISHLIST_KEY, wishlist.filter((item) => item.id !== id));
    else if (action === "add-from-wishlist") {
        const item = wishlist.find((product) => product.id === id);
        const existing = cart.find((product) => product.id === id);
        if (existing) existing.quantity += 1;
        else cart.push({ ...item, quantity: 1 });
    }
    if (["increase", "decrease", "add-from-wishlist"].includes(action)) write(CART_KEY, cart);
    updateNavigation(); renderCart(); renderWishlist(); renderCheckoutTotal();
});

document.getElementById("checkoutForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!read(CART_KEY).length) return;
    localStorage.removeItem(CART_KEY);
    window.location.href = "/Success/Success";
});

updateNavigation(); renderCart(); renderWishlist(); renderCheckoutTotal();