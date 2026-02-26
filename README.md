# 🏥 HealthHub  
### Full-Stack Pharmacy Management System

[![Frontend](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://health-hub-express-amber.vercel.app/)
[![Backend](https://img.shields.io/badge/Backend-Render-blue)](https://health-hub-express.onrender.com/api/medicines)
[![Database](https://img.shields.io/badge/Database-MongoDB-green?logo=mongodb)](https://mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)]

A production-ready pharmacy web application built with **React, Node.js, Express, and MongoDB Atlas**.

This project demonstrates complete full-stack development including:
- REST API architecture  
- JWT authentication  
- Cloud deployment  
- Environment variable configuration  
- Frontend + backend integration  

---

## 🌐 Live Application

### 🔗 Frontend  
👉 https://health-hub-express-amber.vercel.app/

### 🔗 Backend API  
👉 https://health-hub-express.onrender.com/api/medicines

---

## ✨ Features

### 🧾 Medicine Management
- View medicines from MongoDB
- Add new medicines
- Delete medicines
- Category filtering (OTC / Prescription / Wellness)

### 🛒 Cart System
- Add to cart
- Update quantity
- Remove items
- Persistent cart using localStorage

### 🔐 Authentication
- User registration & login
- JWT-based authentication
- Protected API routes
- Role-based access (Customer / Owner)

### ☁️ Deployment
- Frontend hosted on **Vercel**
- Backend hosted on **Render**
- Database hosted on **MongoDB Atlas**

---

## 🧠 Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React (Vite + TypeScript) |
| UI         | Tailwind CSS |
| Backend    | Node.js + Express |
| Database   | MongoDB Atlas |
| ORM        | Mongoose |
| Auth       | JWT |
| Deployment | Vercel + Render |

---

## 🏗 System Architecture

```text
React (Vercel)
        ↓
Express API (Render)
        ↓
MongoDB Atlas
```

---

## 📦 API Endpoints

### Public Routes

```http
GET /api/medicines
```

---

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

---

### Protected Routes (JWT Required)

```http
POST /api/medicines
DELETE /api/medicines/:id
```

Header Required:

```http
Authorization: Bearer <token>
```

---

## 📁 Project Structure

```
health-hub-express/
│
├── client/                 # React frontend
│   ├── pages/
│   ├── components/
│   ├── contexts/
│   └── lib/
│
├── server/                 # Express backend
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── .env
│
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`/server/.env`)

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

---

### Frontend (`/client/.env`)

```env
VITE_API_URL=https://health-hub-express.onrender.com
```

---

## 🛠 Local Development Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/health-hub-express.git
cd health-hub-express
```

---

### 2️⃣ Start Backend

```bash
cd server
npm install
npm start
```

---

### 3️⃣ Start Frontend

```bash
cd client
npm install
npm run dev
```

---

## 🧪 What This Project Demonstrates

- Full-stack CRUD operations  
- REST API design  
- JWT authentication  
- Cloud deployment (Frontend + Backend separately)  
- MongoDB Atlas integration  
- Debugging production environment issues  

---

## 🚀 Future Enhancements

- Store orders in MongoDB
- Admin dashboard
- Prescription image upload (Cloudinary)
- Payment integration (Razorpay / Stripe)
- Email notifications

---

## 👨‍💻 Author

**Swanand**  
Full-Stack Developer  

---

## ⭐ Why This Project Stands Out

This project demonstrates:

- Real-world deployment pipeline  
- Production-ready architecture  
- Environment variable management  
- Secure authentication  
- Full-stack debugging experience  

---

## 📌 License

This project is licensed under the MIT License.
