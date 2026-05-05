import { useOutletContext } from 'react-router-dom'
import { TrendsAssistantPanel } from '../components/layout/TrendsAssistantPanel'

export const TrendsAssistant = () => {
  const { toast } = useOutletContext()
  return (
    <div className="animate-fade-in w-full px-4 pb-12 sm:px-6">
      <TrendsAssistantPanel toast={toast} compact={false} />
    </div>
  )
}
