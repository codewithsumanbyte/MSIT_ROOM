# 🚀 MSIT ROOM

> **From One MSITian to Another. Made with ❤️.**

**MSIT ROOM** is a blazing fast, real-time file sharing and chat application designed for instant collaboration. No logins, no sign-ups, no hassle. Create a room, share the code, and start sharing files and code snippets instantly. Everything disappears after the session expires.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB)
![Node](https://img.shields.io/badge/Backend-Node.js%20%2B%20Socket.io-339933)
![Tailwind](https://img.shields.io/badge/Style-Tailwind%20CSS-38B2AC)

---

## ✨ Features

*   **⚡ Real-Time Messaging**: Instant chat with WebSocket connections.
*   **📂 File Sharing**: Share files/documents/images (up to 500MB).
*   **💻 Code Highlighting**: Auto-detects code snippets and formats them beautifully.
*   **📱 Mobile First**: Fully responsive design with a dedicated mobile sidebar.
*   **🔒 Secure & Ephemeral**: Rooms, requests, and files auto-expire. No data is stored permanently.
*   **🚫 No Login Required**: Just create a room and go.
*   **🔗 QR Code Join**: Scan a QR code to instantly join a room on mobile.
*   **🎨 Premium UI**: Glassmorphism, smooth animations (Framer Motion), and a custom Maroon theme.

---

## 🛠️ Tech Stack

### Frontend (Client)
*   **Framework**: React (Vite)
*   **Styling**: Tailwind CSS, Framer Motion
*   **Icons**: Lucide React
*   **State/Socket**: Socket.io Client, Context API
*   **Routing**: React Router DOM

### Backend (Server)
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Real-time engine**: Socket.io
*   **File Handling**: Multer
*   **Utilities**: UUID, CORS

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
*   [Node.js](https://nodejs.org/) (v16+)
*   [Git](https://git-scm.com/)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/msit-room.git
    cd msit-room
    ```

2.  **Setup Backend (Server)**
    ```bash
    cd server
    npm install
    # Create a .env file (Optional for dev, defaults to port 3000)
    # PORT=3000
    npm start
    ```
    *Server runs at `http://localhost:3000`*

3.  **Setup Frontend (Client)**
    Open a new terminal:
    ```bash
    cd client
    npm install
    # Create a .env file
    # VITE_SERVER_URL=http://localhost:3000
    npm run dev
    ```
    *Client runs at `http://localhost:5173`*

---

## 📦 Project Structure

```bash
MSIT_ROOM/
├── client/                 # React Frontend
│   ├── public/             # Static assets (logo, etc.)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # RoomContext (Socket logic)
│   │   ├── pages/          # Home, Room, PrivacyPolicy
│   │   ├── App.jsx         # Routes
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Node.js Backend
│   ├── src/
│   │   ├── index.js        # Server entry & Socket handlers
│   │   ├── roomStore.js    # In-memory room management
│   │   └── fileUpload.js   # Multer config
│   ├── uploads/            # Temp storage for shared files
│   └── package.json
│
├── DEPLOYMENT.md           # Deployment Guide
└── README.md               # You are here!
```

---

## 🌍 Deployment

### 1. Backend (e.g., Render, Railway)
Build Command: `npm install`
Start Command: `npm start`

### 2. Frontend (e.g., Vercel, Netlify)
Build Command: `npm run build`
Output Directory: `dist`
**Environment Variable**: Set `VITE_SERVER_URL` to your deployed backend URL.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📞 Contact

Project Link:  (https://github.com/codewithsumanbyte/MSIT_ROOM)
