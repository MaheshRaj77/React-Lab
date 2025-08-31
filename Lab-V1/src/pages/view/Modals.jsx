import React, { useState } from 'react';

// Create Experiment Modal Component
export const CreateExperimentModal = ({ onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    category: '',
    difficulty: 'Beginner',
    estimated_time: '',
    path: ''
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
          <h2 className="text-xl font-semibold text-white">Create New Experiment</h2>
          <p className="text-gray-400 text-sm mt-1">Fill in the details for your new experiment</p>
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
              <span>Create Experiment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Create Lab Modal Component
export const CreateLabModal = ({ lab, onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: lab?.name || '',
    description: lab?.description || '',
    category: lab?.category || '',
    difficulty: lab?.difficulty || 'Beginner',
    tags: lab?.tags || ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadType, setUploadType] = useState('files'); // 'files' or 'folder'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // First create the lab
      const labData = {
        ...formData,
        user_id: 'dev-001' // This should come from the authenticated user
      };

      const result = await onSave(labData, selectedFiles);
      // Files will be uploaded after lab creation if provided
    } catch (err) {
      setError('Failed to create lab. Please try again.');
      console.error('Lab creation error:', err);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const errors = [];

    files.forEach(file => {
      // Validate file size (max 10MB per file)
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`${file.name}: File size must be less than 10MB`);
        return;
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'text/csv',
        'application/zip',
        'application/x-zip-compressed',
        'image/jpeg',
        'image/png',
        'image/gif',
        'text/html',
        'application/javascript',
        'text/css',
        'application/json'
      ];

      // Allow files without extension or with common extensions
      const hasValidType = allowedTypes.includes(file.type) ||
                          file.name.match(/\.(html|js|css|json|md|txt|py|java|c|cpp|h|php|rb|go|rs|ts|jsx|tsx|vue|svelte)$/i) ||
                          !file.type; // Allow files without MIME type

      if (!hasValidType) {
        errors.push(`${file.name}: File type not supported`);
        return;
      }

      // Add relative path for folder uploads
      const fileWithPath = {
        ...file,
        relativePath: uploadType === 'folder' ? file.webkitRelativePath || file.name : file.name,
        displayPath: uploadType === 'folder' ? file.webkitRelativePath || file.name : file.name
      };

      validFiles.push(fileWithPath);
    });

    if (errors.length > 0) {
      setError(errors.join('\n'));
    } else {
      setError(null);
    }

    setSelectedFiles(validFiles);
  };

  const handleFolderSelect = (e) => {
    setUploadType('folder');
    handleFileSelect(e);
  };

  const handleFilesSelect = (e) => {
    setUploadType('files');
    handleFileSelect(e);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
    'DevOps',
    'AI/ML',
    'Blockchain',
    'IoT',
    'Game Development'
  ];

  const difficulties = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/20">
          <h2 className="text-xl font-semibold text-white">
            {lab ? 'Edit Lab' : 'Create New Lab'}
          </h2>
          <p className="text-white/70 text-sm mt-1">
            {lab ? 'Update lab information' : 'Add a new lab experiment to your collection'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm whitespace-pre-line">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Lab Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="Enter lab name"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent resize-vertical"
                placeholder="Enter detailed description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Difficulty *
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Lab Files & Folders
              </label>
              <div className="space-y-4">
                {/* Upload Type Selection */}
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="uploadType"
                      value="files"
                      checked={uploadType === 'files'}
                      onChange={() => setUploadType('files')}
                      className="mr-2"
                    />
                    <span className="text-neutral-300 text-sm">Upload Files</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="uploadType"
                      value="folder"
                      checked={uploadType === 'folder'}
                      onChange={() => setUploadType('folder')}
                      className="mr-2"
                    />
                    <span className="text-neutral-300 text-sm">Upload Folder</span>
                  </label>
                </div>

                {/* File/Folder Upload Area */}
                <div className="relative">
                  <input
                    type="file"
                    multiple={uploadType === 'files'}
                    webkitdirectory={uploadType === 'folder' ? "" : undefined}
                    onChange={uploadType === 'folder' ? handleFolderSelect : handleFilesSelect}
                    className="hidden"
                    id="lab-files-upload"
                    accept={uploadType === 'files' ? ".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.zip,.jpg,.jpeg,.png,.gif,.html,.js,.css,.json,.md,.py,.java,.c,.cpp,.h,.php,.rb,.go,.rs,.ts,.jsx,.tsx,.vue,.svelte" : undefined}
                  />
                  <label
                    htmlFor="lab-files-upload"
                    className="flex items-center justify-center w-full h-24 border-2 border-dashed border-neutral-600 rounded-lg cursor-pointer hover:border-primary-500 transition-colors bg-white/5"
                  >
                    <div className="text-center">
                      <svg className="mx-auto h-8 w-8 text-neutral-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {uploadType === 'folder' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        )}
                      </svg>
                      <p className="text-neutral-300 text-sm">
                        {uploadType === 'folder' ? 'Click to select a folder' : 'Click to select files'}
                      </p>
                      <p className="text-neutral-500 text-xs mt-1">
                        {uploadType === 'folder'
                          ? 'Upload entire folder with subdirectories'
                          : 'PDF, Word, Excel, Text, Images, Code files (max 10MB each)'
                        }
                      </p>
                    </div>
                  </label>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-neutral-300">
                        {uploadType === 'folder' ? 'Folder contents' : 'Selected files'} ({selectedFiles.length}):
                      </p>
                      <button
                        type="button"
                        onClick={() => setSelectedFiles([])}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg">
                          <div className="flex items-center flex-1 min-w-0">
                            <svg className="w-4 h-4 text-primary-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {file.displayPath.includes('/') ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              )}
                            </svg>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm font-medium truncate" title={file.displayPath}>
                                {file.displayPath}
                              </p>
                              <p className="text-neutral-400 text-xs">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-400 hover:text-red-300 p-1 ml-2 flex-shrink-0"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <p className="text-neutral-400 text-xs mt-1">
                Optional: Upload files or an entire folder with your lab materials
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="e.g., react, javascript, api"
              />
              <p className="text-neutral-400 text-xs mt-1">
                Optional: Comma-separated tags for better organization
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-white/20">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 text-neutral-400 hover:text-neutral-200 transition-colors font-sans"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-sans"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              )}
              <span>{lab ? 'Update' : 'Create'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Lab File Upload Modal Component
export const LabFileUploadModal = ({ labId, onSave, onCancel, loading }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'text/csv',
        'application/zip',
        'application/x-zip-compressed',
        'image/jpeg',
        'image/png',
        'image/gif'
      ];

      if (!allowedTypes.includes(file.type)) {
        setError('File type not supported. Please upload PDF, Word, Excel, text, CSV, ZIP, or image files.');
        return;
      }

      setSelectedFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setError(null);

      // For now, we'll simulate file upload to Supabase Storage
      // In a real implementation, you'd upload the file to Supabase Storage first
      // and then save the file metadata to the lab_files table

      const fileData = {
        lab_id: labId,
        file_name: selectedFile.name,
        file_path: `/labs/${labId}/${selectedFile.name}`, // This would be the actual storage path
        file_type: selectedFile.type,
        file_size: selectedFile.size
      };

      await onSave(fileData);
    } catch (err) {
      setError('Failed to upload file. Please try again.');
      console.error('File upload error:', err);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">Upload Lab File</h2>
          <p className="text-gray-400 text-sm mt-1">Select a file to upload to this lab</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select File
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.zip,.jpg,.jpeg,.png,.gif"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-primary-500 transition-colors"
              >
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-300">Click to select a file</p>
                  <p className="text-gray-500 text-sm mt-1">PDF, Word, Excel, Text, CSV, ZIP, Images (max 10MB)</p>
                </div>
              </label>
            </div>
          </div>

          {selectedFile && (
            <div className="mb-4 p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-8 h-8 text-primary-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <p className="text-white font-medium text-sm">{selectedFile.name}</p>
                    <p className="text-gray-400 text-xs">{formatFileSize(selectedFile.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-400 hover:text-red-400"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile || loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload File
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
