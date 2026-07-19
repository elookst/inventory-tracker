# 📦 Household Inventory Tracker

A full-stack web application for tracking household and pantry inventory with support for quantities, expiry dates, and low stock alerts.

## Features

✅ **Add/Remove Items** - Easily manage your inventory
✅ **Track Quantities** - Monitor current stock levels
✅ **Expiry Date Tracking** - Track item expiration dates
✅ **Low Stock Alerts** - Get notified when items are running low
✅ **Multiple Categories** - Organize items (Pantry, Fridge, Freezer, Household, Other)
✅ **Dashboard** - Quick overview of inventory status
✅ **Alerts & Notifications** - View expired, expiring soon, and low stock items
✅ **Search by Category** - Filter items by storage location
✅ **Notes** - Add notes to items (brand, location, preferences)

## Tech Stack

- **Frontend**: React 19
- **Backend**: Node.js + Express
- **Database**: SQLite3
- **Styling**: CSS3 with modern gradients and animations

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone or navigate to the project directory:
```bash
cd inventory-tracker
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
npm --prefix client install
```

## Running the Application

### Option 1: Run both frontend and backend together (Recommended)
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend on `http://localhost:3000`

### Option 2: Run backend and frontend separately

Terminal 1 - Backend:
```bash
npm start
```

Terminal 2 - Frontend:
```bash
cd client
npm start
```

## Usage

### Dashboard
- View inventory statistics at a glance
- See quick alerts for expired, expiring soon, and low stock items
- Monitor all categories

### Add Items
- Click "Add Item" tab
- Fill in item details:
  - **Name**: Item name (required)
  - **Category**: Choose from Pantry, Fridge, Freezer, Household, or Other
  - **Quantity**: Current stock level
  - **Min Quantity**: Threshold for low stock alert
  - **Expiry Date**: Optional expiration date
  - **Notes**: Optional notes (location, brand, etc.)

### View All Items
- See all items organized by category
- Visual badges for:
  - Low stock items ⚠️
  - Expiring soon items ⏰
  - Expired items 🚫
- Edit or delete items

### Alerts
- View all expired items that need to be discarded
- See items expiring within the next 7 days
- Check low stock items to add to your shopping list

## API Endpoints

### Items
- `GET /api/items` - Get all items
- `GET /api/items/low-stock` - Get low stock items
- `GET /api/items/expiring-soon` - Get items expiring within 7 days
- `POST /api/items` - Add new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Statistics
- `GET /api/stats` - Get inventory statistics

## Database Schema

### items table
```sql
CREATE TABLE items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  minQuantity INTEGER DEFAULT 1,
  expiryDate TEXT,
  dateAdded TEXT DEFAULT CURRENT_TIMESTAMP,
  notes TEXT
)
```

## File Structure

```
inventory-tracker/
├── server.js                 # Express backend server
├── package.json             # Backend dependencies
├── inventory.db             # SQLite database (created on first run)
└── client/
    ├── src/
    │   ├── App.js           # Main React component
    │   ├── App.css          # Main styling
    │   └── components/
    │       ├── ItemForm.js      # Form for adding/editing items
    │       ├── ItemList.js      # Display items by category
    │       ├── Dashboard.js     # Dashboard view
    │       └── Alerts.js        # Alerts & notifications view
    └── package.json         # Frontend dependencies
```

## Features in Detail

### Low Stock Alerts
- Set minimum quantity for each item
- System automatically flags items below threshold
- Get notified on dashboard and alerts page

### Expiry Date Tracking
- Track expiration dates for perishables
- Items expiring within 7 days shown in "Expiring Soon"
- Expired items clearly marked for disposal
- Automatic calculation of days remaining

### Category Organization
- Pantry: Non-perishable foods, spices, oils
- Fridge: Fresh foods, condiments
- Freezer: Frozen items
- Household: Cleaning supplies, toiletries
- Other: Miscellaneous items

## Tips

💡 Set lower min quantities for items you use frequently
💡 Use notes to track storage locations
💡 Check alerts regularly to maintain inventory
💡 Update quantities as you use items
💡 Clear expired items promptly

## Future Enhancements

- 📱 Mobile app version
- 📊 Usage statistics and trends
- 🛒 Shopping list generation
- 📧 Email notifications for expiring items
- 🔄 Recurring items / auto-restock
- 👥 Multi-user support
- 📸 Photo upload for items

## License

ISC

## Support

For issues or suggestions, please report them to the project repository.

---

Happy inventory tracking! 📦
