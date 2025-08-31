import React from 'react';
import Spinner from '../../components/shared/Spinner';

const LabView = ({
  labs,
  labFiles = [],
  loading,
  onCreateLab,
  onEditLab,
  onDeleteLab,
  labError,
  labSuccessMessage,
  onClearLabError,
  onClearLabSuccess,
  onUploadFile
}) => {
  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white font-heading">Labs</h1>
            <p className="mt-2 text-neutral-400">
              Manage your lab experiments and projects
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onUploadFile}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 font-sans"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span>Upload File</span>
            </button>
            <button
              onClick={onCreateLab}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 font-sans"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Create Lab</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lab Error Message Display */}
      {labError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-red-400 font-medium">Error</h3>
                <p className="text-red-300 text-sm mt-1">{labError}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={onClearLabError}
                className="text-red-400 hover:text-red-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lab Success Message Display */}
      {labSuccessMessage && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-green-400 font-medium">Success</h3>
                <p className="text-green-300 text-sm mt-1">{labSuccessMessage}</p>
              </div>
            </div>
            <button
              onClick={onClearLabSuccess}
              className="text-green-400 hover:text-green-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Labs Table */}
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/20">
          <h2 className="text-xl font-semibold text-white font-heading">Labs ({labs.length})</h2>
        </div>

        {loading ? (
          <div className="p-8">
            <Spinner />
          </div>
        ) : labs.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-neutral-400">No labs found. Create your first lab to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Difficulty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Files</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {labs.map((lab, index) => (
                  <tr key={lab.id || index} className="hover:bg-slate-700/30">
                    <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{lab.name}</td>
                    <td className="px-6 py-4 text-neutral-300 max-w-xs truncate" title={lab.description}>
                      {lab.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-500/20 text-primary-300">
                        {lab.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        lab.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-300' :
                        lab.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                        lab.difficulty === 'Advanced' ? 'bg-orange-500/20 text-orange-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {lab.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(() => {
                        const labFilesForLab = labFiles.filter(file => file.lab_id === lab.id);
                        if (labFilesForLab.length === 0) {
                          return <span className="text-neutral-500">No files</span>;
                        }
                        return (
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-blue-400 text-sm">{labFilesForLab.length} file{labFilesForLab.length !== 1 ? 's' : ''}</span>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-neutral-400">
                      {lab.created_at ? new Date(lab.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onEditLab(lab)}
                          className="text-primary-400 hover:text-primary-300 transition-colors"
                          title="Edit Lab"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onDeleteLab(lab)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Delete Lab"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabView;
