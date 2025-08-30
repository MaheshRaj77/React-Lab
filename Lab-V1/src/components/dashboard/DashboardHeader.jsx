import React from 'react';

const DashboardHeader = ({ user }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-white">
        Welcome back, {user?.name?.split(' ')[0] || 'Developer'}!
      </h1>
      <p className="mt-2 text-gray-400">
        Here's what's happening with your projects today.
      </p>
    </div>
  );
};

export default DashboardHeader;