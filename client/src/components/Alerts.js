import React from 'react';

function Alerts({ items }) {
  const today = new Date().toISOString().split('T')[0];
  const threeFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const expiredItems = items.filter((item) => item.expiryDate && item.expiryDate < today);
  const expiringItems = items.filter(
    (item) => item.expiryDate && item.expiryDate >= today && item.expiryDate <= threeFromNow
  );
  const lowStockItems = items.filter((item) => item.quantity <= item.minQuantity);

  const renderAlertList = (alertItems, type) => {
    if (alertItems.length === 0) return null;

    const titles = {
      expired: '🚫 Expired Items',
      expiring: '⏰ Expiring Soon (Within 3 Days)',
      lowStock: '📉 Low Stock Items',
    };

    return (
      <div className="alerts">
        <h3 style={{ color: type === 'expired' ? '#e74c3c' : type === 'expiring' ? '#f39c12' : '#e67e22', marginBottom: '1rem' }}>
          {titles[type]}
        </h3>
        {alertItems.map((item) => (
          <div key={item.id} className={`alert ${type === 'expired' ? 'danger' : ''}`}>
            <div className="alert-content">
              <h3 style={{ margin: '0 0 0.5rem 0' }}>{item.name}</h3>
              <p style={{ margin: '0.25rem 0' }}>
                <strong>Category:</strong> {item.category}
              </p>
              {item.expiryDate && (
                <p style={{ margin: '0.25rem 0' }}>
                  <strong>Expires:</strong> {new Date(item.expiryDate).toLocaleDateString()}
                  {type === 'expiring' && ` (${Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))} days left)`}
                </p>
              )}
              <p style={{ margin: '0.25rem 0' }}>
                <strong>Quantity:</strong> {item.quantity} (Min: {item.minQuantity})
              </p>
              {item.notes && (
                <p style={{ margin: '0.5rem 0 0', color: '#666', fontStyle: 'italic' }}>
                  📝 {item.notes}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const hasAlerts = expiredItems.length > 0 || expiringItems.length > 0 || lowStockItems.length > 0;

  if (!hasAlerts) {
    return (
      <div className="section">
        <h2>Alerts</h2>
        <div className="empty-state">
          <p>✅ No alerts! Everything is in good shape.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <h2>Alerts & Notifications</h2>

      {expiredItems.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          {renderAlertList(expiredItems, 'expired')}
        </div>
      )}

      {expiringItems.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          {renderAlertList(expiringItems, 'expiring')}
        </div>
      )}

      {lowStockItems.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          {renderAlertList(lowStockItems, 'lowStock')}
        </div>
      )}
    </div>
  );
}

export default Alerts;
