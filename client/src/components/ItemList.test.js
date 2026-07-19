import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ItemList from './ItemList';
import '@testing-library/jest-dom';

describe('ItemList Component', () => {
  const mockItems = [
    {
      id: 1,
      name: 'Canned Beans',
      category: 'Pantry',
      quantity: 5,
      minQuantity: 2,
      expiryDate: null,
      notes: 'Black beans',
    },
    {
      id: 2,
      name: 'Milk',
      category: 'Fridge',
      quantity: 1,
      minQuantity: 1,
      expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Full fat',
    },
    {
      id: 3,
      name: 'Ice Cream',
      category: 'Freezer',
      quantity: 1,
      minQuantity: 1,
      expiryDate: null,
      notes: '',
    },
  ];

  it('renders empty state when no items', () => {
    const mockDelete = jest.fn();
    const mockEdit = jest.fn();
    
    render(<ItemList items={[]} onDelete={mockDelete} onEdit={mockEdit} />);
    
    expect(screen.getByText(/No items yet/i)).toBeInTheDocument();
  });

  it('groups items by category', () => {
    const mockDelete = jest.fn();
    const mockEdit = jest.fn();
    
    render(<ItemList items={mockItems} onDelete={mockDelete} onEdit={mockEdit} />);
    
    expect(screen.getByText(/Pantry/i)).toBeInTheDocument();
    expect(screen.getByText(/Fridge/i)).toBeInTheDocument();
    expect(screen.getByText(/Freezer/i)).toBeInTheDocument();
  });

  it('displays all item names', () => {
    const mockDelete = jest.fn();
    const mockEdit = jest.fn();
    
    render(<ItemList items={mockItems} onDelete={mockDelete} onEdit={mockEdit} />);
    
    expect(screen.getByText('Canned Beans')).toBeInTheDocument();
    expect(screen.getByText('Milk')).toBeInTheDocument();
    expect(screen.getByText('Ice Cream')).toBeInTheDocument();
  });

  it('shows low stock badge when quantity <= minQuantity', () => {
    const lowStockItem = {
      id: 1,
      name: 'Low Stock Item',
      category: 'Pantry',
      quantity: 1,
      minQuantity: 5,
      expiryDate: null,
      notes: '',
    };
    
    const mockDelete = jest.fn();
    const mockEdit = jest.fn();
    
    render(<ItemList items={[lowStockItem]} onDelete={mockDelete} onEdit={mockEdit} />);
    
    expect(screen.getByText(/Low Stock/i)).toBeInTheDocument();
  });

  it('shows expiring soon badge for items expiring within 3 days', () => {
    const mockDelete = jest.fn();
    const mockEdit = jest.fn();
    
    render(<ItemList items={mockItems} onDelete={mockDelete} onEdit={mockEdit} />);
    
    expect(screen.getByText(/Expiring Soon/i)).toBeInTheDocument();
  });

  it('shows expired badge for expired items', () => {
    const expiredItem = {
      id: 1,
      name: 'Expired Milk',
      category: 'Fridge',
      quantity: 1,
      minQuantity: 1,
      expiryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: '',
    };
    
    const mockDelete = jest.fn();
    const mockEdit = jest.fn();
    
    render(<ItemList items={[expiredItem]} onDelete={mockDelete} onEdit={mockEdit} />);
    
    expect(screen.getByText(/Expired/i)).toBeInTheDocument();
  });

  it('calls onEdit when Edit button is clicked', () => {
    const mockDelete = jest.fn();
    const mockEdit = jest.fn();
    
    render(<ItemList items={mockItems} onDelete={mockDelete} onEdit={mockEdit} />);
    
    const editButtons = screen.getAllByText(/Edit/i);
    fireEvent.click(editButtons[0]);
    
    expect(mockEdit).toHaveBeenCalledWith(mockItems[0]);
  });

  it('calls onDelete when Delete button is clicked', () => {
    const mockDelete = jest.fn();
    const mockEdit = jest.fn();
    window.confirm = jest.fn(() => true);
    
    render(<ItemList items={mockItems} onDelete={mockDelete} onEdit={mockEdit} />);
    
    const deleteButtons = screen.getAllByText(/Delete/i);
    fireEvent.click(deleteButtons[0]);
    
    expect(mockDelete).toHaveBeenCalledWith(mockItems[0].id);
  });

  it('displays quantity information', () => {
    const mockDelete = jest.fn();
    const mockEdit = jest.fn();
    
    render(<ItemList items={mockItems} onDelete={mockDelete} onEdit={mockEdit} />);
    
    expect(screen.getByText(/Qty.*5/)).toBeInTheDocument();
  });

  it('displays notes when present', () => {
    const mockDelete = jest.fn();
    const mockEdit = jest.fn();
    
    render(<ItemList items={mockItems} onDelete={mockDelete} onEdit={mockEdit} />);
    
    expect(screen.getByText(/Black beans/)).toBeInTheDocument();
    expect(screen.getByText(/Full fat/)).toBeInTheDocument();
  });
});
