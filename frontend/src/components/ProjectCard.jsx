import { motion } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'

function ensureUrl(url) {
  if (!url) return url
  return url.match(/^https?:\/\//) ? url : `https://${url}`
}

export default function ProjectCard({ project, index = 0 }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-dark-lighter"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl font-bold text-primary/30">
              {project.title?.charAt(0) || 'P'}
            </span>
          </div>
        )}
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 gap-3">
          {project.githubUrl && (
            <a
              href={ensureUrl(project.githubUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/40 transition-colors"
            >
              <FaGithub size={20} />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={ensureUrl(project.liveUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/40 transition-colors"
            >
              <FaExternalLinkAlt size={18} />
            </a>
          )}
        </div>
        {/* Category badge */}
        {project.category && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-primary/90 text-white text-xs font-medium rounded-full">
            {project.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <div className="max-h-[3rem] overflow-y-auto mb-4 scrollbar-thin">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {project.description}
          </p>
        </div>
        {/* Tech stack tags */}
        <div className="flex flex-wrap gap-2">
          {project.techStack?.map((tech, i) => (
            <span
              key={i}
              className="px-2.5 py-1 bg-gray-100 dark:bg-dark-lighter text-gray-700 dark:text-gray-300 text-xs font-medium rounded-lg"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
