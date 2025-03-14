import { Card } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

interface WeatherAlertProps {
  alerts: Array<{
    event: string
    description: string
  }>
}

export default function WeatherAlert({ alerts }: WeatherAlertProps) {
  return (
    <Card className="bg-red-50 border-red-200 p-4">
      {alerts.map((alert, index) => (
        <div key={index} className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">{alert.event}</h3>
            <p className="text-sm text-red-700">{alert.description}</p>
          </div>
        </div>
      ))}
    </Card>
  )
}

