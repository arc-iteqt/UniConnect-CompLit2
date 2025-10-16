"use client"

import { useEffect, useState } from "react"
import { DesktopDashboard } from "@/components/desktop-dashboard"
import { MobileApp } from "@/components/mobile-app"

export default function Home() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile ? <MobileApp /> : <DesktopDashboard />
}
