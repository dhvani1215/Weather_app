"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { WeatherData } from "@/lib/types"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"

interface WeatherCardProps {
  city: string
  weatherData?: WeatherData
  onRemove: () => void
  loading?: boolean
}

export default function WeatherCard({ city, weatherData, onRemove, loading }: WeatherCardProps) {
  const router = useRouter()

  if (loading || !weatherData) {
    return (
      <Card className="overflow-hidden bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center">
            <Skeleton className="h-6 w-24" />
            <Button variant="ghost" size="icon" className="opacity-0" tabIndex={-1}>
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-8 w-24" />
            <div className="grid grid-cols-2 gap-4 w-full">
              <Skeleton className="h-8" />
              <Skeleton className="h-8" />
              <Skeleton className="h-8" />
              <Skeleton className="h-8" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getWeatherIcon = (code: string) => {
    const iconMap: Record<string, string> = {
      "01d": "fa-sun",
      "01n": "fa-moon",
      "02d": "fa-cloud-sun",
      "02n": "fa-cloud-moon",
      "03d": "fa-cloud",
      "03n": "fa-cloud",
      "04d": "fa-clouds",
      "04n": "fa-clouds",
      "09d": "fa-cloud-showers-heavy",
      "09n": "fa-cloud-showers-heavy",
      "10d": "fa-cloud-sun-rain",
      "10n": "fa-cloud-moon-rain",
      "11d": "fa-cloud-bolt",
      "11n": "fa-cloud-bolt",
      "13d": "fa-snowflake",
      "13n": "fa-snowflake",
      "50d": "fa-smog",
      "50n": "fa-smog",
    }

    return iconMap[code] || "fa-cloud"
  }

  return (
    <Card
      className="overflow-hidden bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => router.push(`/weather/${encodeURIComponent(city)}`)}
    >
      <CardHeader className="pb-2 bg-gradient-to-r from-indigo-100 to-purple-100">
        <CardTitle className="flex justify-between items-center">
          <span>{city}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="text-gray-500 hover:text-red-500"
            aria-label={`Remove ${city}`}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <i
            className={`fas ${getWeatherIcon(weatherData.weather[0].icon)} text-4xl mb-4 text-indigo-600`}
            aria-hidden="true"
          />

          <div className="text-3xl font-bold mb-2 text-indigo-900">{Math.round(weatherData.main.temp)}°C</div>

          <p className="text-indigo-700 capitalize mb-4">{weatherData.weather[0].description}</p>

          <div className="grid grid-cols-2 gap-4 w-full text-sm">
            <div className="flex items-center gap-2">
              <i className="fas fa-temperature-high text-red-500" aria-hidden="true" />
              <span>Feels like: {Math.round(weatherData.main.feels_like)}°C</span>
            </div>

            <div className="flex items-center gap-2">
              <i className="fas fa-droplet text-blue-500" aria-hidden="true" />
              <span>Humidity: {weatherData.main.humidity}%</span>
            </div>

            <div className="flex items-center gap-2">
              <i className="fas fa-wind text-gray-500" aria-hidden="true" />
              <span>Wind: {Math.round(weatherData.wind.speed)} m/s</span>
            </div>

            <div className="flex items-center gap-2">
              <i className="fas fa-gauge text-purple-500" aria-hidden="true" />
              <span>Pressure: {weatherData.main.pressure} hPa</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

