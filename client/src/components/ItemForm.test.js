import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ItemForm from './ItemForm';
import '@testing-library/jest-dom';

describe('ItemForm Component', () => {
  it('renders the form with all fields', () => {
    const mockSubmit = jest.fn();
    render(<ItemForm onSubmit={mockSubmit} />);
    
    expect(screen.getByLabelText(/Item Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Current Quantity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Minimum Quantity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Expiry Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Notes/i)).toBeInTheDocument();
  });

  it('submits form with entered data', () => {
    const mockSubmit = jest.fn();
    render(<ItemForm onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/Item Name/i), {
      target: { value: 'Canned Beans' },
    });
    fireEvent.change(screen.getByLabelText(/Category/i), {
      target: { value: 'Pantry' },
    });
    fireEvent.change(screen.getByLabelText(/Current Quantity/i), {
      target: { value: '5' },
    });
    fireEvent.change(screen.getByLabelText(/Minimum Quantity/i), {
      target: { value: '2' },
    });
    fireEvent.change(screen.getByLabelText(/Expiry Date/i), {
      target: { value: '2026-12-31' },
    });
    
    fireEvent.click(screen.getByText(/Add Item/i));
    
    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'Canned Beans',
      category: 'Pantry',
      quantity: 5,
      minQuantity: 2,
      expiryDate: '2026-12-31',
      notes: '',
    });
  });

  it('displays error when item name is empty', () => {
    const mockSubmit = jest.fn();
    window.alert = jest.fn();
    render(<ItemForm onSubmit={mockSubmit} />);
    
    fireEvent.click(screen.getByText(/Add Item/i));
    
    expect(window.alert).toHaveBeenCalledWith('Item name is required');
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('prefills form when initialData is provided', () => {
    const mockSubmit = jest.fn();
    const initialData = {
      id: 1,
      name: 'Milk',
      category: 'Fridge',
      quantity: 2,
      minQuantity: 1,
      expiryDate: '2026-07-25',
      notes: 'Full fat',
    };
    
    render(<ItemForm onSubmit={mockSubmit} initialData={initialData} />);
    
    expect(screen.getByDisplayValue('Milk')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Fridge')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Full fat')).toBeInTheDocument();
  });

  it('shows Update Item button when editing', () => {
    const mockSubmit = jest.fn();
    const initialData = { id: 1, name: 'Test', category: 'Pantry', quantity: 1, minQuantity: 1 };
    
    render(<ItemForm onSubmit={mockSubmit} initialData={initialData} />);
    
    expect(screen.getByText(/Update Item/i)).toBeInTheDocument();
  });

  it('resets form after successful submission', () => {
    const mockSubmit = jest.fn();
    render(<ItemForm onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/Item Name/i), {
      target: { value: 'Beans' },
    });
    fireEvent.click(screen.getByText(/Add Item/i));
    
    expect(screen.getByLabelText(/Item Name/i).value).toBe('');
  });

  it('converts quantity and minQuantity to integers', () => {
    const mockSubmit = jest.fn();
    render(<ItemForm onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/Item Name/i), {
      target: { value: 'Item' },
    });
    fireEvent.change(screen.getByLabelText(/Current Quantity/i), {
      target: { value: '5' },
    });
    fireEvent.change(screen.getByLabelText(/Minimum Quantity/i), {
      target: { value: '2' },
    });
    
    fireEvent.click(screen.getByText(/Add Item/i));
    
    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        quantity: 5,
        minQuantity: 2,
      })
    );
  });
});
