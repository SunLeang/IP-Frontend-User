import type React from "react"
import { ArrowDown, ArrowUp } from "lucide-react"

interface StatCardProps {
  title: string
  value: number | string,
  change: {
    value: number
    isIncrease: boolean
    period: string
  }
  icon: React.ReactNode
}

export function StatCard({ title, value, change, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm text-gray-500 font-medium">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <div className="flex items-center mt-2 text-xs">
            {change.isIncrease ? (
              <span className="flex items-center text-green-500">
                <ArrowUp size={12} className="mr-1" />
                {change.value}% Up
              </span>
            ) : (
              <span className="flex items-center text-red-500">
                <ArrowDown size={12} className="mr-1" />
                {change.value}% Down
              </span>
            )}
            <span className="text-gray-500 ml-1">from {change.period}</span>
          </div>
        </div>
        <div className="bg-blue-50 p-3 rounded-full">{icon}</div>
      </div>
    </div>
  )
}
