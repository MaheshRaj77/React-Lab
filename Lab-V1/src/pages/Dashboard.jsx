import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

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
  const [stats, setStats] = useState({
    totalExperiments: 12,
    completedProjects: 8,
    activeProjects: 4,
    codeCommits: 156
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'experiment',
      title: 'React Hooks Workshop',
      description: 'Completed advanced useState and useEffect exercises',
      timestamp: '2 hours ago',
      status: 'completed'
    },
    {
      id: 2,
      type: 'project',
      title: 'E-commerce Dashboard',
      description: 'Added new product management features',
      timestamp: '1 day ago',
      status: 'in-progress'
    },
    {
      id: 3,
      type: 'lab',
      title: 'API Integration Lab',
      description: 'Started working on REST API implementation',
      timestamp: '2 days ago',
      status: 'started'
    },
    {
      id: 4,
      type: 'resource',
      title: 'TypeScript Documentation',
      description: 'Reviewed advanced TypeScript patterns',
      timestamp: '3 days ago',
      status: 'viewed'
    }
  ]);

  const [quickActions] = useState([
    {
      id: 1,
      title: 'New Experiment',
      description: 'Create a new coding experiment',
      icon: 'beaker',
      action: 'create-experiment',
      color: 'blue'
    },
    {
      id: 2,
      title: 'Browse Labs',
      description: 'Explore available lab exercises',
      icon: 'code',
      action: 'browse-labs',
      color: 'green'
    },
    {
      id: 3,
      title: 'View Resources',
      description: 'Access learning materials',
      icon: 'book',
      action: 'view-resources',
      color: 'purple'
    },
    {
      id: 4,
      title: 'Settings',
      description: 'Manage your account',
      icon: 'settings',
      action: 'settings',
      color: 'gray'
    }
  ]);

  const isEdu = theme === 'education';
  const isAkira = theme === 'akira';
  const isDark = theme === 'dark' || isAkira || isEdu;

  const getIcon = (iconName) => {
    const iconMap = {
      beaker: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547A1.998 1.998 0 004 17.658V18a2 2 0 002 2h12a2 2 0 002-2v-.342a1.998 1.998 0 00-.572-1.415zM15 8a3 3 0 11-6 0v5a3 3 0 006 0V8z" />
      ),
      code: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      ),
      book: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      ),
      settings: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      )
    };
    return iconMap[iconName] || iconMap.code;
  };

  const getStatusColor = (status) => {
    const statusColors = {
      completed: isEdu ? 'text-green-400' : 'text-green-400',
      'in-progress': isEdu ? 'text-blue-400' : 'text-cyan-400',
      started: isEdu ? 'text-yellow-400' : 'text-yellow-400',
      viewed: isDark ? 'text-gray-400' : 'text-gray-500'
    };
    return statusColors[status] || statusColors.viewed;
  };

  const getActionColor = (color) => {
    const colorMap = {
      blue: isEdu ? 'bg-blue-500/20 text-blue-400' : 'bg-cyan-500/20 text-cyan-400',
      green: 'bg-green-500/20 text-green-400',
      purple: 'bg-purple-500/20 text-purple-400',
      gray: isDark ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-500/20 text-gray-600'
    };
    return colorMap[color] || colorMap.blue;
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'create-experiment':
        // Logic for creating experiment
        console.log('Creating new experiment...');
        break;
      case 'browse-labs':
        onLabsClick && onLabsClick();
        break;
      case 'view-resources':
        onResourcesClick && onResourcesClick();
        break;
      case 'settings':
        onProfileClick && onProfileClick();
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <Navbar 
        onHomeClick={onHomeClick}
        onLabsClick={onLabsClick}
        onResourcesClick={onResourcesClick}
        onAboutClick={onAboutClick}
        onDashboardClick={() => {}} // Already on dashboard
        onProfileClick={onProfileClick}
        onLogoutClick={onLogoutClick}
        isLoggedIn={true}
        user={user}
        theme={theme}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Welcome back, {user?.name?.split(' ')[0] || 'Developer'}!
          </h1>
          <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Here's what's happening with your projects today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-800 border border-blue-500/30' : 'bg-white border border-gray-200'} shadow-lg`}>
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${isEdu ? 'bg-blue-500/20' : 'bg-cyan-500/20'}`}>
                <svg className={`w-6 h-6 ${isEdu ? 'text-blue-400' : 'text-cyan-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Total Experiments</p>
                <p className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.totalExperiments}</p>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-800 border border-blue-500/30' : 'bg-white border border-gray-200'} shadow-lg`}>
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-500/20">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Completed Projects</p>
                <p className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.completedProjects}</p>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-800 border border-blue-500/30' : 'bg-white border border-gray-200'} shadow-lg`}>
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-500/20">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Active Projects</p>
                <p className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.activeProjects}</p>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-800 border border-blue-500/30' : 'bg-white border border-gray-200'} shadow-lg`}>
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-500/20">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Code Commits</p>
                <p className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.codeCommits}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-800 border border-blue-500/30' : 'bg-white border border-gray-200'} shadow-lg`}>
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action.action)}
                  className={`p-4 rounded-lg transition-colors text-left ${
                    isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${getActionColor(action.color)}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {getIcon(action.icon)}
                    </svg>
                  </div>
                  <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                    {action.title}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {action.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-800 border border-blue-500/30' : 'bg-white border border-gray-200'} shadow-lg`}>
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${getStatusColor(activity.status)}`}></div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'} truncate`}>
                      {activity.title}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                      {activity.description}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                      {activity.timestamp}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
