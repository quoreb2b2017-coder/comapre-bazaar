import { X } from 'lucide-react'
import { useEffect } from 'react'

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl', full: 'max-w-6xl' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizes[size]} animate-fade-in`}>
        <div className="card shadow-2xl overflow-hidden">
          {title && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          <div className="overflow-y-auto max-h-[85vh]">{children}</div>
        </div>
      </div>
    </div>
  )
}

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', danger = false, loading = false }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <div className="p-6">
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{message}</p>
      <div className="flex gap-3 mt-6 justify-end">
        <button onClick={onClose} className="btn-secondary" disabled={loading}>Cancel</button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={danger ? 'btn-danger' : 'btn-primary'}
        >
          {loading ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : confirmText}
        </button>
      </div>
    </div>
  </Modal>
)
