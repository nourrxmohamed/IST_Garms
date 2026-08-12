const CART_KEY = "garmsCart";
const WISHLIST_KEY = "garmsWishlist";
const REMOVED_PRODUCT_IDS = new Set(["jeans-4", "accessory-9", "fit-jeans-4"]);

const getStoredItems = (key) => {
    try {
        const items = JSON.parse(localStorage.getItem(key)) || [];
        return Array.isArray(items) ? items.filter((item) => !REMOVED_PRODUCT_IDS.has(item.id)) : [];
    } catch {
        return [];
    }
};

let cart = getStoredItems(CART_KEY);
let wishlist = getStoredItems(WISHLIST_KEY);

localStorage.setItem(CART_KEY, JSON.stringify(cart));
localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));

const saveItems = (key, items) => {
    localStorage.setItem(key, JSON.stringify(items));
};

const updateCounts = () => {
    const cartCount = document.getElementById("cartCount");
    const wishlistCount = document.getElementById("wishlistCount");

    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
    }
};

const getProduct = (button) => {
    const product = button.closest(".product");

    return {
        id: product.dataset.id,
        name: product.dataset.name,
        price: Number(product.dataset.price),
        image: product.dataset.image,
        category: product.dataset.category,
    };
};

document.querySelectorAll(".addCart").forEach((button) => {
    button.addEventListener("click", () => {
        const product = getProduct(button);
        const existingItem = cart.find((item) => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        saveItems(CART_KEY, cart);
        updateCounts();
    });
});

document.querySelectorAll(".addWishlist").forEach((button) => {
    button.addEventListener("click", () => {
        const product = getProduct(button);
        const alreadySaved = wishlist.some((item) => item.id === product.id);

        if (alreadySaved) {
            return;
        }

        wishlist.push(product);
        saveItems(WISHLIST_KEY, wishlist);
        updateCounts();
    });
});

const search = document.getElementById("search");

if (search) {
    search.addEventListener("input", () => {
        const query = search.value.trim().toLowerCase();

        document.querySelectorAll(".product").forEach((product) => {
            const name = product.dataset.name.toLowerCase();
            const category = product.dataset.category.toLowerCase();
            const productColumn = product.closest('[class*="col-"]') || product;

            productColumn.style.display =
                name.includes(query) || category.includes(query) ? "" : "none";
        });
    });

    search.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;
        const query = search.value.trim();
        if (query) window.location.href = `/Category/Category?search=${encodeURIComponent(query)}`;
    });
}

document.querySelectorAll(".options span").forEach((option) => {
    option.addEventListener("click", () => {
        const category = option.textContent.replace("→", "").trim();
        alert(`You selected ${category}.`);
    });
});

const startBuildingButton = document.querySelector(".fit-details button");

if (startBuildingButton) {
    startBuildingButton.addEventListener("click", () => {
        document.getElementById("build")?.scrollIntoView({ behavior: "smooth" });
    });
}

updateCounts();

document.querySelectorAll(".category").forEach((card) => {
    card.style.cursor = "pointer";
    card.setAttribute("role", "link");
    card.setAttribute("tabindex", "0");

    const openCategory = () => {
        const category = card.closest("[id]")?.id;
        if (category) window.location.href = `/Category/Category?category=${encodeURIComponent(category)}`;
    };

    card.addEventListener("click", openCategory);
    card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openCategory();
        }
    });
});

document.querySelectorAll(".product").forEach((card) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", (event) => {
        if (event.target.closest("button")) return;
        const product = getProduct(card.querySelector(".addCart"));
        window.location.href = `/Product/Product?id=${encodeURIComponent(product.id)}`;
    });
});

const fitProducts = {
    tops: [
        { id: "fit-top-1", name: "Black Lace Cap-Sleeve Top", price: 650, image: "/images/top (4).jpg", category: "tops", slot: ".top-piece" },
        { id: "fit-top-2", name: "Grey Tattoo Halter Top", price: 550, image: "/images/top (2).jpg", category: "tops", slot: ".top-piece" },
        { id: "fit-top-3", name: "Leopard Floral Corset Top", price: 600, image: "/images/top (3).jpg", category: "tops", slot: ".top-piece" },
        { id: "fit-top-4", name: "Black Off-Shoulder Lace-Up Top", price: 700, image: "/images/top (5).jpg", category: "tops", slot: ".top-piece" },
        { id: "fit-top-5", name: "Black Lace-Up Tube Top", price: 650, image: "/images/top (6).jpg", category: "tops", slot: ".top-piece" },
        { id: "fit-top-6", name: "I Am The Star Stripe Tube Top", price: 600, image: "/images/top (7).jpg", category: "tops", slot: ".top-piece" }
    ],
    jeans: [
        { id: "fit-jeans-1", name: "Lace-Trim Denim Mini Skirt", price: 1000, image: "/images/skirt.jpg", category: "jeans", slot: ".pants-piece" },
        { id: "fit-jeans-2", name: "Embroidered Grey Baggy Jeans", price: 1300, image: "/images/jeans.jpg", category: "jeans", slot: ".pants-piece" },
        { id: "fit-jeans-3", name: "Tommy Hilfiger Patchwork Denim Mini Skirt", price: 1100, image: "/images/streetwear mini skirt_ cool denim mini skirt.jpg", category: "jeans", slot: ".pants-piece" },
    ],
    jackets: [
        { id: "fit-jacket-1", name: "Camo Hooded Jacket", price: 1800, image: "/images/jacket.jpg", category: "jackets", slot: ".jacket-piece" },
        { id: "fit-jacket-2", name: "Graphic Denim Bomber Jacket", price: 2200, image: "/images/jacket (2).jpg", category: "jackets", slot: ".jacket-piece" },
        { id: "fit-jacket-3", name: "Fur-Trim Leather Jacket", price: 1700, image: "/images/jacket (3).jpg", category: "jackets", slot: ".jacket-piece" }
    ],
    accessories: [
        { id: "fit-accessory-1", name: "Layered Silver Lace Bangle Set", price: 450, image: "/images/bracelete.jpg", category: "accessories", slot: ".accessory-piece" },
        { id: "fit-accessory-2", name: "Blue Croc-Embossed Belt", price: 550, image: "/images/belt.jpg", category: "accessories", slot: ".accessory-piece" },
        { id: "fit-accessory-3", name: "Crystal Leopard Bangle Set", price: 500, image: "/images/bracelete (2).jpg", category: "accessories", slot: ".accessory-piece" },
        { id: "fit-accessory-4", name: "Cream Studded Wrap Belt", price: 600, image: "/images/belt (2).jpg", category: "accessories", slot: ".accessory-piece" },
        { id: "fit-accessory-5", name: "Tattoo Wing Sunglasses", price: 450, image: "/images/glasses.jpg", category: "accessories", slot: ".accessory-piece" },
        { id: "fit-accessory-6", name: "Camo New York Cap", price: 550, image: "/images/cap.jpg", category: "accessories", slot: ".accessory-piece" },
        { id: "fit-accessory-7", name: "Red Croc Baker Boy Cap", price: 500, image: "/images/hat.jpg", category: "accessories", slot: ".accessory-piece" }
    ],
    shoes: [
        { id: "fit-shoe-1", name: "Olive Lace-Up High Heel Sandals", price: 2000, image: "/images/shoes (6).jpg", category: "shoes", slot: ".shoes-piece" },
        { id: "fit-shoe-2", name: "Fur-Trim Heeled Boots", price: 2300, image: "/images/shoes (10).jpg", category: "shoes", slot: ".shoes-piece" },
        { id: "fit-shoe-3", name: "Black Lace-Up Knee Boots", price: 1800, image: "/images/shoes (2).jpg", category: "shoes", slot: ".shoes-piece" },
        { id: "fit-shoe-4", name: "Green Stone Chain Sandals", price: 1900, image: "/images/shoes (3).jpg", category: "shoes", slot: ".shoes-piece" },
        { id: "fit-shoe-5", name: "Green Embroidered Sneakers", price: 2100, image: "/images/shoes (4).jpg", category: "shoes", slot: ".shoes-piece" },
        { id: "fit-shoe-6", name: "Olive Croc Lace Boots", price: 2200, image: "/images/shoes (5).jpg", category: "shoes", slot: ".shoes-piece" },
        { id: "fit-shoe-7", name: "Leopard Floral Slingback Heels", price: 2400, image: "/images/shoes (7).jpg", category: "shoes", slot: ".shoes-piece" },
        { id: "fit-shoe-8", name: "Pink Spotted Slingback Heels", price: 1750, image: "/images/shoes (8).jpg", category: "shoes", slot: ".shoes-piece" },
        { id: "fit-shoe-9", name: "Burgundy Ruched Wedge Boots", price: 1950, image: "/images/shoes (9).jpg", category: "shoes", slot: ".shoes-piece" },
        { id: "fit-shoe-10", name: "Black Buckle Ankle Boots", price: 3000, image: "/images/Manolo Blahnik boots.jpg", category: "shoes", slot: ".shoes-piece" }
    ],
    bags: [
        { id: "fit-bag-1", name: "Turquoise Beaded Clutch", price: 1500, image: "/images/bag(6).jpg", category: "bags", slot: ".bag-piece" },
        { id: "fit-bag-2", name: "Union Jack Studded Handbag", price: 1600, image: "/images/Vintage bag London flag.jpg", category: "bags", slot: ".bag-piece" },
        { id: "fit-bag-3", name: "Floral Tapestry Shoulder Bag", price: 1400, image: "/images/bag (2).jpg", category: "bags", slot: ".bag-piece" },
        { id: "fit-bag-4", name: "Zebra Studded Handbag", price: 1500, image: "/images/bag (3).jpg", category: "bags", slot: ".bag-piece" },
        { id: "fit-bag-5", name: "Camo Utility Shoulder Bag", price: 1300, image: "/images/bag (4).jpg", category: "bags", slot: ".bag-piece" },
        { id: "fit-bag-6", name: "Beaded Gemstone Mini Bag", price: 1700, image: "/images/bag (5).jpg", category: "bags", slot: ".bag-piece" },
        { id: "fit-bag-7", name: "Multicolor Lace-Up Shoulder Bag", price: 1550, image: "/images/bag (7).jpg", category: "bags", slot: ".bag-piece" },
        { id: "fit-bag-8", name: "Von Dutch Green Barrel Bag", price: 1800, image: "/images/bag (8).jpg", category: "bags", slot: ".bag-piece" },
        { id: "fit-bag-9", name: "Pink Studded Handbag", price: 1450, image: "/images/bag.jpg", category: "bags", slot: ".bag-piece" }
    ]
};

const fitDetails = document.querySelector(".fit-details");
const fitButton = fitDetails?.querySelector("button");
const selectedFit = new Map();

if (fitDetails && fitButton) {
    const picker = document.createElement("div");
    picker.className = "fit-picker";
    picker.hidden = true;
    picker.setAttribute("aria-live", "polite");

    const summary = document.createElement("p");
    summary.className = "fit-summary";
    summary.textContent = "Choose a category to start building.";
    fitDetails.querySelector(".options").after(picker, summary);

    const updateSummary = () => {
        summary.textContent = selectedFit.size
            ? `Your fit: ${[...selectedFit.values()].map((item) => item.name).join(" · ")}`
            : "Choose a category to start building.";
        fitButton.textContent = selectedFit.size ? "ADD FIT TO CART" : "START BUILDING";
    };

    const showPicker = (category) => {
        picker.replaceChildren();
        picker.hidden = false;
        fitProducts[category].forEach((item) => {
            const choice = document.createElement("button");
            choice.type = "button";
            choice.className = "fit-choice";
            choice.textContent = `${item.name} — EGP ${item.price.toLocaleString()}`;
            choice.addEventListener("click", () => {
                selectedFit.set(category, item);
                if (item.slot) {
                    const slot = document.querySelector(item.slot);
                    slot.style.backgroundImage = `url("${item.image}")`;
                    slot.classList.add("has-item");
                    slot.textContent = item.name;
                }
                [...picker.children].forEach((button) => button.classList.remove("is-active"));
                choice.classList.add("is-active");
                updateSummary();
            });
            picker.append(choice);
        });
    };

    document.addEventListener("click", (event) => {
        const option = event.target.closest(".options span");
        if (!option) return;
        event.stopPropagation();
        const category = option.textContent.match(/[A-Za-z]+/)?.[0].toLowerCase();
        if (fitProducts[category]) showPicker(category);
    }, true);

    fitButton.addEventListener("click", () => {
        if (!selectedFit.size) {
            showPicker("tops");
            return;
        }

        selectedFit.forEach((item) => {
            const existing = cart.find((cartItem) => cartItem.id === item.id);
            if (existing) existing.quantity += 1;
            else cart.push({ ...item, quantity: 1 });
        });
        saveItems(CART_KEY, cart);
        updateCounts();
    });
}