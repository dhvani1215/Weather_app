import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, CloudDrizzle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ForecastData } from "@/lib/types"

interface ForecastDisplayProps {
  forecastData: ForecastData
}

export default function ForecastDisplay({ forecastData }: ForecastDisplayProps) {
  const getWeatherIcon = (iconCode: string, size = 6) => {
    // Map OpenWeatherMap icon codes to Lucide icons
    const iconMap: Record<string, JSX.Element> = {
      "01d": <Sun className={`h-${size} w-${size} text-yellow-500`} />,
      "01n": <Sun className={`h-${size} w-${size} text-yellow-400`} />,
      "02d": <Cloud className={`h-${size} w-${size} text-gray-400`} />,
      "02n": <Cloud className={`h-${size} w-${size} text-gray-400`} />,
      "03d": <Cloud className={`h-${size} w-${size} text-gray-400`} />,
      "03n": <Cloud className={`h-${size} w-${size} text-gray-400`} />,
      "04d": <Cloud className={`h-${size} w-${size} text-gray-500`} />,
      "04n": <Cloud className={`h-${size} w-${size} text-gray-500`} />,
      "09d": <CloudDrizzle className={`h-${size} w-${size} text-blue-400`} />,
      "09n": <CloudDrizzle className={`h-${size} w-${size} text-blue-400`} />,
      "10d": <CloudRain className={`h-${size} w-${size} text-blue-500`} />,
      "10n": <CloudRain className={`h-${size} w-${size} text-blue-500`} />,
      "11d": <CloudLightning className={`h-${size} w-${size} text-yellow-600`} />,
      "11n": <CloudLightning className={`h-${size} w-${size} text-yellow-600`} />,
      "13d": <CloudSnow className={`h-${size} w-${size} text-blue-200`} />,
      "13n": <CloudSnow className={`h-${size} w-${size} text-blue-200`} />,
      "50d": <CloudFog className={`h-${size} w-${size} text-gray-300`} />,
      "50n": <CloudFog className={`h-${size} w-${size} text-gray-300`} />,
    }

    return iconMap[iconCode] || <Cloud className={`h-${size} w-${size} text-gray-400`} />
  }

  const formatDay = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString([], {
      weekday: "short",
    })
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
    })
  }

  // Group forecast by day
  const groupedForecast = forecastData.list.reduce(
    (acc, item) => {
      const day = formatDay(item.dt)
      if (!acc[day]) {
        acc[day] = []
      }
      acc[day].push(item)
      return acc
    },
    {} as Record<string, typeof forecastData.list>,
  )

  return (
    <Card className="border-blue-200 dark:border-blue-900">
      <CardHeader className="bg-blue-50 dark:bg-blue-900/30 pb-2">
        <CardTitle>5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 overflow-x-auto">
        <div className="grid grid-cols-1 gap-4">
          {Object.entries(groupedForecast)
            .slice(0, 5)
            .map(([day, forecasts]) => (
              <div key={day} className="space-y-2">
                <h3 className="font-medium text-gray-700 dark:text-gray-200">{day}</h3>
                <div className="flex space-x-4 pb-2 overflow-x-auto">
                  {forecasts.map((forecast, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center min-w-[80px] p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                    >
                      <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(forecast.dt)}</span>
                      {getWeatherIcon(forecast.weather[0].icon, 5)}
                      <span className="mt-1 font-medium">{Math.round(forecast.main.temp)}°C</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {forecast.weather[0].description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}

