import { motion } from 'framer-motion'
import { ICON_MAP } from './IconPicker'

export default function SkillBadge({ icon, name, index = 0 }) {
  const renderIcon = () => {
    if (!icon) return null
    // If icon is a React component (from fallback data)
    if (typeof icon === 'function') {
      const Icon = icon
      return <Icon className="text-3xl text-primary" />
    }
    // If icon is a key from ICON_MAP (e.g., "FaReact")
    if (typeof icon === 'string' && ICON_MAP[icon]) {
      const Icon = ICON_MAP[icon].component
      return <Icon className="text-3xl text-primary" />
    }
    // If icon is a FontAwesome class string (legacy)
    if (typeof icon === 'string' && icon.includes('fa')) {
      return <i className={`${icon} text-3xl text-primary`} />
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.05, y: -4 }}
      className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-dark-card rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-dark-lighter cursor-default"
    >
      {renderIcon()}
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
        {name}
      </span>
    </motion.div>
  )
}
