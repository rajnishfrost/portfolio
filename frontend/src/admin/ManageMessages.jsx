import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTrash, FaEnvelope, FaEnvelopeOpen, FaTimes } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { getMessages, deleteMessage, markMessageRead } from '../services/api'

export default function ManageMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMsg, setSelectedMsg] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const fetchData = async () => {
    try {
      const res = await getMessages()
      setMessages(res.data || [])
    } catch {
      toast.error('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleOpen = async (msg) => {
    setSelectedMsg(msg)
    if (!msg.read) {
      try {
        await markMessageRead(msg._id)
        setMessages((prev) =>
          prev.map((m) => (m._id === msg._id ? { ...m, read: true } : m))
        )
      } catch {
        // Silently fail
      }
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteMessage(deleteId)
      toast.success('Message deleted')
      setDeleteId(null)
      if (selectedMsg?._id === deleteId) setSelectedMsg(null)
      fetchData()
    } catch {
      toast.error('Delete failed')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {unreadCount} unread message{unreadCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-xl shadow-md border border-gray-100 dark:border-dark-lighter overflow-hidden">
        {messages.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-dark-lighter">
            {messages.map((msg) => (
              <div
                key={msg._id}
                onClick={() => handleOpen(msg)}
                className={`flex items-start gap-4 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-lighter/50 transition-colors ${
                  !msg.read ? 'bg-primary/5' : ''
                }`}
              >
                <div className="mt-1">
                  {msg.read ? (
                    <FaEnvelopeOpen className="text-gray-400" size={16} />
                  ) : (
                    <FaEnvelope className="text-primary" size={16} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className={`text-sm ${!msg.read ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                      {msg.name}
                    </p>
                    <span className="text-xs text-gray-400 shrink-0 ml-2">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{msg.subject}</p>
                  <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{msg.message}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteId(msg._id) }}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg shrink-0"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">No messages yet.</p>
        )}
      </div>

      {/* Message detail modal */}
      <AnimatePresence>
        {selectedMsg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMsg(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-dark-lighter">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Message Details</h2>
                <button onClick={() => setSelectedMsg(null)} className="text-gray-400 hover:text-gray-600">
                  <FaTimes size={20} />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">From</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedMsg.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Email</p>
                    <a href={`mailto:${selectedMsg.email}`} className="text-sm text-primary hover:underline">{selectedMsg.email}</a>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Subject</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedMsg.subject}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Message</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{selectedMsg.message}</p>
                </div>
                {selectedMsg.createdAt && (
                  <p className="text-xs text-gray-400">
                    Received: {new Date(selectedMsg.createdAt).toLocaleString()}
                  </p>
                )}
                <div className="flex gap-3 pt-2">
                  <a
                    href={`mailto:${selectedMsg.email}?subject=Re: ${selectedMsg.subject}`}
                    className="flex-1 text-center py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
                  >
                    Reply via Email
                  </a>
                  <button
                    onClick={() => { setDeleteId(selectedMsg._id); setSelectedMsg(null) }}
                    className="py-2.5 px-4 border border-red-200 dark:border-red-500/30 text-red-500 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-dark-card rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Message?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2 border border-gray-200 dark:border-dark-lighter rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-dark-lighter">
                  Cancel
                </button>
                <button onClick={handleDelete} className="flex-1 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
