import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ExperimentCard from '../components/ExperimentCard';
import { Hyperspeed, hyperspeedPresets, EduGlow, EduText } from '../blocks/Backgrounds/Hyperspeed';
import backendAPI from '../api/backend';


const LabsPage = ({ 
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
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seeding, setSeeding] = useState(false);

  // Fetch experiments from Supabase
  useEffect(() => {
    fetchExperiments();
  }, []);

  const fetchExperiments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await backendAPI.getAll();
      
      if (result.success) {
        setExperiments(result.data);
        if (result.data.length === 0) {
          console.log('No experiments found in database');
        } else {
          console.log(`Loaded ${result.data.length} experiments from database`);
        }
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('Error fetching experiments:', err);
      setError(err.message);
      setExperiments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDatabase = async () => {
    try {
      setSeeding(true);
      setError(null);
      
      const result = await backendAPI.seedDatabase();
      
      if (result.success) {
        console.log('Database seeded successfully');
        // Refresh the experiments list
        await fetchExperiments();
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('Error seeding database:', err);
      setError(`Failed to seed database: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

  const handleNavigateToExperiment = (experiment) => {
    // For now, we'll open the path in a new tab or navigate
    if (experiment.path.startsWith('/experiments/')) {
      // Navigate to local experiment
      const fullPath = window.location.origin + experiment.path;
      window.open(fullPath, '_blank');
    } else {
      // Handle other paths
      console.log('Navigate to:', experiment.path);
      alert(`Navigation to ${experiment.title} - Path: ${experiment.path}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Effect - Full Page */}
      <div className="fixed inset-0 z-0 w-full h-full">
        <div className="w-full h-full relative">
          <Hyperspeed effectOptions={hyperspeedPresets.akira} />
        </div>
      </div>

      {/* Overlay for better text readability */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-[0.5px]" style={{ zIndex: 1 }}></div>

      {/* Content */}
      <div className="relative z-10">
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
        
        {/* Header with Quote */}
        <div className="pt-32 pb-12 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Virtual Labs
            </h1>
            <div className="max-w-4xl mx-auto">
              <blockquote className="text-xl md:text-2xl text-gray-300 italic font-light leading-relaxed">
                "The best way to learn is by doing. Explore, experiment, and discover through hands-on laboratory experiences."
              </blockquote>
              <p className="text-gray-400 mt-4 text-lg">— Innovation through Practice</p>
            </div>
          </div>
        </div>

        {/* Experiments Grid */}
        <div className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto"></div>
                <p className="text-gray-400 mt-4">Loading experiments...</p>
              </div>
            ) : experiments.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-slate-900/80 backdrop-blur-md rounded-xl p-8 border border-slate-700/50 max-w-md mx-auto">
                  <div className="text-6xl mb-4">🧪</div>
                  <h3 className="text-xl font-bold text-white mb-4">No Experiments Found</h3>
                  <p className="text-gray-400 mb-6">
                    It looks like your experiments database is empty. Would you like to load some sample experiments?
                  </p>
                  <button 
                    onClick={handleSeedDatabase}
                    disabled={seeding}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 mx-auto"
                  >
                    {seeding ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Seeding Database...</span>
                      </>
                    ) : (
                      <>
                        <span>Load Sample Experiments</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                      </>
                    )}
                  </button>
                  {error && (
                    <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <p className="text-gray-400">
                    Found <span className="text-blue-400 font-semibold">{experiments.length}</span> experiments in the database
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {experiments.map((experiment) => (
                    <ExperimentCard
                      key={experiment.id}
                      experiment={experiment}
                      onLaunch={handleNavigateToExperiment}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 bg-slate-900/90 backdrop-blur-md border-t border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-xl font-bold text-white mb-4">React Lab</h3>
                <p className="text-gray-400 leading-relaxed">
                  Empowering developers with hands-on experiments and innovative solutions. 
                  Explore, learn, and build the future of web development.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><a href="#" onClick={onHomeClick} className="text-gray-400 hover:text-blue-400 transition-colors">Home</a></li>
                  <li><a href="#" onClick={onLabsClick} className="text-gray-400 hover:text-blue-400 transition-colors">Labs</a></li>
                  <li><a href="#" onClick={onResourcesClick} className="text-gray-400 hover:text-blue-400 transition-colors">Resources</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">GitHub</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Documentation</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Support</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-slate-700/50 mt-8 pt-8 text-center">
              <p className="text-gray-400">
                © {new Date().getFullYear()} React Lab. Built with passion for learning and innovation.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LabsPage;
