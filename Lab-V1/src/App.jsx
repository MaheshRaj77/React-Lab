import React, { useState } from 'react';
import HomePage from './pages/home';
import LabsPage from './pages/LabsPage';
import ResourcesPage from './pages/ResourcesPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);

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
    // Mock login - in real app this would connect to authentication service
    const mockUser = {
      name: 'Admin User',
      email: 'admin@cslabportal.com',
      role: 'admin'
    };
    setUser(mockUser);
    alert('Logged in successfully!');
  };

  const handleLogout = () => {
    setUser(null);
    alert('Logged out successfully!');
  };

  const handleDashboardClick = () => {
    // For now, just show an alert - later can be replaced with actual dashboard page
    alert('Dashboard coming soon!');
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
            onLogoutClick={handleLogout}
            isLoggedIn={!!user}
            user={user}
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
    </div>
  );
}

export default App;
