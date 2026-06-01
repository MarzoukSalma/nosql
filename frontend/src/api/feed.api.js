// src/api/feed.api.js
import api from './api'

export const getFeed = (page = 0) => api.get(`/feed?page=${page}`)

export const createPost = (formData) => api.post('/feed', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})

export const deletePost = (postId) => api.delete(`/feed/${postId}`)
export const toggleLike = (postId) => api.post(`/feed/${postId}/like`)
export const getComments = (postId) => api.get(`/feed/${postId}/comments`)
export const addComment = (postId, contenu) => api.post(`/feed/${postId}/comments`, { contenu })