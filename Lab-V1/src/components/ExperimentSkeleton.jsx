import React from 'react';

const ExperimentSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {Array(count).fill().map((_, i) => (
      <div key={i} className="border border-blue-500/30 rounded-lg p-6 backdrop-blur-md bg-slate-900/20 animate-pulse">
        <div className="h-5 bg-blue-200/20 rounded w-3/4 mb-4"></div>
        <div className="h-3 bg-blue-200/20 rounded mb-3"></div>
        <div className="h-3 bg-blue-200/20 rounded w-5/6 mb-4"></div>
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-6 bg-blue-200/20 rounded w-16"></div>
          <div className="h-6 bg-blue-200/20 rounded w-16"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 bg-blue-200/20 rounded flex-1"></div>
          <div className="h-10 bg-blue-200/20 rounded flex-1"></div>
        </div>
      </div>
    ))}
  </div>
);

export default ExperimentSkeleton;
