import type { WeatherData, DetailedWeatherData, ForecastData } from "./types"

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
const BASE_URL = "https://api.openweathermap.org/data/2.5"

export async function fetchWeatherData(city: string): Promise<WeatherData> {
  const response = await fetch(`${BASE_URL}/weather?q=${encodeURIComponent(city)},IN&units=metric&appid=${API_KEY}`)

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`)
  }

  return response.json()
}

export async function fetchForecastData(city: string): Promise<ForecastData> {
  const response = await fetch(`${BASE_URL}/forecast?q=${encodeURIComponent(city)},IN&units=metric&appid=${API_KEY}`)

  if (!response.ok) {
    throw new Error(`Forecast API error: ${response.status}`)
  }

  return response.json()
}

export async function fetchDetailedWeather(city: string): Promise<DetailedWeatherData> {
  // First get coordinates for the city
  const geoResponse = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)},IN&limit=1&appid=${API_KEY}`,
  )

  if (!geoResponse.ok) {
    throw new Error(`Geocoding API error: ${geoResponse.status}`)
  }

  const [location] = await geoResponse.json()

  if (!location) {
    throw new Error(`City not found: ${city}`)
  }

  // Then get detailed weather data
  const weatherResponse = await fetch(
    `${BASE_URL}/onecall?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${API_KEY}`,
  )

  if (!weatherResponse.ok) {
    throw new Error(`Weather API error: ${weatherResponse.status}`)
  }

  return weatherResponse.json()
}

