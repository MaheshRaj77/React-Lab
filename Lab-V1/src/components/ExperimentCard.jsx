import React from 'react';
import { EduGlow } from '../blocks/Backgrounds/Hyperspeed';

const ExperimentCard = ({ experiment, onViewDetails, onBookmark, onLaunch }) => {
  // Use properties directly from the experiment object, aligning with the DB schema
  const {
    id,
    title = 'Untitled Experiment',
    category = 'Uncategorized',
    difficulty = 'Unknown',
    desc = 'No description available.',
    bookmarked = false,
  } = experiment || {};

  // Truncate description for card view
  const truncateDescription = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 transition-all hover:shadow-primary-500/20 hover:border-primary-400/50 hover:scale-105 duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-white font-heading">
          <EduGlow>{title}</EduGlow>
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBookmark && onBookmark(id, !bookmarked);
          }}
          className={`p-2 rounded-full hover:bg-white/10 transition-colors ${bookmarked ? 'text-primary-400' : 'text-white/50'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
        </button>
      </div>
      
      <p className="text-white/80 mb-4 text-sm h-12 overflow-hidden font-sans">
        {truncateDescription(desc)}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 bg-primary-500/20 text-primary-300 text-xs font-medium rounded-lg font-sans border border-primary-400/30">
          {category}
        </span>
        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded-lg font-sans border border-purple-400/30">
          {difficulty}
        </span>
      </div>
      
      <div className="flex gap-3 mt-auto">
        <button
          onClick={() => onViewDetails && onViewDetails(experiment)}
          className="flex-1 px-4 py-2 bg-white/10 text-white/80 rounded-lg hover:bg-white/20 transition-all text-sm font-sans border border-white/20"
        >
          Details
        </button>
        <button
          onClick={() => onLaunch && onLaunch(experiment)}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg hover:from-primary-700 hover:to-primary-600 transition-all shadow hover:shadow-primary-500/50 text-sm font-sans"
        >
          Launch
        </button>
      </div>
    </div>
  );
};

export default ExperimentCard;
