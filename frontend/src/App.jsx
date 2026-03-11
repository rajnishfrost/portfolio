import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { Toaster } from 'react-hot-toast'
import PublicLayout from './layouts/PublicLayout'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Blogs from './pages/Blogs'
import Contact from './pages/Contact'
import AdminLogin from './admin/AdminLogin'
import AdminLayout from './admin/AdminLayout'
import Dashboard from './admin/Dashboard'
import ManageProjects from './admin/ManageProjects'
import ManageBlogs from './admin/ManageBlogs'
import ManageSkills from './admin/ManageSkills'
import ManageExperience from './admin/ManageExperience'
import ManageEducation from './admin/ManageEducation'
import ManageAchievements from './admin/ManageAchievements'
import ManageProfile from './admin/ManageProfile'
import ManageMessages from './admin/ManageMessages'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <ThemeProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'dark:bg-dark-card dark:text-white',
          duration: 3000,
        }}
      />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<ManageProjects />} />
          <Route path="blogs" element={<ManageBlogs />} />
          <Route path="skills" element={<ManageSkills />} />
          <Route path="experience" element={<ManageExperience />} />
          <Route path="education" element={<ManageEducation />} />
          <Route path="achievements" element={<ManageAchievements />} />
          <Route path="profile" element={<ManageProfile />} />
          <Route path="messages" element={<ManageMessages />} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}
