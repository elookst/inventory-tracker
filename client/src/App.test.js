import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        totalItems: 0,
        totalQuantity: 0,
        lowStockCount: 0,
        expiringSoonCount: 0,
        categories: [],
      }),
  })
);

describe('App Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders the app title', () => {
    render(<App />);
    expect(screen.getByText(/Household Inventory Tracker/i)).toBeInTheDocument();
  });

  it('renders all tabs', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /Dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Item/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /All Items/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Alerts/i })).toBeInTheDocument();
  });

  it('displays the header with description', () => {
    render(<App />);
    expect(screen.getByText(/Track pantry items/i)).toBeInTheDocument();
  });
});

