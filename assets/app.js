// --- SCROLL REVEAL ANIMATIONS ---
const revealElements = document.querySelectorAll('.reveal');

const revealOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px',
};

const revealOnScroll = new IntersectionObserver(function (entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('active');
    observer.unobserve(entry.target);
  });
}, revealOptions);

revealElements.forEach((el) => {
  revealOnScroll.observe(el);
});

// --- GALLERY CAROUSEL LOGIC ---
function scrollCarousel(direction) {
  const track = document.getElementById('carouselTrack');
  if (!track) return;
  const scrollAmount = track.clientWidth * 0.8;
  track.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
}

// --- E-COMMERCE LOGIC ---
let cart = [];

function addToCart(id, name, price) {
  cart.push({ id, name, price });
  updateCartUI();

  const drawer = document.getElementById('cartDrawer');
  if (drawer && !drawer.classList.contains('active')) {
    toggleCart();
  }
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function updateCartUI() {
  const container = document.getElementById('cartItemsContainer');
  const countEl = document.getElementById('cart-count');
  const totalEl = document.getElementById('cartTotal');
  const checkoutTotalEl = document.getElementById('checkoutTotal');
  const checkoutWrap = document.getElementById('checkoutFormWrap');
  const submitBtn = document.getElementById('submitBtn');

  if (!container || !countEl || !totalEl || !checkoutTotalEl || !checkoutWrap) return;

  countEl.innerText = cart.length;

  if (cart.length === 0) {
    container.innerHTML = '<p style="text-align:center; color: #888; margin-top: 2rem;">Your cart is empty.</p>';
    totalEl.innerText = '₱0.00';
    checkoutTotalEl.innerText = '₱0.00';
    checkoutWrap.style.display = 'none';
    if (submitBtn) submitBtn.disabled = true;
    return;
  }

  let html = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    html += `
      <div class="cart-item">
        <div class="item-info">
          <h4 style="margin-bottom: 0.2rem;">${item.name}</h4>
          <p style="font-weight: 600; color: #000;">₱${item.price.toLocaleString()}</p>
        </div>
        <button style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 0.8rem; text-decoration: underline;" onclick="removeFromCart(${index})">Remove</button>
      </div>
    `;
  });

  container.innerHTML = html;
  totalEl.innerText = '₱' + total.toLocaleString();
  checkoutTotalEl.innerText = '₱' + total.toLocaleString();
  checkoutWrap.style.display = 'block';
  if (submitBtn) submitBtn.disabled = false;
}

function toggleCart() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (drawer) drawer.classList.toggle('active');
  if (overlay) overlay.classList.toggle('active');
}

function generateOrderId() {
  const key = 'pepzy_order_counter';
  const current = parseInt(localStorage.getItem(key) || '1000', 10);
  const next = current + 1;
  localStorage.setItem(key, String(next));
  return `#PEP-${next}`;
}

function previewReceipt(event) {
  const file = event.target.files?.[0];
  const previewContainer = document.getElementById('receiptPreviewContainer');
  const previewImage = document.getElementById('receiptImage');

  if (!previewContainer || !previewImage) return;

  if (!file) {
    removeReceipt();
    return;
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    alert('Please upload a JPG or PNG receipt screenshot.');
    event.target.value = '';
    removeReceipt();
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const dataUrl = e.target.result;
    previewImage.src = dataUrl;
    previewContainer.classList.add('active');
    event.target.dataset.base64 = dataUrl;
    event.target.dataset.filename = file.name;
    event.target.dataset.filetype = file.type;
  };
  reader.readAsDataURL(file);
}

function removeReceipt() {
  const receiptInput = document.getElementById('receiptInput');
  const previewContainer = document.getElementById('receiptPreviewContainer');
  const previewImage = document.getElementById('receiptImage');

  if (receiptInput) {
    receiptInput.value = '';
    delete receiptInput.dataset.base64;
    delete receiptInput.dataset.filename;
    delete receiptInput.dataset.filetype;
  }
  if (previewImage) previewImage.src = '';
  if (previewContainer) previewContainer.classList.remove('active');
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

async function processCheckout(event) {
  event.preventDefault();

  if (cart.length === 0) {
    alert('Please add items to your cart before submitting an order request.');
    return;
  }

  const name = document.getElementById('fullNameInput')?.value?.trim();
  const email = document.getElementById('emailInput')?.value?.trim();
  const phone = document.getElementById('phoneInput')?.value?.trim();
  const shippingAddress = document.getElementById('addressInput')?.value?.trim();
  const receiptInput = document.getElementById('receiptInput');

  if (!name || !email || !phone || !shippingAddress) {
    alert('Please complete all shipping details before submitting your order.');
    return;
  }

  if (!receiptInput || !receiptInput.files?.length) {
    alert('Please upload your GoTyme transaction receipt screenshot to continue.');
    return;
  }

  const receiptFile = receiptInput.files[0];
  const receiptBase64 = receiptInput.dataset.base64 || await fileToBase64(receiptFile);

  if (!receiptBase64) {
    alert('Unable to process the receipt upload. Please try again.');
    return;
  }

  const productNames = cart.map((i) => i.name).join(', ');
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const orderId = generateOrderId();

  const order = {
    id: orderId,
    createdAt: new Date().toISOString(),
    customer: { name, email, phone, shippingAddress },
    items: cart,
    productNames,
    total,
    status: 'REQUEST_RECEIVED',
    receipt: {
      name: receiptFile.name,
      type: receiptFile.type,
      data: receiptBase64,
    },
  };

  const ordersKey = 'pepzy_orders';
  const existing = JSON.parse(localStorage.getItem(ordersKey) || '[]');
  existing.push(order);
  localStorage.setItem(ordersKey, JSON.stringify(existing));

  try {
    await fetch('/api/send-order-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        name,
        email,
        productNames,
        receipt: {
          name: receiptFile.name,
          type: receiptFile.type,
          data: receiptBase64.replace(/^data:[^;]+;base64,/, ''),
        },
      }),
    });
  } catch (e) {
    console.error('Email trigger failed:', e);
  }

  cart = [];
  updateCartUI();
  toggleCart();
  removeReceipt();

  const orderForm = document.getElementById('orderForm');
  if (orderForm) orderForm.reset();

  window.location.href = 'thank-you.html?id=' + encodeURIComponent(orderId);
}

window.scrollCarousel = scrollCarousel;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartUI = updateCartUI;
window.toggleCart = toggleCart;
window.processCheckout = processCheckout;
window.previewReceipt = previewReceipt;
window.removeReceipt = removeReceipt;
window.fileToBase64 = fileToBase64;
window.generateOrderId = generateOrderId;

updateCartUI();

