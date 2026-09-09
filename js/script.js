
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

const galleryItems = [
    ["assets/hero-main.webp", "LumaRestore LED light therapy mask, front view"],
    ["assets/mask-worn.webp", "Person wearing the mask at home"],
    ["assets/eye-protection-detail.webp", "Close-up of the eye area design"]
];

const mainImage = $("#mainImage"), thumbs = $("#thumbs");
galleryItems.forEach(([src, alt], i) => {
    const b = document.createElement("button");
    b.className = "thumb" + (i === 0 ? " active" : "");
    b.setAttribute("aria-label", `View image ${i + 1}`);
    b.innerHTML = `<img src="${src}" alt="">`;
    b.addEventListener("click", () => setGallery(i));
    thumbs.appendChild(b);
});
function setGallery(i) {
    mainImage.style.opacity = "0";
    setTimeout(() => {
        mainImage.src = galleryItems[i][0]; mainImage.alt = galleryItems[i][1];
        mainImage.style.opacity = "1";
    }, 120);
    $$(".thumb").forEach((x, n) => x.classList.toggle("active", n === i));
}

const featuredReview = $("#featuredReview");
const featuredReviewImage = $("#featuredReviewImage");
const featuredReviewName = $("#featuredReviewName");
const featuredReviewQuote = $("#featuredReviewQuote");
const featuredReviewDots = $$(".featured-review-dot");
const featuredReviews = [
    {
        image: "assets/ugc-4.webp",
        alt: "Sarah using the LumaRestore mask",
        name: "Sarah & Maple",
        quote: "“Maple sleeps deeper and longer than ever. The cushioning feels luxe and supportive.”"
    },
    {
        image: "assets/ugc-2.webp",
        alt: "Customer using the LumaRestore mask at home",
        name: "Emma & Luna",
        quote: "“The routine feels calm and easy to repeat, even on busy evenings.”"
    },
    {
        image: "assets/ugc-6.webp",
        alt: "Customer enjoying an at-home LumaRestore session",
        name: "Olivia & Coco",
        quote: "“It fits naturally into our evening routine and feels wonderfully hands-free.”"
    }
];
let featuredReviewIndex = 0;
let featuredReviewTimer;

function showFeaturedReview(index) {
    featuredReviewIndex = index;
    const review = featuredReviews[index];
    featuredReviewImage.src = review.image;
    featuredReviewImage.alt = review.alt;
    featuredReviewName.textContent = review.name;
    featuredReviewQuote.textContent = review.quote;
    featuredReviewDots.forEach((dot, dotIndex) => {
        const active = dotIndex === index;
        dot.classList.toggle("active", active);
        dot.setAttribute("aria-current", active ? "true" : "false");
    });
}

function startFeaturedReviewAutoPlay() {
    clearInterval(featuredReviewTimer);
    featuredReviewTimer = setInterval(() => {
        showFeaturedReview((featuredReviewIndex + 1) % featuredReviews.length);
    }, 4200);
}

featuredReviewDots.forEach((dot, index) => dot.addEventListener("click", () => {
    showFeaturedReview(index);
    startFeaturedReviewAutoPlay();
}));
featuredReview.addEventListener("mouseenter", () => clearInterval(featuredReviewTimer));
featuredReview.addEventListener("mouseleave", startFeaturedReviewAutoPlay);
featuredReview.addEventListener("focusin", () => clearInterval(featuredReviewTimer));
featuredReview.addEventListener("focusout", event => {
    if (!featuredReview.contains(event.relatedTarget)) startFeaturedReviewAutoPlay();
});
startFeaturedReviewAutoPlay();

let qty = 1;
$$(".qty-btn").forEach(btn => btn.addEventListener("click", () => {
    qty = Math.max(1, qty + Number(btn.dataset.qty));
    $("#qtyValue").textContent = qty;
    $("#stickyQuantity").textContent = qty;
    updateDisplayedPrice();
}));

const announcements = [
    "Free tracked shipping on qualifying orders.",
    "Easy returns and secure checkout.",
    "Make a few quiet minutes for your self-care routine."
];
let ai = 0;
setInterval(() => {
    const el = $("#announcementText"); if (!el || $(".announcement").hidden) return;
    ai = (ai + 1) % announcements.length;
    el.textContent = announcements[ai];
}, 4000);
$(".announcement-close").addEventListener("click", () => $(".announcement").hidden = true);

$("#menuBtn").addEventListener("click", () => {
    const nav = $("#mobileNav"), open = nav.classList.toggle("open");
    $("#menuBtn").setAttribute("aria-expanded", open);
});
$$(".mobile-nav a").forEach(a => a.addEventListener("click", () => $("#mobileNav").classList.remove("open")));

$$(".spec-list, .faq-list").forEach(list => {
    const accordions = $$("details", list);
    accordions.forEach(accordion => accordion.addEventListener("toggle", () => {
        if (!accordion.open) return;
        accordions.forEach(other => {
            if (other !== accordion) other.open = false;
        });
    }));
});

const overlay = $("#overlay"), drawer = $("#cartDrawer");
function openCart() { overlay.hidden = false; drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); }
function closeCart() { overlay.hidden = true; drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); }
$("#cartBtn").addEventListener("click", openCart); $("#closeCart").addEventListener("click", closeCart); overlay.addEventListener("click", closeCart);

let cart = [];
let selectedBundle = { name: "Mask only", price: 249, originalPrice: 289 };
function formatPrice(n) { return `$${n}`; }
function updateDisplayedPrice() {
    const totalPrice = selectedBundle.price * qty;
    const originalPrice = selectedBundle.originalPrice * qty;
    const savings = (selectedBundle.originalPrice - selectedBundle.price) * qty;
    $("#productPrice").textContent = formatPrice(totalPrice);
    $("#originalPrice").textContent = formatPrice(originalPrice);
    $("#savingsBadge").textContent = `Save ${formatPrice(savings)}`;
    $("#stickyPrice").textContent = formatPrice(totalPrice);
}

function selectBundle(name, price, originalPrice = price) {
    selectedBundle = { name, price, originalPrice };
    $$(".product-bundle").forEach(bundle => {
        const isSelected = bundle.querySelector("input").value === name;
        bundle.classList.toggle("is-selected", isSelected);
        bundle.querySelector("input").checked = isSelected;
    });
    updateDisplayedPrice();
}

$$(".product-bundle").forEach(bundle => {
    bundle.querySelector("input").addEventListener("change", event => {
        selectBundle(
            event.target.value,
            Number(event.target.dataset.price),
            Number(event.target.dataset.originalPrice)
        );
    });
});

$$(".bundle-select").forEach(button => button.addEventListener("click", () => {
    const card = button.closest(".bundle-card");
    const price = Number(card.querySelector("strong").textContent.replace("$", ""));
    const name = card.querySelector("h3").textContent;
    selectBundle(name, price);
    $("#product").scrollIntoView({ behavior: "smooth", block: "start" });
}));

function renderCart() {
    const items = $("#cartItems");
    if (!cart.length) { items.innerHTML = "<p>Your bag is empty.</p>"; }
    else items.innerHTML = cart.map(i => {
        const lineTotal = i.qty * i.price;
        return `<div class="cart-line"><strong>${i.name}</strong><br><span>${i.qty} × ${formatPrice(i.price)} = <strong>${formatPrice(lineTotal)}</strong></span></div>`;
    }).join("");
    const total = cart.reduce((s, i) => s + i.qty * i.price, 0);
    $("#cartTotal").textContent = formatPrice(total);
    $("#cartCount").textContent = cart.reduce((s, i) => s + i.qty, 0);
}
function toast(message) {
    const t = $("#toast"); t.textContent = message; t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2200);
}
function addCurrent(quantity = qty) {
    cart.push({ ...selectedBundle, qty: quantity });
    renderCart(); toast(`${selectedBundle.name} added to bag`);
}
$$(".add-to-cart").forEach(b => b.addEventListener("click", () => {
    addCurrent(b.dataset.source === "final-cta" ? 1 : qty);
    openCart();
}));
$$(".buy-now").forEach(b => b.addEventListener("click", () => { addCurrent(); toast("Your order has been added to the cart."); }));

const lightbox = $("#lightbox"), lightboxImage = $("#lightboxImage");
function openLightbox(img) {
    lightboxImage.src = img.currentSrc || img.src;
    lightboxImage.alt = img.alt;
    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}
function closeLightbox() {
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lightboxImage.removeAttribute("src");
}
$("#mainImageButton").addEventListener("click", () => openLightbox(mainImage));
$$(".ugc-item").forEach(btn => btn.addEventListener("click", () => openLightbox($("img", btn))));
$("#closeLightbox").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });

const ugcViewport = $(".ugc-viewport"), ugcTrack = $("#ugcTrack");
const ugcItems = $$(".ugc-item", ugcTrack), ugcPrev = $(".ugc-prev"), ugcNext = $(".ugc-next");
let ugcIndex = 0;
function getUgcVisibleCount() {
    return window.matchMedia("(max-width: 768px)").matches ? 1
        : window.matchMedia("(max-width: 1024px)").matches ? 2 : 3;
}
function updateUgcSlider() {
    const visibleCount = getUgcVisibleCount();
    const maxIndex = Math.max(0, ugcItems.length - visibleCount);
    ugcIndex = Math.min(ugcIndex, maxIndex);
    const itemWidth = ugcItems[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(ugcTrack).gap) || 0;
    ugcTrack.style.transform = `translateX(-${ugcIndex * (itemWidth + gap)}px)`;
    ugcPrev.disabled = ugcIndex === 0;
    ugcNext.disabled = ugcIndex === maxIndex;
}
ugcPrev.addEventListener("click", () => { ugcIndex -= 1; updateUgcSlider(); });
ugcNext.addEventListener("click", () => { ugcIndex += 1; updateUgcSlider(); });
window.addEventListener("resize", updateUgcSlider);
updateUgcSlider();
updateDisplayedPrice();

$$(".filter").forEach(btn => btn.addEventListener("click", () => {
    $$(".filter").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const rating = btn.dataset.rating;
    reviewCards.forEach(card => {
        card.hidden = rating !== "all" && card.dataset.rating !== rating;
    });
    reviewIndex = 0;
    updateReviewSlider(false);
}));

const reviewViewport = $(".review-viewport");
const reviewTrack = $("#reviewTrack");
const reviewCards = $$(".review-card", reviewTrack);
const reviewPrev = $(".review-prev");
const reviewNext = $(".review-next");
let reviewIndex = 0;
let reviewTimer;

function activeReviewCards() {
    return reviewCards.filter(card => !card.hidden);
}

function getReviewVisibleCount() {
    if (window.matchMedia("(max-width: 768px)").matches) return 1;
    if (window.matchMedia("(max-width: 1024px)").matches) return 2;
    return 3;
}

function updateReviewSlider(animate = true) {
    const cards = activeReviewCards();
    if (!cards.length) return;
    const maxIndex = Math.max(0, cards.length - getReviewVisibleCount());
    reviewIndex = Math.min(reviewIndex, maxIndex);
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(reviewTrack).gap) || 0;
    reviewTrack.style.transition = animate ? "" : "none";
    reviewTrack.style.transform = `translateX(-${reviewIndex * (cardWidth + gap)}px)`;
    if (!animate) requestAnimationFrame(() => { reviewTrack.style.transition = ""; });
}

function moveReview(direction = 1) {
    const cards = activeReviewCards();
    if (!cards.length) return;
    const maxIndex = Math.max(0, cards.length - getReviewVisibleCount());
    reviewIndex += direction;
    if (reviewIndex > maxIndex) {
        reviewIndex = 0;
        updateReviewSlider(false);
        return;
    }
    if (reviewIndex < 0) reviewIndex = maxIndex;
    updateReviewSlider();
}

function startReviewAutoPlay() {
    clearInterval(reviewTimer);
    reviewTimer = setInterval(() => moveReview(1), 4200);
}

reviewPrev.addEventListener("click", () => { moveReview(-1); startReviewAutoPlay(); });
reviewNext.addEventListener("click", () => { moveReview(1); startReviewAutoPlay(); });
reviewViewport.addEventListener("mouseenter", () => clearInterval(reviewTimer));
reviewViewport.addEventListener("mouseleave", startReviewAutoPlay);
reviewViewport.addEventListener("focusin", () => clearInterval(reviewTimer));
reviewViewport.addEventListener("focusout", e => {
    if (!reviewViewport.contains(e.relatedTarget)) startReviewAutoPlay();
});
window.addEventListener("resize", () => updateReviewSlider(false));
updateReviewSlider(false);
startReviewAutoPlay();

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); revealObserver.unobserve(e.target); } });
}, { threshold: .12 });
$$(".reveal").forEach(el => revealObserver.observe(el));

const stickyObserver = new IntersectionObserver(entries => {
    $("#mobileSticky").classList.toggle("show", !entries[0].isIntersecting);
}, { threshold: .1 });
stickyObserver.observe($("#buyBox"));

$("#searchBtn").addEventListener("click", () => toast("Search is coming soon."));
$("#checkoutBtn").addEventListener("click", () => toast("Checkout is ready for your order."));
document.addEventListener("keydown", e => { if (e.key === "Escape") { closeCart(); closeLightbox(); } });
renderCart();
