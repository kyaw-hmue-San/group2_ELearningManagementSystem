# E-Learning Management System - Frontend

React frontend for the E-Learning Management System university project.

## 🚀 Features

- **Modern React UI** with Bootstrap styling
- **Responsive Design** that works on all devices
- **API Integration** with Spring Boot backend
- **Component-based Architecture** for maintainability
- **Real-time Data** fetching and display

## 📋 Prerequisites

- Node.js 16+ and npm
- Spring Boot backend running on port 8080

## 🛠️ Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

4. **Open browser:**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Home.js
│   │   ├── Dashboard.js
│   │   ├── Courses.js
│   │   ├── Users.js
│   │   └── Footer.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## 🎯 Available Pages

- **Home** (`/`) - Landing page with system overview
- **Dashboard** (`/dashboard`) - System statistics and recent data
- **Courses** (`/courses`) - Course management and browsing
- **Users** (`/users`) - User management with role filtering

## 🔧 API Integration

The frontend connects to the Spring Boot backend via:
- Base URL: `http://localhost:8080/api`
- Proxy configuration in `package.json`
- Axios for HTTP requests

## 🎨 Styling

- **Bootstrap 5** for responsive design
- **Font Awesome** for icons
- **Custom CSS** for enhanced styling
- **Gradient backgrounds** and modern UI elements

## 📱 Responsive Design

- Mobile-first approach
- Bootstrap grid system
- Responsive tables and cards
- Mobile-friendly navigation

## 🚀 Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## 🔗 Backend Integration

Make sure your Spring Boot backend is running on `http://localhost:8080` before starting the React development server.
