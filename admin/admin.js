const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');
const productManagementSection = document.getElementById('productManagementSection');
const logoutBtn = document.getElementById('logoutBtn');
const loginForm = document.getElementById('adminLoginForm');
const loginError = document.getElementById('loginError');
const ordersCount = document.getElementById('ordersCount');
const ordersTableBody = document.getElementById('ordersTableBody');
const statusFilter = document.getElementById('statusFilter');
const receiptModalOverlay = document.getElementById('receiptModalOverlay');
const receiptModal = document.getElementById('receiptModal');
const receiptModalImage = document.getElementById('receiptModalImage');
const receiptModalClose = document.getElementById('receiptModalClose');
const adminStatusNote = document.getElementById('adminStatusNote');
const productsTableBody = document.getElementById('productsTableBody');
const newProductBtn = document.getElementById('newProductBtn');
const productFormOverlay = document.getElementById('productFormOverlay');
const productFormModal = document.getElementById('productFormModal');
const productForm = document.getElementById('productForm');
const productFormTitle = document.getElementById('productFormTitle');
const productFormClose = document.getElementById('productFormClose');
const productNameInput = document.getElementById('productName');
const productDosageInput = document.getElementById('productDosage');
const productTagInput = document.getElementById('productTag');
const productDescInput = document.getElementById('productDesc');
const productImgInput = document.getElementById('productImg');
const productPriceInput = document.getElementById('productPrice');
const productInStockSelect = document.getElementById('productInStock');
const productBenefitsInput = document.getElementById('productBenefits');
const productSetsInput = document.getElementById('productSets');

const LOCAL_ADMIN_USERNAME = 'admin';
const LOCAL_ADMIN_PASSWORD = 'pepzy123';
const LOCAL_ORDERS_KEY = 'pepzy_orders';
const LOCAL_PRODUCTS_KEY = 'pepzy_products';
let adminMode = 'backend';
let backendAvailable = false;
let editingProductId = null;

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: 'TIRZEPATIDE',
    dosage: '15mg',
    tag: 'Weight Management & Metabolic Support',
    desc: 'GIP and GLP-1 Receptor Agonist',
    img: 'assets/Tirzepatide.png',
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
      { name: 'Tirzepatide 15mg vial', qty: '1 vial', img: 'assets/Tirzepatide.png' },
    ],
  },
  {
    id: 2,
    name: 'TIRZEPATIDE',
    dosage: '30mg',
    tag: 'Weight Management & Metabolic Support',
    desc: 'GIP and GLP-1 Receptor Agonist',
    img: 'assets/Tirzepatide.png',
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
      { name: 'Tirzepatide 30mg vial', qty: '1 vial', img: 'assets/Tirzepatide.png' },
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
    img: 'assets/sample_photo.png',
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
      { name: '5-Amino 50mg vial', qty: '1 vial', img: 'assets/sample_photo.png' },
    ],
  },
  {
    id: 6,
    name: 'LIPO-C',
    dosage: 'standard',
    tag: 'Immunity & Antioxidant Support',
    desc: 'Liposomal Vitamin C',
    img: 'assets/sample_photo.png',
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
      { name: 'Liposomal Vitamin C vial', qty: '1 vial', img: 'assets/sample_photo.png' },
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
    img: 'assets/sample_photo.png',
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
      { name: 'KPV 10mg vial', qty: '1 vial', img: 'assets/sample_photo.png' },
    ],
  },
];

const STATUS_LABELS = {
  REQUEST_RECEIVED: 'Request Received',
  RECEIPT_CONFIRMED: 'Receipt Confirmed',
  SHIPPED: 'Shipped',
};

function htmlEscape(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function openReceiptModal(src, alt) {
  receiptModalImage.src = src;
  receiptModalImage.alt = alt || 'Receipt preview';
  receiptModal.classList.add('active');
  receiptModalOverlay.classList.add('active');
}

function closeReceiptModal() {
  receiptModal.classList.remove('active');
  receiptModalOverlay.classList.remove('active');
  receiptModalImage.src = '';
}

async function apiFetch(path, options = {}) {
  const headers = {
    ...(options.headers || {}),
  };

  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(path, {
    credentials: 'same-origin',
    headers,
    ...options,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const errorMessage = payload?.error || response.statusText || 'Request failed';
    throw new Error(errorMessage);
  }

  return response.json();
}

function showLogin() {
  loginSection.classList.remove('hidden');
  dashboardSection.classList.add('hidden');
  productManagementSection.classList.add('hidden');
  logoutBtn.classList.add('hidden');
  setAdminStatusNote('');
  document.body.classList.add('admin-login-active');
}

function showDashboard() {
  loginSection.classList.add('hidden');
  dashboardSection.classList.remove('hidden');
  productManagementSection.classList.remove('hidden');
  logoutBtn.classList.remove('hidden');
  document.body.classList.remove('admin-login-active');
}

function setAdminStatusNote(message) {
  if (!adminStatusNote) return;
  adminStatusNote.textContent = message;
  if (message) {
    adminStatusNote.classList.remove('hidden');
  } else {
    adminStatusNote.classList.add('hidden');
  }
}

function loadLocalOrders() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');
  } catch (error) {
    return [];
  }
}

function saveLocalOrders(orders) {
  localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
}

function loadLocalProducts() {
  const saved = localStorage.getItem(LOCAL_PRODUCTS_KEY);
  if (!saved) {
    return DEFAULT_PRODUCTS.map((product) => ({ ...product }));
  }

  try {
    return JSON.parse(saved);
  } catch (error) {
    return DEFAULT_PRODUCTS.map((product) => ({ ...product }));
  }
}

function saveLocalProducts(products) {
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
}

async function loadOrders() {
  if (adminMode === 'local') {
    renderOrders(loadLocalOrders());
    return;
  }

  try {
    const data = await apiFetch('/api/orders');
    const orders = Array.isArray(data.orders) ? data.orders : [];
    renderOrders(orders);
  } catch (error) {
    if (error.message === 'Unauthorized') {
      showLogin();
      return;
    }
    renderOrders(loadLocalOrders());
    adminMode = 'local';
    setAdminStatusNote('');
  }
}

async function loadProducts() {
  if (adminMode === 'local') {
    renderProducts(loadLocalProducts());
    return;
  }

  try {
    const data = await apiFetch('/api/products');
    const products = Array.isArray(data.products) ? data.products : [];
    renderProducts(products);
  } catch (error) {
    renderProducts(loadLocalProducts());
    adminMode = 'local';
    setAdminStatusNote('');
  }
}

function renderOrders(orders) {
  const filterValue = statusFilter.value;
  const filteredOrders = filterValue ? orders.filter((order) => order.status === filterValue) : orders;

  ordersCount.textContent = `${filteredOrders.length} order${filteredOrders.length === 1 ? '' : 's'} displayed`;

  if (filteredOrders.length === 0) {
    ordersTableBody.innerHTML = '<tr><td colspan="7" style="padding: 2rem; text-align: center; color: #6b7280;">No matching orders were found.</td></tr>';
    return;
  }

  ordersTableBody.innerHTML = filteredOrders
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((order) => {
      const customer = order.customer || {};
      const receiptHtml = order.receipt?.data
        ? `<a href="${htmlEscape(order.receipt.data)}" target="_blank" rel="noreferrer"><img class="admin-receipt-thumb" src="${htmlEscape(order.receipt.data)}" alt="Receipt for ${htmlEscape(order.id)}"></a>`
        : 'No receipt available';

      const customerAddress = htmlEscape(customer.shippingAddress || '—');
      const productSummary = (order.items || [])
        .map((item) => `<div>${htmlEscape(item.name)} — ₱${Number(item.price).toLocaleString()}</div>`)
        .join('');

      const orderTimestamp = order.createdAt ? new Date(order.createdAt) : null;
      const orderDate = orderTimestamp ? orderTimestamp.toLocaleDateString() : '—';
      const orderTime = orderTimestamp ? orderTimestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';

      return `
        <tr>
          <td><strong>${htmlEscape(order.id)}</strong></td>
          <td>
            <div class="admin-order-datetime">${htmlEscape(orderDate)}</div>
            <div class="admin-order-datetime admin-order-time">${htmlEscape(orderTime)}</div>
          </td>
          <td>
            <strong>${htmlEscape(customer.name || '—')}</strong><br />
            ${htmlEscape(customer.email || '—')}<br />
            ${htmlEscape(customer.phone || '—')}<br />
            ${customerAddress}
          </td>
          <td>${productSummary}</td>
          <td>₱${Number(order.total || 0).toLocaleString()}</td>
          <td>${receiptHtml}</td>
          <td>
            <label class="admin-status-label">
              <select class="admin-status-select" data-order-id="${htmlEscape(order.id)}">
                ${Object.entries(STATUS_LABELS)
                  .map(
                    ([value, label]) =>
                      `<option value="${value}" ${order.status === value ? 'selected' : ''}>${label}</option>`,
                  )
                  .join('')}
              </select>
            </label>
          </td>
        </tr>
      `;
    })
    .join('');
}

function renderProducts(products) {
  if (!products || products.length === 0) {
    productsTableBody.innerHTML = '<tr><td colspan="4" style="padding: 2rem; text-align: center; color: #6b7280;">No products found.</td></tr>';
    return;
  }

  productsTableBody.innerHTML = products
    .sort((a, b) => Number(a.id || 0) - Number(b.id || 0))
    .map((product) => {
      const stockLabel = product.inStock ? 'In Stock' : 'Out of Stock';
      return `
        <tr>
          <td>
            <strong>${htmlEscape(product.name)}</strong><br />
            <small>${htmlEscape(product.dosage || product.tag || '')}</small>
          </td>
          <td>₱${Number(product.price || 0).toLocaleString()}</td>
          <td>
            <button type="button" class="btn" data-action="toggle-stock" data-product-id="${htmlEscape(product.id)}">${stockLabel}</button>
          </td>
          <td>
            <button type="button" class="btn" data-action="edit" data-product-id="${htmlEscape(product.id)}">Edit</button>
            <button type="button" class="btn" data-action="delete" data-product-id="${htmlEscape(product.id)}" style="background:#ef4444;">Delete</button>
          </td>
        </tr>
      `;
    })
    .join('');
}

async function openProductForm(productId) {
  editingProductId = null;
  productFormTitle.textContent = 'New Product';
  productNameInput.value = '';
  productDosageInput.value = '';
  productTagInput.value = '';
  productDescInput.value = '';
  productImgInput.value = '';
  productPriceInput.value = '';
  productInStockSelect.value = 'true';
  productBenefitsInput.value = '';
  productSetsInput.value = '';

  if (productId) {
    let product = loadLocalProducts().find((item) => Number(item.id) === Number(productId));

    if (!product && adminMode !== 'local') {
      try {
        const data = await apiFetch('/api/products');
        product = Array.isArray(data.products)
          ? data.products.find((item) => Number(item.id) === Number(productId))
          : null;
      } catch (error) {
        product = null;
      }
    }

    if (product) {
      editingProductId = Number(product.id);
      productFormTitle.textContent = 'Edit Product';
      productNameInput.value = product.name || '';
      productDosageInput.value = product.dosage || '';
      productTagInput.value = product.tag || '';
      productDescInput.value = product.desc || '';
      productImgInput.value = product.img || '';
      productPriceInput.value = product.price || '';
      productInStockSelect.value = product.inStock ? 'true' : 'false';
      productBenefitsInput.value = (product.benefits || []).join('\n');
      productSetsInput.value = (product.sets || []).map((item) => `${item.name} | ${item.qty}`).join('\n');
    }
  }

  productFormOverlay.classList.remove('hidden');
  productFormModal.classList.remove('hidden');
}

function closeProductForm() {
  editingProductId = null;
  productForm.reset();
  productFormOverlay.classList.add('hidden');
  productFormModal.classList.add('hidden');
}

function parseBenefits(value) {
  return String(value)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseSets(value) {
  return String(value)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, qty] = line.split('|').map((part) => part.trim());
      return {
        name: name || 'Unnamed item',
        qty: qty || '1 pc',
        img: 'assets/sample_photo.png',
      };
    });
}

async function handleLogin(event) {
  event.preventDefault();
  loginError.textContent = '';

  const username = document.getElementById('adminUsername').value.trim();
  const password = document.getElementById('adminPassword').value.trim();

  if (!username || !password) {
    loginError.textContent = 'Please enter your admin username and password.';
    return;
  }

  if (!backendAvailable && username === LOCAL_ADMIN_USERNAME && password === LOCAL_ADMIN_PASSWORD) {
    adminMode = 'local';
    setAdminStatusNote('');
    showDashboard();
    renderOrders(loadLocalOrders());
    renderProducts(loadLocalProducts());
    return;
  }

  try {
    await apiFetch('/api/admin-login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    adminMode = 'backend';
    setAdminStatusNote('');
    backendAvailable = true;
    showDashboard();
    await loadOrders();
    await loadProducts();
  } catch (error) {
    if (isBackendFallbackError(error) && username === LOCAL_ADMIN_USERNAME && password === LOCAL_ADMIN_PASSWORD) {
      adminMode = 'local';
      backendAvailable = false;
      setAdminStatusNote('');
      showDashboard();
      renderOrders(loadLocalOrders());
      renderProducts(loadLocalProducts());
      return;
    }

    loginError.textContent = error.message === 'Unauthorized' ? 'Invalid credentials.' : error.message;
  }
}

async function handleLogout() {
  try {
    await apiFetch('/api/admin-logout', { method: 'POST' });
  } catch (error) {
    console.warn('Logout failed:', error);
  }

  showLogin();
}

async function handleOrderStatusChange(event) {
  const target = event.target;
  if (!target.classList.contains('admin-status-select')) {
    return;
  }

  const orderId = target.dataset.orderId;
  const status = target.value;

  if (adminMode === 'local') {
    updateLocalOrderStatus(orderId, status);
    renderOrders(loadLocalOrders());
    return;
  }

  try {
    await apiFetch('/api/orders', {
      method: 'PATCH',
      body: JSON.stringify({ id: orderId, status }),
    });
    await loadOrders();
  } catch (error) {
    updateLocalOrderStatus(orderId, status);
    renderOrders(loadLocalOrders());
    alert('Order status updated locally because backend API is unavailable.');
  }
}

function updateLocalOrderStatus(orderId, status) {
  const orders = loadLocalOrders();
  const order = orders.find((item) => item.id === orderId);
  if (!order) return;
  order.status = status;
  order.updatedAt = new Date().toISOString();
  saveLocalOrders(orders);
}

async function handleProductFormSubmit(event) {
  event.preventDefault();

  const name = productNameInput.value.trim();
  const dosage = productDosageInput.value.trim();
  const tag = productTagInput.value.trim();
  const desc = productDescInput.value.trim();
  const img = productImgInput.value.trim();
  const price = Number(productPriceInput.value);
  const inStock = productInStockSelect.value === 'true';
  const benefits = parseBenefits(productBenefitsInput.value);
  const sets = parseSets(productSetsInput.value);

  if (!name || !desc || !img || Number.isNaN(price)) {
    alert('Please complete the product name, description, image, and price.');
    return;
  }

  const payload = {
    name,
    dosage,
    tag,
    desc,
    img,
    price,
    inStock,
    benefits,
    sets,
  };

  try {
    if (adminMode === 'local') {
      if (editingProductId) {
        updateLocalProduct({ id: editingProductId, ...payload });
      } else {
        createLocalProduct(payload);
      }
      closeProductForm();
      renderProducts(loadLocalProducts());
      return;
    }

    if (editingProductId) {
      await apiFetch('/api/products', {
        method: 'PATCH',
        body: JSON.stringify({ id: editingProductId, ...payload }),
      });
    } else {
      await apiFetch('/api/products', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    }

    closeProductForm();
    await loadProducts();
  } catch (error) {
    if (isBackendFallbackError(error)) {
      adminMode = 'local';
      setAdminStatusNote('');
      if (editingProductId) {
        updateLocalProduct({ id: editingProductId, ...payload });
      } else {
        createLocalProduct(payload);
      }
      closeProductForm();
      renderProducts(loadLocalProducts());
      return;
    }

    alert(error.message || 'Unable to save product.');
  }
}

async function handleProductTableClick(event) {
  const button = event.target.closest('button');
  if (!button) return;

  const action = button.dataset.action;
  const productId = Number(button.dataset.productId);
  if (!action || !productId) return;

  if (action === 'edit') {
    openProductForm(productId);
    return;
  }

  if (action === 'delete') {
    deleteProduct(productId);
    return;
  }

  if (action === 'toggle-stock') {
    toggleProductStock(productId);
  }
}

async function deleteProduct(productId) {
  if (!confirm('Delete this product from the catalog?')) {
    return;
  }

  if (adminMode === 'local') {
    deleteLocalProduct(productId);
    renderProducts(loadLocalProducts());
    return;
  }

  try {
    await apiFetch('/api/products', {
      method: 'DELETE',
      body: JSON.stringify({ id: productId }),
    });
    await loadProducts();
  } catch (error) {
    if (isBackendFallbackError(error)) {
      adminMode = 'local';
      setAdminStatusNote('');
      deleteLocalProduct(productId);
      renderProducts(loadLocalProducts());
      return;
    }
    alert(error.message || 'Unable to delete product.');
  }
}

async function toggleProductStock(productId) {
  const products = loadLocalProducts();
  const product = products.find((item) => Number(item.id) === Number(productId));
  const currentInStock = product ? product.inStock : true;
  const updates = { inStock: !currentInStock };

  if (adminMode === 'local') {
    updateLocalProduct({ id: productId, ...product, ...updates });
    renderProducts(loadLocalProducts());
    return;
  }

  try {
    await apiFetch('/api/products', {
      method: 'PATCH',
      body: JSON.stringify({ id: productId, ...updates }),
    });
    await loadProducts();
  } catch (error) {
    if (isBackendFallbackError(error)) {
      adminMode = 'local';
      setAdminStatusNote('');
      updateLocalProduct({ id: productId, ...product, ...updates });
      renderProducts(loadLocalProducts());
      return;
    }
    alert(error.message || 'Unable to toggle stock status.');
  }
}

function createLocalProduct(payload) {
  const products = loadLocalProducts();
  const nextId = products.reduce((max, item) => Math.max(max, Number(item.id || 0)), 0) + 1;
  products.push({ id: nextId, ...payload });
  saveLocalProducts(products);
}

function updateLocalProduct(product) {
  const products = loadLocalProducts();
  const index = products.findIndex((item) => Number(item.id) === Number(product.id));
  if (index === -1) {
    products.push({ ...product });
  } else {
    products[index] = { ...products[index], ...product };
  }
  saveLocalProducts(products);
}

function deleteLocalProduct(productId) {
  const products = loadLocalProducts().filter((item) => Number(item.id) !== Number(productId));
  saveLocalProducts(products);
}

function isBackendFallbackError(error) {
  return /Method Not Allowed|Failed to fetch|NetworkError|404|Unexpected token|No 'Access-Control-Allow-Origin'/.test(error.message);
}

loginForm.addEventListener('submit', handleLogin);
logoutBtn.addEventListener('click', handleLogout);
statusFilter.addEventListener('change', () => {
  if (adminMode === 'local') {
    renderOrders(loadLocalOrders());
    return;
  }

  apiFetch('/api/orders')
    .then((data) => renderOrders(data.orders || []))
    .catch(() => {
      adminMode = 'local';
      renderOrders(loadLocalOrders());
      setAdminStatusNote('');
    });
});
ordersTableBody.addEventListener('change', handleOrderStatusChange);
ordersTableBody.addEventListener('click', (event) => {
  const receiptImg = event.target.closest('.admin-receipt-thumb');
  if (!receiptImg) return;
  event.preventDefault();
  openReceiptModal(receiptImg.src, receiptImg.alt);
});
newProductBtn.addEventListener('click', () => openProductForm());
productsTableBody.addEventListener('click', handleProductTableClick);
productForm.addEventListener('submit', handleProductFormSubmit);
productFormClose.addEventListener('click', closeProductForm);
productFormOverlay.addEventListener('click', closeProductForm);
receiptModalOverlay.addEventListener('click', closeReceiptModal);
receiptModalClose.addEventListener('click', closeReceiptModal);
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (receiptModal.classList.contains('active')) {
    closeReceiptModal();
  }
  if (!productFormModal.classList.contains('hidden')) {
    closeProductForm();
  }
});

async function checkBackendAvailability() {
  try {
    await apiFetch('/api/orders');
    backendAvailable = true;
    return true;
  } catch (error) {
    if (isBackendFallbackError(error)) {
      backendAvailable = false;
      return false;
    }
    if (error.message === 'Unauthorized') {
      backendAvailable = true;
      return true;
    }
    backendAvailable = true;
    return true;
  }
}

(async function initialize() {
  const backendActive = await checkBackendAvailability();
  if (backendActive) {
    try {
      await loadOrders();
      await loadProducts();
      return;
    } catch {
      showLogin();
      return;
    }
  }

  setAdminStatusNote('');
  showLogin();
})();
