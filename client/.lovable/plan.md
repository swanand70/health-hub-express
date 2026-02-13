

# 🏥 Pharmacy Management System — Full Build Plan

## Overview
A complete, production-style Pharmacy Management System built with React, TypeScript, and Tailwind CSS. Uses localStorage as the database. Two user roles: **Customer** and **Pharmacy Owner**. PharmEasy-inspired clean modern UI with a teal/green medical color palette.

---

## 1. Authentication System
- **Login page** with role toggle (Customer / Pharmacy Owner)
- **Customer signup**: Full name, username, password, address, phone, DOB, gender
- **Owner signup**: Owner name, username, password, pharmacy name, pharmacy address, phone, license number
- All credentials stored in localStorage; sessions persist across refresh
- Logout functionality from both dashboards

## 2. Customer Dashboard
- **Sidebar navigation**: Home, Browse Medicines, My Cart, My Orders, Upload Prescription, Profile Settings
- **Home**: Welcome banner, featured medicines cards, nearby pharmacies list
- **Browse Medicines**: Grid of medicine cards with search/filter, category tabs (OTC, Prescription, Wellness), add-to-cart button
- **Pharmacy Selection**: Choose a pharmacy to browse its inventory
- **Cart**: Item list with quantity controls, price totals, delivery/pickup toggle, checkout button
- **Upload Prescription**: Image upload (stored as base64 in localStorage), select pharmacy, submit order
- **Order History**: List of past orders with status tracking (Pending → Accepted → Ready → Delivered)
- **Profile Settings**: Edit all signup fields

## 3. Pharmacy Owner Dashboard
- **Sidebar navigation**: Overview, Inventory, Orders, Analytics, Profile
- **Overview**: Summary cards (total orders, revenue, low stock alerts, pending orders)
- **Inventory Management**: Table of medicines with Add/Edit/Delete, fields: name, category, price, quantity, prescription-required flag, description
- **Orders Panel**: Incoming orders list, view prescription images, Accept/Reject buttons, mark as Ready/Delivered
- **Analytics**: Bar chart for orders over time, revenue summary, low stock alerts list
- **Profile**: Edit pharmacy details

## 4. Data & Storage Layer
- localStorage keys: `pharma_users`, `pharma_pharmacies`, `pharma_products`, `pharma_orders`, `pharma_session`
- Utility module for all CRUD operations
- Data persists across browser refresh

## 5. Demo/Seed Data (preloaded on first visit)
- 2 pharmacies (MedPlus, Apollo Pharmacy)
- 10 medicines across categories (Crocin, Vicks, Dolo-650, Sunscreen, Amoxicillin, etc.)
- 2 sample orders with different statuses
- 1 demo customer and 2 demo pharmacy owner accounts

## 6. UI & Design
- **Color palette**: Teal/green primary (PharmEasy-inspired), white backgrounds, subtle gray cards
- **Sidebar layout** for both dashboards with icons (lucide-react)
- **Cards layout** for medicines and orders
- **Modals** for add/edit inventory items
- **Toast notifications** (sonner) for actions (order placed, item added, etc.)
- **Responsive design**: Works on mobile with collapsible sidebar
- **Smooth hover/transition animations** on cards and buttons
- **Badges** for order status and prescription-required indicators

## 7. File Structure
```
src/
├── lib/storage.ts          — localStorage CRUD utilities & seed data
├── lib/types.ts            — TypeScript interfaces
├── contexts/AuthContext.tsx — Auth state management
├── pages/
│   ├── AuthPage.tsx        — Login/Signup with role selection
│   ├── customer/
│   │   ├── CustomerDashboard.tsx
│   │   ├── BrowseMedicines.tsx
│   │   ├── Cart.tsx
│   │   ├── Orders.tsx
│   │   ├── UploadPrescription.tsx
│   │   └── Profile.tsx
│   └── owner/
│       ├── OwnerDashboard.tsx
│       ├── Inventory.tsx
│       ├── OwnerOrders.tsx
│       └── Analytics.tsx
├── components/
│   ├── CustomerSidebar.tsx
│   ├── OwnerSidebar.tsx
│   ├── MedicineCard.tsx
│   ├── OrderCard.tsx
│   └── StatsCard.tsx
└── App.tsx                 — Route setup with auth guards
```

## 8. Export-Ready
The project connects to GitHub via Lovable's built-in integration. Once built, you can export the full codebase, clone it, run `npm install && npm run dev`, and it works locally out of the box.

