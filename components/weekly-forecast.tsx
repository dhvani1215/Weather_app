interface WeeklyForecastProps {
  daily: Array<{
    dt: number
    temp: {
      min: number
      max: number
    }
    weather: Array<{
      icon: string
      description: string
    }>
  }>
}

export default function WeeklyForecast({ daily }: WeeklyForecastProps) {
  const getWeatherIcon = (icon: string) => {
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

    return iconMap[icon] || "fa-cloud"
  }

  const formatDay = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString([], {
      weekday: "short",
    })
  }

  return (
    <div className="grid grid-cols-7 gap-2">
      {daily.slice(0, 7).map((day, index) => (
        <div key={day.dt} className="bg-white/80 backdrop-blur-sm rounded-lg p-3 text-center">
          <p className="text-sm font-medium mb-2">{index === 0 ? "Today" : formatDay(day.dt)}</p>
          <i
            className={`fas ${getWeatherIcon(day.weather[0].icon)} text-2xl mb-2 text-yellow-500`}
            aria-hidden="true"
          />
          <div className="text-sm">
            <span className="font-medium">{Math.round(day.temp.max)}°</span>
            <span className="text-gray-500 mx-1">/</span>
            <span className="text-gray-500">{Math.round(day.temp.min)}°</span>
          </div>
        </div>
      ))}
    </div>
  )
}

