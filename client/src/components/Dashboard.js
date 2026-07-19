import React from 'react';

function Dashboard({ stats, items }) {
  if (!stats) return <div className="section">Loading...</div>;

  const lowStockItems = items.filter((item) => item.quantity <= item.minQuantity);
  const expiringItems = items.filter((item) => {
    if (!item.expiryDate) return false;
    const today = new Date().toISOString().split('T')[0];
    const threeFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    return item.expiryDate >= today && item.expiryDate <= threeFromNow;
  });

  const expiredItems = items.filter((item) => {
    if (!item.expiryDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return item.expiryDate < today;
  });

  return (
    <div className="section">
      <h2>Dashboard</h2>
      
      <div className="dashboard">
        <div className="stat-card">
          <h3>Total Items</h3>
          <div className="value">{stats.totalItems}</div>
        </div>

        <div className="stat-card">
          <h3>Total Quantity</h3>
          <div className="value">{stats.totalQuantity}</div>
        </div>

        <div className="stat-card warning">
          <h3>Low Stock Items</h3>
          <div className="value">{stats.lowStockCount}</div>
        </div>

        <div className="stat-card warning">
          <h3>Expiring Soon (3 days)</h3>
          <div className="value">{stats.expiringSoonCount}</div>
        </div>
      </div>

      {/* Quick alerts section */}
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ color: '#667eea' }}>Quick Alerts</h3>

        {expiredItems.length > 0 && (
          <div className="alert danger" style={{ marginBottom: '1rem' }}>
            <div className="alert-content">
              <h3>⚠️ {expiredItems.length} Expired Item{expiredItems.length > 1 ? 's' : ''}</h3>
              <p>
                {expiredItems.map((item) => item.name).join(', ')}
              </p>
            </div>
          </div>
        )}

        {expiringItems.length > 0 && (
          <div className="alert" style={{ marginBottom: '1rem' }}>
            <div className="alert-content">
              <h3>⏰ {expiringItems.length} Item{expiringItems.length > 1 ? 's' : ''} Expiring Soon</h3>
              <p>
                {expiringItems.map((item) => `${item.name} (${new Date(item.expiryDate).toLocaleDateString()})`).join(', ')}
              </p>
            </div>
          </div>
        )}

        {lowStockItems.length > 0 && (
          <div className="alert" style={{ marginBottom: '1rem' }}>
            <div className="alert-content">
              <h3>📉 {lowStockItems.length} Item{lowStockItems.length > 1 ? 's' : ''} Low on Stock</h3>
              <p>
                {lowStockItems.map((item) => `${item.name} (${item.quantity} left)`).join(', ')}
              </p>
            </div>
          </div>
        )}

        {expiredItems.length === 0 && expiringItems.length === 0 && lowStockItems.length === 0 && (
          <div className="alert" style={{ background: '#d4edda', borderLeftColor: '#28a745' }}>
            <div className="alert-content">
              <h3>✅ All Good!</h3>
              <p>No expired items, expiring soon, or low stock alerts.</p>
            </div>
          </div>
        )}
      </div>

      {/* Categories */}
      {stats.categories && stats.categories.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ color: '#667eea' }}>Categories</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {stats.categories.map((cat) => (
              <span key={cat} className="badge category">
                {cat}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
