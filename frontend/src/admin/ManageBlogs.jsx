import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { getBlogs, createBlog, updateBlog, deleteBlog, uploadImage } from '../services/api'

const emptyForm = { title: '', description: '', link: '', tags: '', image: '' }

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const fetchData = async () => {
    try {
      const res = await getBlogs()
      setBlogs(res.data || [])
    } catch { toast.error('Failed to load blogs') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true) }
  const openEdit = (blog) => {
    setEditing(blog._id)
    setForm({
      title: blog.title || '', description: blog.description || '',
      link: blog.link || '', tags: (blog.tags || []).join(', '), image: blog.image || '',
    })
    setShowModal(true)
  }

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const res = await uploadImage(file)
      setForm((p) => ({ ...p, image: res.data.url || res.data.path }))
      toast.success('Image uploaded')
    } catch { toast.error('Image upload failed') }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.description) { toast.error('Title and description required'); return }
    setSubmitting(true)
    const data = { ...form, tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean) }
    try {
      if (editing) { await updateBlog(editing, data); toast.success('Blog updated') }
      else { await createBlog(data); toast.success('Blog created') }
      setShowModal(false); fetchData()
    } catch (err) { toast.error(err.response?.data?.message || 'Operation failed') }
    finally { setSubmitting(false) }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try { await deleteBlog(deleteId); toast.success('Blog deleted'); setDeleteId(null); fetchData() }
    catch { toast.error('Delete failed') }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Blogs</h1>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">
          <FaPlus size={14} /> Add Blog
        </button>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-xl shadow-md border border-gray-100 dark:border-dark-lighter overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-dark-lighter">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 hidden md:table-cell">Tags</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 hidden sm:table-cell">Link</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-lighter">
              {blogs.map((blog) => (
                <tr key={blog._id} className="hover:bg-gray-50 dark:hover:bg-dark-lighter/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 dark:text-white">{blog.title}</p>
                    <p className="text-xs text-gray-400 line-clamp-1">{blog.description}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {blog.tags?.map((t, i) => <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">{t}</span>)}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {blog.link && <a href={blog.link} target="_blank" rel="noopener noreferrer" className="text-primary text-xs hover:underline">View</a>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(blog)} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg"><FaEdit size={14} /></button>
                      <button onClick={() => setDeleteId(blog._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"><FaTrash size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {blogs.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-10">No blogs yet.</p>}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-dark-lighter">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editing ? 'Edit Blog' : 'Add Blog'}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><FaTimes size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                  <input name="title" value={form.title} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-dark-lighter border border-gray-200 dark:border-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-dark-lighter border border-gray-200 dark:border-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">External Link</label>
                  <input name="link" value={form.link} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-dark-lighter border border-gray-200 dark:border-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma separated)</label>
                  <input name="tags" value={form.tags} onChange={handleChange} placeholder="React, Blockchain, ..." className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-dark-lighter border border-gray-200 dark:border-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium hover:file:bg-primary/20 cursor-pointer" />
                  {form.image && <img src={form.image} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded-lg" />}
                </div>
                <button type="submit" disabled={submitting} className="w-full py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60">
                  {submitting ? 'Saving...' : editing ? 'Update Blog' : 'Create Blog'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-dark-card rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Blog?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2 border border-gray-200 dark:border-dark-lighter rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-dark-lighter">Cancel</button>
                <button onClick={handleDelete} className="flex-1 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
