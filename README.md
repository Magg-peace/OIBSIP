<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/pizza.svg" alt="PizzaHub Logo" width="80" height="80">
  
  <h1 align="center">PizzaHub SaaS Platform</h1>

  <p align="center">
    A premium, full-stack Pizza Delivery and Management Platform built with the MERN stack.
    <br />
    <a href="#features"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="#">View Demo</a>
    ·
    <a href="#">Report Bug</a>
    ·
    <a href="#">Request Feature</a>
  </p>
</div>

---

## 🍕 About The Project

PizzaHub is a highly polished, production-ready full-stack web application designed for modern pizza delivery businesses. It features a stunning, glassmorphism-inspired UI with a dark-mode aesthetic, paired with a robust backend to handle orders, inventory, and real-time tracking.

The platform is strictly separated into two portals:
1. **User Portal:** Where customers can browse the menu, customize their pizzas, place orders, and track them in real-time.
2. **Admin Operations Center:** Where kitchen staff and managers can view live orders, update statuses, and monitor inventory levels.

### Built With

* **Frontend:** React (Vite), Framer Motion, Tailwind CSS, Lucide React
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Real-time:** Socket.io
* **Authentication:** JWT, bcrypt
* **Emails:** Nodemailer

---

## ✨ Key Features

### For Users 👤
* **Secure Authentication:** Complete registration flow with email verification, forgot password, and JWT-based session management.
* **Pizza Builder Engine:** Interactive custom pizza builder allowing users to choose their base, sauce, cheese, and vegetables.
* **Shopping Cart:** Persistent cart state using React Context.
* **Real-time Order Tracking:** Live order status updates (Received -> Kitchen -> Delivery -> Delivered) powered by WebSockets.
* **Order History:** View past orders and easily re-order favorites.
* **Premium UX:** Smooth page transitions, glassmorphism design tokens, interactive hover states, and toast notifications.

### For Admins 👨‍🍳
* **Ops Dashboard:** A centralized dashboard showing real-time metrics (Orders Today, Pizzas in Kitchen, Out for Delivery, Low Stock Alerts).
* **Live Operations Flow:** A Kanban-style visual board for moving orders through the preparation pipeline.
* **Instant Status Updates:** Changing an order status instantly reflects on the User's tracking page via Socket.io.
* **Inventory Health:** Visual indicators of stock levels to prevent running out of critical ingredients.

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18+)
* MongoDB (Local or Atlas)
* A Gmail account (for Nodemailer)

### Installation

1. **Clone the repo**
   ```sh
   git clone https://github.com/Magg-peace/OIBSIP.git
   cd OIBSIP
   ```

2. **Backend Setup**
   ```sh
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   FRONTEND_URL=http://localhost:5173
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ADMIN_EMAIL=admin@example.com
   ```

3. **Frontend Setup**
   ```sh
   cd ../frontend
   npm install
   ```
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. **Run the Application**
   Open two terminals.
   
   Terminal 1 (Backend):
   ```sh
   cd backend
   npm run dev
   ```
   
   Terminal 2 (Frontend):
   ```sh
   cd frontend
   npm run dev
   ```

---

## 🧪 Demo Credentials

To quickly test the platform without registering, you can use the built-in "Fast Demo Switch" in the Navbar, or login with:

**Admin Account**
* Email: `admin@example.com`
* Password: `password123`

**User Account**
* Email: `user@example.com`
* Password: `password123`

---

## 🛡️ Security Implementations

* **Strict Mode Double-Call Safeties:** `useRef` locks implemented to prevent duplicate token validation during React StrictMode renders.
* **Password Hashing:** Passwords are never stored in plaintext (bcrypt).
* **Role-Based Access Control (RBAC):** Backend middleware explicitly checks for `admin` privileges before allowing access to inventory or order mutation endpoints.
* **Input Validation:** Backend validation to ensure valid data structures before DB insertion.

---

<div align="center">
  <p>Built with ❤️ for Pizza Lovers everywhere.</p>
</div>
