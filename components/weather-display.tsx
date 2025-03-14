import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Wind,
  Droplets,
  Thermometer,
  CloudDrizzle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { WeatherData } from "@/lib/types"

interface WeatherDisplayProps {
  weatherData: WeatherData
}

export default function WeatherDisplay({ weatherData }: WeatherDisplayProps) {
  const getWeatherIcon = (iconCode: string) => {
    // Map OpenWeatherMap icon codes to Lucide icons
    const iconMap: Record<string, JSX.Element> = {
      "01d": <Sun className="h-12 w-12 text-yellow-500" />,
      "01n": <Sun className="h-12 w-12 text-yellow-400" />,
      "02d": <Cloud className="h-12 w-12 text-gray-400" />,
      "02n": <Cloud className="h-12 w-12 text-gray-400" />,
      "03d": <Cloud className="h-12 w-12 text-gray-400" />,
      "03n": <Cloud className="h-12 w-12 text-gray-400" />,
      "04d": <Cloud className="h-12 w-12 text-gray-500" />,
      "04n": <Cloud className="h-12 w-12 text-gray-500" />,
      "09d": <CloudDrizzle className="h-12 w-12 text-blue-400" />,
      "09n": <CloudDrizzle className="h-12 w-12 text-blue-400" />,
      "10d": <CloudRain className="h-12 w-12 text-blue-500" />,
      "10n": <CloudRain className="h-12 w-12 text-blue-500" />,
      "11d": <CloudLightning className="h-12 w-12 text-yellow-600" />,
      "11n": <CloudLightning className="h-12 w-12 text-yellow-600" />,
      "13d": <CloudSnow className="h-12 w-12 text-blue-200" />,
      "13n": <CloudSnow className="h-12 w-12 text-blue-200" />,
      "50d": <CloudFog className="h-12 w-12 text-gray-300" />,
      "50n": <CloudFog className="h-12 w-12 text-gray-300" />,
    }

    return iconMap[iconCode] || <Cloud className="h-12 w-12 text-gray-400" />
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="overflow-hidden border-blue-200 dark:border-blue-900">
      <CardHeader className="bg-blue-50 dark:bg-blue-900/30 pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>Current Weather</span>
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString([], {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          {getWeatherIcon(weatherData.weather[0].icon)}

          <h3 className="mt-2 text-xl font-bold">{Math.round(weatherData.main.temp)}°C</h3>

          <p className="text-gray-600 dark:text-gray-300 capitalize">{weatherData.weather[0].description}</p>

          <div className="mt-4 w-full grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-red-500" />
              <span className="text-sm">Feels like: {Math.round(weatherData.main.feels_like)}°C</span>
            </div>

            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Humidity: {weatherData.main.humidity}%</span>
            </div>

            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Wind: {Math.round(weatherData.wind.speed)} m/s</span>
            </div>

            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">Sunrise: {formatTime(weatherData.sys.sunrise)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

