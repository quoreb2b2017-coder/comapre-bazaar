// pages/Blogs.jsx
import { useOutletContext } from 'react-router-dom'
import { BlogTable } from '../components/blogs/BlogTable'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const Blogs = () => {
  const { toast } = useOutletContext()
  const navigate = useNavigate()
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Blog Management</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Manage all your AI-generated blogs</p>
        </div>
        <button onClick={() => navigate('/generate')} className="btn-primary">
          <Plus className="w-4 h-4" /> New Blog
        </button>
      </div>
      <BlogTable toast={toast} />
    </div>
  )
}
