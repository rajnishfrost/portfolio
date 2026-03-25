import { motion } from 'framer-motion'
import { FaArrowRight } from 'react-icons/fa'

export default function BlogCard({ blog, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-dark-lighter"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-secondary/20 to-primary/20">
        {blog.image ? (
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl font-bold text-secondary/30">
              {blog.title?.charAt(0) || 'B'}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {blog.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-primary/10 dark:bg-primary/20 text-primary text-xs font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {blog.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
          {blog.description}
        </p>

        <a
          href={blog.url || blog.link || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all"
        >
          Read More <FaArrowRight size={12} />
        </a>
      </div>
    </motion.div>
  )
}
