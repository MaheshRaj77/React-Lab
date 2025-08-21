import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function SupabaseStatus() {
  const [status, setStatus] = useState('checking')
  const [error, setError] = useState(null)

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('experiments')
        .select('count', { count: 'exact' })
        .limit(1)

      if (error) {
        setStatus('error')
        setError(error.message)
      } else {
        setStatus('connected')
        setError(null)
      }
    } catch (err) {
      setStatus('error')
      setError(err.message)
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'text-green-400'
      case 'error': return 'text-red-400'
      default: return 'text-yellow-400'
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'connected': return '🟢 Connected'
      case 'error': return '🔴 Error'
      default: return '🟡 Checking...'
    }
  }

  return (
    <div className="inline-flex items-center space-x-2">
      <span className={`font-mono text-sm ${getStatusColor()}`}>
        {getStatusText()}
      </span>
      {error && (
        <span className="text-red-300 text-xs">
          ({error})
        </span>
      )}
    </div>
  )
}