import VatavaranDashboard from "@/components/vatavaran-dashboard"
import Script from "next/script"

export default function Home() {
  return (
    <>
      <Script src="https://kit.fontawesome.com/ba9316d898.js" crossOrigin="anonymous" />
      <main className="min-h-screen bg-gradient-to-b from-[#C5CAE9] via-[#B2DFDB] to-[#FFF9C4]">
        <VatavaranDashboard />
      </main>
    </>
  )
}

