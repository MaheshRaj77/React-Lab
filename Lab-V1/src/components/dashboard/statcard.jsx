import React from 'react';

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-xl shadow-lg flex items-center space-x-4">
      <div className="flex-shrink-0 w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-xl">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-400 font-medium">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;