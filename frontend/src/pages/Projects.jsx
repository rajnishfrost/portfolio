import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Section from '../components/Section'
import ProjectCard from '../components/ProjectCard'
import { getProjects } from '../services/api'

const categories = ['All', 'Personal', 'Office', 'Freelancing', 'OpenSource']

const fallbackProjects = [
  {
    _id: '1',
    title: 'DeFi Exchange Platform',
    description: 'A decentralized exchange platform with AMM, liquidity pools, and yield farming capabilities built on Ethereum.',
    techStack: ['Solidity', 'React', 'Web3.js', 'Node.js'],
    category: 'Personal',
    github: 'https://github.com/rajnishfrost',
    live: '#',
  },
  {
    _id: '2',
    title: 'NFT Marketplace',
    description: 'Full-featured NFT marketplace for minting, buying, selling, and auctioning digital assets with IPFS storage.',
    techStack: ['Next.js', 'Solidity', 'IPFS', 'Tailwind'],
    category: 'Personal',
    github: 'https://github.com/rajnishfrost',
    live: '#',
  },
  {
    _id: '3',
    title: 'Supply Chain Tracker',
    description: 'Blockchain-based supply chain management system ensuring transparency and traceability of products.',
    techStack: ['Ethereum', 'React', 'Node.js', 'MongoDB'],
    category: 'Freelancing',
    github: 'https://github.com/rajnishfrost',
  },
  {
    _id: '4',
    title: 'Enterprise Dashboard',
    description: 'Real-time analytics dashboard for enterprise resource planning with role-based access control.',
    techStack: ['React', 'TypeScript', 'GraphQL', 'PostgreSQL'],
    category: 'Office',
    live: '#',
  },
  {
    _id: '5',
    title: 'DAO Governance Tool',
    description: 'Decentralized governance platform allowing token holders to create and vote on proposals.',
    techStack: ['Solidity', 'React', 'The Graph', 'IPFS'],
    category: 'OpenSource',
    github: 'https://github.com/rajnishfrost',
  },
  {
    _id: '6',
    title: 'Crypto Portfolio Tracker',
    description: 'Real-time cryptocurrency portfolio tracker with price alerts, charts, and DeFi position tracking.',
    techStack: ['Next.js', 'Node.js', 'WebSocket', 'Redis'],
    category: 'Personal',
    github: 'https://github.com/rajnishfrost',
    live: '#',
  },
]

export default function Projects() {
  const [projects, setProjects] = useState(fallbackProjects)
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getProjects()
        if (res.data?.length) setProjects(res.data)
      } catch (err) {
        // Use fallback data
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const filtered = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory)

  return (
    <div className="pt-16 min-h-screen">
      <Section
        title="Projects"
        subtitle="A collection of my work across different domains"
      >
        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-gray-100 dark:bg-dark-lighter text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-lighter/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <ProjectCard key={project._id || i} project={project} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {filtered.length === 0 && !loading && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">
            No projects found in this category.
          </p>
        )}
      </Section>
    </div>
  )
}
