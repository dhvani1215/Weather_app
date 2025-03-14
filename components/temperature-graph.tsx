"use client"

import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend)

interface TemperatureGraphProps {
  hourly: Array<{
    dt: number
    temp: number
  }>
}

export default function TemperatureGraph({ hourly }: TemperatureGraphProps) {
  const next24Hours = hourly.slice(0, 24)

  const data = {
    labels: next24Hours.map((hour) =>
      new Date(hour.dt * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        hour12: false,
      }),
    ),
    datasets: [
      {
        fill: true,
        label: "Temperature °C",
        data: next24Hours.map((hour) => hour.temp),
        borderColor: "rgb(255, 196, 0)",
        backgroundColor: "rgba(255, 196, 0, 0.1)",
        tension: 0.4,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        callbacks: {
          label: (context: any) => `${context.parsed.y}°C`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          callback: (value: number) => `${value}°C`,
        },
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
  }

  return (
    <div className="w-full h-[300px]">
      <Line data={data} options={options} />
    </div>
  )
}

