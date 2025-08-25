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
    <div className="border border-blue-500/30 rounded-lg backdrop-blur-md bg-slate-900/20 p-6 transition-all hover:shadow-lg hover:shadow-blue-500/20 hover:border-blue-400/50">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-white">
          <EduGlow>{title}</EduGlow>
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBookmark && onBookmark(id, !bookmarked);
          }}
          className={`p-2 rounded-full hover:bg-blue-500/20 transition-colors ${bookmarked ? 'text-blue-400' : 'text-gray-400'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
        </button>
      </div>
      
      <p className="text-blue-400 mb-4 text-sm h-12 overflow-hidden">
        {truncateDescription(desc)}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded">
          {category}
        </span>
        <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded">
          {difficulty}
        </span>
      </div>
      
      <div className="flex gap-3 mt-auto">
        <button
          onClick={() => onViewDetails && onViewDetails(experiment)}
          className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
        >
          Details
        </button>
        <button
          onClick={() => onLaunch && onLaunch(experiment)}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow hover:shadow-blue-500/50 text-sm"
        >
          Launch
        </button>
      </div>
    </div>
  );
};

export default ExperimentCard;
