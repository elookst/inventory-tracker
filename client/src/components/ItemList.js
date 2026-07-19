import React from 'react';

function ItemList({ items, onDelete, onEdit }) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p>No items yet. Add your first item to get started!</p>
      </div>
    );
  }

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return null;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysLeft = Math.floor((expiry - now) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) return 'expired';
    if (daysLeft <= 3) return 'expiring-soon';
    return null;
  };

  const groupByCategory = () => {
    const grouped = {};
    items.forEach((item) => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });
    return grouped;
  };

  const categorized = groupByCategory();

  return (
    <div className="item-list">
      {Object.entries(categorized).map(([category, categoryItems]) => (
        <div key={category}>
          <h3 style={{ color: '#667eea', marginTop: '1.5rem', marginBottom: '1rem' }}>
            {category} ({categoryItems.length})
          </h3>
          {categoryItems.map((item) => {
            const expiryStatus = getExpiryStatus(item.expiryDate);
            const isLowStock = item.quantity <= item.minQuantity;

            return (
              <div key={item.id} className="item-card">
                <div className="item-info">
                  <h4 className="item-name">{item.name}</h4>
                  <div className="item-meta">
                    <span className="badge category">{item.category}</span>
                    <span className="quantity-display">
                      Qty: <strong>{item.quantity}</strong>
                    </span>
                    {isLowStock && (
                      <span className="badge low-stock">⚠ Low Stock</span>
                    )}
                    {expiryStatus === 'expired' && (
                      <span className="badge expired">🚫 Expired</span>
                    )}
                    {expiryStatus === 'expiring-soon' && (
                      <span className="badge expiring">⏰ Expiring Soon</span>
                    )}
                  </div>
                  {item.expiryDate && (
                    <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.9rem' }}>
                      Expires: {new Date(item.expiryDate).toLocaleDateString()}
                    </p>
                  )}
                  {item.notes && (
                    <p style={{ margin: '0.25rem 0', color: '#999', fontSize: '0.85rem' }}>
                      📝 {item.notes}
                    </p>
                  )}
                </div>
                <div className="item-actions">
                  <button
                    className="btn-primary"
                    onClick={() => onEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => onDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default ItemList;
