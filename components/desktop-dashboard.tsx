"use client"

import { useState, useEffect } from "react"
import {
  LayoutDashboard,
  Radio,
  BarChart3,
  Settings,
  Search,
  Bell,
  MapPin,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabaseClient"

interface Beacon {
  id: string
  item: string
  location: string
  time?: string
  last_seen?: string
  lat?: number
  lng?: number
}

interface RealtimePayload {
  eventType: "INSERT" | "UPDATE" | "DELETE"
  schema: string
  table: string
  commit_timestamp: string
  new: Partial<Beacon>
  old: Partial<Beacon>
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Radio, label: "Beacons", active: false },
  { icon: BarChart3, label: "Reports", active: false },
  { icon: Settings, label: "Settings", active: false },
]

export function DesktopDashboard() {
  const [beacons, setBeacons] = useState<Beacon[]>([])
  const [selectedBeacon, setSelectedBeacon] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch beacons from Supabase
  useEffect(() => {
    const fetchBeacons = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("beacons")
        .select("*")
        .order("last_seen", { ascending: false })

      if (error) console.error("Error fetching beacons:", error)
      else setBeacons(data || [])
      setLoading(false)
    }

    fetchBeacons()
  }, [])

  // Listen for realtime changes
  useEffect(() => {
    const channel = supabase
      .channel("beacons-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "beacons" },
        (payload: RealtimePayload) => {
          console.log("Realtime update:", payload)
          setBeacons((current) => {
            if (payload.eventType === "INSERT") return [payload.new as Beacon, ...current]
            if (payload.eventType === "UPDATE")
              return current.map((b) => (b.id === payload.new.id ? (payload.new as Beacon) : b))
            if (payload.eventType === "DELETE")
              return current.filter((b) => b.id !== payload.old.id)
            return current
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const selected = beacons.find((b) => b.id === selectedBeacon)

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <aside className="w-64 border-r border-sidebar-border bg-sidebar flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Radio className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold text-sidebar-foreground">TrackPack</h1>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant={item.active ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-11",
                item.active && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Find by student or item" className="pl-10 bg-muted/50 border-0" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground text-xs">
                3
              </Badge>
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Map and Beacon List */}
        <div className="flex-1 flex overflow-hidden">
          {/* Map View */}
          <div className="flex-1 relative bg-muted/30">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-br from-muted/50 to-muted/20 relative overflow-hidden">
                {/* Grid Background */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                </div>

                {/* Beacon Pins */}
                {beacons.map((beacon: Beacon, index: number) => (
                  <button
                    key={beacon.id}
                    onClick={() => setSelectedBeacon(beacon.id)}
                    className={cn(
                      "absolute w-10 h-10 rounded-full shadow-lg transition-all hover:scale-110",
                      selectedBeacon === beacon.id
                        ? "bg-primary ring-4 ring-primary/30"
                        : "bg-secondary hover:bg-secondary/80"
                    )}
                    style={{
                      left: `${20 + index * 15}%`,
                      top: `${30 + (index % 3) * 20}%`,
                    }}
                  >
                    <MapPin className="w-6 h-6 text-white m-auto" />
                  </button>
                ))}

                {/* Selected Beacon Info */}
                {selected && (
                  <Card className="absolute top-4 left-4 p-4 w-72 shadow-xl">
                    <h3 className="font-semibold text-card-foreground mb-2">
                      {selected.item}
                    </h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {selected.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Last seen {selected.time || selected.last_seen || "—"}
                      </div>
                    </div>
                    <Badge className="mt-3 bg-primary text-primary-foreground">
                      {selected.id}
                    </Badge>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Beacon List Panel */}
          <aside className="w-96 border-l border-border bg-card overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-card-foreground mb-4">
                Active Beacons
              </h2>

              {loading ? (
                <p className="text-sm text-muted-foreground">Loading beacons...</p>
              ) : beacons.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active beacons found.</p>
              ) : (
                <div className="space-y-3">
                  {beacons.map((beacon: Beacon) => (
                    <Card
                      key={beacon.id}
                      className={cn(
                        "p-4 cursor-pointer transition-all hover:shadow-md",
                        selectedBeacon === beacon.id && "ring-2 ring-primary"
                      )}
                      onClick={() => setSelectedBeacon(beacon.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-card-foreground text-sm">
                          {beacon.item}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {beacon.id}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          {beacon.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {beacon.time || beacon.last_seen || "—"}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
