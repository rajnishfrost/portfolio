import { FaGithub, FaLinkedin, FaEnvelope, FaHeart } from 'react-icons/fa'

const socialLinks = [
  { icon: FaGithub, href: 'https://github.com/rajnishfrost', label: 'GitHub' },
  { icon: FaLinkedin, href: 'https://linkedin.com/in/rajnish-yadav', label: 'LinkedIn' },
  { icon: FaEnvelope, href: 'mailto:rajnishfrost@gmail.com', label: 'Email' },
]

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-dark border-t border-gray-200 dark:border-dark-lighter">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: copyright */}
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Rajnish Yadav. All rights reserved.
          </p>

          {/* Center: social links */}
          <div className="flex items-center gap-4">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-dark-lighter"
                aria-label={label}
              >
                <Icon size={20} />
              </a>
            ))}
          </div>

          {/* Right: built with */}
          <p className="text-gray-500 dark:text-gray-500 text-sm flex items-center gap-1">
            Built with <FaHeart className="text-red-500" size={12} /> & React
          </p>
        </div>
      </div>
    </footer>
  )
}
