import React, { useState, useMemo } from 'react';
import { showSuccess } from '../shared/NotificationManager';

// Edit Experiment Modal Component
const EditExperimentModal = ({ experiment, onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    title: experiment.title || '',
    desc: experiment.desc || '',
    category: experiment.category || '',
    difficulty: experiment.difficulty || 'Beginner',
    estimated_time: experiment.estimated_time || '',
    path: experiment.path || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const categories = [
    'Web Technology',
    'Computer Networks',
    'Data Structures',
    'Algorithms',
    'Database Systems',
    'Operating Systems',
    'Software Engineering',
    'Machine Learning',
    'Cybersecurity',
    'Mobile Development',
    'Cloud Computing',
    'DevOps'
  ];

  const difficulties = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">Edit Experiment</h2>
          <p className="text-gray-400 text-sm mt-1">Update all experiment details below</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter experiment title"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="desc"
                value={formData.desc}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                placeholder="Enter detailed description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Difficulty *
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estimated Time
              </label>
              <input
                type="text"
                name="estimated_time"
                value={formData.estimated_time}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 2-3 hours"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Path
              </label>
              <input
                type="text"
                name="path"
                value={formData.path}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., /experiments/exp-1/index.html"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-700">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              )}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ExperimentsTable = ({
  experiments,
  onEdit,
  onDelete,
  loading,
  selectedExperiments = [],
  onSelectExperiment,
  onSelectAll
}) => {
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'descending' });
  const [editingExperiment, setEditingExperiment] = useState(null);

  // Map data to expected format and add default values for missing fields
  const processedExperiments = experiments.map(exp => ({
    ...exp,
    updatedAt: exp.created_at,
    technologies: [exp.category] // Use category as technology
  }));

  // useMemo will sort the data only when the experiments or sort config change
  const sortedExperiments = useMemo(() => {
    let sortableItems = [...processedExperiments];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [processedExperiments, sortConfig]);

  // Function to handle header clicks for sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Function to handle edit
  const handleEdit = (experiment) => {
    setEditingExperiment(experiment);
  };

  // Function to handle save edit
  const handleSaveEdit = async (formData) => {
    if (onEdit) {
      await onEdit(editingExperiment, formData);
      showSuccess('Experiment updated successfully!');
      setEditingExperiment(null);
    }
  };

  // Function to handle cancel edit
  const handleCancelEdit = () => {
    setEditingExperiment(null);
  };

  // Helper to get the sorting arrow icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕';
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  return (
    <>
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-sm text-gray-400 border-b-2 border-slate-700">
              <tr>
                {onSelectExperiment && (
                  <th className="p-4 w-12">
                    <input
                      type="checkbox"
                      checked={selectedExperiments.length === experiments.length && experiments.length > 0}
                      onChange={() => {
                        if (onSelectAll) {
                          onSelectAll();
                        } else {
                          const allSelected = selectedExperiments.length === experiments.length;
                          if (allSelected) {
                            // Deselect all - pass empty array or call deselect for each
                            experiments.forEach(exp => {
                              if (selectedExperiments.includes(exp.id)) {
                                onSelectExperiment(exp.id);
                              }
                            });
                          } else {
                            // Select all - call select for each unselected experiment
                            experiments.forEach(exp => {
                              if (!selectedExperiments.includes(exp.id)) {
                                onSelectExperiment(exp.id);
                              }
                            });
                          }
                        }
                      }}
                      className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </th>
                )}
                <th className="p-4 cursor-pointer" onClick={() => requestSort('title')}>
                  Experiment Title {getSortIcon('title')}
                </th>
                <th className="p-4 cursor-pointer" onClick={() => requestSort('updatedAt')}>
                  Last Updated {getSortIcon('updatedAt')}
                </th>
                <th className="p-4">Technologies</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedExperiments.length === 0 ? (
                <tr>
                  <td colSpan={onSelectExperiment ? 5 : 4} className="p-8 text-center text-gray-400">
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-4xl">🔬</span>
                      <p className="text-lg font-medium">No experiments found</p>
                      <p className="text-sm">Create your first experiment to get started!</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedExperiments.map((exp) => (
                  <tr key={exp.id} className="border-b border-slate-800 hover:bg-slate-700/30 transition-colors">
                    {onSelectExperiment && (
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedExperiments.includes(exp.id)}
                          onChange={() => onSelectExperiment(exp.id)}
                          className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                        />
                      </td>
                    )}
                    <td className="p-4 font-medium text-white">{exp.title}</td>
                    <td className="p-4 text-sm text-gray-400">{new Date(exp.updatedAt).toLocaleDateString()}</td>
                    <td className="p-4 flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <span key={tech} className="bg-slate-600 text-gray-300 text-xs px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(exp)}
                          disabled={loading}
                          className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs hover:bg-yellow-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete && onDelete(exp)}
                          disabled={loading}
                          className="px-3 py-1 bg-red-500/20 text-red-300 rounded text-xs hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingExperiment && (
        <EditExperimentModal
          experiment={editingExperiment}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
          loading={loading}
        />
      )}
    </>
  );
};

export default ExperimentsTable;