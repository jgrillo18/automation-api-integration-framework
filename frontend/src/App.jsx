import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Workflows from './pages/Workflows';
import Admin from './pages/Admin';
import History from './pages/History';
import NavBar from './components/NavBar';
import { LangProvider } from './i18n';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogin = (tok, email) => {
    localStorage.setItem('token', tok);
    if (email) localStorage.setItem('userEmail', email);
    setToken(tok);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setToken(null);
  };

  return (
    <LangProvider>
      <Router>
        <Routes>
          <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
          <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register onLogin={handleLogin} />} />
          <Route
            path="/*"
            element={
              token ? (
                <div style={{ display: 'flex', minHeight: '100vh' }}>
                  <NavBar onLogout={handleLogout} />
                  <div className="main-content">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/workflows" element={<Workflows />} />
                      <Route path="/admin" element={<Admin />} />
                      <Route path="/history" element={<History />} />
                      <Route path="*" element={<Navigate to="/dashboard" />} />
                    </Routes>
                  </div>
                </div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </Router>
    </LangProvider>
  );
}

export default App;
