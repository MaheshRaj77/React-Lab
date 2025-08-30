import React from 'react';

// A simple Icon component placeholder
const Icon = ({ children }) => <span className="mr-3 w-6 text-center">{children}</span>;

const Sidebar = ({ developer, stats, activeView, setActiveView, onLogoutClick }) => {
  if (!developer) return null; // Or a loading skeleton

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: '📊' },
    { id: 'experiments', label: 'My Experiments', icon: '🔬' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const getLinkClass = (viewId) =>
    `flex items-center p-3 rounded-lg transition-colors font-medium ${
      activeView === viewId
        ? 'bg-blue-500/20 text-blue-300'
        : 'text-gray-400 hover:bg-slate-700/50 hover:text-gray-200'
    }`;

  return (
    <aside className="w-72 flex-shrink-0 bg-slate-900 text-gray-300 flex flex-col p-6 border-r border-slate-800">
      <div className="flex items-center mb-10">
        <img src={developer.avatarUrl} alt={developer.name} className="w-14 h-14 rounded-full mr-4 border-2 border-slate-700" />
        <div>
          <h2 className="font-semibold text-lg text-white">{developer.name}</h2>
          <p className="text-sm text-gray-400">{developer.role}</p>
        </div>
      </div>

      <nav className="flex-grow">
        {navItems.map(item => (
          <button key={item.id} onClick={() => setActiveView(item.id)} className={`w-full text-left mt-2 ${getLinkClass(item.id)}`}>
            <Icon>{item.icon}</Icon> {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto">
        <h3 className="text-xs font-bold uppercase text-gray-500 mb-3">Project Stats</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span>Total Experiments</span>
            <span className="font-bold text-white bg-slate-700 px-2 py-1 rounded-full text-xs">{stats?.total || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>In Progress</span>
            <span className="font-bold text-cyan-300">{stats?.inProgress || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Completed</span>
            <span className="font-bold text-green-400">{stats?.completed || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Planned</span>
            <span className="font-bold text-yellow-400">{stats?.planned || 0}</span>
          </div>
        </div>
        <button onClick={onLogoutClick} className={`w-full text-left mt-8 ${getLinkClass('logout')}`}>
            <Icon>🚪</Icon> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;