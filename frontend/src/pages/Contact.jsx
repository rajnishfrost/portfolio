import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaEnvelope, FaGithub, FaLinkedin, FaPaperPlane, FaMapMarkerAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'
import Section from '../components/Section'
import { submitContact } from '../services/api'
import { useProfile } from '../context/ProfileContext'

export default function Contact() {
  const { profile } = useProfile()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) {
      errs.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = 'Invalid email address'
    }
    if (!form.subject.trim()) errs.subject = 'Subject is required'
    if (!form.message.trim()) {
      errs.message = 'Message is required'
    } else if (form.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      await submitContact(form)
      toast.success('Message sent successfully! I will get back to you soon.')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClasses = (field) =>
    `w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-lighter border ${
      errors[field]
        ? 'border-red-500 focus:ring-red-500'
        : 'border-gray-200 dark:border-dark-lighter focus:ring-primary'
    } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all`

  return (
    <div className="pt-16 min-h-screen">
      <Section title="Get in Touch" subtitle="I'd love to hear from you. Drop me a message!">
        <div className="grid lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-6"
          >
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Let's connect
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Whether you have a project in mind, want to collaborate, or just want to say
                hello, feel free to reach out. I'll get back to you as soon as possible.
              </p>
            </div>

            <div className="space-y-4">
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-4 p-4 bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-lighter hover:shadow-md transition-all group"
                >
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <FaEnvelope className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {profile.email}
                    </p>
                  </div>
                </a>
              )}

              {profile.socialLinks?.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-lighter hover:shadow-md transition-all group"
                >
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <FaGithub className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">GitHub</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {profile.socialLinks.github.replace('https://github.com/', '')}
                    </p>
                  </div>
                </a>
              )}

              {profile.socialLinks?.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-lighter hover:shadow-md transition-all group"
                >
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <FaLinkedin className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">LinkedIn</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      rajnishfrost
                    </p>
                  </div>
                </a>
              )}

              {profile.location && (
                <div className="flex items-center gap-4 p-4 bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-lighter">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <FaMapMarkerAlt className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {profile.location}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.form
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="lg:col-span-3 bg-white dark:bg-dark-card p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-dark-lighter"
          >
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={inputClasses('name')}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={inputClasses('email')}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="What's this about?"
                className={inputClasses('subject')}
              />
              {errors.subject && (
                <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                placeholder="Tell me about your project..."
                className={inputClasses('message') + ' resize-none'}
              />
              {errors.message && (
                <p className="text-red-500 text-xs mt-1">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <FaPaperPlane size={16} />
                  Send Message
                </>
              )}
            </button>
          </motion.form>
        </div>
      </Section>
    </div>
  )
}
