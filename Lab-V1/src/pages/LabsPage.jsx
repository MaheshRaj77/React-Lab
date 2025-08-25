import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ExperimentCard from '../components/ExperimentCard';
import ExperimentDetailView from '../components/ExperimentDetailView';
import ExperimentSkeleton from '../components/ExperimentSkeleton';
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
  const [detailExperiment, setDetailExperiment] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  // Fetch experiments from backend
  useEffect(() => {
    const fetchExperiments = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await backendAPI.getAll();
        if (result.success && Array.isArray(result.data)) {
          setExperiments(result.data);
        } else {
          setExperiments([]);
          setError(result.error || 'Failed to fetch experiments.');
        }
      } catch (err) {
        setExperiments([]);
        setError(err.message || 'Failed to fetch experiments.');
      } finally {
        setLoading(false);
      }
    };
    fetchExperiments();
  }, []);

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

  // Show detail view modal and fetch experiment by ID
  const handleShowDetail = async (experiment) => {
    setDetailLoading(true);
    setDetailError(null);
    setDetailExperiment(null);
    try {
      const result = await backendAPI.getById(experiment.id);
      if (result.success) {
        setDetailExperiment(result.data);
      } else {
        setDetailError(result.error || 'Failed to load experiment details.');
      }
    } catch (err) {
      setDetailError(err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  // Hide detail view modal
  const handleCloseDetail = () => {
    setDetailExperiment(null);
    setDetailError(null);
    setDetailLoading(false);
  };

  // Launch experiment (open path)
  const handleNavigateToExperiment = (experiment) => {
    if (experiment.path && experiment.path.startsWith('/experiments/')) {
      const fullPath = window.location.origin + experiment.path;
      window.open(fullPath, '_blank');
    } else {
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
            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded text-red-300 text-center">
                {error}
              </div>
            )}

            {loading ? (
              <ExperimentSkeleton count={6} />
            ) : experiments.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-slate-900/80 backdrop-blur-md rounded-xl p-8 border border-slate-700/50 max-w-md mx-auto">
                  <div className="text-6xl mb-4">🧪</div>
                  <h3 className="text-xl font-bold text-white mb-4">No Experiments Found</h3>
                  <p className="text-gray-400 mb-6">
                    It looks like your experiments database is empty.
                  </p>
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
                      onViewDetails={handleShowDetail}
                    />
                  ))}
                </div>
                {/* Detail View Modal */}
                {detailExperiment && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="relative max-w-2xl w-full mx-4">
                      <button
                        onClick={handleCloseDetail}
                        className="absolute top-2 right-2 z-10 p-2 bg-slate-800/80 rounded-full text-white hover:bg-slate-700/80"
                        aria-label="Close"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <ExperimentDetailView
                        experiment={detailExperiment}
                        onBack={handleCloseDetail}
                        onBookmark={() => {
                          /* Bookmark functionality can be implemented here */
                        }}
                        onLaunch={handleNavigateToExperiment}
                      />
                    </div>
                  </div>
                )}
                {/* Loading/Error for Detail View */}
                {detailLoading && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-900/90 p-8 rounded-lg text-white flex flex-col items-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400 mb-4"></div>
                      <p>Loading experiment details...</p>
                    </div>
                  </div>
                )}
                {detailError && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-red-900/90 p-8 rounded-lg text-white flex flex-col items-center">
                      <p className="mb-4">{detailError}</p>
                      <button onClick={handleCloseDetail} className="bg-red-500 px-4 py-2 rounded">Close</button>
                    </div>
                  </div>
                )}
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
