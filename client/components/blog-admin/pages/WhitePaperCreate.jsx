import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/** Legacy route — opens list with side drawer */
export const WhitePaperCreate = () => {
  const navigate = useNavigate()
  useEffect(() => {
    navigate('/whitepapers', { replace: true, state: { openUpload: true } })
  }, [navigate])
  return null
}
