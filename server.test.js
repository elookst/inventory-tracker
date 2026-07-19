const request = require('supertest');
const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

function createTestApp() {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  const dbPath = path.join(__dirname, 'test_inventory.db');
  const db = new sqlite3.Database(dbPath);

  db.serialize(() => {
    const createTableSQL = 'CREATE TABLE IF NOT EXISTS items (' +
      'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
      'name TEXT NOT NULL,' +
      'category TEXT NOT NULL,' +
      'quantity INTEGER NOT NULL DEFAULT 0,' +
      'minQuantity INTEGER DEFAULT 1,' +
      'expiryDate TEXT,' +
      'dateAdded TEXT DEFAULT CURRENT_TIMESTAMP,' +
      'notes TEXT)';
    db.run(createTableSQL);
  });

  app.get('/api/items', (req, res) => {
    db.all('SELECT * FROM items ORDER BY category, name', [], (err, rows) => {
      if (err) res.status(500).json({ error: err.message });
      else res.json(rows || []);
    });
  });

  app.post('/api/items', (req, res) => {
    const { name, category, quantity, minQuantity, expiryDate, notes } = req.body;

    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' });
    }

    const insertSQL = 'INSERT INTO items (name, category, quantity, minQuantity, expiryDate, notes) VALUES (?, ?, ?, ?, ?, ?)';
    db.run(insertSQL, [name, category, quantity || 0, minQuantity || 1, expiryDate || null, notes || ''], function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: this.lastID, name, category, quantity, minQuantity, expiryDate, notes });
    });
  });

  app.get('/api/stats', (req, res) => {
    db.all('SELECT * FROM items', [], (err, items) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      const threeFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

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

  app.delete('/api/items/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM items WHERE id = ?', [id], function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ message: 'Item deleted' });
    });
  });

  return { app, db };
}

describe('Inventory API Backend', () => {
  let app, db;

  beforeEach((done) => {
    const test = createTestApp();
    app = test.app;
    db = test.db;
    
    db.run('DELETE FROM items', () => {
      done();
    });
  });

  afterEach((done) => {
    db.close(done);
  });

  describe('POST /api/items', () => {
    it('should create a new item', (done) => {
      request(app)
        .post('/api/items')
        .send({
          name: 'Milk',
          category: 'Fridge',
          quantity: 2,
          minQuantity: 1,
          expiryDate: '2026-12-31',
          notes: 'Full fat',
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.name).toBe('Milk');
          expect(res.body.category).toBe('Fridge');
          done();
        });
    });

    it('should reject item without name', (done) => {
      request(app)
        .post('/api/items')
        .send({ category: 'Fridge', quantity: 2 })
        .expect(400)
        .end(done);
    });

    it('should reject item without category', (done) => {
      request(app)
        .post('/api/items')
        .send({ name: 'Milk', quantity: 2 })
        .expect(400)
        .end(done);
    });
  });

  describe('GET /api/items', () => {
    beforeEach((done) => {
      db.run('INSERT INTO items (name, category, quantity, minQuantity) VALUES (?, ?, ?, ?)',
        ['Beans', 'Pantry', 5, 2], done);
    });

    it('should retrieve all items', (done) => {
      request(app)
        .get('/api/items')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.length).toBe(1);
          done();
        });
    });

    it('should return empty array when no items', (done) => {
      db.run('DELETE FROM items', () => {
        request(app)
          .get('/api/items')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.length).toBe(0);
            done();
          });
      });
    });
  });

  describe('GET /api/stats', () => {
    beforeEach((done) => {
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      db.run('INSERT INTO items (name, category, quantity, minQuantity, expiryDate) VALUES (?, ?, ?, ?, ?)',
        ['Item1', 'Pantry', 10, 5, null],
        () => {
          db.run('INSERT INTO items (name, category, quantity, minQuantity, expiryDate) VALUES (?, ?, ?, ?, ?)',
            ['Item2', 'Fridge', 2, 5, tomorrow], done);
        });
    });

    it('should return correct statistics', (done) => {
      request(app)
        .get('/api/stats')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.totalItems).toBe(2);
          expect(res.body.totalQuantity).toBe(12);
          expect(res.body.lowStockCount).toBe(1);
          done();
        });
    });
  });

  describe('DELETE /api/items/:id', () => {
    beforeEach((done) => {
      db.run('INSERT INTO items (name, category, quantity, minQuantity) VALUES (?, ?, ?, ?)',
        ['To Delete', 'Pantry', 5, 2], done);
    });

    it('should delete an item', (done) => {
      request(app)
        .delete('/api/items/1')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.message).toBe('Item deleted');
          done();
        });
    });
  });
});
