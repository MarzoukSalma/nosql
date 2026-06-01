import api from './api'

export const getResources = (params = {}) => api.get('/resources', { params })
export const getResourceById = (id) => api.get(`/resources/${id}`)
export const createResource = (formData) => api.post('/resources', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
export const deleteResource = (id) => api.delete(`/resources/${id}`)
export const toggleSave = (id) => api.post(`/resources/${id}/save`)
export const incrementDownload = (id) => api.post(`/resources/${id}/download`)
export const getSavedResources = () => api.get('/resources/saved')
export const requestResource = (data) => api.post('/resources/request', data)