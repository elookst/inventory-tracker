import React, { useState, useEffect } from 'react';
import './App.css';
import ItemForm from './components/ItemForm';
import ItemList from './components/ItemList';
import Dashboard from './components/Dashboard';
import Alerts from './components/Alerts';

function App() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingItem, setEditingItem] = useState(null);

  const API_URL = 'http://localhost:5000/api';

  // Fetch all items
  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_URL}/items`);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error('Error fetching items:', err);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchStats();
  }, []);

  // Add item
  const handleAddItem = async (itemData) => {
    try {
      const res = await fetch(`${API_URL}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });
      const newItem = await res.json();
      setItems([...items, newItem]);
      fetchStats();
    } catch (err) {
      console.error('Error adding item:', err);
    }
  };

  // Update item
  const handleUpdateItem = async (id, itemData) => {
    try {
      const res = await fetch(`${API_URL}/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });
      const updatedItem = await res.json();
      setItems(items.map((item) => (item.id === id ? updatedItem : item)));
      setEditingItem(null);
      fetchStats();
    } catch (err) {
      console.error('Error updating item:', err);
    }
  };

  // Delete item
  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await fetch(`${API_URL}/items/${id}`, { method: 'DELETE' });
        setItems(items.filter((item) => item.id !== id));
        fetchStats();
      } catch (err) {
        console.error('Error deleting item:', err);
      }
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>📦 Household Inventory Tracker</h1>
        <p>Track pantry items, household supplies, and expiry dates</p>
      </header>

      <nav className="tabs">
        <button
          className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`tab ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('add');
            setEditingItem(null);
          }}
        >
          Add Item
        </button>
        <button
          className={`tab ${activeTab === 'items' ? 'active' : ''}`}
          onClick={() => setActiveTab('items')}
        >
          All Items
        </button>
        <button
          className={`tab ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          Alerts
        </button>
      </nav>

      <main className="content">
        {activeTab === 'dashboard' && <Dashboard stats={stats} items={items} />}

        {activeTab === 'add' && (
          <div className="section">
            <h2>{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
            <ItemForm
              onSubmit={(data) => {
                if (editingItem) {
                  handleUpdateItem(editingItem.id, data);
                } else {
                  handleAddItem(data);
                  setActiveTab('items');
                }
              }}
              initialData={editingItem}
            />
          </div>
        )}

        {activeTab === 'items' && (
          <div className="section">
            <h2>All Items</h2>
            <ItemList
              items={items}
              onDelete={handleDeleteItem}
              onEdit={(item) => {
                setEditingItem(item);
                setActiveTab('add');
              }}
            />
          </div>
        )}

        {activeTab === 'alerts' && <Alerts items={items} />}
      </main>
    </div>
  );
}

export default App;
