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
    <div className="h-full max-h-[90vh] overflow-y-auto">
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 text-sm bg-slate-800/50 border border-slate-600/50 text-slate-300 rounded-lg hover:bg-slate-700/50 hover:border-slate-500/50 transition-all font-sans backdrop-blur-sm"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to all experiments
        </button>
      </div>
      
      <article className="backdrop-blur-lg bg-gradient-to-br from-slate-800/20 to-slate-900/30 border border-slate-600/30 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-white font-heading mb-4 lg:mb-0 lg:mr-6">
              <EduGlow>{title}</EduGlow>
            </h1>
            <button
              onClick={() => onBookmark(!bookmarked)}
              className={`self-start p-3 rounded-full hover:bg-white/10 transition-all duration-200 ${bookmarked ? 'text-yellow-400' : 'text-slate-400'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-4 py-2 bg-blue-500/20 text-blue-300 text-sm font-medium rounded-full font-sans border border-blue-400/30">
              {category}
            </span>
            <span className={`px-4 py-2 text-sm font-medium rounded-full font-sans border ${
              difficulty.toLowerCase() === 'beginner' 
                ? 'bg-green-500/20 text-green-300 border-green-400/30'
                : difficulty.toLowerCase() === 'intermediate'
                ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'
                : 'bg-red-500/20 text-red-300 border-red-400/30'
            }`}>
              {difficulty}
            </span>
            {estimatedTime && (
              <span className="px-4 py-2 bg-purple-500/20 text-purple-300 text-sm font-medium rounded-full font-sans border border-purple-400/30">
                {estimatedTime}
              </span>
            )}
          </div>
          
          <div className="mb-8">
            <p className="text-slate-300 text-base leading-relaxed font-sans">{desc}</p>
          </div>
          
          <div className="flex justify-start lg:justify-end">
            <button
              onClick={() => onLaunch(experiment)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white rounded-xl hover:from-blue-700/90 hover:to-purple-700/90 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 text-base font-medium font-sans border border-blue-500/40"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Launch Experiment
            </button>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ExperimentDetailView;
