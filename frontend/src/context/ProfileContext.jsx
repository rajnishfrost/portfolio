import { createContext, useContext, useState, useEffect } from 'react'
import { getProfile } from '../services/api'

const ProfileContext = createContext(null)

const defaultProfile = {
  name: 'Rajnish Yadav',
  title: 'Fullstack Blockchain Developer',
  subtitle: '',
  bio: '',
  email: 'rajnishfrost@gmail.com',
  phone: '',
  location: 'India',
  resumeLink: '',
  socialLinks: {
    github: 'https://github.com/rajnishfrost',
    linkedin: 'https://www.linkedin.com/in/rajnish-yadav/',
    twitter: '',
    medium: '',
  },
  profileImage: '',
  isHireable: true,
}

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(defaultProfile)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile()
        if (res.data) {
          setProfile(res.data)
        }
      } catch {
        // use default profile
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  return (
    <ProfileContext.Provider value={{ profile, loading }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}
