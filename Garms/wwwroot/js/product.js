const selectedProductId = new URLSearchParams(window.location.search).get("id");
const detail = document.getElementById("productDetail");
const product = window.garmsProducts?.find((item) => item.id === selectedProductId);
const sizesFor = (category) => category === "shoes" ? ["36", "37", "38", "39", "40", "41"] : ["bags", "accessories"].includes(category) ? ["One size"] : ["XS", "S", "M", "L", "XL"];

if (!product) {
    detail.innerHTML = '<p class="empty">This item is no longer available. <a href="/Category/Category?category=all">View all items &rarr;</a></p>';
} else {
    document.title = `${product.name} | GARMS`;
    const sizes = sizesFor(product.category);
    detail.innerHTML = `<article class="product-detail"><div class="product-detail-image"><img src="${product.image}" alt="${product.name}"></div><div class="product-detail-info"><p class="product-category">GARMS / ${product.category}</p><h1>${product.name}</h1><p class="product-price">EGP ${product.price.toLocaleString()}</p><div class="detail-section"><div class="detail-label"><strong>Select size</strong><span id="selectedSize">Choose a size</span></div><div class="size-options">${sizes.map((size) => `<button type="button" class="size-button" data-size="${size}">${size}</button>`).join("")}</div></div><div class="detail-section quantity-picker"><strong>Quantity</strong><div><button type="button" id="decreaseQuantity" aria-label="Decrease quantity">-</button><span id="productQuantity">1</span><button type="button" id="increaseQuantity" aria-label="Increase quantity">+</button></div></div><button type="button" id="addProductToCart" class="button button-green detail-action">ADD TO CART</button><button type="button" id="addProductToWishlist" class="detail-action">ADD TO WISHLIST</button></div></article>`;
    let selectedSize = "";
    let quantity = 1;
    const updateQuantity = () => { document.getElementById("productQuantity").textContent = quantity; };
    document.querySelectorAll(".size-button").forEach((button) => button.addEventListener("click", () => { document.querySelectorAll(".size-button").forEach((item) => item.classList.remove("is-selected")); button.classList.add("is-selected"); selectedSize = button.dataset.size; document.getElementById("selectedSize").textContent = selectedSize; }));
    document.getElementById("decreaseQuantity").addEventListener("click", () => { if (quantity > 1) { quantity -= 1; updateQuantity(); } });
    document.getElementById("increaseQuantity").addEventListener("click", () => { quantity += 1; updateQuantity(); });
    document.getElementById("addProductToCart").addEventListener("click", (event) => { if (!selectedSize) { document.getElementById("selectedSize").textContent = "Please choose a size"; return; } const cart = read(CART_KEY); const cartId = `${product.id}-${selectedSize}`; const existing = cart.find((item) => item.id === cartId); if (existing) existing.quantity += quantity; else cart.push({ ...product, id: cartId, size: selectedSize, quantity }); write(CART_KEY, cart); updateNavigation(); event.currentTarget.textContent = "ADDED TO CART"; });
    document.getElementById("addProductToWishlist").addEventListener("click", (event) => { const wishlist = read(WISHLIST_KEY); if (!wishlist.some((item) => item.id === product.id)) write(WISHLIST_KEY, [...wishlist, product]); updateNavigation(); event.currentTarget.textContent = "SAVED TO WISHLIST"; });
}