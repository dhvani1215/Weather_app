"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import WeatherCard from "./weather-card"
import VoiceInput from "./voice-input"
import { fetchWeatherData } from "@/lib/weather-api"
import type { WeatherData } from "@/lib/types"

const popularCities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
]

export default function VatavaranDashboard() {
  const [cities, setCities] = useState<string[]>(popularCities)
  const [newCity, setNewCity] = useState("")
  const [weatherData, setWeatherData] = useState<Record<string, WeatherData>>({})
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const addCity = async (cityName: string) => {
    const city = cityName.trim()
    if (!city) return

    if (cities.includes(city)) {
      toast({
        title: "City already added",
        description: `${city} is already in your dashboard`,
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const data = await fetchWeatherData(city)
      setWeatherData((prev) => ({ ...prev, [city]: data }))
      setCities((prev) => [...prev, city])
      setNewCity("")
      toast({
        title: "City added",
        description: `Weather data for ${city} has been added to your dashboard`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `Could not find weather data for ${city}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const removeCity = (city: string) => {
    setCities((prev) => prev.filter((c) => c !== city))
    setWeatherData((prev) => {
      const newData = { ...prev }
      delete newData[city]
      return newData
    })
  }

  const handleVoiceInput = (text: string) => {
    // Extract city name from voice input
    const cityMatch = text.match(/(?:weather|temperature|forecast)(?:\s+in|\s+for|\s+at)?\s+([a-zA-Z\s]+)$/i)
    if (cityMatch && cityMatch[1]) {
      const detectedCity = cityMatch[1].trim()
      addCity(detectedCity)
    }
  }

  // Fetch weather data for initial cities
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true)
      const data: Record<string, WeatherData> = {}

      for (const city of cities) {
        try {
          const weatherData = await fetchWeatherData(city)
          data[city] = weatherData
        } catch (error) {
          console.error(`Error fetching data for ${city}:`, error)
        }
      }

      setWeatherData(data)
      setLoading(false)
    }

    fetchInitialData()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 text-indigo-900">वातावरण (Vatavaran)</h1>
        <p className="text-indigo-700 mb-6">Indian Cities Weather Dashboard</p>

        <Card className="p-4 bg-white/80 backdrop-blur-sm max-w-md mx-auto">
          <div className="flex gap-2 mb-4">
            <Input
              type="text"
              placeholder="Enter city name..."
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addCity(newCity)}
              className="bg-white"
            />
            <Button onClick={() => addCity(newCity)} disabled={loading || !newCity}>
              Add City
            </Button>
          </div>

          <VoiceInput onResult={handleVoiceInput} />
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cities.map((city) => (
          <WeatherCard
            key={city}
            city={city}
            weatherData={weatherData[city]}
            onRemove={() => removeCity(city)}
            loading={loading}
          />
        ))}
      </div>

      {cities.length === 0 && !loading && (
        <div className="text-center text-gray-500 mt-8">No cities added. Start by adding a city above!</div>
      )}
    </div>
  )
}

