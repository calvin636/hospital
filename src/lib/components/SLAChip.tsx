// SLA status chip component
interface SLAChipProps {
  availability: string
  responseTime: string
  supportLevel: string
  className?: string
}

export function SLAChip({ 
  availability, 
  responseTime, 
  supportLevel, 
  className = '' 
}: SLAChipProps) {
  const getSupportColor = (level: string) => {
    switch (level) {
      case 'enterprise':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'premium':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'priority':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getSupportColor(supportLevel)}`}>
        {supportLevel.charAt(0).toUpperCase() + supportLevel.slice(1)}
      </div>
      <div className="text-xs text-gray-600">
        {availability} uptime
      </div>
      <div className="text-xs text-gray-600">
        {responseTime} response
      </div>
    </div>
  )
}
