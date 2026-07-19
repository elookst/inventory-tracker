import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';
import '@testing-library/jest-dom';

describe('Dashboard Component', () => {
  const mockStats = {
    totalItems: 10,
    totalQuantity: 45,
    lowStockCount: 2,
    expiringSoonCount: 1,
    categories: ['Pantry', 'Fridge', 'Freezer'],
  };

  const mockItems = [
    {
      id: 1,
      name: 'Beans',
      category: 'Pantry',
      quantity: 1,
      minQuantity: 5,
      expiryDate: null,
    },
    {
      id: 2,
      name: 'Milk',
      category: 'Fridge',
      quantity: 1,
      minQuantity: 1,
      expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    {
      id: 3,
      name: 'Old Juice',
      category: 'Fridge',
      quantity: 1,
      minQuantity: 1,
      expiryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
  ];

  it('renders loading state when stats is null', () => {
    render(<Dashboard stats={null} items={[]} />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('displays all statistics', () => {
    render(<Dashboard stats={mockStats} items={[]} />);
    
    expect(screen.getByText(/Total Items/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Quantity/i)).toBeInTheDocument();
    expect(screen.getByText(/Low Stock Items/i)).toBeInTheDocument();
    expect(screen.getByText(/Expiring Soon.*3 days/i)).toBeInTheDocument();
  });

  it('displays correct stat values', () => {
    render(<Dashboard stats={mockStats} items={[]} />);
    
    const values = screen.getAllByText(/^(10|45|2|1)$/);
    expect(values.length).toBeGreaterThan(0);
  });

  it('shows expired items alert', () => {
    render(<Dashboard stats={mockStats} items={mockItems} />);
    
    expect(screen.getByText(/Expired Item/i)).toBeInTheDocument();
  });

  it('shows expiring soon alert', () => {
    render(<Dashboard stats={mockStats} items={mockItems} />);
    
    expect(screen.getByText(/Expiring Soon/i)).toBeInTheDocument();
  });

  it('shows low stock alert', () => {
    render(<Dashboard stats={mockStats} items={mockItems} />);
    
    expect(screen.getByText(/Low on Stock/i)).toBeInTheDocument();
  });

  it('shows all good message when no alerts', () => {
    const noAlertItems = [
      {
        id: 1,
        name: 'Beans',
        category: 'Pantry',
        quantity: 10,
        minQuantity: 2,
        expiryDate: null,
      },
    ];
    
    render(<Dashboard stats={mockStats} items={noAlertItems} />);
    
    expect(screen.getByText(/All Good/i)).toBeInTheDocument();
  });

  it('displays categories', () => {
    render(<Dashboard stats={mockStats} items={[]} />);
    
    expect(screen.getByText(/Pantry/)).toBeInTheDocument();
    expect(screen.getByText(/Fridge/)).toBeInTheDocument();
    expect(screen.getByText(/Freezer/)).toBeInTheDocument();
  });

  it('calculates low stock items correctly', () => {
    const itemsWithLowStock = [
      {
        id: 1,
        name: 'Item1',
        category: 'Pantry',
        quantity: 1,
        minQuantity: 5,
        expiryDate: null,
      },
      {
        id: 2,
        name: 'Item2',
        category: 'Pantry',
        quantity: 2,
        minQuantity: 2,
        expiryDate: null,
      },
      {
        id: 3,
        name: 'Item3',
        category: 'Pantry',
        quantity: 10,
        minQuantity: 5,
        expiryDate: null,
      },
    ];
    
    render(<Dashboard stats={mockStats} items={itemsWithLowStock} />);
    
    expect(screen.getByText(/Item1/)).toBeInTheDocument();
  });
});
