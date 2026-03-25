import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaTimes, FaGithub, FaExternalLinkAlt, FaGripVertical } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { getProjects, createProject, updateProject, deleteProject, reorderProjects, uploadImage } from '../services/api'
import ImageCropper from '../components/ImageCropper'

const emptyForm = {
  title: '', description: '', category: 'Personal', techStack: '',
  githubUrl: '', liveUrl: '', image: '', featured: false,
}

export default function ManageProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [cropImage, setCropImage] = useState(null)
  const [imageUploading, setImageUploading] = useState(false)

  // Drag state
  const dragItem = useRef(null)
  const dragOverItem = useRef(null)

  const fetchData = async () => {
    try {
      const res = await getProjects()
      setProjects(res.data || [])
    } catch (err) {
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  const openEdit = (project) => {
    setEditing(project._id)
    setForm({
      title: project.title || '',
      description: project.description || '',
      category: project.category || 'Personal',
      techStack: (project.techStack || []).join(', '),
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      image: project.image || '',
      featured: project.featured || false,
    })
    setShowModal(true)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setCropImage(reader.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleCropDone = async (croppedFile) => {
    setCropImage(null)
    setImageUploading(true)
    try {
      const res = await uploadImage(croppedFile)
      setForm((prev) => ({ ...prev, image: res.data.imageUrl || res.data.url || res.data.path }))
      toast.success('Image uploaded')
    } catch (err) {
      toast.error('Image upload failed')
    } finally {
      setImageUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.description) {
      toast.error('Title and description are required')
      return
    }

    setSubmitting(true)
    const data = {
      ...form,
      techStack: form.techStack.split(',').map((s) => s.trim()).filter(Boolean),
    }

    try {
      if (editing) {
        await updateProject(editing, data)
        toast.success('Project updated')
      } else {
        await createProject(data)
        toast.success('Project created')
      }
      setShowModal(false)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteProject(deleteId)
      toast.success('Project deleted')
      setDeleteId(null)
      fetchData()
    } catch (err) {
      toast.error('Delete failed')
    }
  }

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    dragItem.current = index
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnter = (e, index) => {
    e.preventDefault()
    dragOverItem.current = index
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) {
      dragItem.current = null
      dragOverItem.current = null
      return
    }

    const reordered = [...projects]
    const draggedProject = reordered[dragItem.current]
    reordered.splice(dragItem.current, 1)
    reordered.splice(dragOverItem.current, 0, draggedProject)
    setProjects(reordered)

    const orderedIds = reordered.map(p => p._id)
    try {
      await reorderProjects(orderedIds)
    } catch {
      toast.error('Reorder failed')
      fetchData()
    }

    dragItem.current = null
    dragOverItem.current = null
  }

  const handleDragEnd = () => {
    dragItem.current = null
    dragOverItem.current = null
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Projects</h1>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">
          <FaPlus size={14} /> Add Project
        </button>
      </div>

      {/* Projects table */}
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-md border border-gray-100 dark:border-dark-lighter overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-dark-lighter">
              <tr>
                <th className="w-10 px-2 py-3"></th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 hidden lg:table-cell">Tech Stack</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 hidden sm:table-cell">Links</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody
              className="divide-y divide-gray-100 dark:divide-dark-lighter"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {projects.map((project, index) => (
                <tr
                  key={project._id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragEnd={handleDragEnd}
                  className="hover:bg-gray-50 dark:hover:bg-dark-lighter/50 transition-colors cursor-grab active:cursor-grabbing"
                >
                  <td className="px-2 py-3 text-center">
                    <FaGripVertical className="text-gray-300 dark:text-gray-600 mx-auto" size={14} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {project.image ? (
                        <img src={project.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {project.title?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{project.title}</p>
                        {project.featured && <span className="text-xs text-accent font-medium">Featured</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      {project.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {project.techStack?.slice(0, 3).map((t, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-dark-lighter text-xs rounded">
                          {t}
                        </span>
                      ))}
                      {(project.techStack?.length || 0) > 3 && (
                        <span className="text-xs text-gray-400">+{project.techStack.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="flex gap-2">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary">
                          <FaGithub size={16} />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary">
                          <FaExternalLinkAlt size={14} />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(project)} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                        <FaEdit size={14} />
                      </button>
                      <button onClick={() => setDeleteId(project._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all">
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {projects.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-10">No projects yet. Add your first project!</p>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-dark-lighter">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {editing ? 'Edit Project' : 'Add Project'}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <FaTimes size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                  <input name="title" value={form.title} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-dark-lighter border border-gray-200 dark:border-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-dark-lighter border border-gray-200 dark:border-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-dark-lighter border border-gray-200 dark:border-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none">
                      <option value="Personal">Personal</option>
                      <option value="Office">Office</option>
                      <option value="Freelancing">Freelancing</option>
                      <option value="OpenSource">OpenSource</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tech Stack</label>
                    <input name="techStack" value={form.techStack} onChange={handleChange} placeholder="React, Node.js, ..." className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-dark-lighter border border-gray-200 dark:border-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub URL</label>
                    <input name="githubUrl" value={form.githubUrl} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-dark-lighter border border-gray-200 dark:border-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Live URL</label>
                    <input name="liveUrl" value={form.liveUrl} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-dark-lighter border border-gray-200 dark:border-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image</label>
                  <input type="file" accept="image/*" onChange={handleImageSelect} className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium hover:file:bg-primary/20 cursor-pointer" />
                  {imageUploading && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-primary">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Uploading image...
                    </div>
                  )}
                  {form.image && !imageUploading && (
                    <div className="mt-2 relative inline-block group">
                      <img src={form.image} alt="Preview" className="w-full max-w-xs h-32 object-cover rounded-lg border border-gray-200 dark:border-dark-lighter" />
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, image: '' }))}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTimes size={10} />
                      </button>
                    </div>
                  )}
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 text-primary rounded focus:ring-primary" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Featured project</span>
                </label>
                <button type="submit" disabled={submitting} className="w-full py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60">
                  {submitting ? 'Saving...' : editing ? 'Update Project' : 'Create Project'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Cropper */}
      {cropImage && (
        <ImageCropper
          imageSrc={cropImage}
          aspect={16 / 9}
          onCropDone={handleCropDone}
          onCancel={() => setCropImage(null)}
        />
      )}

      {/* Delete confirmation */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-dark-card rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Project?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2 border border-gray-200 dark:border-dark-lighter rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-dark-lighter transition-colors">
                  Cancel
                </button>
                <button onClick={handleDelete} className="flex-1 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
