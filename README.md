<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/pizza.svg" alt="PizzaHub Logo" width="100" height="100">

  <h1 align="center">PizzaHub SaaS Platform</h1>

  <p align="center">
    <strong>A next-generation Pizza Delivery and Operations Management Platform</strong>
    <br />
    Built with the MERN stack and powered by WebSockets for real-time tracking.
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="NodeJS" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101" alt="Socket.io" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  </p>

  <p align="center">
    <a href="#features">Features</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#installation">Installation</a> •
    <a href="#api-reference">API Reference</a>
  </p>
</div>

---

## 📖 Overview

**PizzaHub** is a production-ready, full-stack application designed to modernize the pizza delivery lifecycle. Featuring a dual-portal system, it provides a seamless, glassmorphism-inspired experience for customers while offering kitchen staff a high-performance operations dashboard.

Real-time synchronization ensures that when a chef marks a pizza as "In Kitchen," the customer's tracking screen instantly updates via WebSockets.

---

## ✨ Core Features

### 👤 Customer Portal
* **Custom Pizza Builder Engine:** Interactive visual builder allowing customers to layer bases, sauces, and toppings.
* **Real-time Order Tracking:** Live Kanban-style progress bar powered by `Socket.io`.
* **Enterprise Authentication:** JWT-based sessions, automated email verification, and secure password reset workflows.
* **Premium UX/UI:** Framer Motion animations, dark/light mode optimization, and micro-interactions.
* **Order History & Cart Persistence:** Context-driven state management for robust session handling.

### 👨‍🍳 Admin Operations Center
* **Live Flow Board:** Real-time updates of incoming orders injected directly into the kitchen queue without page refreshes.
* **One-Click State Mutations:** Update order statuses instantly to keep customers informed.
* **Automated Inventory Health:** Real-time visual tracking of ingredient thresholds with automated low-stock email alerts.
* **Metrics Dashboard:** Business intelligence widgets tracking daily throughput and active deliveries.

---

## 🏗️ Architecture & Tech Stack

### Frontend (Client)
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS + Vanilla CSS Tokens (Glassmorphism)
- **State Management:** React Context API (Auth, Cart)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Routing:** React Router DOM v6

### Backend (Server)
- **Environment:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **WebSockets:** Socket.io
- **Security:** bcrypt, jsonwebtoken, CORS
- **Mail Service:** Nodemailer

### Project Structure
```text
OIBSIP/
├── backend/
│   ├── config/         # Database and connection configurations
│   ├── controllers/    # Route business logic
│   ├── middleware/     # Authentication and error handling
│   ├── models/         # Mongoose schema definitions
│   ├── routes/         # Express API route declarations
│   ├── utils/          # Email services and cron jobs
│   └── server.js       # Application entry point
│
└── frontend/
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── context/    # Global state management
    │   ├── pages/      # Route-level components
    │   ├── App.jsx     # Main React layout and routing
    │   └── index.css   # Global design tokens and utilities
    └── tailwind.config.js
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18.0.0 or higher)
- MongoDB instance (Local or Atlas)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Magg-peace/OIBSIP.git
cd OIBSIP
```

### 2. Configure Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pizzahub
JWT_SECRET=your_jwt_encryption_key
FRONTEND_URL=http://localhost:5173
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_smtp_email@example.com
EMAIL_PASS=your_smtp_password
ADMIN_EMAIL=admin_alerts@example.com
```
Start the backend development server:
```bash
npm run dev
```

### 3. Configure Frontend
Open a new terminal window:
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```
Start the frontend development server:
```bash
npm run dev
```

---

## 🔐 Authentication & Roles

The application strictly separates privileges using Role-Based Access Control (RBAC).
For ease of demonstration, the UI includes a **"Fast Demo Switch"** allowing instant swapping between roles without manual credential entry.

| Role | Access Level | Test Email | Test Password |
| :--- | :--- | :--- | :--- |
| **Admin** | Full access to inventory, live operations, and metrics. | `admin@example.com` | `password123` |
| **User** | Access to pizza builder, personal order history, and tracking. | `user@example.com` | `password123` |

---

## 📡 API Reference

### Authentication
* `POST /api/auth/register` - Register a new user
* `POST /api/auth/login` - Authenticate user and return JWT
* `GET /api/auth/me` - Get current user profile
* `POST /api/auth/verify-email` - Validate email via token

### Orders
* `POST /api/orders` - Create a new order (Protected)
* `GET /api/orders` - Get all orders (Admin only)
* `GET /api/orders/myorders` - Get orders for current user (Protected)
* `PUT /api/orders/:id/status` - Update order status (Admin only)

### Inventory
* `GET /api/inventory` - Get all ingredient stock levels
* `PUT /api/inventory/:id` - Update specific ingredient stock (Admin only)

### External
* `POST /api/newsletter/subscribe` - Trigger automated welcome email

---

## 🛡️ Security Posture

* **Stateless Sessions:** JWT-based authentication ensures high scalability.
* **Password Cryptography:** All passwords are one-way hashed using `bcrypt` prior to database insertion.
* **Idempotency Locks:** React `useRef` locks prevent strict-mode double-firing on sensitive mutation endpoints (like token consumption).
* **Route Protection:** Higher-Order Components (HOCs) aggressively protect frontend routing paths based on Redux/Context state.

---

<div align="center">
  <i>Developed with precision and care.</i>
</div>
