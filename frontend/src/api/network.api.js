import api from './api'

export const getConnections = () => api.get('/network/connections')
export const getPendingRequests = () => api.get('/network/requests')
export const getSuggestions = (limit = 10) => api.get(`/network/suggestions?limit=${limit}`)
export const getRelationStatus = (userId) => api.get(`/network/status/${userId}`)
export const sendRequest = (userId) => api.post(`/network/request/${userId}`)
export const acceptRequest = (userId) => api.post(`/network/request/${userId}/accept`)
export const declineRequest = (userId) => api.post(`/network/request/${userId}/decline`)
export const removeConnection = (userId) => api.delete(`/network/connection/${userId}`)