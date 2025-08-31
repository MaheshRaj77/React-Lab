import React, { useState, useEffect, useMemo } from 'react';
import backendAPI from '../api/backend';
import developersAPI from '../api/developers';
import labAPI from '../api/lab';
import labFilesAPI from '../api/lab-files';
import { showSuccess, showError } from '../components/shared/NotificationManager';

// Components
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DashboardOverview from './view/dashboardoverview';
import ExperimentsView from './view/experimentview';
import LabView from './view/LabView';
import UserView from './view/UserView';
import SettingsView from './view/SettingsView';
import { CreateExperimentModal, CreateLabModal, LabFileUploadModal } from './view/Modals';
import Spinner from '../components/shared/Spinner';










const Dashboard = ({ 
  user, 
  onHomeClick, 
  onLabsClick, 
  onResourcesClick, 
  onAboutClick,
  onLogoutClick,
  onProfileClick,
  theme = 'education' 
}) => {
  // State for the data
  const [dashboardData, setDashboardData] = useState({ developer: null, experiments: [], labs: [], labFiles: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Navigation state
  const [activeView, setActiveView] = useState('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Lab management state
  const [showCreateLabModal, setShowCreateLabModal] = useState(false);
  const [showLabFileUploadModal, setShowLabFileUploadModal] = useState(false);
  const [editingLab, setEditingLab] = useState(null);
  const [labError, setLabError] = useState(null);
  const [labSuccessMessage, setLabSuccessMessage] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const developerId = user?.id || 'dev-001'; // Use logged-in user's ID

        // Fetch developer profile, experiments, all developers, labs, and lab files
        const [developerResponse, experimentsResponse, developersResponse, labsResponse, labFilesResponse] = await Promise.allSettled([
          developersAPI.getProfile().catch((error) => {
            console.warn('Failed to fetch user profile:', error);
            // Return default developer data instead of throwing
            return {
              id: developerId,
              name: user?.name || 'Developer',
              last_name: user?.lastName || '',
              email: user?.email || '',
              role: user?.role || 'Developer',
              profile_image_url: user?.avatarUrl || null
            };
          }),
          backendAPI.getAll().catch((error) => {
            console.warn('Failed to fetch experiments:', error);
            return { success: false, data: [], error: error.message };
          }),
          developersAPI.getAll().catch((error) => {
            console.warn('Failed to fetch developers:', error);
            return { data: [] };
          }),
          labAPI.getAll().catch((error) => {
            console.warn('Failed to fetch labs:', error);
            return { data: [] };
          }),
          labFilesAPI.getAll().catch((error) => {
            console.warn('Failed to fetch lab files:', error);
            return { data: [] };
          })
        ]);

        const developer = developerResponse.status === 'fulfilled' ? developerResponse.value : {
          id: developerId,
          name: user?.name || 'Developer',
          last_name: user?.lastName || '',
          email: user?.email || '',
          role: user?.role || 'Developer',
          profile_image_url: user?.avatarUrl || null
        };

        const experiments = experimentsResponse.status === 'fulfilled' && experimentsResponse.value.success 
          ? experimentsResponse.value.data || []
          : [];

        const developers = developersResponse.status === 'fulfilled' 
          ? developersResponse.value.data || []
          : [];

        const labs = labsResponse.status === 'fulfilled' 
          ? labsResponse.value.data || []
          : [];

        const labFiles = labFilesResponse.status === 'fulfilled' 
          ? labFilesResponse.value.data || []
          : [];

        setDashboardData({
          developer,
          experiments,
          developers,
          labs,
          labFiles
        });
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please refresh the page.');
        
        // Set default data to prevent crashes
        setDashboardData({
          developer: {
            id: user?.id || 'dev-001',
            name: user?.name || 'Developer',
            last_name: user?.lastName || '',
            email: user?.email || '',
            role: user?.role || 'Developer',
            profile_image_url: user?.avatarUrl || null
          },
          experiments: [],
          developers: [],
          labs: [],
          labFiles: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]); // Re-fetch if the user prop changes

  // Data manipulation functions
  const handleCreateExperiment = () => {
    setShowCreateModal(true);
  };

  const handleCreateExperimentSubmit = async (formData) => {
    try {
      setLoading(true);
      // Check if formData is a template (has all required fields pre-filled)
      const isTemplate = formData.title && formData.desc && formData.category;

      if (isTemplate) {
        // If it's a template, use it directly
        const newExp = await backendAPI.createExperiment(formData);
        setDashboardData(prev => ({
          ...prev,
          experiments: [...prev.experiments, newExp]
        }));
        showSuccess('Experiment created from template successfully!');
        setShowCreateModal(false);
      } else {
        // Original form submission logic
        const newExp = await backendAPI.createExperiment({
          title: formData.title,
          desc: formData.desc,
          category: formData.category,
          difficulty: formData.difficulty,
          estimated_time: formData.estimated_time,
          path: formData.path
        });
        setDashboardData(prev => ({
          ...prev,
          experiments: [...prev.experiments, newExp]
        }));
        showSuccess('Experiment created successfully!');
        setShowCreateModal(false);
      }
    } catch (err) {
      setError('Failed to create experiment.');
      console.error(err);
      showError('Failed to create experiment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExperimentCancel = () => {
    setShowCreateModal(false);
  };

  // Lab management handlers
  const handleCreateLab = () => {
    setShowCreateLabModal(true);
  };

  const handleCreateLabSubmit = async (formData, files = []) => {
    try {
      setLoading(true);
      setLabError(null);

      // Create the lab first
      const newLab = await labAPI.create(formData);

      // If files were selected, upload them
      if (files.length > 0) {
        try {
          for (const file of files) {
            const fileData = {
              lab_id: newLab.id,
              file_name: file.name,
              file_path: `/labs/${newLab.id}/${file.relativePath || file.name}`,
              file_type: file.type,
              file_size: file.size
            };

            await labFilesAPI.upload(fileData);
          }
        } catch (fileError) {
          console.error('Failed to upload some files:', fileError);
          // Don't fail the entire operation if file upload fails
          setLabSuccessMessage('Lab created successfully! Some files may not have been uploaded.');
        }
      }

      setDashboardData(prev => ({
        ...prev,
        labs: [...prev.labs, newLab]
      }));
      setShowCreateLabModal(false);
      setLabSuccessMessage('Lab created successfully!');
    } catch (error) {
      console.error('Failed to create lab:', error);
      const errorMessage = error.message || 'Failed to create lab';
      setLabError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditLab = (lab) => {
    setEditingLab(lab);
    setShowCreateLabModal(true);
  };

  const handleEditLabSubmit = async (formData, files = []) => {
    try {
      setLoading(true);
      setLabError(null);

      // Update the lab
      const updatedLab = await labAPI.update(editingLab.id, formData);

      // If new files were selected, upload them
      if (files.length > 0) {
        try {
          for (const file of files) {
            const fileData = {
              lab_id: editingLab.id,
              file_name: file.name,
              file_path: `/labs/${editingLab.id}/${file.relativePath || file.name}`,
              file_type: file.type,
              file_size: file.size
            };

            await labFilesAPI.upload(fileData);
          }
        } catch (fileError) {
          console.error('Failed to upload some files:', fileError);
          setLabSuccessMessage('Lab updated successfully! Some files may not have been uploaded.');
        }
      }

      setDashboardData(prev => ({
        ...prev,
        labs: prev.labs.map(l => l.id === editingLab.id ? updatedLab : l)
      }));
      setEditingLab(null);
      setShowCreateLabModal(false);
      setLabSuccessMessage('Lab updated successfully!');
    } catch (error) {
      console.error('Failed to update lab:', error);
      const errorMessage = error.message || 'Failed to update lab';
      setLabError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLab = async (lab) => {
    if (!window.confirm(`Delete lab: ${lab.name}?`)) return;

    try {
      setLoading(true);
      setLabError(null);
      await labAPI.delete(lab.id);
      setDashboardData(prev => ({
        ...prev,
        labs: prev.labs.filter(l => l.id !== lab.id)
      }));
      setLabSuccessMessage('Lab deleted successfully!');
    } catch (error) {
      console.error('Failed to delete lab:', error);
      const errorMessage = error.message || 'Failed to delete lab';
      setLabError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLabCancel = () => {
    setShowCreateLabModal(false);
    setEditingLab(null);
  };

  // Lab file upload handlers
  const handleUploadFile = () => {
    setShowLabFileUploadModal(true);
  };

  const handleUploadFileSubmit = async (fileData) => {
    try {
      setLoading(true);
      setLabError(null);

      // Upload file metadata to the database
      await labFilesAPI.upload(fileData);

      setShowLabFileUploadModal(false);
      setLabSuccessMessage(`File "${fileData.file_name}" uploaded successfully!`);
    } catch (error) {
      console.error('Failed to upload file:', error);
      const errorMessage = error.message || 'Failed to upload file';
      setLabError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadFileCancel = () => {
    setShowLabFileUploadModal(false);
  };

  const handleEditExperiment = async (experiment, formData) => {
    try {
      setLoading(true);
      const updated = await backendAPI.updateExperiment(experiment.id, {
        title: formData.title,
        desc: formData.desc,
        category: formData.category,
        difficulty: formData.difficulty,
        estimated_time: formData.estimated_time,
        path: formData.path
      });
      setDashboardData(prev => ({
        ...prev,
        experiments: prev.experiments.map(e => e.id === experiment.id ? updated : e)
      }));
      showSuccess('Experiment updated successfully!');
    } catch (err) {
      setError('Failed to update experiment.');
      console.error(err);
      showError('Failed to update experiment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExperiment = async (exp) => {
    if (!window.confirm('Delete experiment: ' + exp.title + '?')) return;
    
    try {
      setLoading(true);
      await backendAPI.deleteExperiment(exp.id);
      setDashboardData(prev => ({
        ...prev,
        experiments: prev.experiments.filter(e => e.id !== exp.id)
      }));
      showSuccess('Experiment deleted successfully!');
    } catch (err) {
      setError('Failed to delete experiment.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle profile updates
  const handleUpdateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);

      // Call the developers API to update profile
      const updatedProfile = await developersAPI.updateProfile(profileData);

      // Update local state with the response
      setDashboardData(prev => ({
        ...prev,
        developer: {
          ...prev.developer,
          ...updatedProfile.developer
        }
      }));

      showSuccess('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      const errorMessage = error.message || 'Failed to update profile';
      setError(errorMessage);
      throw error; // Re-throw to let calling component handle it
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics from the fetched data
  const stats = useMemo(() => {
    const experiments = dashboardData.experiments || [];
    
    const techFrequency = experiments.flatMap(e => [e.category]).filter(Boolean)
      .reduce((acc, tech) => {
          acc[tech] = (acc[tech] || 0) + 1;
          return acc;
      }, {});

    return {
      total: experiments.length,
      mostUsedTech: Object.keys(techFrequency).sort((a, b) => techFrequency[b] - techFrequency[a])[0] || 'N/A',
      inProgress: experiments.filter(e => e.status === 'in_progress').length,
      completed: experiments.filter(e => e.status === 'completed').length,
      planned: experiments.filter(e => e.status === 'planned').length
    };
  }, [dashboardData.experiments]);

  // Render a loading spinner or error message
  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-slate-950"><Spinner /></div>;
  }
  if (error) {
    return <div className="text-center text-red-400 mt-20">{error}</div>;
  }

  const { developer, experiments, developers, labs, labFiles } = dashboardData;

  // Function to render the correct view based on state
  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return <DashboardOverview 
          developer={developer} 
          stats={stats} 
          experiments={experiments} 
          theme={theme} 
          userCount={developers.length}
          onCreateExperiment={handleCreateExperiment}
          onExportExperiments={() => setActiveView('experiments')}
          onViewAnalytics={() => setActiveView('experiments')}
        />;
      case 'experiments':
        return (
          <ExperimentsView 
            experiments={experiments}
            onCreate={handleCreateExperiment}
            onEdit={handleEditExperiment}
            onDelete={handleDeleteExperiment}
            loading={loading}
            theme={theme}
          />
        );
      case 'lab':
        return <LabView
          labs={labs}
          labFiles={labFiles}
          loading={loading}
          onCreateLab={handleCreateLab}
          onEditLab={handleEditLab}
          onDeleteLab={handleDeleteLab}
          onUploadFile={handleUploadFile}
          labError={labError}
          labSuccessMessage={labSuccessMessage}
          onClearLabError={() => setLabError(null)}
          onClearLabSuccess={() => setLabSuccessMessage(null)}
        />;
      case 'user':
        return <UserView user={developer} onUpdateProfile={handleUpdateProfile} />;
      case 'settings':
        return <SettingsView user={developer} onUpdateProfile={handleUpdateProfile} />;
      default:
        return <DashboardOverview 
          developer={developer} 
          stats={stats} 
          experiments={experiments} 
          theme={theme} 
          userCount={developers.length}
          onCreateExperiment={handleCreateExperiment}
          onExportExperiments={() => setActiveView('experiments')}
          onViewAnalytics={() => setActiveView('experiments')}
        />;
    }
  };

  const isDark = theme === 'dark' || theme === 'akira' || theme === 'education';

  return (
      <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`} style={{ position: 'relative' }}>
        <Navbar
            onHomeClick={onHomeClick}
            onLabsClick={onLabsClick}
            onResourcesClick={onResourcesClick}
            onAboutClick={onAboutClick}
            onDashboardClick={() => setActiveView('overview')}
            onProfileClick={onProfileClick}
            onLogoutClick={onLogoutClick}
            isLoggedIn={true}
            user={user}
            theme={theme}
          />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className={`flex space-x-1 ${isDark ? 'bg-slate-800/50' : 'bg-gray-200'} p-1 rounded-lg w-fit`}>
            <button
              onClick={() => setActiveView('overview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'overview'
                  ? `${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-500 text-white'}`
                  : `${isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-slate-700/50' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-300'}`
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveView('experiments')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'experiments'
                  ? `${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-500 text-white'}`
                  : `${isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-slate-700/50' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-300'}`
              }`}
            >
              Experiments
            </button>
            <button
              onClick={() => setActiveView('lab')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'lab'
                  ? `${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-500 text-white'}`
                  : `${isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-slate-700/50' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-300'}`
              }`}
            >
              Lab
            </button>
            <button
              onClick={() => setActiveView('user')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'user'
                  ? `${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-500 text-white'}`
                  : `${isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-slate-700/50' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-300'}`
              }`}
            >
              User
            </button>
            <button
              onClick={() => setActiveView('settings')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'settings'
                  ? `${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-500 text-white'}`
                  : `${isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-slate-700/50' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-300'}`
              }`}
            >
              Settings
            </button>
          </div>
        </div>
        
        {renderContent()}
      </div>

      {showCreateModal && (
        <CreateExperimentModal
          onSave={handleCreateExperimentSubmit}
          onCancel={handleCreateExperimentCancel}
          loading={loading}
        />
      )}

      {(showCreateLabModal || editingLab) && (
        <CreateLabModal
          lab={editingLab}
          onSave={editingLab ? handleEditLabSubmit : handleCreateLabSubmit}
          onCancel={handleLabCancel}
          loading={loading}
        />
      )}

      {showLabFileUploadModal && (
        <LabFileUploadModal
          labId={labs.length > 0 ? labs[0].id : null} // For now, use the first lab ID
          onSave={handleUploadFileSubmit}
          onCancel={handleUploadFileCancel}
          loading={loading}
        />
      )}

      {/* Footer Component */}
      <Footer
        onHomeClick={onHomeClick}
        onExploreClick={onLabsClick}
        onResourcesClick={onResourcesClick}
        onDashboardClick={() => {}}
        onAdminLogin={() => {}}
        isLoggedIn={true}
      />
    </div>
  );

};

export default Dashboard;