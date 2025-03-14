"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import VoiceRecognition from "./voice-recognition"
import WeatherDisplay from "./weather-display"
import ForecastDisplay from "./forecast-display"
import { fetchWeatherData, fetchForecastData } from "@/lib/weather-api"
import type { WeatherData, ForecastData } from "@/lib/types"

export default function WeatherDashboard() {
  const [city, setCity] = useState<string>("")
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [forecastData, setForecastData] = useState<ForecastData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleVoiceCommand = async (command: string) => {
    // Extract city name from voice command
    const cityRegex = /(?:weather|temperature|forecast)(?:\s+in|\s+for|\s+at)?\s+([a-zA-Z\s]+)$/i
    const match = command.match(cityRegex)

    if (match && match[1]) {
      const detectedCity = match[1].trim()
      setCity(detectedCity)
      await fetchWeather(detectedCity)
    } else {
      toast({
        title: "Command not recognized",
        description: "Try saying 'Weather in [city name]'",
        variant: "destructive",
      })
    }
  }

  const fetchWeather = async (cityName: string) => {
    setLoading(true)
    setError(null)

    try {
      const weather = await fetchWeatherData(cityName)
      setWeatherData(weather)

      const forecast = await fetchForecastData(cityName)
      setForecastData(forecast)

      toast({
        title: "Weather updated",
        description: `Latest weather for ${cityName}`,
      })
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.")
      toast({
        title: "Error",
        description: "Could not fetch weather data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch default weather on first load
  useEffect(() => {
    const defaultCity = "London"
    setCity(defaultCity)
    fetchWeather(defaultCity)
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-4xl font-bold text-center mb-2 text-blue-700 dark:text-blue-400">
          Weather Voice Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">Get weather updates using voice commands</p>

        <VoiceRecognition onResult={handleVoiceCommand} />

        {city && (
          <div className="mt-4 text-center">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
              {loading ? "Loading weather data..." : `Weather for ${city}`}
            </p>
          </div>
        )}
      </div>

      {error && (
        <Card className="mb-6 border-red-300 bg-red-50 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </CardContent>
        </Card>
      )}

      {weatherData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <WeatherDisplay weatherData={weatherData} />

          {forecastData && (
            <div className="md:col-span-2">
              <ForecastDisplay forecastData={forecastData} />
            </div>
          )}
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Try saying "Weather in New York" or "What's the temperature in Tokyo"
        </p>
      </div>
    </div>
  )
}

