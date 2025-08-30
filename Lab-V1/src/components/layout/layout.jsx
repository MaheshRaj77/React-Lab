import React from 'react';
import Sidebar from './sidebar';

const Layout = ({ children, developer, stats, activeView, setActiveView, onLogoutClick }) => {
  return (
    <div className="flex h-screen bg-slate-950 text-white">
      <Sidebar
        developer={developer}
        stats={stats}
        activeView={activeView}
        setActiveView={setActiveView}
        onLogoutClick={onLogoutClick}
      />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;