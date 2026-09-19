import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FaReact, FaNodeJs, FaDocker, FaGitAlt, FaAws, FaPython, FaEthereum,
  FaGithub, FaLinkedin, FaEnvelope, FaArrowRight, FaBriefcase, FaTrophy
} from 'react-icons/fa'
import {
  SiSolidity, SiTypescript, SiJavascript, SiNextdotjs, SiTailwindcss,
  SiMongodb, SiPostgresql, SiRedis, SiGraphql, SiRust, SiWeb3Dotjs,
  SiExpress, SiNginx, SiKubernetes, SiLinux
} from 'react-icons/si'
import Section from '../components/Section'
import ProjectCard from '../components/ProjectCard'
import BlogCard from '../components/BlogCard'
import SkillBadge from '../components/SkillBadge'
import { getProjects, getBlogs, getSkills, getExperience, getAchievements } from '../services/api'
import { useProfile } from '../context/ProfileContext'

// ==================== Fallback Data ====================

const fallbackSkills = {
  Frontend: [
    { name: 'React', icon: FaReact },
    { name: 'Next.js', icon: SiNextdotjs },
    { name: 'TypeScript', icon: SiTypescript },
    { name: 'JavaScript', icon: SiJavascript },
    { name: 'Tailwind CSS', icon: SiTailwindcss },
  ],
  Backend: [
    { name: 'Node.js', icon: FaNodeJs },
    { name: 'Express.js', icon: SiExpress },
    { name: 'Python', icon: FaPython },
    { name: 'MongoDB', icon: SiMongodb },
    { name: 'PostgreSQL', icon: SiPostgresql },
    { name: 'Redis', icon: SiRedis },
    { name: 'GraphQL', icon: SiGraphql },
  ],
  Blockchain: [
    { name: 'Solidity', icon: SiSolidity },
    { name: 'Ethereum', icon: FaEthereum },
    { name: 'Web3.js', icon: SiWeb3Dotjs },
    { name: 'Rust', icon: SiRust },
  ],
  DevOps: [
    { name: 'Docker', icon: FaDocker },
    { name: 'AWS', icon: FaAws },
    { name: 'Kubernetes', icon: SiKubernetes },
    { name: 'Nginx', icon: SiNginx },
    { name: 'Git', icon: FaGitAlt },
    { name: 'Linux', icon: SiLinux },
  ],
}

const fallbackProjects = [
  {
    _id: '1',
    title: 'DeFi Exchange Platform',
    description: 'A decentralized exchange platform with AMM, liquidity pools, and yield farming capabilities built on Ethereum.',
    techStack: ['Solidity', 'React', 'Web3.js', 'Node.js'],
    category: 'Personal',
    featured: true,
    githubUrl: 'https://github.com/rajnishfrost',
    liveUrl: '#',
  },
  {
    _id: '2',
    title: 'NFT Marketplace',
    description: 'Full-featured NFT marketplace for minting, buying, selling, and auctioning digital assets with IPFS storage.',
    techStack: ['Next.js', 'Solidity', 'IPFS', 'Tailwind'],
    category: 'Personal',
    featured: true,
    githubUrl: 'https://github.com/rajnishfrost',
    liveUrl: '#',
  },
  {
    _id: '3',
    title: 'Supply Chain Tracker',
    description: 'Blockchain-based supply chain management system ensuring transparency and traceability of products.',
    techStack: ['Ethereum', 'React', 'Node.js', 'MongoDB'],
    category: 'Freelancing',
    featured: true,
    githubUrl: 'https://github.com/rajnishfrost',
    liveUrl: '#',
  },
]

const fallbackExperience = [
  {
    _id: '1',
    company: 'Web3 Startup',
    role: 'Lead Blockchain Developer',
    startDate: '2023-01',
    endDate: null,
    current: true,
    description: 'Leading blockchain development for DeFi applications, smart contract architecture, and cross-chain integrations.',
  },
  {
    _id: '2',
    company: 'Tech Solutions Inc.',
    role: 'Fullstack Developer',
    startDate: '2021-06',
    endDate: '2022-12',
    current: false,
    description: 'Developed scalable web applications using React, Node.js, and cloud services. Implemented CI/CD pipelines and microservices architecture.',
  },
  {
    _id: '3',
    company: 'Freelance',
    role: 'Web Developer',
    startDate: '2020-01',
    endDate: '2021-05',
    current: false,
    description: 'Built custom web applications and smart contracts for various clients. Focused on e-commerce and blockchain solutions.',
  },
]

const fallbackBlogs = [
  {
    _id: '1',
    title: 'Understanding Smart Contract Security',
    description: 'A comprehensive guide to common vulnerabilities in Solidity and how to write secure smart contracts.',
    tags: ['Blockchain', 'Solidity', 'Security'],
    link: '#',
  },
  {
    _id: '2',
    title: 'Building Scalable APIs with Node.js',
    description: 'Best practices for building production-ready APIs with Express.js, including authentication, rate limiting, and caching.',
    tags: ['Node.js', 'Backend', 'API'],
    link: '#',
  },
]

const fallbackAchievements = [
  {
    _id: '1',
    title: 'Blockchain Hackathon Winner',
    description: 'Won first place in a national blockchain hackathon for building a decentralized identity solution.',
  },
  {
    _id: '2',
    title: 'Smart Contract Security Certification',
    description: 'Certified smart contract auditor with expertise in identifying vulnerabilities and ensuring code safety.',
  },
  {
    _id: '3',
    title: 'Open Source Contributor',
    description: 'Active contributor to major open-source blockchain and web development projects.',
  },
]

// ==================== Hero Section ====================

function HeroSection({ profile }) {
  const firstName = profile.name?.split(' ')[0] || 'Rajnish'

  const socialLinks = [
    profile.socialLinks?.github && { icon: FaGithub, href: profile.socialLinks.github, label: 'GitHub' },
    profile.socialLinks?.linkedin && { icon: FaLinkedin, href: profile.socialLinks.linkedin, label: 'LinkedIn' },
    profile.email && { icon: FaEnvelope, href: `mailto:${profile.email}`, label: 'Email' },
  ].filter(Boolean)

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-secondary/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-primary font-semibold text-lg mb-4 tracking-wide"
          >
            Welcome to my portfolio
          </motion.p>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-gray-900 dark:text-white">Hi, I'm </span>
            <span className="bg-gradient-to-r from-primary via-primary-light to-secondary bg-clip-text text-transparent">
              {firstName}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4 font-medium"
          >
            {profile.title}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto mb-8"
          >
            {profile.subtitle || profile.bio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/projects"
              className="px-8 py-3.5 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5"
            >
              View Projects
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3.5 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition-all duration-300 hover:-translate-y-0.5"
            >
              Contact Me
            </Link>
          </motion.div>

          {/* Social links */}
          {socialLinks.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center justify-center gap-4 mt-10"
            >
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-dark-lighter"
                  aria-label={label}
                >
                  <Icon size={22} />
                </a>
              ))}
            </motion.div>
          )}
        </motion.div>

      </div>
    </section>
  )
}

// ==================== About Section ====================

function AboutSection({ profile }) {
  const initials = profile.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'RY'

  return (
    <Section id="about" title="About Me" subtitle="A little bit about who I am and what I do">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Image / Initials */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="w-full aspect-square max-w-md mx-auto rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-dark-lighter">
            {profile.profileImage ? (
              <img src={profile.profileImage} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-8">
                <div className="text-7xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                  {initials}
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{profile.name}</p>
              </div>
            )}
          </div>
          {/* Decorative element */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-2xl -z-10" />
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-secondary/10 rounded-2xl -z-10" />
        </motion.div>

        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {profile.bio && (
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              {profile.bio}
            </p>
          )}
        </motion.div>
      </div>
    </Section>
  )
}

// ==================== Skills Section ====================

function SkillsSection() {
  const [activeTab, setActiveTab] = useState(null)
  const [apiSkills, setApiSkills] = useState(null)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await getSkills()
        const grouped = res.data?.grouped || {}
        if (Object.keys(grouped).length > 0) {
          setApiSkills(grouped)
        }
      } catch {
        // use fallback
      }
    }
    fetchSkills()
  }, [])

  const skillsData = apiSkills || fallbackSkills
  const categories = Object.keys(skillsData)
  const currentTab = (activeTab && categories.includes(activeTab)) ? activeTab : categories[0]

  return (
    <Section
      id="skills"
      title="Skills & Technologies"
      subtitle="Tools and technologies I work with"
      className="bg-white dark:bg-dark-card/30"
    >
      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              currentTab === cat
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'bg-gray-100 dark:bg-dark-lighter text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-lighter/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills grid */}
      <motion.div
        key={currentTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-3xl mx-auto"
      >
        {skillsData[currentTab]?.map((skill, i) => (
          <SkillBadge key={skill.name || skill._id} icon={skill.icon} name={skill.name} index={i} />
        ))}
      </motion.div>
    </Section>
  )
}

// ==================== Featured Projects Section ====================

function FeaturedProjectsSection({ projects }) {
  return (
    <Section
      id="projects"
      title="Featured Projects"
      subtitle="Some of my recent work that I'm proud of"
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.slice(0, 3).map((project, i) => (
          <ProjectCard key={project._id || i} project={project} index={i} />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mt-10"
      >
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-6 py-3 text-primary font-semibold hover:bg-primary/10 rounded-xl transition-all group"
        >
          View All Projects
          <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </Section>
  )
}

// ==================== Experience Timeline ====================

function ExperienceSection({ experience }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Present'
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  return (
    <Section
      id="experience"
      title="Experience"
      subtitle="My professional journey"
      className="bg-white dark:bg-dark-card/30"
    >
      <div className="max-w-3xl mx-auto">
        {experience.map((exp, i) => (
          <motion.div
            key={exp._id || i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative pl-8 pb-10 last:pb-0"
          >
            {/* Timeline line */}
            {i < experience.length - 1 && (
              <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-gray-200 dark:bg-dark-lighter" />
            )}
            {/* Timeline dot */}
            <div className="absolute left-0 top-1.5 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <FaBriefcase className="text-white" size={10} />
            </div>

            {/* Content card */}
            <div className="bg-white dark:bg-dark-card p-5 rounded-xl shadow-md border border-gray-100 dark:border-dark-lighter hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {exp.role}
                </h3>
                <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full w-fit">
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              <p className="text-primary font-semibold text-sm mb-2">{exp.company}</p>
              {exp.description && exp.description.includes('•') ? (
                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 text-sm leading-relaxed space-y-1">
                  {exp.description.split('•').filter(item => item.trim()).map((item, idx) => (
                    <li key={idx}>{item.trim()}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {exp.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

// ==================== Achievements Section ====================

function AchievementsSection({ achievements }) {
  return (
    <Section
      id="achievements"
      title="Achievements"
      subtitle="Milestones and recognitions"
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {achievements.map((item, i) => (
          <motion.div
            key={item._id || i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-md border border-gray-100 dark:border-dark-lighter hover:shadow-lg transition-shadow group"
          >
            {item.image ? (
              item.link ? (
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="block mb-4 overflow-hidden rounded-xl">
                  <img src={item.image} alt={item.title} className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300" />
                </a>
              ) : (
                <img src={item.image} alt={item.title} className="w-full h-40 object-cover rounded-xl mb-4" />
              )
            ) : (
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <FaTrophy className="text-accent text-xl" />
              </div>
            )}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {item.link ? (
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  {item.title}
                </a>
              ) : item.title}
            </h3>
            {item.date && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                {new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
            )}
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

// ==================== Blog Preview Section ====================

function BlogPreviewSection({ blogs }) {
  return (
    <Section
      id="blogs"
      title="Latest Blogs"
      subtitle="Thoughts, tutorials, and insights"
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.slice(0, 3).map((blog, i) => (
          <BlogCard key={blog._id || i} blog={blog} index={i} />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mt-10"
      >
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 px-6 py-3 text-primary font-semibold hover:bg-primary/10 rounded-xl transition-all group"
        >
          View All Blogs
          <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </Section>
  )
}

// ==================== Contact CTA Section ====================

function ContactCTASection() {
  return (
    <section className="py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-12 md:p-16 shadow-2xl shadow-primary/20"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Let's Work Together
        </h2>
        <p className="text-white/80 text-lg max-w-xl mx-auto mb-8">
          Have a project in mind? I'd love to hear about it. Let's discuss how
          I can help bring your ideas to life.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group"
        >
          Get in Touch
          <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </section>
  )
}

// ==================== Main Home Page ====================

export default function Home() {
  const { profile } = useProfile()
  const [projects, setProjects] = useState(fallbackProjects)
  const [blogs, setBlogs] = useState(fallbackBlogs)
  const [experience, setExperience] = useState(fallbackExperience)
  const [achievements, setAchievements] = useState(fallbackAchievements)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, blogRes, expRes, achRes] = await Promise.allSettled([
          getProjects(),
          getBlogs(),
          getExperience(),
          getAchievements(),
        ])
        if (projRes.status === 'fulfilled' && projRes.value.data?.length) {
          setProjects(projRes.value.data)
        }
        if (blogRes.status === 'fulfilled' && blogRes.value.data?.length) {
          setBlogs(blogRes.value.data)
        }
        if (expRes.status === 'fulfilled' && expRes.value.data?.length) {
          setExperience(expRes.value.data)
        }
        if (achRes.status === 'fulfilled' && achRes.value.data?.length) {
          setAchievements(achRes.value.data)
        }
      } catch (err) {
        // Fallback data already set
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <HeroSection profile={profile} />
      <AboutSection profile={profile} />
      <SkillsSection />
      <FeaturedProjectsSection projects={projects} />
      <ExperienceSection experience={experience} />
      <AchievementsSection achievements={achievements} />
      <BlogPreviewSection blogs={blogs} />
      <ContactCTASection />
    </>
  )
}
