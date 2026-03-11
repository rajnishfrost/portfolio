import { useState, useEffect } from 'react'
import Section from '../components/Section'
import BlogCard from '../components/BlogCard'
import { getBlogs } from '../services/api'

const fallbackBlogs = [
  {
    _id: '1',
    title: 'Understanding Smart Contract Security',
    description: 'A comprehensive guide to common vulnerabilities in Solidity smart contracts and how to prevent reentrancy attacks, overflow bugs, and access control issues.',
    tags: ['Blockchain', 'Solidity', 'Security'],
    link: '#',
  },
  {
    _id: '2',
    title: 'Building Scalable APIs with Node.js',
    description: 'Best practices for building production-ready REST APIs with Express.js, including authentication, rate limiting, caching strategies, and error handling.',
    tags: ['Node.js', 'Backend', 'API'],
    link: '#',
  },
  {
    _id: '3',
    title: 'DeFi Explained: From AMMs to Yield Farming',
    description: 'An in-depth look at decentralized finance protocols, how automated market makers work, and strategies for yield optimization in DeFi.',
    tags: ['DeFi', 'Blockchain', 'Finance'],
    link: '#',
  },
  {
    _id: '4',
    title: 'React Performance Optimization',
    description: 'Advanced techniques for optimizing React applications including memoization, code splitting, lazy loading, and virtual scrolling for large datasets.',
    tags: ['React', 'Frontend', 'Performance'],
    link: '#',
  },
  {
    _id: '5',
    title: 'Introduction to Rust for Web Developers',
    description: 'Why Rust is gaining popularity in the blockchain space and how web developers can start learning Rust for building Solana programs and WASM.',
    tags: ['Rust', 'WebAssembly', 'Blockchain'],
    link: '#',
  },
  {
    _id: '6',
    title: 'Docker & Kubernetes for Full-Stack Apps',
    description: 'A practical guide to containerizing full-stack applications with Docker and deploying them to Kubernetes clusters with auto-scaling.',
    tags: ['DevOps', 'Docker', 'Kubernetes'],
    link: '#',
  },
]

export default function Blogs() {
  const [blogs, setBlogs] = useState(fallbackBlogs)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await getBlogs()
        if (res.data?.length) setBlogs(res.data)
      } catch (err) {
        // Use fallback data
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  return (
    <div className="pt-16 min-h-screen">
      <Section
        title="Blog"
        subtitle="Articles, tutorials, and insights on web development and blockchain"
      >
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog, i) => (
              <BlogCard key={blog._id || i} blog={blog} index={i} />
            ))}
          </div>
        )}

        {blogs.length === 0 && !loading && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">
            No blog posts yet. Check back soon!
          </p>
        )}
      </Section>
    </div>
  )
}
