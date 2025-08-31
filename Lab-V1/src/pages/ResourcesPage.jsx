import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
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
          <h1 className="text-4xl font-bold text-white mb-8 text-center font-heading">
            Learning Resources
          </h1>
          
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-8 shadow-2xl mb-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4 font-heading">Database Connection Test</h2>
            <TestSupabase />
          </div>
          
          {/* Experiments Section */}
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-8 shadow-2xl mb-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 font-heading">Interactive Experiments</h2>
            <p className="text-white/80 mb-6 font-sans">
              Explore hands-on web development experiments and demos:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a
                href="/experiments/exp-1/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="backdrop-blur-lg bg-white/10 hover:bg-white/20 p-4 rounded-xl transition-all border border-white/20 hover:border-primary-400/50 hover:scale-105 duration-300"
              >
                <h3 className="text-white font-semibold mb-2 font-heading">HTML Tag Explorer</h3>
                <p className="text-white/70 text-sm">Explore and preview common HTML tags</p>
              </a>
              <a
                href="/experiments/exp-2/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="backdrop-blur-lg bg-white/10 hover:bg-white/20 p-4 rounded-xl transition-all border border-white/20 hover:border-primary-400/50 hover:scale-105 duration-300"
              >
                <h3 className="text-white font-semibold mb-2">Online Book Store</h3>
                <p className="text-white/70 text-sm">E-commerce demo with cart functionality</p>
              </a>
              <a
                href="/experiments/exp-5/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="backdrop-blur-lg bg-white/10 hover:bg-white/20 p-4 rounded-xl transition-all border border-white/20 hover:border-primary-400/50 hover:scale-105 duration-300"
              >
                <h3 className="text-white font-semibold mb-2">XML/XSLT Book Collection</h3>
                <p className="text-white/70 text-sm">XML data transformation demo</p>
              </a>
            </div>
            <p className="text-neutral-400 text-sm mt-4">
              More experiments available in the /experiments folder
            </p>
          </div>
          
          {/* Learning Resources Section */}
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-8 shadow-2xl mb-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Learning Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Web Development</h3>
                <ul className="text-white/70 space-y-2">
                  <li>• <a href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">MDN Web Docs</a></li>
                  <li>• <a href="https://react.dev" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">React Documentation</a></li>
                  <li>• <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">Tailwind CSS</a></li>
                  <li>• <a href="https://supabase.com/docs" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">Supabase Docs</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Tools & Technologies</h3>
                <ul className="text-white/70 space-y-2">
                  <li>• <a href="https://code.visualstudio.com" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">VS Code</a></li>
                  <li>• <a href="https://git-scm.com" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">Git</a></li>
                  <li>• <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">Vite</a></li>
                  <li>• <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">Node.js</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-8 shadow-2xl border border-white/20">
            <p className="text-white/80 text-lg mb-4">
              Access comprehensive learning materials and documentation.
            </p>
            <p className="text-white/70">
              This section is currently under development. Soon you'll find:
            </p>
            <ul className="text-white/70 mt-4 space-y-2">
              <li>• Tutorial documentation</li>
              <li>• Video lectures</li>
              <li>• Code examples</li>
              <li>• API references</li>
              <li>• Best practices guides</li>
            </ul>
          </div>
        </div>

        {/* Footer Component */}
        <Footer
          onHomeClick={onHomeClick}
          onExploreClick={onLabsClick}
          onResourcesClick={onResourcesClick}
          onDashboardClick={onDashboardClick}
          onAdminLogin={onAdminLogin}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </div>
  );
};

export default ResourcesPage;
