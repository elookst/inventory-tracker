import React, { useState, useEffect } from 'react';

function ItemForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Pantry',
    quantity: 1,
    minQuantity: 1,
    expiryDate: '',
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' || name === 'minQuantity' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Item name is required');
      return;
    }
    onSubmit(formData);
    if (!initialData) {
      setFormData({
        name: '',
        category: 'Pantry',
        quantity: 1,
        minQuantity: 1,
        expiryDate: '',
        notes: '',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">Item Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Canned Beans, Olive Oil"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="Pantry">Pantry</option>
            <option value="Fridge">Fridge</option>
            <option value="Freezer">Freezer</option>
            <option value="Household">Household</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="quantity">Current Quantity *</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="minQuantity">Minimum Quantity (Low Stock Alert)</label>
          <input
            type="number"
            id="minQuantity"
            name="minQuantity"
            value={formData.minQuantity}
            onChange={handleChange}
            min="0"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="expiryDate">Expiry Date (Optional)</label>
          <input
            type="date"
            id="expiryDate"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes (Optional)</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="e.g., Storage location, brand preference"
          rows="3"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {initialData ? 'Update Item' : 'Add Item'}
        </button>
      </div>
    </form>
  );
}

export default ItemForm;
