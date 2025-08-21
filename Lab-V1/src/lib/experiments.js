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
  }
}