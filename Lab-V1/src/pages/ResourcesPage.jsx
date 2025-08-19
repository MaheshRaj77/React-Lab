import React from 'react';
import Navbar from '../components/Navbar';

const ResourcesPage = ({ 
  onHomeClick, 
  onLabsClick, 
  onResourcesClick, 
  onAboutClick, 
  onDashboardClick,
  onAdminLogin,
  onLogoutClick,
  isLoggedIn = false,
  user = null
}) => {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar 
        onHomeClick={onHomeClick}
        onLabsClick={onLabsClick}
        onResourcesClick={onResourcesClick}
        onAboutClick={onAboutClick}
        onDashboardClick={onDashboardClick}
        onAdminLogin={onAdminLogin}
        onLogoutClick={onLogoutClick}
        isLoggedIn={isLoggedIn}
        user={user}
        theme="education"
      />
      
      <div className="pt-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-8">
            Learning Resources
          </h1>
          <div className="bg-slate-800/50 rounded-lg p-8 backdrop-blur-sm">
            <p className="text-gray-300 text-lg mb-4">
              Access comprehensive learning materials and documentation.
            </p>
            <p className="text-gray-400">
              This section is currently under development. Soon you'll find:
            </p>
            <ul className="text-gray-400 mt-4 space-y-2">
              <li>• Tutorial documentation</li>
              <li>• Video lectures</li>
              <li>• Code examples</li>
              <li>• API references</li>
              <li>• Best practices guides</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
