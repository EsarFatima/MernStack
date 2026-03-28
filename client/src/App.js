import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  if (userLoggedIn) {
    return <Dashboard onLogout={() => setUserLoggedIn(false)} />;
  }

  return (
    <div className="app">
      <div className="auth-container-main">
        <div className="auth-toggle">
          {showLogin
            ? <Login onLogin={() => setUserLoggedIn(true)} />
            : <Register />}
        </div>
        <div className="auth-switch">
          <p>
            {showLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setShowLogin(!showLogin)}
              className="switch-btn"
            >
              {showLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
