import React from 'react';
import { EduGlow } from '../blocks/Backgrounds/Hyperspeed';


const ExperimentDetailView = ({ experiment = {}, onBack, onBookmark, onLaunch }) => {
  // Destructure properties and provide fallbacks, aligning with the DB schema
  const {
    title = 'Untitled Experiment',
    category = 'Uncategorized',
    difficulty = 'Unknown',
    estimated_time: estimatedTime = 'Not specified',
    desc = 'No description available.',
    bookmarked = false,
  } = experiment;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={onBack}
          className="mb-4 px-4 py-2 text-sm bg-transparent border border-white text-white rounded-lg hover:bg-white/10 transition-all font-sans"
        >
          &larr; Back to all experiments
        </button>
        <article className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-semibold text-white font-heading">
              <EduGlow>{title}</EduGlow>
            </h1>
            <button
              onClick={() => onBookmark(!bookmarked)}
              className={`p-2 rounded-full hover:bg-white/10 transition-colors ${bookmarked ? 'text-primary-400' : 'text-white/50'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-primary-500/20 text-primary-300 text-xs font-medium rounded-lg font-sans border border-primary-400/30">
              {category}
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded-lg font-sans border border-purple-400/30">
              {difficulty}
            </span>
            {estimatedTime && (
              <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs font-medium rounded-lg font-sans border border-green-400/30">
                {estimatedTime}
              </span>
            )}
          </div>
          <p className="text-white/80 my-6 font-sans">{desc}</p>
          <div className="mt-6">
            <button
              onClick={() => onLaunch(experiment)}
              className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-3 rounded-lg hover:from-primary-700 hover:to-primary-600 transition-all shadow-lg hover:shadow-primary-500/50 font-sans"
            >
              Launch Experiment
            </button>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ExperimentDetailView;
