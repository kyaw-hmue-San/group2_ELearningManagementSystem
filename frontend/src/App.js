import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Courses from './components/Courses';
import Users from './components/Users';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import Register from './components/Register';
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [adminUser, setAdminUser] = useState(null);

  const handleAdminLogin = (admin) => {
    setAdminUser(admin);
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/users" element={<Users />} />
            <Route path="/admin/login" element={<AdminLogin onLogin={handleAdminLogin} />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
