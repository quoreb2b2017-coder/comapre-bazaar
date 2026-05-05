import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

const ICONS = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
  warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
}

const COLORS = {
  success: 'border-l-green-500',
  error: 'border-l-red-500',
  warning: 'border-l-yellow-500',
  info: 'border-l-blue-500',
}

export const Toast = ({ toasts, removeToast }) => (
  <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
    {toasts.map((toast) => (
      <div
        key={toast.id}
        className={`pointer-events-auto animate-fade-in card shadow-lg border-l-4 ${COLORS[toast.type]} px-4 py-3 flex items-start gap-3`}
      >
        <div className="flex-shrink-0 mt-0.5">{ICONS[toast.type]}</div>
        <p className="flex-1 text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{toast.message}</p>
        <button
          onClick={() => removeToast(toast.id)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    ))}
  </div>
)
