# AI-Chatbot Project

## 📌 Project Overview

**AI-Chatbot** is a comprehensive full-stack web application built using the MERN stack (MongoDB, Express.js, React, Node.js). It features a robust authentication system with microservices architecture and an integrated AI-powered chatbot.

### Key Features

*   **Advanced Authentication**:
    *   User Signup with Email OTP Verification.
    *   Secure Login with JWT (JSON Web Tokens).
    *   Google OAuth Integration.
    *   Forgot Password & Reset Password flows via Email OTP.
*   **Microservices Architecture**: Backend is divided into distinct services (`AuthServices`, `ChatServices`, `UserServices`) for scalability and maintainability.
*   **AI Chatbot**: Integrated chatbot functionality powered by Groq SDK (`ChatServices`).
*   **User Management**: dedicated service for managing user data (`UserServices`).
*   **Modern Frontend**: Built with React and Vite, featuring responsive design, dark mode aesthetics, and smooth animations.

---

## 🛠 Tech Stack

### Frontend
*   **Framework**: React (Vite)
*   **Routing**: React Router DOM
*   **State Management**: Context API
*   **Forms**: React Hook Form
*   **HTTP Client**: Axios
*   **Styling**: CSS3 (Custom Styles)
*   **Notifications**: React Hot Toast, React Toastify
*   **Icons**: React Icons
*   **Authentication**: @react-oauth/google, js-cookie, jwt-decode

### Backend (Node.js & Express)
The backend is structured as a set of microservices:

1.  **AuthServices**: Handles user authentication, signup, login, and OTP verification.
2.  **ChatServices**: Manages chat interactions and integrates with AI models (Groq SDK).
3.  **UserServices**: Manages user profile data and account operations.

**Common Backend Dependencies:**
*   **Core**: Express, Mongoose (MongoDB), Dotenv, Cors, Cookie-Parser
*   **Auth**: JsonWebToken, Passport, Passport-Google-OAuth20, Bcrypt/Bcryptjs
*   **Communication**: Nodemailer (Email), Node-Fetch, Axios
*   **AI**: Groq SDK (in ChatServices)

---

## 📂 Project Structure

```graphql
isAuth/
├── Backend/
│   ├── AuthServices/       # Authentication Microservice
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── server.js
│   │   └── package.json
│   ├── ChatServices/       # Chatbot Microservice
│   │   ├── ...
│   │   ├── server.js
│   │   └── package.json
│   └── UserServices/       # User Management Microservice
│       ├── ...
│       ├── server.js
│       └── package.json
│
└── Frontend/               # React Application
    ├── public/
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── context/        # React Context (Auth, Chat)
    │   ├── pages/          # Application Pages (Auth, Landing, etc.)
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Installation & Setup

### Prerequisites
*   Node.js installed
*   MongoDB installed or a MongoDB Atlas connection string

### 1. Clone the Repository
```bash
git clone <repository-url>
cd AI-Chatbot
```

### 2. Backend Setup
You need to set up and run each microservice independently.

**AuthServices:**
```bash
cd Backend/AuthServices
npm install
# Create a .env file with PORT, MONGO_URI, JWT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, EMAIL_USER, EMAIL_PASS
npm start
```

**ChatServices:**
```bash
cd Backend/ChatServices
npm install
# Create a .env file with PORT, MONGO_URI, GROQ_API_KEY
npm start
```

**UserServices:**
```bash
cd Backend/UserServices
npm install
# Create a .env file with PORT, MONGO_URI
npm start
```

### 3. Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

The frontend will typically run on `http://localhost:5173`.

---

## 📦 Frontend Dependencies

| Package | Version | Description |
| :--- | :--- | :--- |
| `@react-oauth/google` | `^0.12.2` | Google OAuth integration |
| `axios` | `^1.12.2` | Promise based HTTP client |
| `react-hook-form` | `^7.65.0` | Performant, flexible and extensible forms |
| `react-router-dom` | `^7.9.4` | Declarative routing for React |
| `react-hot-toast` | `^2.6.0` | Smoking hot React notifications |
| `react-icons` | `^5.5.0` | Include popular icons in your React projects |
| `js-cookie` | `^3.0.5` | Simple JavaScript API for handling cookies |
| `jwt-decode` | `^4.0.0` | Decode JWT tokens |

---

## 🛡️ API Endpoints Overview

### Auth Services
*   `POST /api/auth/signup` - Register a new user
*   `POST /api/auth/login` - User login
*   `POST /api/auth/verify-otp` - Verify email OTP
*   `GET /api/auth/google` - Google OAuth

### User Services
*   `GET /api/user/me` - Get current user profile
*   `PUT /api/user/update` - Update user information

### Chat Services
*   `POST /api/chat/message` - Send a message to the AI chatbot

---

## 🤝 Contributing

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
