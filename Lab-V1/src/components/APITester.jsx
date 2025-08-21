import React, { useState } from 'react';
import unifiedAPI from '../api/unified';

const APITester = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async (apiMethod, ...args) => {
    setLoading(true);
    try {
      const response = await unifiedAPI[apiMethod](...args);
      setResult({
        method: apiMethod,
        args,
        response,
        timestamp: new Date().toISOString(),
        provider: unifiedAPI.getProviderInfo().current
      });
    } catch (error) {
      setResult({
        method: apiMethod,
        args,
        error: error.message,
        timestamp: new Date().toISOString(),
        provider: unifiedAPI.getProviderInfo().current
      });
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-slate-900 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Experiments API Tester</h2>
        <div className="text-sm text-gray-400">
          Using: <span className="text-blue-400">{unifiedAPI.getProviderInfo().current}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => testAPI('getAll')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          disabled={loading}
        >
          Get All
        </button>
        
        <button
          onClick={() => testAPI('seedDatabase')}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          disabled={loading}
        >
          Seed Database
        </button>
        
        <button
          onClick={() => testAPI('getByCategory', 'Backgrounds')}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
          disabled={loading}
        >
          Get Backgrounds
        </button>
        
        <button
          onClick={() => testAPI('getByDifficulty', 'Advanced')}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          disabled={loading}
        >
          Get Advanced
        </button>
        
        <button
          onClick={() => testAPI('search', 'React')}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg"
          disabled={loading}
        >
          Search "React"
        </button>
        
        <button
          onClick={() => testAPI('healthCheck')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
          disabled={loading}
        >
          Health Check
        </button>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
          <p className="text-gray-400 mt-2">Testing API...</p>
        </div>
      )}

      {result && (
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">
            {result.method}({result.args.map(arg => JSON.stringify(arg)).join(', ')})
          </h3>
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs text-gray-400">{result.timestamp}</p>
            <span className="text-xs text-blue-400">{result.provider}</span>
          </div>
          <pre className="text-sm text-gray-300 overflow-auto max-h-96">
            {JSON.stringify(result.response || result.error, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default APITester;
