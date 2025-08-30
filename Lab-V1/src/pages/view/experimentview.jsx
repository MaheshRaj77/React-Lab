import React, { useState, useMemo } from 'react';
import ExperimentsTable from '../../components/dashboard/experimentstable';

const ExperimentsView = ({ experiments, onCreate, onEdit, onDelete, loading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedExperiments, setSelectedExperiments] = useState([]);

  // Get unique categories and difficulties for filters
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(experiments.map(exp => exp.category))];
    return uniqueCategories.filter(Boolean);
  }, [experiments]);

  const difficulties = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  // Filter and sort experiments
  const filteredExperiments = useMemo(() => {
    let filtered = experiments.filter(exp => {
      const matchesSearch = !searchQuery ||
        exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.desc.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = !selectedCategory || exp.category === selectedCategory;
      const matchesDifficulty = !selectedDifficulty || exp.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    // Sort experiments
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'created_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [experiments, searchQuery, selectedCategory, selectedDifficulty, sortBy, sortOrder]);

  // Handle bulk selection
  const handleSelectExperiment = (expId) => {
    setSelectedExperiments(prev =>
      prev.includes(expId)
        ? prev.filter(id => id !== expId)
        : [...prev, expId]
    );
  };

  const handleSelectAll = () => {
    if (selectedExperiments.length === filteredExperiments.length) {
      setSelectedExperiments([]);
    } else {
      setSelectedExperiments(filteredExperiments.map(exp => exp.id));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (!selectedExperiments.length) return;

    const confirmMessage = `Delete ${selectedExperiments.length} experiment${selectedExperiments.length > 1 ? 's' : ''}?`;
    if (!window.confirm(confirmMessage)) return;

    try {
      for (const expId of selectedExperiments) {
        await onDelete({ id: expId });
      }
      setSelectedExperiments([]);
      alert('Selected experiments deleted successfully!');
    } catch (error) {
      alert('Failed to delete some experiments. Please try again.');
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedDifficulty('');
    setSortBy('created_at');
    setSortOrder('desc');
  };

  // Experiment templates
  const experimentTemplates = [
    {
      title: 'Web Development Fundamentals',
      desc: 'Learn HTML, CSS, and JavaScript basics through hands-on projects',
      category: 'Web Technology',
      difficulty: 'Beginner',
      estimated_time: '4-6 hours',
      path: '/experiments/web-fundamentals'
    },
    {
      title: 'React Component Library',
      desc: 'Build reusable React components with TypeScript',
      category: 'Web Technology',
      difficulty: 'Intermediate',
      estimated_time: '6-8 hours',
      path: '/experiments/react-components'
    },
    {
      title: 'Database Design Project',
      desc: 'Design and implement a relational database schema',
      category: 'Database Systems',
      difficulty: 'Intermediate',
      estimated_time: '5-7 hours',
      path: '/experiments/database-design'
    },
    {
      title: 'API Development with Node.js',
      desc: 'Create RESTful APIs using Express.js and MongoDB',
      category: 'Web Technology',
      difficulty: 'Advanced',
      estimated_time: '8-10 hours',
      path: '/experiments/nodejs-api'
    }
  ];

  // Handle template selection
  const handleCreateFromTemplate = (template) => {
    // Pre-fill the create modal with template data
    onCreate(template);
  };

  // Export experiments to JSON
  const handleExportExperiments = () => {
    const dataStr = JSON.stringify(filteredExperiments, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `experiments-export-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Import experiments from JSON
  const handleImportExperiments = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedExperiments = JSON.parse(e.target.result);
          // Here you would typically send these to the backend
          console.log('Imported experiments:', importedExperiments);
          alert('Import functionality would be implemented here');
        } catch (error) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">My Experiments</h1>
          <p className="mt-2 text-gray-400">
            Manage and organize your experiments. Create, edit, and track your projects.
          </p>
        </div>
        <div className="flex space-x-3">
          {selectedExperiments.length > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <span>🗑️</span>
              <span>Delete ({selectedExperiments.length})</span>
            </button>
          )}
          <div className="flex space-x-2">
            <button
              onClick={handleExportExperiments}
              disabled={loading || experiments.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <span>📤</span>
              <span>Export</span>
            </button>
            <label className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer flex items-center space-x-2">
              <span>📥</span>
              <span>Import</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportExperiments}
                className="hidden"
              />
            </label>
            <button
              onClick={onCreate}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <span>+</span>
              <span>New Experiment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search Experiments
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or description..."
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Levels</option>
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sort By
            </label>
            <select
              value={`${sortBy}_${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('_');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="created_at_desc">Newest First</option>
              <option value="created_at_asc">Oldest First</option>
              <option value="title_asc">Title A-Z</option>
              <option value="title_desc">Title Z-A</option>
              <option value="category_asc">Category A-Z</option>
              <option value="difficulty_asc">Difficulty ↑</option>
            </select>
          </div>
        </div>

        {/* Filter Actions */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-400">
            Showing {filteredExperiments.length} of {experiments.length} experiments
          </div>
          <div className="flex space-x-2">
            <button
              onClick={clearFilters}
              className="px-3 py-1 text-gray-400 hover:text-gray-200 text-sm border border-slate-600 rounded hover:border-slate-500 transition-colors"
            >
              Clear Filters
            </button>
            {filteredExperiments.length > 0 && (
              <button
                onClick={handleSelectAll}
                className="px-3 py-1 text-blue-400 hover:text-blue-300 text-sm border border-slate-600 rounded hover:border-slate-500 transition-colors"
              >
                {selectedExperiments.length === filteredExperiments.length ? 'Deselect All' : 'Select All'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Experiment Templates */}
      <div className="mb-6 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Start Templates</h3>
        <p className="text-gray-400 text-sm mb-4">
          Jumpstart your experiments with pre-built templates
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {experimentTemplates.map((template, index) => (
            <div
              key={index}
              className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 hover:bg-slate-600/50 transition-colors cursor-pointer"
              onClick={() => handleCreateFromTemplate(template)}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-white font-medium text-sm">{template.title}</h4>
                <span className={`text-xs px-2 py-1 rounded ${
                  template.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-300' :
                  template.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                  template.difficulty === 'Advanced' ? 'bg-orange-500/20 text-orange-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  {template.difficulty}
                </span>
              </div>
              <p className="text-gray-400 text-xs mb-3 line-clamp-2">{template.desc}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{template.category}</span>
                <span>{template.estimated_time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ExperimentsTable
        experiments={filteredExperiments}
        onEdit={onEdit}
        onDelete={onDelete}
        loading={loading}
        selectedExperiments={selectedExperiments}
        onSelectExperiment={handleSelectExperiment}
        onSelectAll={handleSelectAll}
      />
    </div>
  );
};

export default ExperimentsView;