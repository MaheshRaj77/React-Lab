import React from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatCard from '../../components/dashboard/statcard';

const DashboardOverview = ({ developer, stats, experiments, theme: _theme, userCount = 0, onCreateExperiment, onExportExperiments, onViewAnalytics }) => {
  // Calculate category breakdown from actual experiments data
  const categoryBreakdown = Object.entries(
    (experiments || []).reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([category, count]) => ({
    category,
    count,
    percentage: Math.round((count / (experiments?.length || 1)) * 100)
  }));

  return (
    <div>
      <DashboardHeader user={developer} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
        <StatCard title="Total Experiments" value={stats.total || 0} icon="🔬" />
        <StatCard title="Total Users" value={userCount} icon="👥" />
        <StatCard title="In Progress" value={stats.inProgress || 0} icon="⏳" />
        <StatCard title="Completed" value={stats.completed || 0} icon="✅" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Category Breakdown */}
          <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-white">Category Breakdown</h3>
            <div className="space-y-4">
              {categoryBreakdown.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <span className="text-4xl mb-2 block">📈</span>
                  <p className="text-lg font-medium">No categories yet</p>
                  <p className="text-sm">Create experiments to see category breakdown!</p>
                </div>
              ) : (
                categoryBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-300">{item.category}</span>
                        <span className="text-sm text-gray-500">{item.count} experiments</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Project Status */}
          <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-white">Project Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Completed</span>
                <span className="text-green-400 font-semibold">{stats.completed || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">In Progress</span>
                <span className="text-cyan-400 font-semibold">{stats.inProgress || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Planned</span>
                <span className="text-yellow-400 font-semibold">{stats.planned || 0}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-white">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={onCreateExperiment}
                className="w-full text-left px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors text-gray-300 hover:text-white"
              >
                <div className="flex items-center space-x-3">
                  <span>📝</span>
                  <span>Create New Experiment</span>
                </div>
              </button>
              <button 
                onClick={onExportExperiments}
                className="w-full text-left px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors text-gray-300 hover:text-white"
              >
                <div className="flex items-center space-x-3">
                  <span>📤</span>
                  <span>Export Experiments</span>
                </div>
              </button>
              <button 
                onClick={onViewAnalytics}
                className="w-full text-left px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors text-gray-300 hover:text-white"
              >
                <div className="flex items-center space-x-3">
                  <span>📊</span>
                  <span>View Analytics</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;