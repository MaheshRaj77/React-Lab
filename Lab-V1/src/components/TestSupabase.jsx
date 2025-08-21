import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function TestSupabase() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const testConnection = async () => {
    setLoading(true)
    setError(null)
    try {
      // Test reading data from experiments table
      const { data: experiments, error } = await supabase
        .from('experiments')
        .select('*')
        .limit(5)

      if (error) {
        setError(error.message)
        console.error('Supabase Error:', error)
      } else {
        setData(experiments)
        console.log('Connection successful! Data:', experiments)
      }
    } catch (err) {
      setError(err.message)
      console.error('Connection Error:', err)
    }
    setLoading(false)
  }

  const addSampleExperiment = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: newExperiment, error } = await supabase
        .from('experiments')
        .insert([
          {
            title: 'Sample Experiment',
            desc: 'This is a test experiment to verify database connection',
            category: 'UI/UX',
            difficulty: 'Beginner',
            estimated_time: '30 minutes',
            path: '/experiments/sample'
          }
        ])
        .select()

      if (error) {
        setError(error.message)
      } else {
        console.log('Experiment added:', newExperiment)
        // Refresh the data
        testConnection()
      }
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Supabase Connection Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testConnection} 
          disabled={loading}
          style={{ 
            marginRight: '10px', 
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Testing...' : 'Fetch Experiments'}
        </button>
        
        <button 
          onClick={addSampleExperiment} 
          disabled={loading}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Adding...' : 'Add Sample Experiment'}
        </button>
      </div>

      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#ffebee', 
          color: '#c62828',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {data && (
        <div>
          <h3>Experiments Data ({data.length} records):</h3>
          <pre style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '15px', 
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      {data && data.length === 0 && (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#e3f2fd', 
          borderRadius: '4px'
        }}>
          <p>No experiments found. Try adding a sample experiment!</p>
        </div>
      )}
    </div>
  )
}