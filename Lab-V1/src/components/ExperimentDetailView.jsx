import React from 'react';
import { EduGlow } from '../blocks/Backgrounds/Hyperspeed';

const ExperimentDetailView = ({ experiment, onBack, onBookmark, onLaunch }) => (
  <div className="min-h-screen p-4 md:p-8">
    <div className="max-w-7xl mx-auto">
      <button 
        onClick={onBack}
        className="mb-4 px-4 py-2 text-sm bg-transparent border border-white text-white rounded-lg hover:bg-white/10 transition-all"
      >
        &larr; Back to all experiments
      </button>
      
      <article className="border border-blue-500/30 rounded-lg backdrop-blur-md bg-slate-900/20 p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-semibold text-white">
            <EduGlow>{experiment.title}</EduGlow>
          </h1>
          <button
            onClick={() => onBookmark(!experiment.bookmarked)}
            className={`p-2 rounded-full hover:bg-blue-500/20 transition-colors ${experiment.bookmarked ? 'text-blue-400' : 'text-gray-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded">
            {experiment.category}
          </span>
          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded">
            {experiment.difficulty}
          </span>
          {experiment.estimatedTime && (
            <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs font-medium rounded">
              {experiment.estimatedTime}
            </span>
          )}
        </div>
        
        <p className="text-blue-400 my-6">{experiment.desc}</p>
        
        <div className="mt-6">
          <button
            onClick={() => onLaunch(experiment.id)}
            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg hover:shadow-blue-500/50"
          >
            Launch Experiment
          </button>
        </div>
      </article>
    </div>
  </div>
);

export default ExperimentDetailView;
