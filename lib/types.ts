export interface WeatherData {
  name: string
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  wind: {
    speed: number
    deg: number
  }
  sys: {
    country: string
    sunrise: number
    sunset: number
  }
  dt: number
  timezone: number
}

export interface ForecastItem {
  dt: number
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  wind: {
    speed: number
    deg: number
  }
  dt_txt: string
}

export interface ForecastData {
  city: {
    id: number
    name: string
    country: string
    sunrise: number
    sunset: number
  }
  list: ForecastItem[]
}

export interface DetailedWeatherData {
  current: {
    dt: number
    sunrise: number
    sunset: number
    temp: number
    feels_like: number
    pressure: number
    humidity: number
    dew_point: number
    uvi: number
    clouds: number
    visibility: number
    wind_speed: number
    wind_deg: number
    weather: Array<{
      id: number
      main: string
      description: string
      icon: string
    }>
    rain?: {
      "1h": number
    }
  }
  hourly: Array<{
    dt: number
    temp: number
    feels_like: number
    pressure: number
    humidity: number
    wind_speed: number
    wind_deg: number
    weather: Array<{
      id: number
      main: string
      description: string
      icon: string
    }>
  }>
  daily: Array<{
    dt: number
    sunrise: number
    sunset: number
    temp: {
      day: number
      min: number
      max: number
      night: number
      eve: number
      morn: number
    }
    feels_like: {
      day: number
      night: number
      eve: number
      morn: number
    }
    pressure: number
    humidity: number
    wind_speed: number
    wind_deg: number
    weather: Array<{
      id: number
      main: string
      description: string
      icon: string
    }>
  }>
  alerts?: Array<{
    sender_name: string
    event: string
    start: number
    end: number
    description: string
  }>
}

