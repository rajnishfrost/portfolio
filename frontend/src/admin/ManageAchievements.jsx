import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { getAchievements, createAchievement, updateAchievement, deleteAchievement, uploadImage } from '../services/api'
import ImageCropper from '../components/ImageCropper'

const emptyForm = { title: '', description: '', date: '', image: '', link: '' }

export default function ManageAchievements() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [cropImage, setCropImage] = useState(null)
  const [imageUploading, setImageUploading] = useState(false)

  const fetchData = async () => {
    try { const res = await getAchievements(); setItems(res.data || []) }
    catch { toast.error('Failed to load achievements') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true) }
  const openEdit = (item) => {
    setEditing(item._id)
    setForm({
      title: item.title || '', description: item.description || '',
      date: item.date?.substring(0, 10) || '', image: item.image || '', link: item.link || '',
    })
    setShowModal(true)
  }

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

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
      setForm((p) => ({ ...p, image: res.data.imageUrl || res.data.url || res.data.path }))
      toast.success('Image uploaded')
    } catch { toast.error('Upload failed') }
    finally { setImageUploading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title) { toast.error('Title is required'); return }
    setSubmitting(true)
    try {
      if (editing) { await updateAchievement(editing, form); toast.success('Achievement updated') }
      else { await createAchievement(form); toast.success('Achievement created') }
      setShowModal(false); fetchData()
    } catch (err) { toast.error(err.response?.data?.message || 'Operation failed') }
    finally { setSubmitting(false) }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try { await deleteAchievement(deleteId); toast.success('Deleted'); setDeleteId(null); fetchData() }
    catch { toast.error('Delete failed') }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Achievements</h1>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">
          <FaPlus size={14} /> Add Achievement
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item._id} className="bg-white dark:bg-dark-card p-5 rounded-xl border border-gray-100 dark:border-dark-lighter shadow-md">
            {item.image && <img src={item.image} alt={item.title} className="w-full h-32 object-cover rounded-lg mb-3" />}
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">{item.title}</h3>
            {item.date && <p className="text-xs text-gray-400 mb-2">{new Date(item.date).toLocaleDateString()}</p>}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{item.description}</p>
            <div className="flex gap-1">
              <button onClick={() => openEdit(item)} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg"><FaEdit size={14} /></button>
              <button onClick={() => setDeleteId(item._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"><FaTrash size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-10">No achievements yet.</p>}

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-dark-lighter">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editing ? 'Edit Achievement' : 'Add Achievement'}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><FaTimes size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                  <input name="title" value={form.title} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-dark-lighter border border-gray-200 dark:border-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-dark-lighter border border-gray-200 dark:border-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                    <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-dark-lighter border border-gray-200 dark:border-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link</label>
                    <input name="link" value={form.link} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-dark-lighter border border-gray-200 dark:border-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image</label>
                  <input type="file" accept="image/*" onChange={handleImageSelect} className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium hover:file:bg-primary/20 cursor-pointer" />
                  {imageUploading && <p className="mt-2 text-xs text-gray-500">Uploading...</p>}
                  {form.image && !imageUploading && <img src={form.image} alt="Preview" className="mt-2 w-32 h-20 object-cover rounded-lg" />}
                </div>
                <button type="submit" disabled={submitting} className="w-full py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60">
                  {submitting ? 'Saving...' : editing ? 'Update' : 'Create'}
                </button>
              </form>
              {cropImage && (
                <ImageCropper
                  imageSrc={cropImage}
                  aspect={16 / 9}
                  onCropDone={handleCropDone}
                  onCancel={() => setCropImage(null)}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-dark-card rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Achievement?</h3>
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
