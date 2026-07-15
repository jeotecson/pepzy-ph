import fs from 'fs';
import path from 'path';

const ORDERS_FILE = path.join(process.cwd(), 'api', 'data', 'orders.json');
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

function ensureOrdersStorage() {
  const dir = path.dirname(ORDERS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, '[]', 'utf8');
  }
}

function loadOrders() {
  ensureOrdersStorage();
  const raw = fs.readFileSync(ORDERS_FILE, 'utf8');
  return raw ? JSON.parse(raw) : [];
}

function saveOrders(orders) {
  ensureOrdersStorage();
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
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

    if (req.method === 'POST') {
      const order = req.body;
      if (!order || !order.id || !order.customer || !order.items) {
        return res.status(400).json({ error: 'Order payload is missing required fields.' });
      }

      const orders = loadOrders();
      const existingIndex = orders.findIndex((existing) => existing.id === order.id);
      if (existingIndex !== -1) {
        orders[existingIndex] = { ...orders[existingIndex], ...order, updatedAt: new Date().toISOString() };
      } else {
        orders.push({ ...order, createdAt: order.createdAt || new Date().toISOString() });
      }

      saveOrders(orders);
      return res.status(201).json({ ok: true, order });
    }

    if (req.method === 'GET') {
      if (!isAdminRequest(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const orders = loadOrders();
      return res.status(200).json({ ok: true, orders });
    }

    if (req.method === 'PATCH') {
      if (!isAdminRequest(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id, status } = req.body || {};
      if (!id || !status) {
        return res.status(400).json({ error: 'Missing order id or status.' });
      }

      const validStatuses = ['REQUEST_RECEIVED', 'RECEIPT_CONFIRMED', 'SHIPPED'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value.' });
      }

      const orders = loadOrders();
      const orderIndex = orders.findIndex((item) => item.id === id);
      if (orderIndex === -1) {
        return res.status(404).json({ error: 'Order not found.' });
      }

      orders[orderIndex].status = status;
      orders[orderIndex].updatedAt = new Date().toISOString();
      saveOrders(orders);

      return res.status(200).json({ ok: true, order: orders[orderIndex] });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('Order API error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
