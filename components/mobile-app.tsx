"use client"

import { useState, useEffect } from "react"
import {
  MapPin,
  Package,
  Scan,
  Bell,
  User,
  Radio,
  Clock,
  ChevronRight,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabaseClient"

interface Beacon {
  id: string
  item: string
  location: string
  last_seen?: string
  latitude?: number
  longitude?: number
}

interface Notification {
  id: number
  title: string
  message: string
  created_at: string
}

interface RealtimePayload {
  eventType: "INSERT" | "UPDATE" | "DELETE"
  schema: string
  table: string
  commit_timestamp: string
  new: Partial<Beacon>
  old: Partial<Beacon>
}

type Tab = "home" | "items" | "scan" | "notifications" | "profile"

export function MobileApp() {
  const [activeTab, setActiveTab] = useState<Tab>("home")
  const [beacons, setBeacons] = useState<Beacon[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Fetch data from Supabase
  useEffect(() => {
    const fetchBeacons = async () => {
      const { data, error } = await supabase
        .from("beacons")
        .select("*")
        .order("last_seen", { ascending: false })
      if (error) console.error(error)
      else setBeacons(data || [])
    }

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
      if (error) console.error(error)
      else setNotifications(data || [])
    }

    fetchBeacons()
    fetchNotifications()
  }, [])

  // Realtime for beacons
  useEffect(() => {
    const channel = supabase
      .channel("beacons-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "beacons" },
        (payload: RealtimePayload) => {
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

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex-1 overflow-y-auto pb-20">
        {activeTab === "home" && <HomeScreen beacons={beacons} />}
        {activeTab === "items" && <ItemsScreen beacons={beacons} />}
        {activeTab === "scan" && <ScanScreen />}
        {activeTab === "notifications" && <NotificationsScreen notifications={notifications} />}
        {activeTab === "profile" && <ProfileScreen />}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-card border-t border-border flex items-center justify-around px-4">
        <TabButton icon={MapPin} label="Home" active={activeTab === "home"} onClick={() => setActiveTab("home")} />
        <TabButton icon={Package} label="My Items" active={activeTab === "items"} onClick={() => setActiveTab("items")} />
        <TabButton icon={Scan} label="Scan" active={activeTab === "scan"} onClick={() => setActiveTab("scan")} />
        <TabButton icon={Bell} label="Alerts" active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} badge={notifications.length} />
        <TabButton icon={User} label="Profile" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
      </nav>
    </div>
  )
}

function TabButton({
  icon: Icon,
  label,
  active,
  onClick,
  badge,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  active: boolean
  onClick: () => void
  badge?: number
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 relative transition-colors">
      <div
        className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
          active ? "bg-primary text-primary-foreground" : "text-muted-foreground",
        )}
      >
        <Icon className="w-6 h-6" />
        {badge && (
          <Badge className="absolute top-0 right-0 w-5 h-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground text-xs">
            {badge}
          </Badge>
        )}
      </div>
      <span className={cn("text-xs font-medium", active ? "text-foreground" : "text-muted-foreground")}>{label}</span>
    </button>
  )
}

// ================= Screens =================

function HomeScreen({ beacons }: { beacons: Beacon[] }) {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-foreground">TrackPack</h1>
      <p className="text-sm text-muted-foreground">Find your items instantly</p>
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 bg-card">
          <div className="text-3xl font-bold text-primary mb-1">{beacons.length}</div>
          <div className="text-sm text-muted-foreground">Active Beacons</div>
        </Card>
      </div>
    </div>
  )
}

function ItemsScreen({ beacons }: { beacons: Beacon[] }) {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-foreground mb-6">My Items</h1>
      {beacons.map((b) => (
        <Card key={b.id} className="p-4 bg-card">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-foreground">{b.item}</h3>
            <Badge variant="outline" className="text-xs">{b.id}</Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" /> {b.location}
          </div>
        </Card>
      ))}
    </div>
  )
}

function ScanScreen() {
  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-[calc(100vh-5rem)]">
      <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6 relative">
        <Radio className="w-24 h-24 text-primary" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">Searching for beacons...</h2>
      <p className="text-muted-foreground text-center mb-6">Make sure Bluetooth is enabled</p>
    </div>
  )
}

function NotificationsScreen({ notifications }: { notifications: Notification[] }) {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-foreground mb-6">Notifications</h1>
      {notifications.map((n) => (
        <Card key={n.id} className="p-4 bg-card">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">{n.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{n.message}</p>
              <span className="text-xs text-muted-foreground">{n.created_at}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

function ProfileScreen() {
  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col items-center pt-8 pb-6">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src="/placeholder.svg?height=96&width=96" />
          <AvatarFallback className="bg-primary text-primary-foreground text-2xl">JD</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold text-foreground">John Doe</h2>
        <p className="text-sm text-muted-foreground">john.doe@school.edu</p>
      </div>

      <Card className="p-4 bg-card space-y-4">
        <Button variant="ghost" className="w-full justify-start text-foreground">
          <Settings className="w-5 h-5 mr-3" /> Settings
        </Button>
        <Button variant="ghost" className="w-full justify-start text-foreground">
          <Bell className="w-5 h-5 mr-3" /> Notification Preferences
        </Button>
        <Button variant="ghost" className="w-full justify-start text-foreground">
          <Package className="w-5 h-5 mr-3" /> Manage Beacons
        </Button>
      </Card>

      <div className="text-center text-xs text-muted-foreground pt-4">TrackPack v1.0.0</div>
    </div>
  )
}