import React from 'react';
import { EduGlow } from '../blocks/Backgrounds/Hyperspeed';

const ExperimentCard = ({ experiment, onViewDetails, onLaunch }) => {
  // Use properties directly from the experiment object, aligning with the DB schema
  const {
    id,
    title = 'Untitled Experiment',
    category = 'Uncategorized',
    difficulty = 'Unknown',
    desc = 'No description available.',
  } = experiment || {};

  // Truncate description for card view
  const truncateDescription = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div className="backdrop-blur-lg bg-gradient-to-br from-slate-800/20 to-slate-900/30 border border-slate-600/30 rounded-2xl shadow-2xl p-6 transition-all hover:shadow-slate-400/20 hover:border-slate-500/50 hover:scale-105 duration-300">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-white font-heading mb-2">
          <EduGlow>{title}</EduGlow>
        </h3>
      </div>
      
      <p className="text-slate-300 mb-4 text-sm leading-relaxed font-sans min-h-[3rem]">
        {truncateDescription(desc)}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-5">
        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-lg font-sans border border-blue-400/30">
          {category}
        </span>
        <span className={`px-3 py-1 text-xs font-medium rounded-lg font-sans border ${
          difficulty.toLowerCase() === 'beginner' 
            ? 'bg-green-500/20 text-green-300 border-green-400/30'
            : difficulty.toLowerCase() === 'intermediate'
            ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'
            : 'bg-red-500/20 text-red-300 border-red-400/30'
        }`}>
          {difficulty}
        </span>
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={() => onViewDetails && onViewDetails(experiment)}
          className="flex-1 px-4 py-2 bg-slate-700/50 text-slate-200 rounded-lg hover:bg-slate-600/60 transition-all text-sm font-sans border border-slate-600/40"
        >
          View Details
        </button>
        <button
          onClick={() => onLaunch && onLaunch(experiment)}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white rounded-lg hover:from-blue-700/90 hover:to-purple-700/90 transition-all shadow text-sm font-sans border border-blue-500/40"
        >
          Launch
        </button>
      </div>
    </div>
  );
};

export default ExperimentCard;
