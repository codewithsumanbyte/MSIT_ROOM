# MSIT ROOM - Deployment & Development Guide

This guide explains how to run, build, and deploy the MSIT ROOM application.

## 🏗️ Architecture Overview

The app consists of two parts:
1.  **Client (Frontend)**: React, Vite, Tailwind CSS. Running on Port `5173` (Dev) / Served Static (Prod).
2.  **Server (Backend)**: Node.js, Express, Socket.io. Running on Port `3000`.

---

## 🚀 Running Locally (Development)

Follow these steps to run the project on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher) installed.
- Git (optional, for cloning).

### 1. Setup Backend (Server)
The server handles real-time sockets and file uploads.

```bash
# Open a terminal
cd server

# Install dependencies
npm install

# Start the server
npm start
```
*Server will run at `http://localhost:3000`*

### 2. Setup Frontend (Client)
The client is the UI you see in the browser.

```bash
# Open a NEW terminal
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```
*Client will run at `http://localhost:5173`*

---

## 📦 Building for Production

If you want to host this on a server, you need to build the React app.

1.  **Build the Client:**
    ```bash
    cd client
    npm run build
    ```
    This creates a `dist` folder with optimized HTML/CSS/JS files.

2.  **Serve Static Files:**
    You can configure the Node.js server to serve these files, or host them separately (e.g., on Vercel/Netlify).

---

## ☁️ Deployment Guide (Free Tier)

To make your app live on the internet, I recommend separating the Frontend and Backend.

### **Phase 1: Deploy Backend (Render.com)**
*Render offers free Node.js hosting.*

1.  Push your code to **GitHub**.
2.  Create an account on [Render](https://render.com).
3.  Click **"New +"** -> **"Web Service"**.
4.  Connect your GitHub repository.
5.  **Settings:**
    *   **Root Directory:** `server`
    *   **Build Command:** `npm install`
    *   **Start Command:** `npm start`
6.  Click **Deploy**.
7.  **Copy your Backend URL** (e.g., `https://msit-room-api.onrender.com`).

### **Phase 2: Deploy Frontend (Vercel)**
*Vercel is best for React apps.*

1.  **Configure Environment Variable:**
    *   In Vercel Project Settings, go to **Environment Variables**.
    *   Add Key: `VITE_SERVER_URL`
    *   Add Value: Your **Render Backend URL** (e.g., `https://msit-room-api.onrender.com`).
    *   *Note: Using the env var is better than hardcoding!*
2.  Push changes to GitHub.
3.  Create an account on [Vercel](https://vercel.com).
4.  **Add New Project** -> Import your repo.
5.  **Settings:**
    *   **Root Directory:** `client`
    *   **Framework Preset:** Vite
    *   **Build Command:** `npm run build`
    *   **Output Directory:** `dist`
6.  Click **Deploy**.

🎉 **Your app is now live!**

---

## 🛠️ Technology Stack

-   **Frontend:** React, Vite, Tailwind CSS, Lucide Icons, Framer Motion
-   **Backend:** Node.js, Express, Socket.io
-   **File Handling:** Multer (Files are stored temporarily in `server/uploads` and auto-deleted)
-   **Real-time:** Socket.io (WebSockets)

## 🤝 Contributing & Customization

-   **Logo:** stored in `client/public/logo.svg`.
-   **Colors:** Defined in Tailwind classes (Maroon `#900C3F`).
-   **Expiry Logic:** managed in `server/src/roomStore.js`.

---
*Made with ❤️ by MSITians AIML*
