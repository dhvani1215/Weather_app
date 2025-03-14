"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { fetchDetailedWeather } from "@/lib/weather-api"
import TemperatureGraph from "./temperature-graph"
import WeeklyForecast from "./weekly-forecast"
import WeatherAlert from "./weather-alert"
import type { DetailedWeatherData } from "@/lib/types"

interface DetailedWeatherProps {
  city: string
}

export default function DetailedWeather({ city }: DetailedWeatherProps) {
  const [weatherData, setWeatherData] = useState<DetailedWeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDetailedWeather(city)
        setWeatherData(data)
      } catch (error) {
        console.error("Error fetching weather data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [city])

  if (loading || !weatherData) {
    return <div>Loading...</div>
  }

  const currentTemp = Math.round(weatherData.current.temp)
  const currentCondition = weatherData.current.weather[0].description
  const feelsLike = Math.round(weatherData.current.feels_like)

  return (
    <div className="container mx-auto max-w-4xl">
      <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <div className="grid gap-6">
        {/* Current Weather Header */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{city}</h1>
              <p className="text-gray-500">
                {new Date().toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-gray-900">{currentTemp}°C</div>
              <p className="text-gray-500 capitalize">{currentCondition}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <i className="fas fa-temperature-high text-red-500 mb-1" />
              <p className="text-sm text-gray-500">Feels Like</p>
              <p className="font-semibold">{feelsLike}°C</p>
            </div>
            <div>
              <i className="fas fa-droplet text-blue-500 mb-1" />
              <p className="text-sm text-gray-500">Humidity</p>
              <p className="font-semibold">{weatherData.current.humidity}%</p>
            </div>
            <div>
              <i className="fas fa-wind text-gray-500 mb-1" />
              <p className="text-sm text-gray-500">Wind Speed</p>
              <p className="font-semibold">{Math.round(weatherData.current.wind_speed)} km/h</p>
            </div>
          </div>
        </Card>

        {/* Weather Alerts */}
        {weatherData.alerts && weatherData.alerts.length > 0 && <WeatherAlert alerts={weatherData.alerts} />}

        {/* Weather Tabs */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <Tabs defaultValue="temperature" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="temperature" className="flex-1">
                <i className="fas fa-temperature-high mr-2" />
                Temperature
              </TabsTrigger>
              <TabsTrigger value="precipitation" className="flex-1">
                <i className="fas fa-cloud-rain mr-2" />
                Precipitation
              </TabsTrigger>
              <TabsTrigger value="wind" className="flex-1">
                <i className="fas fa-wind mr-2" />
                Wind
              </TabsTrigger>
            </TabsList>

            <TabsContent value="temperature" className="p-4">
              <TemperatureGraph hourly={weatherData.hourly} />
            </TabsContent>

            <TabsContent value="precipitation" className="p-4">
              <div className="text-center py-4">
                <div className="text-3xl font-bold mb-2">{weatherData.current.humidity}%</div>
                <p className="text-gray-500">Humidity</p>
                {weatherData.current.rain && (
                  <div className="mt-4">
                    <div className="text-2xl font-bold text-blue-500">{weatherData.current.rain["1h"]} mm</div>
                    <p className="text-gray-500">Rainfall (last hour)</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="wind" className="p-4">
              <div className="text-center py-4">
                <div className="text-3xl font-bold mb-2">{Math.round(weatherData.current.wind_speed)} km/h</div>
                <p className="text-gray-500">Wind Speed</p>
                <div className="mt-4">
                  <div className="text-2xl font-bold">{weatherData.current.wind_deg}°</div>
                  <p className="text-gray-500">Wind Direction</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Weekly Forecast */}
        <WeeklyForecast daily={weatherData.daily} />
      </div>
    </div>
  )
}

