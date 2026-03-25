import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { getExperience, createExperience, updateExperience, deleteExperience } from '../services/api'

const emptyForm = { company: '', role: '', startDate: '', endDate: '', current: false, description: '' }

export default function ManageExperience() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const fetchData = async () => {
    try { const res = await getExperience(); setItems(res.data || []) }
    catch { toast.error('Failed to load experience') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true) }
  const openEdit = (item) => {
    setEditing(item._id)
    setForm({
      company: item.company || '', role: item.role || '',
      startDate: item.startDate?.substring(0, 10) || '', endDate: item.endDate?.substring(0, 10) || '',
      current: item.current || false, description: item.description || '',
    })
    setShowModal(true)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.company || !form.role) { toast.error('Company and role required'); return }
    setSubmitting(true)
    try {
      if (editing) { await updateExperience(editing, form); toast.success('Experience updated') }
      else { await createExperience(form); toast.success('Experience created') }
      setShowModal(false); fetchData()
    } catch (err) { toast.error(err.response?.data?.message || 'Operation failed') }
    finally { setSubmitting(false) }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try { await deleteExperience(deleteId); toast.success('Deleted'); setDeleteId(null); fetchData() }
    catch { toast.error('Delete failed') }
  }

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Experience</h1>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">
          <FaPlus size={14} /> Add Experience
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item._id} className="bg-white dark:bg-dark-card p-5 rounded-xl border border-gray-100 dark:border-dark-lighter shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">{item.role}</h3>
                <p className="text-primary text-sm font-medium">{item.company}</p>
                <p className="text-xs text-gray-400 mt-1">{formatDate(item.startDate)} - {item.current ? 'Present' : formatDate(item.endDate)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{item.description}</p>
              </div>
              <div className="flex gap-1 shrink-0 ml-4">
                <button onClick={() => openEdit(item)} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg"><FaEdit size={14} /></button>
                <button onClick={() => setDeleteId(item._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"><FaTrash size={14} /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-10">No experience entries yet.</p>}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-dark-lighter">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editing ? 'Edit Experience' : 'Add Experience'}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><FaTimes size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company *</label>
                  <input name="company" value={form.company} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-dark-lighter border border-gray-200 dark:border-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role *</label>
                  <input name="role" value={form.role} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-dark-lighter border border-gray-200 dark:border-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                    <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-dark-lighter border border-gray-200 dark:border-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                    <input type="date" name="endDate" value={form.endDate} onChange={handleChange} disabled={form.current} className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-dark-lighter border border-gray-200 dark:border-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50" />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="current" checked={form.current} onChange={handleChange} className="w-4 h-4 text-primary rounded focus:ring-primary" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Currently working here</span>
                </label>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-dark-lighter border border-gray-200 dark:border-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none resize-none" />
                </div>
                <button type="submit" disabled={submitting} className="w-full py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60">
                  {submitting ? 'Saving...' : editing ? 'Update' : 'Create'}
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
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Experience?</h3>
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
