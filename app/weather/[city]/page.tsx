import DetailedWeather from "@/components/detailed-weather"

export default function WeatherPage({
  params,
}: {
  params: { city: string }
}) {
  const decodedCity = decodeURIComponent(params.city)

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#C5CAE9] via-[#B2DFDB] to-[#FFF9C4] p-4">
      <DetailedWeather city={decodedCity} />
    </main>
  )
}

