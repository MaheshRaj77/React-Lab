import React, { useState } from 'react';
import HomePage from './pages/home';
import LabsPage from './pages/LabsPage';
import ResourcesPage from './pages/ResourcesPage';
import Dashboard from './pages/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import developersAPI from './api/developers.js';
import './App.css';
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [fromRegistration, setFromRegistration] = useState(false);

  // Navigation handlers
  const handleHomeClick = () => {
    setCurrentPage('home');
  };

  const handleLabsClick = () => {
    setCurrentPage('labs');
  };

  const handleResourcesClick = () => {
    setCurrentPage('resources');
  };

  const handleAboutClick = () => {
    // For now, just show an alert - later can be replaced with actual about page
    alert('About section coming soon!');
  };

  const handleAdminLogin = () => {
    setFromRegistration(false); // Reset flag when opening login manually
    setShowLogin(true);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setShowLogin(false);
    setFromRegistration(false); // Reset the flag
    setCurrentPage('home');
  };

  const handleRegister = (userData) => {
    // After successful registration, show login form instead of going to dashboard
    setShowRegister(false);
    setFromRegistration(true); // Set flag to show success message in login
    setShowLogin(true);
    // Don't set user here since they need to login after registration
  };

  const handleLogout = () => {
    developersAPI.logout();
    setUser(null);
    setCurrentPage('home');
  };

  const handleDashboardClick = () => {
    if (user) {
      setCurrentPage('dashboard');
    } else {
      setFromRegistration(false); // Reset flag when opening login for dashboard
      setShowLogin(true);
    }
  };

  const handleProfileClick = () => {
    setShowProfile(true);
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const handleExploreClick = () => {
    handleLabsClick();
  };

  // Render different pages based on current page state
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            onExploreClick={handleExploreClick}
            onHomeClick={handleHomeClick}
            onLabsClick={handleLabsClick}
            onResourcesClick={handleResourcesClick}
            onAboutClick={handleAboutClick}
            onDashboardClick={handleDashboardClick}
            onAdminLogin={handleAdminLogin}
            onProfileClick={handleProfileClick}
            onLogoutClick={handleLogout}
            isLoggedIn={!!user}
            user={user}
          />
        );
      case 'labs':
        return (
          <LabsPage 
            onHomeClick={handleHomeClick}
            onLabsClick={handleLabsClick}
            onResourcesClick={handleResourcesClick}
            onAboutClick={handleAboutClick}
            onDashboardClick={handleDashboardClick}
            onAdminLogin={handleAdminLogin}
            onProfileClick={handleProfileClick}
            onLogoutClick={handleLogout}
            isLoggedIn={!!user}
            user={user}
          />
        );
      case 'resources':
        return (
          <ResourcesPage 
            onHomeClick={handleHomeClick}
            onLabsClick={handleLabsClick}
            onResourcesClick={handleResourcesClick}
            onAboutClick={handleAboutClick}
            onDashboardClick={handleDashboardClick}
            onAdminLogin={handleAdminLogin}
            onProfileClick={handleProfileClick}
            onLogoutClick={handleLogout}
            isLoggedIn={!!user}
            user={user}
          />
        );
      case 'dashboard':
        return (
          <Dashboard 
            user={user}
            onHomeClick={handleHomeClick}
            onLabsClick={handleLabsClick}
            onResourcesClick={handleResourcesClick}
            onAboutClick={handleAboutClick}
            onLogoutClick={handleLogout}
            onProfileClick={handleProfileClick}
            theme="education"
            showExperimentsManagement={true} // Example prop
          />
        );
      default:
        return (
          <HomePage 
            onExploreClick={handleExploreClick}
            onHomeClick={handleHomeClick}
            onLabsClick={handleLabsClick}
            onResourcesClick={handleResourcesClick}
            onAboutClick={handleAboutClick}
            onDashboardClick={handleDashboardClick}
            onAdminLogin={handleAdminLogin}
            onProfileClick={handleProfileClick}
            onLogoutClick={handleLogout}
            isLoggedIn={!!user}
            user={user}
          />
        );
    }
  };

  return (
    <div className="App">
      {renderCurrentPage()}
      
      {/* Authentication Modals */}
      {showLogin && (
        <Login 
          onLogin={handleLogin}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setFromRegistration(false); // Reset flag when switching to register
            setShowRegister(true);
          }}
          onClose={() => {
            setShowLogin(false);
            setFromRegistration(false); // Reset flag when closing
          }}
          theme="education"
          fromRegistration={fromRegistration}
        />
      )}
      
      {showRegister && (
        <Register 
          onRegister={handleRegister}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
          onClose={() => setShowRegister(false)}
          theme="education"
        />
      )}
      
      {showProfile && user && (
        <Profile 
          user={user}
          onUpdateUser={handleUpdateUser}
          onClose={() => setShowProfile(false)}
          theme="education"
        />
      )}
    </div>
  );
}

export default App;
