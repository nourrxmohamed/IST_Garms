const products = [
    { id: "top-1", category: "tops", name: "Black Lace Cap-Sleeve Top", price: 650, image: "/images/top (4).jpg" },
    { id: "top-2", category: "tops", name: "Grey Tattoo Halter Top", price: 550, image: "/images/top (2).jpg" },
    { id: "top-3", category: "tops", name: "Leopard Floral Corset Top", price: 600, image: "/images/top (3).jpg" },
    { id: "top-4", category: "tops", name: "Black Off-Shoulder Lace-Up Top", price: 700, image: "/images/top (5).jpg" },
    { id: "top-5", category: "tops", name: "Black Lace-Up Tube Top", price: 650, image: "/images/top (6).jpg" },
    { id: "top-6", category: "tops", name: "I Am The Star Stripe Tube Top", price: 600, image: "/images/top (7).jpg" },
    { id: "top-7", category: "tops", name: "Union Jack Studded Tube Top", price: 650, image: "/images/top.jpg" },
    { id: "jeans-1", category: "jeans", name: "Lace-Trim Denim Mini Skirt", price: 1000, image: "/images/skirt.jpg" },
    { id: "jeans-2", category: "jeans", name: "Embroidered Grey Baggy Jeans", price: 1300, image: "/images/jeans.jpg" },
    { id: "jeans-3", category: "jeans", name: "Tommy Hilfiger Patchwork Denim Mini Skirt", price: 1100, image: "/images/streetwear mini skirt_ cool denim mini skirt.jpg" },
    { id: "jacket-1", category: "jackets", name: "Camo Hooded Jacket", price: 1800, image: "/images/jacket.jpg" },
    { id: "jacket-2", category: "jackets", name: "Graphic Denim Bomber Jacket", price: 2200, image: "/images/jacket (2).jpg" },
    { id: "jacket-3", category: "jackets", name: "Fur-Trim Leather Jacket", price: 1700, image: "/images/jacket (3).jpg" },
    { id: "accessory-1", category: "accessories", name: "Layered Silver Lace Bangle Set", price: 450, image: "/images/bracelete.jpg" },
    { id: "accessory-2", category: "accessories", name: "Blue Croc-Embossed Belt", price: 550, image: "/images/belt.jpg" },
    { id: "accessory-3", category: "accessories", name: "Crystal Leopard Bangle Set", price: 500, image: "/images/bracelete (2).jpg" },
    { id: "accessory-4", category: "accessories", name: "Cream Studded Wrap Belt", price: 600, image: "/images/belt (2).jpg" },
    { id: "accessory-5", category: "accessories", name: "Tattoo Wing Sunglasses", price: 450, image: "/images/glasses.jpg" },
    { id: "accessory-6", category: "accessories", name: "Rhinestone Brown Shield Sunglasses", price: 500, image: "/images/glasses (2).jpg" },
    { id: "accessory-7", category: "accessories", name: "Camo New York Cap", price: 550, image: "/images/cap.jpg" },
    { id: "accessory-8", category: "accessories", name: "Red Croc Baker Boy Cap", price: 500, image: "/images/hat.jpg" },
    { id: "shoe-1", category: "shoes", name: "Olive Lace-Up High Heel Sandals", price: 2000, image: "/images/shoes (6).jpg" },
    { id: "shoe-2", category: "shoes", name: "Fur-Trim Heeled Boots", price: 2300, image: "/images/shoes (10).jpg" },
    { id: "shoe-3", category: "shoes", name: "Black Lace-Up Knee Boots", price: 1800, image: "/images/shoes (2).jpg" },
    { id: "shoe-4", category: "shoes", name: "Green Stone Chain Sandals", price: 1900, image: "/images/shoes (3).jpg" },
    { id: "shoe-5", category: "shoes", name: "Green Embroidered Sneakers", price: 2100, image: "/images/shoes (4).jpg" },
    { id: "shoe-6", category: "shoes", name: "Olive Croc Lace Boots", price: 2200, image: "/images/shoes (5).jpg" },
    { id: "shoe-7", category: "shoes", name: "Leopard Floral Slingback Heels", price: 2400, image: "/images/shoes (7).jpg" },
    { id: "shoe-8", category: "shoes", name: "Pink Spotted Slingback Heels", price: 1750, image: "/images/shoes (8).jpg" },
    { id: "shoe-9", category: "shoes", name: "Burgundy Ruched Wedge Boots", price: 1950, image: "/images/shoes (9).jpg" },
    { id: "shoe-10", category: "shoes", name: "Floral Denim Cowboy Boots", price: 1700, image: "/images/shoes.jpg" },
    { id: "shoe-11", category: "shoes", name: "Black Buckle Ankle Boots", price: 3000, image: "/images/Manolo Blahnik boots.jpg" },
    { id: "shoe-12", category: "shoes", name: "Leopard Bow Mule Heels", price: 2800, image: "/images/%23shoes%20%23heels_.jpg" },
    { id: "bag-1", category: "bags", name: "Turquoise Beaded Clutch", price: 1500, image: "/images/bag(6).jpg" },
    { id: "bag-2", category: "bags", name: "Union Jack Studded Handbag", price: 1600, image: "/images/Vintage bag London flag.jpg" },
    { id: "bag-3", category: "bags", name: "Von Dutch Shoulder Bag", price: 1800, image: "/images/bag (8).jpg" },
    { id: "bag-4", category: "bags", name: "Floral Tapestry Shoulder Bag", price: 1400, image: "/images/bag (2).jpg" },
    { id: "bag-5", category: "bags", name: "Zebra Studded Handbag", price: 1500, image: "/images/bag (3).jpg" },
    { id: "bag-6", category: "bags", name: "Camo Utility Shoulder Bag", price: 1300, image: "/images/bag (4).jpg" },
    { id: "bag-7", category: "bags", name: "Beaded Gemstone Mini Bag", price: 1700, image: "/images/bag (5).jpg" },
    { id: "bag-8", category: "bags", name: "Animal Print Buckle Handbag", price: 1500, image: "/images/bag (6).jpg" },
    { id: "bag-9", category: "bags", name: "Multicolor Lace-Up Shoulder Bag", price: 1550, image: "/images/bag (7).jpg" },
    { id: "bag-10", category: "bags", name: "Pink Studded Handbag", price: 1450, image: "/images/bag.jpg" }
];
window.garmsProducts = products;

const parameters = new URLSearchParams(window.location.search);
const searchTerm = parameters.get("search")?.trim().toLowerCase() || "";
const category = parameters.get("category") || (searchTerm ? "all" : "tops");
const validCategory = category === "all" || products.some((product) => product.category === category)
    ? category
    : "tops";
const displayCategory = searchTerm
    ? `Results for "${parameters.get("search").trim()}"`
    : validCategory === "all"
        ? "All items"
        : validCategory[0].toUpperCase() + validCategory.slice(1);
document.title = `${displayCategory} | GARMS`;
const categoryTitle = document.getElementById("categoryTitle");
if (categoryTitle) categoryTitle.textContent = `${displayCategory}.`;

const grid = document.getElementById("productGrid");
const matchingProducts = products.filter((product) => {
    const matchesCategory = validCategory === "all" || product.category === validCategory;
    const matchesSearch = !searchTerm || `${product.name} ${product.category}`.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
});

if (grid && !matchingProducts.length) {
    grid.innerHTML = '<p class="empty">No pieces match that search. <a href="/Category/Category?category=all">View all items →</a></p>';
}

matchingProducts.forEach((product) => {
    if (!grid) return;
    const card = document.createElement("article");
    card.className = "catalogue-card";
    card.tabIndex = 0;
    card.setAttribute("role", "link");
    card.innerHTML = `<img src="${product.image}" alt="${product.name}"><h2>${product.name}</h2><p>EGP ${product.price.toLocaleString()}</p>`;
    const actions = document.createElement("div");
    actions.className = "actions";
    actions.append(button("Add to Cart", "add-category-cart", product.id, "button-green"));
    actions.append(button("♡ Wishlist", "add-category-wishlist", product.id));
    card.append(actions);
    card.addEventListener("click", (event) => {
        if (!event.target.closest("button")) window.location.href = `/Product/Product?id=${encodeURIComponent(product.id)}`;
    });
    card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            window.location.href = `/Product/Product?id=${encodeURIComponent(product.id)}`;
        }
    });
    grid.append(card);
});

document.addEventListener("click", (event) => {
    const action = event.target.closest("button[data-action]");
    if (!action || !action.dataset.action.startsWith("add-category")) return;
    const product = products.find((item) => item.id === action.dataset.id);
    const cart = read(CART_KEY);
    const wishlist = read(WISHLIST_KEY);

    if (action.dataset.action === "add-category-cart") {
        const existing = cart.find((item) => item.id === product.id);
        if (existing) existing.quantity += 1;
        else cart.push({ ...product, quantity: 1 });
        write(CART_KEY, cart);
        action.textContent = "Added!";
    } else if (wishlist.some((item) => item.id === product.id)) {
        action.textContent = "Already Saved";
    } else {
        wishlist.push(product);
        write(WISHLIST_KEY, wishlist);
        action.textContent = "Saved!";
    }

    updateNavigation();
    window.setTimeout(() => {
        action.textContent = action.dataset.action === "add-category-cart" ? "Add to Cart" : "♡ Wishlist";
    }, 1200);
});