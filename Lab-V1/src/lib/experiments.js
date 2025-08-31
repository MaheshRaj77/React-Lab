import { supabase } from './supabase'

export const experimentsAPI = {
  // Get all experiments
  async getAll() {
    const { data, error } = await supabase
      .from('experiments')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get experiment by ID
  async getById(id) {
    const { data, error } = await supabase
      .from('experiments')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Create new experiment
  async create(experiment) {
    const { data, error } = await supabase
      .from('experiments')
      .insert([experiment])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update experiment
  async update(id, updates) {
    const { data, error } = await supabase
      .from('experiments')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete experiment
  async delete(id) {
    const { error } = await supabase
      .from('experiments')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  // Filter by category
  async getByCategory(category) {
    const { data, error } = await supabase
      .from('experiments')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // File upload related functions
  async uploadFile(experimentId, file, metadata = {}) {
    const formData = new FormData()
    formData.append('file', file)
    if (experimentId) formData.append('experiment_id', experimentId)
    if (metadata.description) formData.append('description', metadata.description)
    if (metadata.tags) formData.append('tags', metadata.tags)
    if (metadata.isPublic !== undefined) formData.append('is_public', metadata.isPublic.toString())

    const response = await fetch('/api/experiment-files/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Upload failed')
    }

    return await response.json()
  },

  async getExperimentFiles(experimentId) {
    const response = await fetch(`/api/experiment-files/experiment/${experimentId}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch files')
    }

    const data = await response.json()
    return data.data || []
  },

  async downloadFile(fileId) {
    const response = await fetch(`/api/experiment-files/${fileId}/download`)
    
    if (!response.ok) {
      throw new Error('Download failed')
    }

    return response.blob()
  },

  async deleteFile(fileId) {
    const response = await fetch(`/api/experiment-files/${fileId}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Delete failed')
    }

    return await response.json()
  }
}