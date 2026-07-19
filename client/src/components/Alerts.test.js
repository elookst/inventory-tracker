import React from 'react';
import { render, screen } from '@testing-library/react';
import Alerts from './Alerts';
import '@testing-library/jest-dom';

describe('Alerts Component', () => {
  const mockItems = [
    {
      id: 1,
      name: 'Expired Milk',
      category: 'Fridge',
      quantity: 1,
      minQuantity: 1,
      expiryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Full fat',
    },
    {
      id: 2,
      name: 'Expiring Cheese',
      category: 'Fridge',
      quantity: 2,
      minQuantity: 1,
      expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Cheddar',
    },
    {
      id: 3,
      name: 'Low Stock Beans',
      category: 'Pantry',
      quantity: 1,
      minQuantity: 5,
      expiryDate: null,
      notes: 'Black beans',
    },
    {
      id: 4,
      name: 'Plenty of Pasta',
      category: 'Pantry',
      quantity: 10,
      minQuantity: 2,
      expiryDate: null,
      notes: '',
    },
  ];

  it('displays no alerts message when no items need attention', () => {
    const noAlertItems = [
      {
        id: 1,
        name: 'Good Item',
        category: 'Pantry',
        quantity: 10,
        minQuantity: 2,
        expiryDate: null,
        notes: '',
      },
    ];
    
    render(<Alerts items={noAlertItems} />);
    
    expect(screen.getByText(/No alerts/i)).toBeInTheDocument();
    expect(screen.getByText(/Everything is in good shape/i)).toBeInTheDocument();
  });

  it('displays expired items section', () => {
    render(<Alerts items={mockItems} />);
    
    expect(screen.getByText(/Expired Items/i)).toBeInTheDocument();
  });

  it('displays expiring soon section with 3 day limit', () => {
    render(<Alerts items={mockItems} />);
    
    expect(screen.getByText(/Expiring Soon.*3 Days/i)).toBeInTheDocument();
  });

  it('displays low stock section', () => {
    render(<Alerts items={mockItems} />);
    
    expect(screen.getByText(/Low Stock Items/i)).toBeInTheDocument();
  });

  it('shows category for each alert item', () => {
    render(<Alerts items={mockItems} />);
    
    expect(screen.getAllByText('Fridge').length).toBeGreaterThan(0);
  });

  it('shows quantity information for alert items', () => {
    render(<Alerts items={mockItems} />);
    
    expect(screen.getByText(/Quantity/i)).toBeInTheDocument();
  });

  it('shows notes when present', () => {
    render(<Alerts items={mockItems} />);
    
    expect(screen.getByText(/Full fat/)).toBeInTheDocument();
    expect(screen.getByText(/Cheddar/)).toBeInTheDocument();
  });

  it('displays days left for expiring items', () => {
    render(<Alerts items={mockItems} />);
    
    expect(screen.getByText(/days left/i)).toBeInTheDocument();
  });

  it('does not display items without alerts', () => {
    render(<Alerts items={mockItems} />);
    
    expect(screen.queryByText('Plenty of Pasta')).not.toBeInTheDocument();
  });

  it('handles items with no expiry date as non-expiring', () => {
    const itemsNoExpiry = [
      {
        id: 1,
        name: 'Dry Goods',
        category: 'Pantry',
        quantity: 10,
        minQuantity: 2,
        expiryDate: null,
        notes: '',
      },
    ];
    
    render(<Alerts items={itemsNoExpiry} />);
    
    expect(screen.getByText(/No alerts/i)).toBeInTheDocument();
  });

  it('shows only items that meet alert criteria', () => {
    const mixedItems = [
      {
        id: 1,
        name: 'Expired Product',
        category: 'Fridge',
        quantity: 1,
        minQuantity: 1,
        expiryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: '',
      },
      {
        id: 2,
        name: 'Good Product',
        category: 'Pantry',
        quantity: 10,
        minQuantity: 2,
        expiryDate: null,
        notes: '',
      },
    ];
    
    render(<Alerts items={mixedItems} />);
    
    expect(screen.getByText(/Expired Items/i)).toBeInTheDocument();
    expect(screen.queryByText('Good Product')).not.toBeInTheDocument();
  });
});
