import { Clock, CheckCircle, XCircle, Globe } from 'lucide-react'

const CONFIG = {
  pending:   { cls: 'badge-pending',   Icon: Clock,        label: 'Pending' },
  approved:  { cls: 'badge-approved',  Icon: CheckCircle,  label: 'Approved' },
  rejected:  { cls: 'badge-rejected',  Icon: XCircle,      label: 'Rejected' },
  published: { cls: 'badge-published', Icon: Globe,        label: 'Published' },
}

export const StatusBadge = ({ status }) => {
  const { cls, Icon, label } = CONFIG[status] || CONFIG.pending
  return (
    <span className={cls}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  )
}
