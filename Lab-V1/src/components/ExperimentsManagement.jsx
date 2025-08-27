import React, { useState, useEffect } from 'react';
import backendAPI from '../api/backend'; // Assuming this is extended for experiments CRUD

const ExperimentsManagement = () => {
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newExperiment, setNewExperiment] = useState({ title: '', category: '', difficulty: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', category: '', difficulty: '', description: '' });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchExperiments();
  }, []);

  const fetchExperiments = async () => {
    try {
      setLoading(true);
      const data = await backendAPI.getAll();
      setExperiments(data);
    } catch (err) {
      setError('Failed to fetch experiments');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (form) => {
    const errors = {};
    if (!form.title) errors.title = 'Title is required';
    if (!form.category) errors.category = 'Category is required';
    if (!form.difficulty) errors.difficulty = 'Difficulty is required';
    if (!form.description) errors.description = 'Description is required';
    return errors;
  };

  const handleCreate = async () => {
    const errors = validateForm(newExperiment);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    try {
      await backendAPI.createExperiment(newExperiment);
      setNewExperiment({ title: '', category: '', difficulty: '', description: '' });
      setFormErrors({});
      fetchExperiments();
    } catch (err) {
      setError('Failed to create experiment');
    }
  };

  const handleUpdate = async () => {
    const errors = validateForm(editForm);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    try {
      await backendAPI.updateExperiment(editingId, editForm);
      setEditingId(null);
      setEditForm({ title: '', category: '', difficulty: '', description: '' });
      setFormErrors({});
      fetchExperiments();
    } catch (err) {
      setError('Failed to update experiment');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this experiment?')) {
      try {
        await backendAPI.removeExperiment(id);
        fetchExperiments();
      } catch (err) {
        setError('Failed to delete experiment');
      }
    }
  };

  const startEditing = (exp) => {
    setEditingId(exp.id);
    setEditForm({ title: exp.title, category: exp.category, difficulty: exp.difficulty, description: exp.description });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Experiments</h2>
      {/* Create Form */}
      <div className="mb-8">
        <h3 className="text-xl mb-2">Add New Experiment</h3>
        <input
          type="text"
          placeholder="Title"
          value={newExperiment.title}
          onChange={(e) => setNewExperiment({ ...newExperiment, title: e.target.value })}
          className="block mb-2 p-2 border"
        />
        {formErrors.title && <p className="text-red-500">{formErrors.title}</p>}
        <input
          type="text"
          placeholder="Category"
          value={newExperiment.category}
          onChange={(e) => setNewExperiment({ ...newExperiment, category: e.target.value })}
          className="block mb-2 p-2 border"
        />
        {formErrors.category && <p className="text-red-500">{formErrors.category}</p>}
        <input
          type="text"
          placeholder="Difficulty"
          value={newExperiment.difficulty}
          onChange={(e) => setNewExperiment({ ...newExperiment, difficulty: e.target.value })}
          className="block mb-2 p-2 border"
        />
        {formErrors.difficulty && <p className="text-red-500">{formErrors.difficulty}</p>}
        <textarea
          placeholder="Description"
          value={newExperiment.description}
          onChange={(e) => setNewExperiment({ ...newExperiment, description: e.target.value })}
          className="block mb-2 p-2 border"
        />
        {formErrors.description && <p className="text-red-500">{formErrors.description}</p>}
        <button onClick={handleCreate} className="bg-blue-500 text-white p-2">Create</button>
      </div>

      {/* List */}
      <table className="w-full border">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Difficulty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {experiments.map((exp) => (
            <tr key={exp.id}>
              <td>{exp.title}</td>
              <td>{exp.category}</td>
              <td>{exp.difficulty}</td>
              <td>
                <button onClick={() => startEditing(exp)} className="text-blue-500 mr-2">Edit</button>
                <button onClick={() => handleDelete(exp.id)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Form */}
      {editingId && (
        <div className="mt-8">
          <h3 className="text-xl mb-2">Edit Experiment</h3>
          <input
            type="text"
            placeholder="Title"
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            className="block mb-2 p-2 border"
          />
          {formErrors.title && <p className="text-red-500">{formErrors.title}</p>}
          <input
            type="text"
            placeholder="Category"
            value={editForm.category}
            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
            className="block mb-2 p-2 border"
          />
          {formErrors.category && <p className="text-red-500">{formErrors.category}</p>}
          <input
            type="text"
            placeholder="Difficulty"
            value={editForm.difficulty}
            onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value })}
            className="block mb-2 p-2 border"
          />
          {formErrors.difficulty && <p className="text-red-500">{formErrors.difficulty}</p>}
          <textarea
            placeholder="Description"
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            className="block mb-2 p-2 border"
          />
          {formErrors.description && <p className="text-red-500">{formErrors.description}</p>}
          <button onClick={handleUpdate} className="bg-blue-500 text-white p-2">Update</button>
          <button onClick={() => setEditingId(null)} className="bg-gray-500 text-white p-2 ml-2">Cancel</button>
        </div>
      )}
    </div>
  );
};

export default ExperimentsManagement;