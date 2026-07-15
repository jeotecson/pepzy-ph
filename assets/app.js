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

const productsGrid = document.getElementById('productsGrid');
let storefrontProducts = [];

const DEFAULT_STORE_PRODUCTS = [
  {
    id: 1,
    name: 'TIRZEPATIDE',
    dosage: '15mg',
    tag: 'Weight Management & Metabolic Support',
    desc: 'GIP and GLP-1 Receptor Agonist',
    img: 'assets/tirzepatide-15.png',
    price: 2700,
    inStock: true,
    benefits: [
      'Helps reduce appetite and promote fat loss while preserving lean muscle.',
      'Supports healthy blood sugar levels, insulin sensitivity, and A1C balance.',
      'Delivers sustainable results with a comprehensive approach.',
    ],
    sets: [
      { name: 'Rubbing Alcohol (70% Isopropyl)', qty: '1 bottle', img: 'assets/sample_photo.png' },
      { name: 'Alcohol Pads', qty: '2 pcs', img: 'assets/sample_photo.png' },
      { name: 'Wet Wipes', qty: '1 pc', img: 'assets/sample_photo.png' },
      { name: 'Syringe (Large)', qty: '1 pc', img: 'assets/sample_photo.png' },
      { name: 'Insulin Syringe', qty: '1 pc', img: 'assets/sample_photo.png' },
      { name: 'Bacteriostatic BAC Water (BACTERIOSTATIC WATER)', qty: '1 vial', img: 'assets/sample_photo.png' },
      { name: 'Peptide Case', qty: '1 pc', img: 'assets/sample_photo.png' },
      { name: 'User Guide & Manual', qty: '1 booklet', img: 'assets/sample_photo.png' },
      { name: 'Tirzepatide 15mg vial', qty: '1 vial', img: 'assets/tirzepatide-15.png' },
    ],
  },
  {
    id: 2,
    name: 'TIRZEPATIDE',
    dosage: '30mg',
    tag: 'Weight Management & Metabolic Support',
    desc: 'GIP and GLP-1 Receptor Agonist',
    img: 'assets/tirzepatide-30.png',
    price: 3700,
    inStock: true,
    benefits: [
      'Helps reduce appetite and promote fat loss while preserving lean muscle.',
      'Supports healthy blood sugar levels, insulin sensitivity, and A1C balance.',
      'Delivers sustainable results with a comprehensive approach.',
    ],
    sets: [
      { name: 'Rubbing Alcohol (70% Isopropyl)', qty: '1 bottle', img: 'assets/sample_photo.png' },
      { name: 'Alcohol Pads', qty: '2 pcs', img: 'assets/sample_photo.png' },
      { name: 'Wet Wipes', qty: '1 pc', img: 'assets/sample_photo.png' },
      { name: 'Syringe (Large)', qty: '1 pc', img: 'assets/sample_photo.png' },
      { name: 'Insulin Syringe', qty: '1 pc', img: 'assets/sample_photo.png' },
      { name: 'Bacteriostatic BAC Water (BACTERIOSTATIC WATER)', qty: '1 vial', img: 'assets/sample_photo.png' },
      { name: 'Peptide Case', qty: '1 pc', img: 'assets/sample_photo.png' },
      { name: 'User Guide & Manual', qty: '1 booklet', img: 'assets/sample_photo.png' },
      { name: 'Tirzepatide 30mg vial', qty: '1 vial', img: 'assets/tirzepatide-30.png' },
    ],
  },
  {
    id: 3,
    name: 'NAD+',
    dosage: '500mg',
    tag: 'Cellular Energy & Anti-Aging',
    desc: 'Nicotinamide Adenine Dinucleotide',
    img: 'assets/nad.png',
    price: 2300,
    inStock: true,
    benefits: [
      'Supports ATP production to fight fatigue and improve overall vitality.',
      'Activates sirtuins that help repair DNA and promote healthy cellular aging.',
      'Supports brain function, metabolism, and immune health.',
    ],
    sets: [
      { name: 'Rubbing Alcohol (70% Isopropyl)', qty: '1 bottle', img: 'assets/sample_photo.png' },
      { name: 'Alcohol Pads', qty: '2 pcs', img: 'assets/sample_photo.png' },
      { name: 'Wet Wipes', qty: '1 pc', img: 'assets/sample_photo.png' },
      { name: 'Syringe (Large)', qty: '1 pc', img: 'assets/sample_photo.png' },
      { name: 'Insulin Syringe', qty: '1 pc', img: 'assets/sample_photo.png' },
      { name: 'Bacteriostatic BAC Water (BACTERIOSTATIC WATER)', qty: '1 vial', img: 'assets/sample_photo.png' },
      { name: 'Peptide Case', qty: '1 pc', img: 'assets/sample_photo.png' },
      { name: 'User Guide & Manual', qty: '1 booklet', img: 'assets/sample_photo.png' },
      { name: 'NAD+ 500mg vial', qty: '1 vial', img: 'assets/nad.png' },
    ],
  },
  {
    id: 4,
    name: 'GHK-CU',
    dosage: '100mg',
    tag: 'Cellular & Tissue Repair',
    desc: 'Copper Tripeptide-1',
    img: 'assets/GHK-CU.png',
    price: 2500,
    inStock: true,
    benefits: [
      'Promotes tissue repair and new blood vessel formation (angiogenesis).',
      'Enlarges hair follicles and extends the growth phase of the hair cycle.',
      'Neutralizes free radicals and protects cells from oxidative stress.',
    ],
    sets: [
      { name: 'Rubbing Alcohol (70% Isopropyl)', qty: '1 bottle', img: 'assets/sample_photo.png' },
      { name: 'Alcohol Pads', qty: '2 pcs', img: 'assets/sample_photo.png' },
      { name: 'Wet Wipes', qty: '1 pc', img: 'assets/sample_photo.png' },
      { name: 'Syringe (Large)', qty: '1 pc', img: 'assets/sample_photo.png' },
      { name: 'Insulin Syringe', qty: '1 pc', img: 'assets/sample_photo.png' },
      { name: 'Bacteriostatic BAC Water (BACTERIOSTATIC WATER)', qty: '1 vial', img: 'assets/sample_photo.png' },
      { name: 'Peptide Case', qty: '1 pc', img: 'assets/sample_photo.png' },
      { name: 'User Guide & Manual', qty: '1 booklet', img: 'assets/sample_photo.png' },
      { name: 'GHK-Cu 100mg vial', qty: '1 vial', img: 'assets/GHK-CU.png' },
    ],
  },
  {
    id: 5,
    name: '5-AMINO',
    dosage: '50mg',
    tag: 'Cellular Health & Rejuvenation',
    desc: '5-Aminolevulinic Acid',
    img: 'assets/5-amino.png',
    price: 2700,
    inStock: true,
    benefits: [
      'Supports cellular energy production and mitochondrial function.',
      'Promotes skin health and radiance from within.',
      'Enhances overall cellular rejuvenation and vitality.',
    ],
    sets: [
      { name: 'Rubbing Alcohol (70% Isopropyl)', qty: '1 bottle', img: 'assets/sample_photo.png' },
      { name: 'Alcohol Pads', qty: '2 pcs', img: 'assets/sample_photo.png' },
      { name: 'Wet Wipes', qty: '1 pc', img: 'assets/sample_photo.png' },
      { name: 'Syringe (Large)', qty: '1 pc', img: 'assets/sample_photo.png' },
      { name: 'Insulin Syringe', qty: '1 pc', img: 'assets/sample_photo.png' },
      { name: 'Bacteriostatic BAC Water (BACTERIOSTATIC WATER)', qty: '1 vial', img: 'assets/sample_photo.png' },
      { name: 'Peptide Case', qty: '1 pc', img: 'assets/sample_photo.png' },
      { name: 'User Guide & Manual', qty: '1 booklet', img: 'assets/sample_photo.png' },
      { name: '5-Amino 50mg vial', qty: '1 vial', img: 'assets/5-amino.png' },
    ],
  },
  {
    id: 6,
    name: 'LIPO-C',
    dosage: 'standard',
    tag: 'Immunity & Antioxidant Support',
    desc: 'Liposomal Vitamin C',
    img: 'assets/lipo-c.png',
    price: 2200,
    inStock: true,
    benefits: [
      'Enhanced absorption with liposomal delivery technology.',
      'Powerful antioxidant support for immune health.',
      'Promotes collagen synthesis and cellular repair.',
    ],
    sets: [
      { name: 'Rubbing Alcohol (70% Isopropyl)', qty: '1 bottle', img: 'assets/sample_photo.png' },
      { name: 'Alcohol Pads', qty: '2 pcs', img: 'assets/sample_photo.png' },
      { name: 'Wet Wipes', qty: '1 pc', img: 'assets/sample_photo.png' },
      { name: 'Syringe (Large)', qty: '1 pc', img: 'assets/sample_photo.png' },
      { name: 'Insulin Syringe', qty: '1 pc', img: 'assets/sample_photo.png' },
      { name: 'Bacteriostatic BAC Water (BACTERIOSTATIC WATER)', qty: '1 vial', img: 'assets/sample_photo.png' },
      { name: 'Peptide Case', qty: '1 pc', img: 'assets/sample_photo.png' },
      { name: 'User Guide & Manual', qty: '1 booklet', img: 'assets/sample_photo.png' },
      { name: 'Liposomal Vitamin C vial', qty: '1 vial', img: 'assets/lipo-c.png' },
    ],
  },
  {
    id: 7,
    name: 'LEMON BOTTLE',
    dosage: 'standard',
    tag: 'Advanced Fat Dissolving Solution',
    desc: 'Fat Dissolving Solution',
    img: 'assets/lemonbottle.jpeg',
    price: 2000,
    inStock: true,
    benefits: [
      'Advanced formula for targeted fat reduction.',
      'Supports body contouring and definition.',
      'Professional-grade solution with proven results.',
    ],
    sets: [
      { name: 'Rubbing Alcohol (70% Isopropyl)', qty: '1 bottle', img: 'assets/sample_photo.png' },
      { name: 'Alcohol Pads', qty: '2 pcs', img: 'assets/sample_photo.png' },
      { name: 'Wet Wipes', qty: '1 pc', img: 'assets/sample_photo.png' },
      { name: 'Syringe (Large)', qty: '1 pc', img: 'assets/sample_photo.png' },
      { name: 'Insulin Syringe', qty: '1 pc', img: 'assets/sample_photo.png' },
      { name: 'Bacteriostatic BAC Water (BACTERIOSTATIC WATER)', qty: '1 vial', img: 'assets/sample_photo.png' },
      { name: 'Peptide Case', qty: '1 pc', img: 'assets/sample_photo.png' },
      { name: 'User Guide & Manual', qty: '1 booklet', img: 'assets/sample_photo.png' },
      { name: 'Lemon Bottle Solution', qty: '1 bottle', img: 'assets/lemonbottle.jpeg' },
    ],
  },
  {
    id: 8,
    name: 'KPV',
    dosage: '10mg',
    tag: 'Immune & Gut Health Support',
    desc: 'Kinetic Peptide Valine',
    img: 'assets/kpv.png',
    price: 2600,
    inStock: true,
    benefits: [
      'Supports immune system function and natural defenses.',
      'Promotes healthy gut barrier and intestinal health.',
      'Helps maintain balanced immune response and cellular protection.',
    ],
    sets: [
      { name: 'Rubbing Alcohol (70% Isopropyl)', qty: '1 bottle', img: 'assets/sample_photo.png' },
      { name: 'Alcohol Pads', qty: '2 pcs', img: 'assets/sample_photo.png' },
      { name: 'Wet Wipes', qty: '1 pc', img: 'assets/sample_photo.png' },
      { name: 'Syringe (Large)', qty: '1 pc', img: 'assets/sample_photo.png' },
      { name: 'Insulin Syringe', qty: '1 pc', img: 'assets/sample_photo.png' },
      { name: 'Bacteriostatic BAC Water (BACTERIOSTATIC WATER)', qty: '1 vial', img: 'assets/sample_photo.png' },
      { name: 'Peptide Case', qty: '1 pc', img: 'assets/sample_photo.png' },
      { name: 'User Guide & Manual', qty: '1 booklet', img: 'assets/sample_photo.png' },
      { name: 'KPV 10mg vial', qty: '1 vial', img: 'assets/kpv.png' },
    ],
  },
];

async function loadStorefrontProducts() {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) {
      throw new Error('Failed to load products');
    }

    const data = await response.json();
    storefrontProducts = Array.isArray(data.products) ? data.products : DEFAULT_STORE_PRODUCTS;
  } catch (error) {
    storefrontProducts = DEFAULT_STORE_PRODUCTS;
  }

  renderProductCards(storefrontProducts);
}

function renderProductCards(products) {
  if (!productsGrid) return;

  if (!products || products.length === 0) {
    productsGrid.innerHTML = '<div class="card glass" style="grid-column:1/-1; text-align:center; color:#6b7280;">No products are available at this time.</div>';
    return;
  }

  productsGrid.innerHTML = products
    .sort((a, b) => Number(a.id || 0) - Number(b.id || 0))
    .map((product) => {
      const title = product.dosage && product.dosage !== 'standard' ? `${product.name} ${product.dosage}` : product.name;
      const isInStock = product.inStock !== false;
      const stockInfo = isInStock ? '' : '<span class="tag" style="background: #ef4444;">Out of stock</span>';
      const addButton = isInStock
        ? `<button class="btn" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">Add to Cart</button>`
        : `<button class="btn" disabled style="opacity:0.6;cursor:not-allowed;">Out of Stock</button>`;

      return `
        <div class="card glass ${isInStock ? '' : 'out-of-stock'}">
          <img src="${product.img}" alt="${product.name} product image" class="card-img">
          <span class="tag">${product.tag || ''}</span>
          <h3>${title}</h3>
          <p class="desc">${product.desc}</p>
          <div class="card-footer">
            <span class="price">₱${Number(product.price).toLocaleString()}</span>
            <button class="details-btn" type="button" onclick="openProductDetails(${product.id})">Details</button>
            ${addButton}
          </div>
          ${stockInfo}
        </div>
      `;
    })
    .join('');
}

function openProductDetails(productId) {
  const data = storefrontProducts.find((item) => Number(item.id) === Number(productId));
  if (!data) return;

  const modal = document.getElementById('productModal');
  const overlay = document.getElementById('productModalOverlay');
  const img = document.getElementById('productModalImage');
  const tag = document.getElementById('productModalTag');
  const title = document.getElementById('productModalTitle');
  const price = document.getElementById('productModalPrice');
  const desc = document.getElementById('productModalDesc');
  const benefits = document.getElementById('productModalBenefits');
  const adminInfo = document.getElementById('productModalAdminInfo');
  const sets = document.getElementById('productModalSets');
  const addToCartBtn = document.getElementById('modalAddToCartBtn');

  if (!modal || !overlay || !img || !tag || !title || !desc || !benefits || !adminInfo || !sets || !addToCartBtn) return;

  img.src = data.img;
  img.alt = `${data.name} product image`;
  tag.textContent = data.tag;
  title.textContent = data.dosage && data.dosage !== 'standard' ? `${data.name} ${data.dosage}` : data.name;
  price.textContent = `₱${Number(data.price).toLocaleString()}`;
  desc.textContent = data.desc;
  benefits.innerHTML = (data.benefits || []).map((item) => `<li>${item}</li>`).join('');
  adminInfo.textContent = data.adminInfo || 'Typically administered to one customer per order.';
  sets.innerHTML = (data.sets || [])
    .map(
      (item) => `
        <div class="set-item-card">
          <div class="set-item-meta">
            <div class="set-item-name">${item.name}</div>
            <div class="set-item-qty">${item.qty}</div>
            ${item.note ? `<div class="set-item-note">${item.note}</div>` : ''}
          </div>
        </div>
      `,
    )
    .join('');

  addToCartBtn.disabled = data.inStock === false;
  addToCartBtn.textContent = data.inStock === false ? 'Out of Stock' : 'Add to Cart';
  addToCartBtn.onclick = function () {
    if (data.inStock === false) return;
    addToCart(productId, data.name, data.price);
    closeProductDetails();
  };

  modal.classList.add('active');
  overlay.classList.add('active');
}

function closeProductDetails() {
  const modal = document.getElementById('productModal');
  const overlay = document.getElementById('productModalOverlay');
  if (modal) modal.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
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
    const storeResponse = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });

    if (!storeResponse.ok) {
      console.warn('Server order persistence failed:', await storeResponse.text());
    }
  } catch (storeError) {
    console.warn('Unable to store order on server:', storeError);
  }

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
window.openProductDetails = openProductDetails;
window.closeProductDetails = closeProductDetails;
window.processCheckout = processCheckout;
window.previewReceipt = previewReceipt;
window.removeReceipt = removeReceipt;
window.fileToBase64 = fileToBase64;
window.generateOrderId = generateOrderId;

// Initialize storefront products and cart
loadStorefrontProducts();
updateCartUI();

