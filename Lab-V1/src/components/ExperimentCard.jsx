import React, { useState, useEffect } from 'react'
import unifiedAPI from '../api/unified'


const ExperimentCard = ({ 
  experiment, // Full experiment object (preferred)
  id,
  title,
  desc,
  category,
  difficulty,
  estimatedTime,
  bookmarked = false,
  onBookmark = () => {},
  onLaunch = () => {},
  onOpen = () => {},
  fetchSingle = false // flag to indicate if we should fetch this experiment individually
}) => {
  const [loading, setLoading] = useState(fetchSingle)
  const [error, setError] = useState(null)
  
  // Use experiment object if provided, otherwise use individual props
  const [experimentData, setExperimentData] = useState(
    experiment || {
      id,
      title,
      desc,
      category,
      difficulty,
      estimated_time: estimatedTime,
      bookmarked
    }
  )

  // If fetchSingle is true, we fetch this specific experiment from the database
  useEffect(() => {
    const fetchSingleExperiment = async () => {
      if (!fetchSingle || !id) return
      
      try {
        setLoading(true)
        const result = await unifiedAPI.getById(id)
        
        if (!result.success) {
          throw new Error(result.error)
        }
        
        if (result.data) {
          setExperimentData({
            ...result.data,
            bookmarked
          })
        }
      } catch (err) {
        setError(err.message)
        console.error(`Error fetching experiment ${id}:`, err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchSingleExperiment()
  }, [id, fetchSingle, bookmarked])
  // Display loading state
  if (loading) {
    return (
      <div className="border border-blue-500/30 rounded-lg p-6 backdrop-blur-md bg-slate-900/20 animate-pulse">
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
    )
  }

  // Display error state
  if (error) {
    return (
      <div className="border border-red-500/30 rounded-lg backdrop-blur-md bg-slate-900/20">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-red-400 mb-2">Error Loading Experiment</h3>
          <p className="text-gray-300 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-500/30 text-white px-4 py-2 rounded-md hover:bg-red-500/50 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Destructure experimentData for easier access
  const { 
    title: expTitle, 
    desc: expDesc, 
    category: expCategory, 
    difficulty: expDifficulty, 
    estimated_time: expTime
  } = experimentData

  // Helper functions for display
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'bg-green-500/20 text-green-300'
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-300'
      case 'advanced': return 'bg-red-500/20 text-red-300'
      default: return 'bg-purple-500/20 text-purple-300'
    }
  }

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'backgrounds': return 'bg-blue-500/20 text-blue-300'
      case 'web development': return 'bg-green-500/20 text-green-300'
      case 'text animations': return 'bg-purple-500/20 text-purple-300'
      case 'ui components': return 'bg-pink-500/20 text-pink-300'
      default: return 'bg-blue-500/20 text-blue-300'
    }
  }

  const handleLaunch = () => {
    const expData = experiment || experimentData
    if (onLaunch) {
      onLaunch(expData)
    }
  }

  const handleOpen = () => {
    const expData = experiment || experimentData
    if (onOpen) {
      onOpen(expData)
    }
  }

  // Display experiment card
  return (
    <div className="border border-blue-500/30 rounded-lg backdrop-blur-md bg-slate-900/20 hover:border-white/30 transition-all overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-white hover:text-blue-400 cursor-pointer" onClick={handleOpen}>
            {expTitle || title}
          </h3>
          {onBookmark && (
            <button
              onClick={() => onBookmark(!bookmarked)}
              className={`p-2 rounded-full hover:bg-blue-500/20 transition-colors ${bookmarked ? 'text-blue-400' : 'text-gray-400'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            </button>
          )}
        </div>
        
        <p className="text-blue-400 text-sm mb-4 line-clamp-3">{expDesc || desc}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(expCategory || category)}`}>
            {expCategory || category}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(expDifficulty || difficulty)}`}>
            {expDifficulty || difficulty}
          </span>
          {(expTime || estimatedTime) && (
            <span className="px-2 py-1 bg-gray-500/20 text-gray-300 text-xs font-medium rounded">
              {expTime || estimatedTime}
            </span>
          )}
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleLaunch}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg hover:shadow-blue-500/50"
          >
            Launch
          </button>
          {onOpen && (
            <button
              onClick={handleOpen}
              className="flex-1 bg-transparent border border-white text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all"
            >
              Details
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExperimentCard