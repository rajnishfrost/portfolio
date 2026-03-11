import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

// Request interceptor to add JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ==================== Public API ====================

export const getProfile = () => api.get('/profile')
export const getProjects = (category) => {
  const params = category && category !== 'All' ? { category } : {}
  return api.get('/projects', { params })
}
export const getBlogs = () => api.get('/blogs')
export const getSkills = (admin = false) => api.get('/skills', { params: admin ? { admin: 'true' } : {} })
export const getCategories = () => api.get('/categories')
export const getExperience = () => api.get('/experience')
export const getEducation = () => api.get('/education')
export const getAchievements = () => api.get('/achievements')

// Contact
export const submitContact = (data) => api.post('/contact', data)

// ==================== Auth ====================

export const login = (data) => api.post('/auth/login', data)
export const register = (data) => api.post('/auth/register', data)
export const getMe = () => api.get('/auth/me')

// ==================== Admin CRUD ====================

// Projects
export const createProject = (data) => api.post('/projects', data)
export const updateProject = (id, data) => api.put(`/projects/${id}`, data)
export const deleteProject = (id) => api.delete(`/projects/${id}`)

// Blogs
export const createBlog = (data) => api.post('/blogs', data)
export const updateBlog = (id, data) => api.put(`/blogs/${id}`, data)
export const deleteBlog = (id) => api.delete(`/blogs/${id}`)

// Skills
export const createSkill = (data) => api.post('/skills', data)
export const updateSkill = (id, data) => api.put(`/skills/${id}`, data)
export const deleteSkill = (id) => api.delete(`/skills/${id}`)
export const reorderSkills = (orderedIds) => api.put('/skills/reorder', { orderedIds })

// Categories
export const createCategory = (data) => api.post('/categories', data)
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data)
export const toggleCategory = (id) => api.put(`/categories/${id}/toggle`)
export const deleteCategory = (id) => api.delete(`/categories/${id}`)
export const reorderCategories = (orderedIds) => api.put('/categories/reorder', { orderedIds })

// Experience
export const createExperience = (data) => api.post('/experience', data)
export const updateExperience = (id, data) => api.put(`/experience/${id}`, data)
export const deleteExperience = (id) => api.delete(`/experience/${id}`)

// Education
export const createEducation = (data) => api.post('/education', data)
export const updateEducation = (id, data) => api.put(`/education/${id}`, data)
export const deleteEducation = (id) => api.delete(`/education/${id}`)

// Achievements
export const createAchievement = (data) => api.post('/achievements', data)
export const updateAchievement = (id, data) => api.put(`/achievements/${id}`, data)
export const deleteAchievement = (id) => api.delete(`/achievements/${id}`)

// Profile
export const updateProfile = (data) => api.put('/profile', data)

// Messages
export const getMessages = () => api.get('/contact')
export const deleteMessage = (id) => api.delete(`/contact/${id}`)
export const markMessageRead = (id) => api.put(`/contact/${id}/read`)

// Upload
export const uploadImage = (file) => {
  const formData = new FormData()
  formData.append('image', file)
  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export default api
