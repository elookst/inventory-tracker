# Quick Start Guide - Household Inventory Tracker

## 🎯 What You Built

A complete web app for tracking household and pantry inventory with:
- ✅ Add/remove items
- ✅ Track quantities with low stock alerts
- ✅ Expiry date tracking with smart alerts
- ✅ Organized by categories (Pantry, Fridge, Freezer, Household)
- ✅ Beautiful dashboard with statistics
- ✅ Alerts page for expired and expiring items

## 📁 Project Structure

```
C:\Users\eluks\projects\inventory-tracker\
├── server.js              ← Backend API (Express + SQLite)
├── package.json           ← Backend dependencies
├── inventory.db           ← Database (created on first run)
└── client/                ← React frontend
    └── src/
        ├── App.js
        ├── App.css
        └── components/
            ├── ItemForm.js
            ├── ItemList.js
            ├── Dashboard.js
            └── Alerts.js
```

## 🚀 Getting Started

### Step 1: Start the Backend
Open PowerShell in `C:\Users\eluks\projects\inventory-tracker\`:
```powershell
npm start
```
✅ Backend will be running at: http://localhost:5000

### Step 2: Start the Frontend
Open another PowerShell in the same directory:
```powershell
cd client
npm start
```
✅ Frontend will open at: http://localhost:3000

### Alternative: Run Both Together
In one PowerShell window:
```powershell
npm run dev
```
This starts both backend and frontend automatically!

## 🎮 Using the App

### 1. **Dashboard Tab**
   - Overview of all statistics
   - Quick alerts for issues
   - Total items and categories

### 2. **Add Item Tab**
   - Click "Add Item"
   - Fill in:
     - Item name (required)
     - Category (Pantry, Fridge, Freezer, Household, etc.)
     - Quantity
     - Minimum quantity (for low stock alert)
     - Expiry date (optional)
     - Notes (optional)
   - Click "Add Item"

### 3. **All Items Tab**
   - View all items organized by category
   - See status badges:
     - ⚠️ Low Stock
     - ⏰ Expiring Soon (within 7 days)
     - 🚫 Expired
   - Edit or delete items

### 4. **Alerts Tab**
   - See all expired items
   - See items expiring within 7 days
   - See low stock items
   - Perfect for shopping list planning

## 📊 Key Features

### Low Stock Alerts
- Set minimum quantity for each item
- Get automatic alerts when stock runs low
- Shows on dashboard and alerts page

### Expiry Date Tracking
- Track expiration dates
- Items highlighted if expiring within 7 days
- Clear warning for expired items
- Automatic day-counter

### Smart Organization
- Group items by storage location
- Filter by category
- Add notes (brand, location, preferences)

## 🔧 API Endpoints (if you need them)

Backend runs on `http://localhost:5000`:

```
GET    /api/items                    - Get all items
GET    /api/items/low-stock          - Get low stock items
GET    /api/items/expiring-soon      - Get expiring items
POST   /api/items                    - Add new item
PUT    /api/items/:id                - Update item
DELETE /api/items/:id                - Delete item
GET    /api/stats                    - Get statistics
```

## 💾 Your Data

- All data is stored in `inventory.db` (SQLite)
- Database persists between sessions
- All files are on your local machine (no cloud sync)

## 🎨 Customization

The app is ready to customize! You can:
- Change colors in `client/src/App.css`
- Add more categories in `ItemForm.js`
- Modify the database schema in `server.js`
- Add features like photo uploads, sharing, etc.

## ⚠️ Troubleshooting

**"Cannot find module 'express'"**
→ Run `npm install` in the root directory

**"Port 5000 already in use"**
→ Change PORT in server.js to 3001, 8000, etc.

**"Port 3000 already in use"**
→ React will ask if you want to use a different port

**Database errors**
→ Delete `inventory.db` and restart - it will recreate

## 📚 Example Items to Add

Try adding these to test the features:

1. **Canned Beans** - Pantry, Qty: 6, Min: 2
2. **Milk** - Fridge, Qty: 1, Min: 1, Expiry: [2 weeks from now]
3. **Frozen Vegetables** - Freezer, Qty: 3, Min: 1
4. **Dish Soap** - Household, Qty: 1, Min: 1
5. **Olive Oil** - Pantry, Qty: 1, Min: 1, Notes: "Extra virgin, dark bottle"

## ✨ Next Steps

1. Start using the app with your actual inventory!
2. Check the Alerts tab regularly
3. Update quantities as you use items
4. Customize categories and minimum quantities

---

**Happy tracking! 📦** Your household inventory is now organized!
