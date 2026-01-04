
// Items
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let discount = 0;
let isLoggedIn = localStorage.getItem('token') ? true : false;
let products = [
    { id: 1, title: 'Zomax Catier Watch', price: 36000, image: 'Catier Watch', imageUrl: './Assets/Watch3.JPG', description: 'Catier Watch.', rating: '★★★★★' },
    { id: 2, title: 'Zomax SMART IT-67', price: 39000, image: 'Zomax Watch', imageUrl: 'Assets/20d599a0-6086-4f76-8749-3be3301832a8.jpg', description: 'A combination of smart glass,smart watch,lipstick,AirPod and 5 unique different straps     Smart Watch features include:   *bluetooth camera   *bluetooth music  *weather  *blood pressure  *stop watch *flashlight  *Breathing  *calculator  *Heart rate  *blood oxygen monitoring  *Do not disturb  *siri  *settings  *sedentary reminder  *sleep monitoring e.t.c', rating: '★★★★☆' },
    { id: 3, title: 'Zomax Glossy Shoe', price: 25000, image: 'Glossy Shoe', imageUrl: './Assets/Shoe8.JPG', description: 'Simple Ladies Glossy Shoe.', rating: '★★★★★', sizes: [36, 37, 38, 39, 40, 41, 42] },
    { id: 4, title: 'Zomax Sports Slide Shoe', price: 10500, image: 'Sports Slide', imageUrl: 'Assets/Sports Slide.JPG', description: 'Low Noise-Steps with long lasting expand.', rating: '★★★★☆', sizes: [41, 42, 43, 44, 45] },
    { id: 5, title: 'Zomax Simple Glossy shoe', price: 15000, image: 'Glossy Shoe', imageUrl: 'Assets/Simple Glossy.JPG', description: 'High-capacity power bank with fast charge.', rating: '★★★★★', sizes: [38, 39, 40, 41, 42] },
    { id: 6, title: 'Zomax Off- white Luxury slide', price: 37000, image: 'Slippers', imageUrl: 'Assets/Off-white Luxury Slide.JPG', description: 'Off- white luxury slide slippers', rating: '★★★★☆', sizes: [40, 41, 42, 43, 44, 45, 46] },
    { id: 7, title: 'Zomax Lifter Slides', price: 26000, image: 'Slippers', imageUrl: 'Assets/Lifter.JPG', description: 'Female lifter slide slippers (Black).', rating: '★★★★★', sizes: [37, 38, 39, 40, 41, 42] },
    { id: 8, title: 'Zomax Rolex Watch', price: 20000, image: 'Gold Watch', imageUrl: 'Assets/Gold watch.JPG', description: 'Original Non-Tarnished Gold Rolex Watch', rating: '★★★★☆' }
];

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    normalizeCart();
    renderProducts();
    updateCartDisplay();
    initPWA();
    initEventListeners();
    if (isLoggedIn) document.getElementById('loginBtn').textContent = 'Account';
});

// Cart items image URL
function normalizeCart() {
    if (!Array.isArray(cart)) cart = [];
    cart = cart.map(item => {
        const prod = products.find(p => p.id == item.id) || {};
        return {
            id: Number(item.id) || prod.id,
            title: item.title || prod.title,
            price: item.price || prod.price || 0,
            quantity: item.quantity || 1,
            imageUrl: item.imageUrl || prod.imageUrl || '',
            description: item.description || prod.description || '',
            size: item.size || prod.size || ''
        };
    });
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Logins
let deferredPrompt;
function initPWA() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        setTimeout(() => document.getElementById('installBanner').classList.add('show'), 2000);
    });
}
document.getElementById('installBtn').onclick = async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        document.getElementById('installBanner').classList.remove('show');
    }
};
document.getElementById('closeInstall').onclick = () => document.getElementById('installBanner').classList.remove('show');

// Render Products
function renderProducts(filtered = products) {
    const grid = document.getElementById('productsGrid');
    const commentsStore = JSON.parse(localStorage.getItem('comments') || '{}');
    grid.innerHTML = filtered.map(product => {
        const arr = Array.isArray(commentsStore[product.id]) ? commentsStore[product.id] : [];
        const count = arr.length;
        const avg = count ? Math.round(arr.reduce((s, it) => s + (it.rating || 0), 0) / count) : 0;
        const starsInline = (() => { let out = ''; for (let i = 1; i <= 5; i++) out += (i <= avg) ? '★' : '☆'; return out; })();
        return `
    <div class="product-card">
        <div class="product-image" onclick="openProductPreview(${product.id})">
            <img src="${product.imageUrl || ''}" alt="${product.title}" onload="this.nextElementSibling.style.display='none'" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
            <div class="product-emoji">${product.image}</div>
        </div>
        <div class="product-info">
            <div class="product-title">${product.title}</div>
            <div class="price">${product.price.toLocaleString()}</div>
            <div class="rating">${product.rating}</div>
            <div class="review-bar">
                <div class="stars-inline">${starsInline}</div>
                <div class="review-count">${count ? count + ' review' + (count > 1 ? 's' : '') : 'No reviews'}</div>
                <button class="write-review" onclick="openProductReview(${product.id});return false;">Write review</button>
            </div>
            <div class="action-row">
                <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id}, '${product.title}', ${product.price}, this)">
                    Add to Cart 
                </button>
                <a class="whatsapp-btn" href="#" onclick="event.stopPropagation(); openWhatsapp(${product.id});return false;">Whatsapp</a>
            </div>
        </div>
    </div>
    `;
    }).join('');
}

function openProductReview(productId) {
    openProductPreview(productId);
    setTimeout(() => {
        const ta = document.getElementById('commentText');
        if (ta) ta.focus();
    }, 250);
}

// Open WhatsApp chat with a prefilled message including product image URL
function openWhatsapp(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const number = '2349131557676';
    const lines = [];
    lines.push("Hi, I'm interested in this item:");
    lines.push(product.title);
    lines.push(`Price: ₦${product.price.toLocaleString()}`);
    if (product.imageUrl) lines.push(product.imageUrl);
    const text = encodeURIComponent(lines.join('\n'));
    const url = `https://wa.me/${number}?text=${text}`;
    window.open(url, '_blank');
}

// Product preview open/close
function openProductPreview(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const modal = document.getElementById('productPreviewModal');
    document.getElementById('previewTitle').textContent = product.title;
    document.getElementById('previewImage').src = product.imageUrl || '';
    document.getElementById('previewImage').alt = product.title;
    document.getElementById('previewPrice').textContent = `₦${product.price.toLocaleString()}`;
    document.getElementById('previewDesc').textContent = product.description || '';
    document.getElementById('previewMeta').textContent = product.rating ? `Rating: ${product.rating}` : '';

    // wire buttons and size selector
    const addBtn = document.getElementById('previewAddBtn');
    const waBtn = document.getElementById('previewWhatsappBtn');
    const sizeWrapper = document.getElementById('sizeWrapper');
    const sizeSelect = document.getElementById('sizeSelect');
    if (product.sizes && Array.isArray(product.sizes) && product.sizes.length) {
        sizeWrapper.style.display = 'block';
        sizeSelect.innerHTML = product.sizes.map(s => `<option value="${s}">${s}</option>`).join('');
        sizeSelect.value = product.sizes[0];
    } else {
        if (sizeWrapper) sizeWrapper.style.display = 'none';
        if (sizeSelect) sizeSelect.innerHTML = '';
    }
    addBtn.onclick = function (e) { e.stopPropagation(); const sel = (sizeSelect && sizeSelect.value) ? sizeSelect.value : ''; addToCart(product.id, product.title, product.price, this, sel); };
    waBtn.onclick = function (e) { e.stopPropagation(); openWhatsapp(product.id); return false; };

    modal.style.display = 'block';
    // initialize comments UI for this product
    try {
        document.getElementById('commentProductId').value = product.id;
        document.getElementById('commenterName').value = '';
        document.getElementById('commentText').value = '';
        document.getElementById('commentRating').value = '5';
        // set up star click handlers
        const stars = document.querySelectorAll('#commentStars .star');
        stars.forEach(s => {
            s.classList.remove('selected');
            s.onclick = function (ev) {
                ev.stopPropagation();
                const v = Number(this.dataset.value || 0);
                document.getElementById('commentRating').value = String(v);
                stars.forEach(st => {
                    if (Number(st.dataset.value) <= v) st.classList.add('selected');
                    else st.classList.remove('selected');
                });
            };
        });
        // default select 5
        stars.forEach(st => st.classList.add('selected'));

        // form submit
        const form = document.getElementById('commentForm');
        form.onsubmit = function (e) {
            e.preventDefault();
            e.stopPropagation();
            const pid = Number(document.getElementById('commentProductId').value || product.id);
            const name = (document.getElementById('commenterName').value || 'Anonymous').trim();
            const text = (document.getElementById('commentText').value || '').trim();
            const rating = Math.max(1, Math.min(5, Number(document.getElementById('commentRating').value || 5)));
            if (!text) return alert('Please write a short review.');
            addComment(pid, { name, text, rating, date: new Date().toISOString() });
            document.getElementById('commenterName').value = '';
            document.getElementById('commentText').value = '';
            document.getElementById('commentRating').value = '5';
            stars.forEach(st => st.classList.add('selected'));
            renderComments(pid);
        };
        renderComments(product.id);
    } catch (err) { console.error('comments init', err); }
}

// COMMENTS: store per-product comments in localStorage under key 'comments'
function getCommentsStorage() {
    try { return JSON.parse(localStorage.getItem('comments') || '{}'); } catch (e) { return {}; }
}
function saveCommentsStorage(obj) { localStorage.setItem('comments', JSON.stringify(obj)); }
function addComment(productId, comment) {
    const storage = getCommentsStorage();
    const arr = Array.isArray(storage[productId]) ? storage[productId] : [];
    arr.unshift(comment);
    storage[productId] = arr;
    saveCommentsStorage(storage);
}
function renderComments(productId) {
    const storage = getCommentsStorage();
    const arr = Array.isArray(storage[productId]) ? storage[productId] : [];
    const list = document.getElementById('commentsList');
    if (!list) return;
    if (arr.length === 0) {
        list.innerHTML = '<div style="color:#666;padding:0.75rem;background:#fff;border-radius:8px;border:1px solid #f6f6f6;">Be the first to review this item.</div>';
    } else {
        list.innerHTML = arr.map(c => `
            <div class="comment">
                <div class="meta"><strong>${escapeHtml(c.name || 'Anonymous')}</strong> • ${renderStarsInline(c.rating)} • <span style="color:#999;font-size:0.85rem">${new Date(c.date).toLocaleString()}</span></div>
                <div class="body">${escapeHtml(c.text)}</div>
            </div>
        `).join('');
    }
    // update previewMeta average
    const previewMeta = document.getElementById('previewMeta');
    if (previewMeta) {
        if (arr.length === 0) previewMeta.textContent = '';
        else {
            const avg = (arr.reduce((s, it) => s + (it.rating || 0), 0) / arr.length) || 0;
            previewMeta.innerHTML = `Rating: ${renderStarsInline(Math.round(avg))} (${avg.toFixed(1)})`;
        }
    }
}

function renderStarsInline(n) {
    let out = '';
    for (let i = 1; i <= 5; i++) out += (i <= n) ? '★' : '☆';
    return `<span style="color:#f1c40f">${out}</span>`;
}

function escapeHtml(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": "&#39;" })[c]; }); }

function closeProductPreview() {
    const modal = document.getElementById('productPreviewModal');
    if (modal) modal.style.display = 'none';
}

// Cart Functions
function addToCart(id, title, price, sourceEl, size) {
    // Allow adding to cart without forcing login; require login only at checkout
    const prod = products.find(p => p.id === id) || {};
    // if product has sizes but no size chosen, open preview to prompt selection
    if (prod.sizes && Array.isArray(prod.sizes) && prod.sizes.length && (!size || String(size).trim() === '')) {
        openProductPreview(prod.id);
        return;
    }
    // include imageUrl, description and size so cart items can show thumbnails/descriptions
    const item = { id, title, price, quantity: 1, size: size || '', imageUrl: prod.imageUrl || '', description: prod.description || '' };
    const existing = cart.find(p => p.id === id && (p.size || '') === (item.size || ''));
    if (existing) existing.quantity++;
    else cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    // Update cart modal if it's open so user sees items immediately
    try { if (document.getElementById('cartModal').style.display === 'block') renderCart(); } catch (e) { }
    // Success animation where possible
    const btn = sourceEl || (window.event && window.event.target) || null;
    if (btn && btn.tagName) {
        const prevText = btn.textContent;
        btn.textContent = 'Added! ✅';
        btn.style.background = '#27ae60';
        setTimeout(() => {
            btn.textContent = prevText || 'Add to Cart';
            btn.style.background = '';
        }, 1500);
    }
}

function updateCartDisplay() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal * (1 - discount);

    document.getElementById('cartBadge').textContent = totalItems;
    document.getElementById('cartBadge').style.display = totalItems ? 'flex' : 'none';
    document.getElementById('cartTotal').textContent = total.toLocaleString();

    const countEl = document.getElementById('cartCount');
    if (countEl) countEl.textContent = totalItems;
}

function renderCart() {
    // reload cart from storage to avoid stale state
    cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const container = document.getElementById('cartItems');
    if (cart.length === 0) {
        container.innerHTML = '<div style="padding:3rem;text-align:center;color:#666;"><h3>Your cart is empty 😢</h3><p>Add some items to get started!</p></div>';
        return;
    }
    container.innerHTML = cart.map((item, index) => {
        const prodMeta = products.find(p => p.id === item.id) || {};
        const img = item.imageUrl || prodMeta.imageUrl || '';
        const desc = item.description || prodMeta.description || '';
        return `
    <div class="cart-item" onclick="openProductPreview(${item.id})" role="button" tabindex="0">
        <img src="${img}" alt="${item.title}" style="width:100px;height:72px;object-fit:cover;border-radius:8px;margin-right:1rem;">
        <div style="flex:1;">
            <div style="font-weight:700;font-size:1.05rem;margin-bottom:0.25rem;">${item.title}</div>
            <div style="color:#666;font-size:0.95rem;margin-bottom:0.5rem;">${desc}</div>
            <div style="color:#666;">${item.price.toLocaleString()} each${item.size ? ' • Size: ' + item.size : ''}</div>
        </div>
        <div class="quantity-controls">
            <button class="qty-btn" onclick="event.stopPropagation(); updateQuantity(${index}, -1)">-</button>
            <span style="min-width:50px;text-align:center;font-weight:700;font-size:1.2rem;">${item.quantity}</span>
            <button class="qty-btn" onclick="event.stopPropagation(); updateQuantity(${index}, 1)">+</button>
        </div>
        <button class="remove-btn" onclick="event.stopPropagation(); removeFromCart(${index})">Remove</button>
    </div>
    `;
    }).join('');
    // defensive: if mapping produced empty string, show a simple list
    if (!container.innerHTML || container.innerHTML.trim() === '') {
        container.innerHTML = '<pre style="padding:1rem;white-space:pre-wrap;word-break:break-word;">' + JSON.stringify(cart, null, 2) + '</pre>';
    }
    updateCartDisplay();
}

function updateQuantity(index, change) {
    cart[index].quantity = Math.max(1, cart[index].quantity + change);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function clearCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    // Reset shipping, discounts and update totals
    shippingCost = 0;
    discount = 0;
    renderCart();
    // hide shipping result if visible
    const sr = document.getElementById('shippingResult');
    if (sr) sr.style.display = 'none';
    updateCartDisplay();
    // reset cart badge
    const badge = document.getElementById('cartBadge');
    if (badge) { badge.textContent = 0; badge.style.display = 'none'; }
    // ensure cart total shows zero
    const totalEl = document.getElementById('cartTotal');
    if (totalEl) totalEl.textContent = '0';
    closeCart();
}

// Auth
function login() {
    localStorage.setItem('token', 'user_' + Date.now());
    isLoggedIn = true;
    document.getElementById('authModal').style.display = 'none';
    document.getElementById('loginBtn').textContent = 'Account';
    alert('Logged in successfully! 🎉');
}

function signup() {
    login(); // Same flow for demo
    alert('Account created! Welcome to Zomax Store! 🎉');
}

function switchTab(tab) {
    document.getElementById('loginTab').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('signupTab').style.display = tab === 'signup' ? 'block' : 'none';
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('modalTitle').textContent = tab === 'login' ? 'Welcome Back' : 'Join Zomax Store';
}


// Search: attach to any input with class 'search-input' and keep them in sync
function handleSearchInput(e) {
    const term = e.target.value.toLowerCase();
    // sync all search inputs
    document.querySelectorAll('.search-input').forEach(el => { if (el !== e.target) el.value = e.target.value; });
    const filtered = products.filter(p =>
        p.title.toLowerCase().includes(term) || (p.image && p.image.toLowerCase().includes(term))
    );
    renderProducts(filtered);
}
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.search-input').forEach(input => {
        input.addEventListener('input', handleSearchInput);
    });
});
// Shipping Calculator (Nigerian rates)
// Shipping calculator removed — shipping is handled at checkout externally.
let shippingCost = 0; // keep variable for compatibility (always 0)

function updateGrandTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = (subtotal * (1 - discount));
    document.getElementById('cartTotal').textContent = total.toLocaleString();
}

// Update existing updateCartDisplay()
function updateCartDisplay() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartBadge').textContent = totalItems;
    document.getElementById('cartBadge').style.display = totalItems ? 'flex' : 'none';
    updateGrandTotal(); // Now includes shipping
    const countEl = document.getElementById('cartCount');
    if (countEl) countEl.textContent = totalItems;
}

// Update checkout to show full breakdown
document.getElementById('checkoutBtn').onclick = () => {
    if (cart.length === 0) return alert('Cart empty!');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const grandTotal = (subtotal * (1 - discount));

    alert(`✅ Order Confirmed!\n\n📦 Cart: ₦${subtotal.toLocaleString()}\n💰 Total: ₦${grandTotal.toLocaleString()}\n\nPaystack processing... 🎉`);
    clearCart();
};

// Event Listeners
function initEventListeners() {
    // Modals
    document.querySelectorAll('.close').forEach(close => {
        close.onclick = () => {
            document.getElementById('authModal').style.display = 'none';
            document.getElementById('cartModal').style.display = 'none';
            closeProductPreview();
        };
    });
    document.getElementById('cartBtn').onclick = () => {
        // Ensure cart is in-sync with storage and normalized before showing
        normalizeCart();
        updateCartDisplay();
        document.getElementById('cartModal').style.display = 'block';
        renderCart();
    };
    document.getElementById('loginBtn').onclick = () => {
        document.getElementById('authModal').style.display = 'block';
    };
    window.onclick = (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    };
}

// Close cart function
function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}
