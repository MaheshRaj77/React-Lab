import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ExperimentCard from '../components/ExperimentCard';
import ExperimentDetailView from '../components/ExperimentDetailView';
import ExperimentSkeleton from '../components/ExperimentSkeleton';
import { Hyperspeed, hyperspeedPresets, EduGlow, EduText } from '../blocks/Backgrounds/Hyperspeed';
import backendAPI from '../api/backend';
import { showInfo } from '../components/shared/NotificationManager';


const LabsPage = ({ 
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
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailExperiment, setDetailExperiment] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  // Define available categories
  const categories = [
    'Web Technology',
    'Computer Networks',
    'Data Structures',
    'Algorithms',
    'Database Systems',
    'Operating Systems',
    'Software Engineering',
    'Machine Learning',
    'Cybersecurity',
    'Mobile Development',
    'Cloud Computing',
    'DevOps'
  ];

  // Fetch experiments from backend
  const fetchExperiments = async () => {
    console.log('fetchExperiments called');
    setLoading(true);
    setError(null);
    try {
      console.log('Calling backendAPI.getAll()');
      const result = await backendAPI.getAll();
      console.log('API result:', result);
      if (result.success && Array.isArray(result.data)) {
        console.log('Setting experiments:', result.data.length, 'items');
        setExperiments(result.data);
      } else {
        console.log('API call failed or returned invalid data');
        setExperiments([]);
        setError(result.error || 'Failed to fetch experiments.');
      }
    } catch (err) {
      console.log('API call threw error:', err);
      setExperiments([]);
      setError(err.message || 'Failed to fetch experiments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiments();
  }, []);

  // Group experiments by category
  const groupExperimentsByCategory = (experiments) => {
    const grouped = {};
    experiments.forEach(experiment => {
      const category = experiment.category || 'Uncategorized';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(experiment);
    });
    return grouped;
  };

  // Get categories that have experiments
  const getAvailableCategories = (experiments) => {
    const grouped = groupExperimentsByCategory(experiments);
    return categories.filter(category => grouped[category] && grouped[category].length > 0);
  };

  // Launch experiment (open path)

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
      showInfo(`Navigation to ${experiment.title} - Path: ${experiment.path}`);
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
          onProfileClick={onProfileClick}
          onLogoutClick={onLogoutClick}
          isLoggedIn={isLoggedIn}
          user={user}
          theme="education"
        />
        
        {/* Header with Quote */}
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 tracking-tight font-heading leading-tight">
              Virtual Labs
            </h1>
            <div className="max-w-4xl mx-auto">
              <blockquote className="text-lg md:text-xl lg:text-2xl text-neutral-300 italic font-light leading-relaxed font-sans mb-6">
                "The best way to learn is by doing. Explore, experiment, and discover through hands-on laboratory experiences."
              </blockquote>
              <p className="text-neutral-400 text-base md:text-lg font-sans">— Innovation through Practice</p>
            </div>
          </div>
        </div>

        {/* Experiments Sections */}
        <div className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="max-w-7xl mx-auto">
            {/* Error message */}
            {error && (
              <div className="mb-8 p-6 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-center max-w-2xl mx-auto">
                <div className="text-2xl mb-2">⚠️</div>
                <p className="font-medium">{error}</p>
              </div>
            )}

            {loading ? (
              <ExperimentSkeleton count={10} />
            ) : experiments.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-slate-900/80 backdrop-blur-md rounded-xl p-10 border border-slate-700/50 max-w-lg mx-auto">
                  <div className="text-7xl mb-6">🧪</div>
                  <h3 className="text-2xl font-bold text-white mb-6 font-heading">No Experiments Found</h3>
                  <p className="text-neutral-400 text-lg leading-relaxed">
                    It looks like your experiments database is empty. Check back later for new experiments!
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-12">
                  <p className="text-neutral-400 text-lg">
                    Found <span className="text-blue-400 font-semibold text-xl">{experiments.length}</span> experiments across <span className="text-purple-400 font-semibold">{getAvailableCategories(experiments).length}</span> categories
                  </p>
                </div>
                
                {/* Category Sections */}
                {getAvailableCategories(experiments).map((category) => {
                  const categoryExperiments = groupExperimentsByCategory(experiments)[category];
                  return (
                    <div key={category} className="mb-16">
                      <div className="flex items-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-white font-heading mr-6">
                          {category}
                        </h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-slate-600 to-transparent"></div>
                        <span className="text-sm text-slate-400 font-medium ml-6 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50">
                          {categoryExperiments.length} {categoryExperiments.length === 1 ? 'experiment' : 'experiments'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                        {categoryExperiments.map((experiment) => (
                          <ExperimentCard
                            key={experiment.id}
                            experiment={experiment}
                            onLaunch={handleNavigateToExperiment}
                            onViewDetails={handleShowDetail}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
                
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

export default LabsPage;
