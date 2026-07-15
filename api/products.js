import fs from 'fs';
import path from 'path';

const PRODUCTS_FILE = path.join(process.cwd(), 'api', 'data', 'products.json');
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'pepzy123';

function parseCookies(cookieHeader = '') {
  return cookieHeader
    .split(';')
    .map((cookie) => cookie.trim())
    .filter(Boolean)
    .reduce((acc, cookie) => {
      const [name, value] = cookie.split('=');
      acc[name] = value;
      return acc;
    }, {});
}

function ensureProductsStorage() {
  const dir = path.dirname(PRODUCTS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(PRODUCTS_FILE)) {
    fs.writeFileSync(PRODUCTS_FILE, '[]', 'utf8');
  }
}

function loadProducts() {
  ensureProductsStorage();
  const raw = fs.readFileSync(PRODUCTS_FILE, 'utf8');
  return raw ? JSON.parse(raw) : [];
}

function saveProducts(products) {
  ensureProductsStorage();
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');
}

function isAdminRequest(req) {
  const cookies = parseCookies(req.headers.cookie || '');
  return cookies.pepzyAdminAuth === '1';
}

export default async function handler(req, res) {
  try {
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    if (req.method === 'GET') {
      const products = loadProducts();
      return res.status(200).json({ ok: true, products });
    }

    if (!isAdminRequest(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'POST') {
      const product = req.body;
      if (!product || !product.name || typeof product.price !== 'number') {
        return res.status(400).json({ error: 'Product name and numeric price are required.' });
      }

      const products = loadProducts();
      const nextId = products.reduce((max, item) => Math.max(max, Number(item.id || 0)), 0) + 1;
      const newProduct = {
        id: nextId,
        name: product.name,
        dosage: product.dosage || '',
        tag: product.tag || '',
        desc: product.desc || '',
        img: product.img || '',
        price: product.price,
        inStock: product.inStock !== false,
        benefits: Array.isArray(product.benefits) ? product.benefits : [],
        sets: Array.isArray(product.sets) ? product.sets : [],
        createdAt: new Date().toISOString(),
      };

      products.push(newProduct);
      saveProducts(products);
      return res.status(201).json({ ok: true, product: newProduct });
    }

    if (req.method === 'PATCH') {
      const { id, ...updates } = req.body || {};
      if (!id) {
        return res.status(400).json({ error: 'Product id is required.' });
      }

      const products = loadProducts();
      const productIndex = products.findIndex((item) => String(item.id) === String(id));
      if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found.' });
      }

      const existingProduct = products[productIndex];
      const updatedProduct = {
        ...existingProduct,
        ...updates,
        price: typeof updates.price === 'number' ? updates.price : existingProduct.price,
        inStock: typeof updates.inStock === 'boolean' ? updates.inStock : existingProduct.inStock,
        benefits: Array.isArray(updates.benefits) ? updates.benefits : existingProduct.benefits,
        sets: Array.isArray(updates.sets) ? updates.sets : existingProduct.sets,
        updatedAt: new Date().toISOString(),
      };

      products[productIndex] = updatedProduct;
      saveProducts(products);
      return res.status(200).json({ ok: true, product: updatedProduct });
    }

    if (req.method === 'DELETE') {
      const { id } = req.body || {};
      if (!id) {
        return res.status(400).json({ error: 'Product id is required.' });
      }

      const products = loadProducts();
      const productIndex = products.findIndex((item) => String(item.id) === String(id));
      if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found.' });
      }

      const removed = products.splice(productIndex, 1)[0];
      saveProducts(products);
      return res.status(200).json({ ok: true, product: removed });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('Product API error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
