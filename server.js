const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Database setup
const dbPath = path.join(__dirname, 'inventory.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Database error:', err);
  else console.log('Connected to SQLite database');
});

// Initialize database schema
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      minQuantity INTEGER DEFAULT 1,
      expiryDate TEXT,
      dateAdded TEXT DEFAULT CURRENT_TIMESTAMP,
      notes TEXT
    )
  `);
});

// Routes

// Get all items
app.get('/api/items', (req, res) => {
  db.all('SELECT * FROM items ORDER BY category, name', [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows || []);
  });
});

// Get items with low stock
app.get('/api/items/low-stock', (req, res) => {
  db.all(
    'SELECT * FROM items WHERE quantity <= minQuantity ORDER BY quantity ASC',
    [],
    (err, rows) => {
      if (err) res.status(500).json({ error: err.message });
      else res.json(rows || []);
    }
  );
});

// Get items expiring soon (within 3 days)
app.get('/api/items/expiring-soon', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const threeFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  db.all(
    `SELECT * FROM items 
     WHERE expiryDate IS NOT NULL 
     AND expiryDate BETWEEN ? AND ? 
     ORDER BY expiryDate ASC`,
    [today, threeFromNow],
    (err, rows) => {
      if (err) res.status(500).json({ error: err.message });
      else res.json(rows || []);
    }
  );
});

// Add item
app.post('/api/items', (req, res) => {
  const { name, category, quantity, minQuantity, expiryDate, notes } = req.body;

  if (!name || !category) {
    return res.status(400).json({ error: 'Name and category are required' });
  }

  db.run(
    `INSERT INTO items (name, category, quantity, minQuantity, expiryDate, notes) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, category, quantity || 0, minQuantity || 1, expiryDate || null, notes || ''],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: this.lastID, name, category, quantity, minQuantity, expiryDate, notes });
    }
  );
});

// Update item
app.put('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const { name, category, quantity, minQuantity, expiryDate, notes } = req.body;

  db.run(
    `UPDATE items 
     SET name = ?, category = ?, quantity = ?, minQuantity = ?, expiryDate = ?, notes = ? 
     WHERE id = ?`,
    [name, category, quantity, minQuantity, expiryDate || null, notes || '', id],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id, name, category, quantity, minQuantity, expiryDate, notes });
    }
  );
});

// Delete item
app.delete('/api/items/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM items WHERE id = ?', [id], function (err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Item deleted' });
  });
});

// Get statistics
app.get('/api/stats', (req, res) => {
  db.all('SELECT * FROM items', [], (err, items) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const threeFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const stats = {
      totalItems: items.length,
      totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
      lowStockCount: items.filter((item) => item.quantity <= item.minQuantity).length,
      expiringSoonCount: items.filter(
        (item) => item.expiryDate && item.expiryDate >= today && item.expiryDate <= threeFromNow
      ).length,
      categories: [...new Set(items.map((item) => item.category))],
    };

    res.json(stats);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
