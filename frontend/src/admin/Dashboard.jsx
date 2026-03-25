import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FaProjectDiagram, FaBlog, FaCogs, FaEnvelope,
  FaArrowRight, FaBriefcase, FaGraduationCap, FaTrophy
} from 'react-icons/fa'
import { getProjects, getBlogs, getSkills, getMessages } from '../services/api'

const statCards = [
  { key: 'projects', label: 'Projects', icon: FaProjectDiagram, color: 'from-primary to-primary-dark', link: '/admin/projects' },
  { key: 'blogs', label: 'Blogs', icon: FaBlog, color: 'from-secondary to-blue-600', link: '/admin/blogs' },
  { key: 'skills', label: 'Skills', icon: FaCogs, color: 'from-accent to-orange-600', link: '/admin/skills' },
  { key: 'messages', label: 'Messages', icon: FaEnvelope, color: 'from-green-500 to-emerald-600', link: '/admin/messages' },
]

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, blogs: 0, skills: 0, messages: 0 })
  const [recentMessages, setRecentMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projRes, blogRes, skillRes, msgRes] = await Promise.allSettled([
          getProjects(),
          getBlogs(),
          getSkills(),
          getMessages(),
        ])

        setStats({
          projects: projRes.status === 'fulfilled' ? (projRes.value.data?.length || 0) : 0,
          blogs: blogRes.status === 'fulfilled' ? (blogRes.value.data?.length || 0) : 0,
          skills: skillRes.status === 'fulfilled' ? (skillRes.value.data?.length || 0) : 0,
          messages: msgRes.status === 'fulfilled' ? (msgRes.value.data?.length || 0) : 0,
        })

        if (msgRes.status === 'fulfilled' && msgRes.value.data) {
          setRecentMessages(msgRes.value.data.slice(0, 5))
        }
      } catch (err) {
        // Keep defaults
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ key, label, icon: Icon, color, link }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              to={link}
              className="block p-5 bg-white dark:bg-dark-card rounded-xl shadow-md border border-gray-100 dark:border-dark-lighter hover:shadow-lg transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${color}`}>
                  <Icon className="text-white" size={20} />
                </div>
                <FaArrowRight className="text-gray-400 group-hover:text-primary transition-colors" size={14} />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {loading ? '-' : stats[key]}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-md border border-gray-100 dark:border-dark-lighter">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Add Project', icon: FaProjectDiagram, link: '/admin/projects' },
              { label: 'Write Blog', icon: FaBlog, link: '/admin/blogs' },
              { label: 'Add Skill', icon: FaCogs, link: '/admin/skills' },
              { label: 'Experience', icon: FaBriefcase, link: '/admin/experience' },
              { label: 'Education', icon: FaGraduationCap, link: '/admin/education' },
              { label: 'Achievements', icon: FaTrophy, link: '/admin/achievements' },
            ].map(({ label, icon: Icon, link }) => (
              <Link
                key={label}
                to={link}
                className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-dark-lighter rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all"
              >
                <Icon size={14} />
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Recent messages */}
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-md border border-gray-100 dark:border-dark-lighter">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Messages</h2>
            <Link to="/admin/messages" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </div>
          {recentMessages.length > 0 ? (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div
                  key={msg._id}
                  className="p-3 bg-gray-50 dark:bg-dark-lighter rounded-lg"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {msg.name}
                    </p>
                    <span className="text-xs text-gray-400">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                    {msg.subject || msg.message}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
              {loading ? 'Loading...' : 'No messages yet'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
