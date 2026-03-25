import { useState, useEffect } from 'react'
import { FaSave } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { getProfile, updateProfile, uploadImage } from '../services/api'

export default function ManageProfile() {
  const [form, setForm] = useState({
    name: '', title: '', subtitle: '', bio: '', email: '', phone: '', location: '',
    resumeLink: '', profileImage: '', isHireable: true,
    socialLinks: { github: '', linkedin: '', medium: '', twitter: '' },
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile()
        if (res.data) {
          setForm({
            name: res.data.name || '',
            title: res.data.title || '',
            subtitle: res.data.subtitle || '',
            bio: res.data.bio || '',
            email: res.data.email || '',
            phone: res.data.phone || '',
            location: res.data.location || '',
            resumeLink: res.data.resumeLink || '',
            profileImage: res.data.profileImage || '',
            isHireable: res.data.isHireable ?? true,
            socialLinks: {
              github: res.data.socialLinks?.github || '',
              linkedin: res.data.socialLinks?.linkedin || '',
              medium: res.data.socialLinks?.medium || '',
              twitter: res.data.socialLinks?.twitter || '',
            },
          })
        }
      } catch {
        // Use defaults
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  const handleSocialChange = (e) => setForm((p) => ({ ...p, socialLinks: { ...p.socialLinks, [e.target.name]: e.target.value } }))

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const res = await uploadImage(file)
      setForm((p) => ({ ...p, profileImage: res.data.imageUrl || res.data.url || res.data.path }))
      toast.success('Avatar uploaded')
    } catch { toast.error('Upload failed') }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await updateProfile(form)
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>

  const inputClass = "w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-dark-lighter border border-gray-200 dark:border-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all"
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Manage Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-md border border-gray-100 dark:border-dark-lighter">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-100 dark:border-dark-lighter">Basic Information</h2>

          {/* Avatar */}
          <div className="flex items-center gap-5 mb-8">
            <div className="w-20 h-20 shrink-0 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/20">
              {form.profileImage ? (
                <img src={form.profileImage} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-primary">{form.name?.split(' ').map(n => n[0]).join('') || 'RY'}</span>
              )}
            </div>
            <div className="flex-1">
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium hover:file:bg-primary/20 cursor-pointer" />
              <p className="text-xs text-gray-400 mt-1.5">Recommended: 200x200px, JPG or PNG</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <label className={labelClass}>Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Professional Title</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Fullstack Blockchain Developer" className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Subtitle / Tagline</label>
              <input name="subtitle" value={form.subtitle} onChange={handleChange} placeholder="A short intro about yourself" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. India" className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Bio</label>
              <textarea name="bio" value={form.bio} onChange={handleChange} rows={4} className={inputClass + ' resize-none'} placeholder="Tell about yourself..." />
            </div>
            <div className="md:col-span-2 flex items-center gap-3">
              <input type="checkbox" id="hireable" checked={form.isHireable} onChange={(e) => setForm(p => ({ ...p, isHireable: e.target.checked }))} className="w-4 h-4 accent-primary rounded" />
              <label htmlFor="hireable" className="text-sm font-medium text-gray-700 dark:text-gray-300">Available for hire</label>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-md border border-gray-100 dark:border-dark-lighter">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-100 dark:border-dark-lighter">Social Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <label className={labelClass}>GitHub</label>
              <input name="github" value={form.socialLinks.github} onChange={handleSocialChange} placeholder="https://github.com/username" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>LinkedIn</label>
              <input name="linkedin" value={form.socialLinks.linkedin} onChange={handleSocialChange} placeholder="https://linkedin.com/in/username" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Twitter</label>
              <input name="twitter" value={form.socialLinks.twitter} onChange={handleSocialChange} placeholder="https://twitter.com/username" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Medium</label>
              <input name="medium" value={form.socialLinks.medium} onChange={handleSocialChange} placeholder="https://medium.com/@username" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Resume */}
        <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-md border border-gray-100 dark:border-dark-lighter">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-100 dark:border-dark-lighter">Resume</h2>
          <div>
            <label className={labelClass}>Resume URL</label>
            <input name="resumeLink" value={form.resumeLink} onChange={handleChange} placeholder="Link to your resume (Google Drive, Dropbox, etc.)" className={inputClass} />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-60 shadow-lg shadow-primary/20"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FaSave size={16} />
            )}
            {submitting ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}
