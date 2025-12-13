# BubbleChat - Frontend 💬

**Real-time messaging with an emotional connection.**

This is the **Frontend** repository for BubbleChat, a modern real-time chat application. It handles the user interface, real-time socket connections, and mood-adaptive theming.

**🔗 Related Repository:**
- **Backend**: [Link to Backend Repository](https://github.com/Nileka03/bubble-backend.git)

**🌐 Live Demo:** [BubbleChat App](https://bubble-frontend-six.vercel.app/) 

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-ISC-blue.svg)

---

## 💡 About the Project

Text messaging often misses the nuance of face-to-face interaction. We've all experienced the struggle of running out of things to say, worrying about "cold" replies, or misinterpreting the tone of a message.

**BubbleChat** bridges this gap using AI:
- **Never run out of words**: Context-aware AI suggestions help you reply effortlessly and keep the conversation flowing, avoiding those awkward silences.
- **Feel the vibe**: Since you can't see faces or hear voices, our Mood Theme engine analyzes the emotional tone of the chat and adapts the background color accordingly. Instantly know if the conversation is joyful, serious, or affectionate.

---

## 🚀 Features

- **Real-Time Messaging**: Instant message sending and receiving.
- **Dynamic Mood Themes**: Changes the UI color theme based on the emotional context of the conversation.
- **Smart Replies**: Displays AI-generated quick reply suggestions via the backend.
- **Media Sharing**: Upload and view images in chat.
- **Online Status**: Real-time indicators for active users.
- **Glassmorphism UI**: A sleek, modern aesthetic using complex CSS and detailed animations.

---

## 🏗 Architecture

### Project Structure

```
client/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images and global styles
│   ├── components/         # Reusable UI components
│   │   ├── ChatContainer.jsx
│   │   ├── Sidebar.jsx
│   │   └── ...
│   ├── context/            # React Contexts
│   │   ├── AuthContext.jsx # Handles user auth state
│   │   └── SocketContext.jsx
│   ├── lib/                # Utilities
│   │   ├── axios.js        # Configured Axios instance
│   │   └── utils.js        # Helper functions
│   ├── pages/              # Main Application Pages
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   └── ProfilePage.jsx
│   ├── App.jsx             # Main App component & Routing
│   └── main.jsx            # Entry point
├── .env                    # Environment variables
├── index.html              # HTML template
├── package.json            # Dependencies
└── vite.config.js          # Vite configuration
```

---

## 🛠 Tech Stack

- **[React 19](https://react.dev/)**: A JavaScript library for building user interfaces. Used for component-based architecture and state management.
- **[Vite](https://vitejs.dev/)**: A build tool that aims to provide a faster and leaner development experience for modern web projects.
- **[Tailwind CSS v4](https://tailwindcss.com/)**: A utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup.
- **[Framer Motion](https://www.framer.com/motion/)**: A production-ready motion library for React. Used for the smooth page transitions and mood color animations.
- **[Socket.io-client](https://socket.io/)**: The client-side library to connect to the Socket.io server for real-time, bi-directional event communication.
- **[Axios](https://axios-http.com/)**: A promise-based HTTP client for the browser and Node.js. Used for making REST API requests to the backend.
- **[React Router v7](https://reactrouter.com/)**: A standard library for routing in React. Enables navigation between views (Home, Login, Profile) without page reloads.
- **[React Hot Toast](https://react-hot-toast.com/)**: A library for adding beautiful, animated notifications to the React app.
- **[clsx](https://github.com/lukeed/clsx) / [tailwind-merge](https://github.com/dcastil/tailwind-merge)**: Utilities to conditionally construct `className` strings and merge Tailwind classes without conflicts.

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/bubblechat-frontend.git
cd bubblechat-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configuration
Create a `.env` file in the root of the project:
```env
# The URL of your running backend server
VITE_BACKEND_URL=http://localhost:5000
```

### 4. Run Locally
```bash
npm run dev
# The app will run on http://localhost:5173
```

---

## 🛡 Security
- **Secure Handling**: Access tokens are handled via HttpOnly cookies (managed by the backend), ensuring XSS protection.
- **Route Protection**: Private routes redirect unauthenticated users to the Login page.

---


