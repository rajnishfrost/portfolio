import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  FaHome, FaProjectDiagram, FaBlog, FaCogs, FaBriefcase,
  FaGraduationCap, FaTrophy, FaUser, FaEnvelope, FaSignOutAlt,
  FaBars, FaTimes
} from 'react-icons/fa'
import toast from 'react-hot-toast'

const sidebarLinks = [
  { to: '/admin', icon: FaHome, label: 'Dashboard', end: true },
  { to: '/admin/projects', icon: FaProjectDiagram, label: 'Projects' },
  { to: '/admin/blogs', icon: FaBlog, label: 'Blogs' },
  { to: '/admin/skills', icon: FaCogs, label: 'Skills' },
  { to: '/admin/experience', icon: FaBriefcase, label: 'Experience' },
  { to: '/admin/education', icon: FaGraduationCap, label: 'Education' },
  { to: '/admin/achievements', icon: FaTrophy, label: 'Achievements' },
  { to: '/admin/profile', icon: FaUser, label: 'Profile' },
  { to: '/admin/messages', icon: FaEnvelope, label: 'Messages' },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    toast.success('Logged out successfully')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-dark-card text-white z-50 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-dark-lighter">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            RY Admin
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {sidebarLinks.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-400 hover:bg-dark-lighter hover:text-white'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-dark-lighter">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <FaSignOutAlt size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-dark/80 backdrop-blur-lg border-b border-gray-200 dark:border-dark-lighter px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-lighter rounded-lg"
            >
              <FaBars size={20} />
            </button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Portfolio Admin
            </h2>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
