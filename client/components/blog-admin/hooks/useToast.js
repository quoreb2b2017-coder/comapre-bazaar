import { useState, useCallback, useMemo } from 'react'

let toastId = 0

export const useToast = () => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ message, type = 'info', duration = 4000 }) => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, type, duration }])
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    }
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useMemo(
    () => ({
      success: (message, duration) => addToast({ message, type: 'success', duration }),
      error: (message, duration) => addToast({ message, type: 'error', duration: duration || 6000 }),
      info: (message, duration) => addToast({ message, type: 'info', duration }),
      warning: (message, duration) => addToast({ message, type: 'warning', duration }),
    }),
    [addToast]
  )

  return { toasts, toast, removeToast }
}
