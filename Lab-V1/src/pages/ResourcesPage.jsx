import React from 'react';
import Navbar from '../components/Navbar';
import TestSupabase from '../components/TestSupabase';

const ResourcesPage = ({ 
  onHomeClick, 
  onLabsClick, 
  onResourcesClick, 
  onAboutClick, 
  onDashboardClick,
  onAdminLogin,
  onProfileClick,
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
        onProfileClick={onProfileClick}
        onLogoutClick={onLogoutClick}
        isLoggedIn={isLoggedIn}
        user={user}
        theme="education"
      />
      
      <div className="pt-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Learning Resources
          </h1>
          
          <div className="bg-slate-800/50 rounded-lg p-8 backdrop-blur-sm mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Database Connection Test</h2>
            <TestSupabase />
          </div>
          
          {/* Experiments Section */}
          <div className="bg-slate-800/50 rounded-lg p-8 backdrop-blur-sm mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Interactive Experiments</h2>
            <p className="text-gray-300 mb-6">
              Explore hands-on web development experiments and demos:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a
                href="/experiments/exp-1/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-700/50 hover:bg-slate-600/50 p-4 rounded-lg transition-colors"
              >
                <h3 className="text-white font-semibold mb-2">HTML Tag Explorer</h3>
                <p className="text-gray-400 text-sm">Explore and preview common HTML tags</p>
              </a>
              <a
                href="/experiments/exp-2/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-700/50 hover:bg-slate-600/50 p-4 rounded-lg transition-colors"
              >
                <h3 className="text-white font-semibold mb-2">Online Book Store</h3>
                <p className="text-gray-400 text-sm">E-commerce demo with cart functionality</p>
              </a>
              <a
                href="/experiments/exp-5/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-700/50 hover:bg-slate-600/50 p-4 rounded-lg transition-colors"
              >
                <h3 className="text-white font-semibold mb-2">XML/XSLT Book Collection</h3>
                <p className="text-gray-400 text-sm">XML data transformation demo</p>
              </a>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              More experiments available in the /experiments folder
            </p>
          </div>
          
          {/* Learning Resources Section */}
          <div className="bg-slate-800/50 rounded-lg p-8 backdrop-blur-sm mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Learning Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Web Development</h3>
                <ul className="text-gray-400 space-y-2">
                  <li>• <a href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">MDN Web Docs</a></li>
                  <li>• <a href="https://react.dev" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">React Documentation</a></li>
                  <li>• <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Tailwind CSS</a></li>
                  <li>• <a href="https://supabase.com/docs" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Supabase Docs</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Tools & Technologies</h3>
                <ul className="text-gray-400 space-y-2">
                  <li>• <a href="https://code.visualstudio.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">VS Code</a></li>
                  <li>• <a href="https://git-scm.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Git</a></li>
                  <li>• <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Vite</a></li>
                  <li>• <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Node.js</a></li>
                </ul>
              </div>
            </div>
          </div>
          
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
