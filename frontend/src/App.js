import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import BottomNav from './components/BottomNav';
import PinSetup from './pages/PinSetup';
import Login from './pages/Login';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import Expenses from './pages/Expenses';
import CheckIn from './pages/CheckIn';
import Documents from './pages/Documents';
import Notes from './pages/Notes';
import Profile from './pages/Profile';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading Life OS...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/setup" element={<PinSetup />} />
          <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
          
          {isAuthenticated ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/checkin" element={<CheckIn />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/profile" element={<Profile setAuth={setIsAuthenticated} />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
        
        {isAuthenticated && <BottomNav />}
      </div>
    </Router>
  );
}

export default App;