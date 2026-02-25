# 🏥 HealthHub – Full Stack Pharmacy Management System

## 🌐 Live Application

**Frontend:**  
https://health-hub-express-amber.vercel.app/

**Backend API:**  
https://health-hub-express.onrender.com/api/medicines

---

## 🚀 Features

- View all medicines from database
- Add new medicines
- Delete medicines
- Real-time MongoDB Atlas integration
- REST API architecture
- Fully deployed frontend + backend
- Environment variable security

---

## 🧠 Tech Stack

### Frontend
- React (Vite)
- Axios
- Vercel

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Render

---

## 📦 API Endpoints

### Get all medicines

```bash
GET /api/medicines
```

### Add medicine

```bash
POST /api/medicines
```

### Delete medicine

```bash
DELETE /api/medicines/:id
```

---

## 📂 Project Structure

```
health-hub-express/
├── client/
├── server/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env
├── package.json
└── README.md
```

---

## ⚙️ Environment Variables

Create `.env` inside `/server`

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```
```
