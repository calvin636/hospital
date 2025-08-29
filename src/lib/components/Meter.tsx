// Usage meter component
import type { UsageMeter } from '../memberContext'

interface MeterProps {
  meter: UsageMeter
  className?: string
}

export function Meter({ meter, className = '' }: MeterProps) {
  const isUnlimited = meter.limit === 'unlimited'
  const percentage = isUnlimited ? 0 : meter.percentage

  return (
    <div className={`bg-white rounded-lg border p-4 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-gray-900">{meter.name}</h3>
        <span className="text-sm text-gray-500">
          {meter.used} {isUnlimited ? '' : `/ ${meter.limit}`} {meter.unit}
        </span>
      </div>
      
      {!isUnlimited && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              percentage >= 90 ? 'bg-red-500' :
              percentage >= 70 ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}
      
      {isUnlimited && (
        <div className="text-sm text-green-600 font-medium">
          ∞ Unlimited
        </div>
      )}
      
      {!isUnlimited && (
        <div className="text-xs text-gray-500 mt-1">
          {percentage.toFixed(1)}% used
        </div>
      )}
    </div>
  )
}
