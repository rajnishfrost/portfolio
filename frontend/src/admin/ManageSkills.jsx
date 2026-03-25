import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaTimes, FaGripVertical, FaEye, FaEyeSlash, FaCheck } from 'react-icons/fa'
import toast from 'react-hot-toast'
import IconPicker from '../components/IconPicker'
import {
  getSkills, createSkill, updateSkill, deleteSkill, reorderSkills,
  getCategories, createCategory, updateCategory, toggleCategory, deleteCategory, reorderCategories,
} from '../services/api'

const emptyForm = { name: '', category: '', icon: '', proficiency: 80 }

export default function ManageSkills() {
  const [skills, setSkills] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deleteCatId, setDeleteCatId] = useState(null)

  // Category management
  const [newCatName, setNewCatName] = useState('')
  const [editingCat, setEditingCat] = useState(null)
  const [editCatName, setEditCatName] = useState('')

  // Drag state for skills
  const dragItem = useRef(null)
  const dragOverItem = useRef(null)
  const [dragCategory, setDragCategory] = useState(null)

  // Drag state for categories
  const dragCat = useRef(null)
  const dragOverCat = useRef(null)

  const fetchData = async () => {
    try {
      const [skillsRes, catsRes] = await Promise.all([getSkills(true), getCategories()])
      setSkills(skillsRes.data?.skills || skillsRes.data || [])
      setCategories(catsRes.data || [])
    } catch { toast.error('Failed to load data') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  // ---- Skill CRUD ----
  const openAdd = () => {
    setEditing(null)
    setForm({ ...emptyForm, category: categories.find(c => c.enabled)?.name || categories[0]?.name || '' })
    setShowModal(true)
  }
  const openEdit = (skill) => {
    setEditing(skill._id)
    setForm({ name: skill.name || '', category: skill.category || '', icon: skill.icon || '', proficiency: skill.proficiency || 80 })
    setShowModal(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: name === 'proficiency' ? parseInt(value) || 0 : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name) { toast.error('Name is required'); return }
    if (!form.category) { toast.error('Category is required'); return }
    setSubmitting(true)
    try {
      if (editing) { await updateSkill(editing, form); toast.success('Skill updated') }
      else { await createSkill(form); toast.success('Skill created') }
      setShowModal(false); fetchData()
    } catch (err) { toast.error(err.response?.data?.message || 'Operation failed') }
    finally { setSubmitting(false) }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try { await deleteSkill(deleteId); toast.success('Skill deleted'); setDeleteId(null); fetchData() }
    catch { toast.error('Delete failed') }
  }

  // ---- Category CRUD ----
  const handleAddCategory = async () => {
    if (!newCatName.trim()) { toast.error('Enter a category name'); return }
    try {
      await createCategory({ name: newCatName.trim() })
      toast.success('Category created')
      setNewCatName('')
      fetchData()
    } catch (err) {
      console.error('Create category error:', err)
      toast.error(err.response?.data?.message || 'Failed to create category')
    }
  }

  const handleRenameCategory = async (catId) => {
    if (!editCatName.trim()) return
    try {
      await updateCategory(catId, { name: editCatName.trim() })
      toast.success('Category renamed')
      setEditingCat(null)
      setEditCatName('')
      fetchData()
    } catch (err) { toast.error(err.response?.data?.message || 'Rename failed') }
  }

  const handleToggleCategory = async (catId) => {
    try {
      await toggleCategory(catId)
      fetchData()
    } catch { toast.error('Toggle failed') }
  }

  const handleDeleteCategory = async () => {
    if (!deleteCatId) return
    try {
      await deleteCategory(deleteCatId)
      toast.success('Category deleted')
      setDeleteCatId(null)
      fetchData()
    } catch { toast.error('Delete failed') }
  }

  // ---- Skill drag and drop ----
  const handleDragStart = (e, index, category) => {
    dragItem.current = index
    setDragCategory(category)
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

  const handleDrop = async (e, category) => {
    e.preventDefault()
    if (dragCategory !== category || dragItem.current === null || dragOverItem.current === null) {
      dragItem.current = null; dragOverItem.current = null; setDragCategory(null); return
    }

    const grouped = skills.reduce((acc, s) => { (acc[s.category] = acc[s.category] || []).push(s); return acc }, {})
    const catSkills = [...(grouped[category] || [])]
    const draggedSkill = catSkills[dragItem.current]
    catSkills.splice(dragItem.current, 1)
    catSkills.splice(dragOverItem.current, 0, draggedSkill)

    const newSkills = skills.map(s => {
      if (s.category !== category) return s
      const idx = catSkills.findIndex(cs => cs._id === s._id)
      return { ...s, order: idx }
    })
    setSkills(newSkills)

    const orderedIds = catSkills.map(s => s._id)
    try { await reorderSkills(orderedIds) }
    catch { toast.error('Reorder failed'); fetchData() }

    dragItem.current = null; dragOverItem.current = null; setDragCategory(null)
  }

  const handleDragEnd = () => {
    dragItem.current = null; dragOverItem.current = null; setDragCategory(null)
  }

  // ---- Category drag and drop ----
  const handleCatDragStart = (e, index) => {
    dragCat.current = index
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleCatDragEnter = (e, index) => {
    e.preventDefault()
    dragOverCat.current = index
  }

  const handleCatDrop = async (e) => {
    e.preventDefault()
    if (dragCat.current === null || dragOverCat.current === null || dragCat.current === dragOverCat.current) {
      dragCat.current = null; dragOverCat.current = null; return
    }

    const newCats = [...categories]
    const dragged = newCats[dragCat.current]
    newCats.splice(dragCat.current, 1)
    newCats.splice(dragOverCat.current, 0, dragged)
    setCategories(newCats)

    try { await reorderCategories(newCats.map(c => c._id)) }
    catch { toast.error('Reorder failed'); fetchData() }

    dragCat.current = null; dragOverCat.current = null
  }

  const handleCatDragEnd = () => { dragCat.current = null; dragOverCat.current = null }

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>

  // Group skills by category, respecting category order
  const grouped = {}
  for (const cat of categories) {
    const catSkills = skills.filter(s => s.category === cat.name)
    if (catSkills.length > 0 || true) { // show even empty categories
      grouped[cat.name] = { skills: catSkills, enabled: cat.enabled, _id: cat._id }
    }
  }
  // Also show skills with categories not in the categories list
  const knownCatNames = categories.map(c => c.name)
  const orphanSkills = skills.filter(s => !knownCatNames.includes(s.category))
  if (orphanSkills.length > 0) {
    const orphanCats = [...new Set(orphanSkills.map(s => s.category))]
    for (const catName of orphanCats) {
      grouped[catName] = { skills: orphanSkills.filter(s => s.category === catName), enabled: true, _id: null }
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Skills</h1>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">
          <FaPlus size={14} /> Add Skill
        </button>
      </div>

      {/* Category Management Section */}
      <div className="mb-8 p-5 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-lighter">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Manage Categories</h2>

        {/* Add new category */}
        <div className="flex gap-2 mb-4">
          <input
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            placeholder="New category name..."
            className="flex-1 px-3 py-2 rounded-lg bg-gray-50 dark:bg-dark-lighter border border-gray-200 dark:border-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none text-sm"
          />
          <button
            type="button"
            onClick={handleAddCategory}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors text-sm whitespace-nowrap"
          >
            <FaPlus size={12} /> Add
          </button>
        </div>

        {/* Category list */}
        <div
          className="space-y-2"
          onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }}
          onDrop={handleCatDrop}
        >
          {categories.map((cat, index) => (
            <div
              key={cat._id}
              draggable
              onDragStart={(e) => handleCatDragStart(e, index)}
              onDragEnter={(e) => handleCatDragEnter(e, index)}
              onDragEnd={handleCatDragEnd}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-grab active:cursor-grabbing transition-all ${
                cat.enabled
                  ? 'bg-gray-50 dark:bg-dark-lighter border-gray-200 dark:border-dark-lighter'
                  : 'bg-gray-100 dark:bg-dark-lighter/50 border-gray-200 dark:border-dark-lighter opacity-60'
              }`}
            >
              <FaGripVertical className="text-gray-300 dark:text-gray-600 flex-shrink-0" size={12} />

              {editingCat === cat._id ? (
                <div className="flex-1 flex gap-2">
                  <input
                    value={editCatName}
                    onChange={(e) => setEditCatName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleRenameCategory(cat._id); if (e.key === 'Escape') setEditingCat(null) }}
                    className="flex-1 px-2 py-1 rounded-lg bg-white dark:bg-dark-card border border-primary text-gray-900 dark:text-white text-sm focus:outline-none"
                    autoFocus
                  />
                  <button onClick={() => handleRenameCategory(cat._id)} className="p-1.5 text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg"><FaCheck size={12} /></button>
                  <button onClick={() => setEditingCat(null)} className="p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-lighter rounded-lg"><FaTimes size={12} /></button>
                </div>
              ) : (
                <>
                  <span className={`flex-1 font-medium text-sm ${cat.enabled ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500 line-through'}`}>
                    {cat.name}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {skills.filter(s => s.category === cat.name).length} skills
                  </span>
                  <div className="flex gap-0.5">
                    <button
                      onClick={() => handleToggleCategory(cat._id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        cat.enabled
                          ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10'
                          : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-lighter'
                      }`}
                      title={cat.enabled ? 'Hide from public' : 'Show on public'}
                    >
                      {cat.enabled ? <FaEye size={12} /> : <FaEyeSlash size={12} />}
                    </button>
                    <button
                      onClick={() => { setEditingCat(cat._id); setEditCatName(cat.name) }}
                      className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg"
                    >
                      <FaEdit size={12} />
                    </button>
                    <button
                      onClick={() => setDeleteCatId(cat._id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">No categories yet. Create one above!</p>
          )}
        </div>
      </div>

      {/* Skills grouped by category */}
      {Object.keys(grouped).length > 0 ? (
        Object.entries(grouped).map(([catName, { skills: catSkills, enabled }]) => (
          <div key={catName} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{catName}</h2>
              {!enabled && (
                <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-dark-lighter text-gray-500 dark:text-gray-400 rounded-full">Hidden</span>
              )}
            </div>
            {catSkills.length > 0 ? (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, catName)}
              >
                {catSkills.map((skill, index) => (
                  <div
                    key={skill._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index, catName)}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDragEnd={handleDragEnd}
                    className="flex items-center justify-between p-4 bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-lighter cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <FaGripVertical className="text-gray-300 dark:text-gray-600 flex-shrink-0" size={14} />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{skill.name}</p>
                        <div className="mt-1 w-32 h-1.5 bg-gray-200 dark:bg-dark-lighter rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${skill.proficiency || 80}%` }} />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(skill)} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg"><FaEdit size={12} /></button>
                      <button onClick={() => setDeleteId(skill._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"><FaTrash size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-500 py-3 pl-2">No skills in this category</p>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 py-10">No skills yet. Add your first skill!</p>
      )}

      {/* Add/Edit Skill Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-dark-lighter">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editing ? 'Edit Skill' : 'Add Skill'}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><FaTimes size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-dark-lighter border border-gray-200 dark:border-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-dark-lighter border border-gray-200 dark:border-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none">
                    <option value="">Select category...</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>{cat.name}{!cat.enabled ? ' (Hidden)' : ''}</option>
                    ))}
                  </select>
                </div>
                <IconPicker value={form.icon} onChange={(val) => setForm(p => ({ ...p, icon: val }))} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Proficiency ({form.proficiency}%)</label>
                  <input type="range" name="proficiency" value={form.proficiency} onChange={handleChange} min="0" max="100" className="w-full accent-primary" />
                </div>
                <button type="submit" disabled={submitting} className="w-full py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60">
                  {submitting ? 'Saving...' : editing ? 'Update Skill' : 'Create Skill'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Skill confirmation */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-dark-card rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Skill?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2 border border-gray-200 dark:border-dark-lighter rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-dark-lighter">Cancel</button>
                <button onClick={handleDelete} className="flex-1 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Category confirmation */}
      <AnimatePresence>
        {deleteCatId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDeleteCatId(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-dark-card rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Category?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">This will also delete all skills in this category. This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteCatId(null)} className="flex-1 py-2 border border-gray-200 dark:border-dark-lighter rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-dark-lighter">Cancel</button>
                <button onClick={handleDeleteCategory} className="flex-1 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
