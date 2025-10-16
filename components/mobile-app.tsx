"use client"

import { useState } from "react"
import { MapPin, Package, Scan, Bell, User, Radio, Clock, ChevronRight, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const mockItems = [
  { id: "BCN-001", item: "Laptop - MacBook Pro", location: "Library - 2nd Floor", time: "2 mins ago" },
  { id: "BCN-002", item: "Backpack - Blue Nike", location: "Cafeteria", time: "5 mins ago" },
  { id: "BCN-003", item: "Textbook - Chemistry", location: "Room 204", time: "12 mins ago" },
]

const mockNotifications = [
  { id: 1, title: "Item Found", message: "Your laptop was detected in the Library", time: "5m ago" },
  { id: 2, title: "Low Battery", message: "Beacon BCN-003 battery is low", time: "1h ago" },
  { id: 3, title: "Item Moved", message: "Your backpack changed location", time: "2h ago" },
]

type Tab = "home" | "items" | "scan" | "notifications" | "profile"

export function MobileApp() {
  const [activeTab, setActiveTab] = useState<Tab>("home")

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pb-20">
        {activeTab === "home" && <HomeScreen />}
        {activeTab === "items" && <ItemsScreen />}
        {activeTab === "scan" && <ScanScreen />}
        {activeTab === "notifications" && <NotificationsScreen />}
        {activeTab === "profile" && <ProfileScreen />}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-card border-t border-border flex items-center justify-around px-4">
        <TabButton icon={MapPin} label="Home" active={activeTab === "home"} onClick={() => setActiveTab("home")} />
        <TabButton
          icon={Package}
          label="My Items"
          active={activeTab === "items"}
          onClick={() => setActiveTab("items")}
        />
        <TabButton icon={Scan} label="Scan" active={activeTab === "scan"} onClick={() => setActiveTab("scan")} />
        <TabButton
          icon={Bell}
          label="Alerts"
          active={activeTab === "notifications"}
          onClick={() => setActiveTab("notifications")}
          badge={3}
        />
        <TabButton
          icon={User}
          label="Profile"
          active={activeTab === "profile"}
          onClick={() => setActiveTab("profile")}
        />
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
  icon: any
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

function HomeScreen() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">TrackPack</h1>
          <p className="text-sm text-muted-foreground">Find your items instantly</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
          <Radio className="w-7 h-7 text-primary-foreground" />
        </div>
      </div>

      {/* Map Card */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
        <div className="aspect-video rounded-xl bg-muted/50 relative overflow-hidden mb-4">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-muted/30 to-muted/10 relative">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]"></div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary shadow-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
            </div>
          </div>
        </div>
        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          <MapPin className="w-4 h-4 mr-2" />
          Center on My Location
        </Button>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 bg-card">
          <div className="text-3xl font-bold text-primary mb-1">5</div>
          <div className="text-sm text-muted-foreground">Active Beacons</div>
        </Card>
        <Card className="p-4 bg-card">
          <div className="text-3xl font-bold text-secondary mb-1">2</div>
          <div className="text-sm text-muted-foreground">Items Nearby</div>
        </Card>
      </div>
    </div>
  )
}

function ItemsScreen() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-foreground mb-6">My Items</h1>

      {mockItems.map((item) => (
        <Card key={item.id} className="p-4 bg-card">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">{item.item}</h3>
              <Badge variant="outline" className="text-xs">
                {item.id}
              </Badge>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {item.location}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Last seen {item.time}
            </div>
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
        <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping"></div>
        <Radio className="w-24 h-24 text-primary" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">Searching for beacons...</h2>
      <p className="text-muted-foreground text-center mb-6">Make sure Bluetooth is enabled</p>

      <Card className="w-full p-4 bg-card space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">BCN-001</span>
          <div className="flex gap-1">
            <div className="w-1 h-4 bg-primary rounded-full"></div>
            <div className="w-1 h-4 bg-primary rounded-full"></div>
            <div className="w-1 h-4 bg-primary rounded-full"></div>
            <div className="w-1 h-4 bg-muted rounded-full"></div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">BCN-002</span>
          <div className="flex gap-1">
            <div className="w-1 h-4 bg-secondary rounded-full"></div>
            <div className="w-1 h-4 bg-secondary rounded-full"></div>
            <div className="w-1 h-4 bg-muted rounded-full"></div>
            <div className="w-1 h-4 bg-muted rounded-full"></div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function NotificationsScreen() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-foreground mb-6">Notifications</h1>

      {mockNotifications.map((notification) => (
        <Card key={notification.id} className="p-4 bg-card">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">{notification.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
              <span className="text-xs text-muted-foreground">{notification.time}</span>
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
          <Settings className="w-5 h-5 mr-3" />
          Settings
        </Button>
        <Button variant="ghost" className="w-full justify-start text-foreground">
          <Bell className="w-5 h-5 mr-3" />
          Notification Preferences
        </Button>
        <Button variant="ghost" className="w-full justify-start text-foreground">
          <Package className="w-5 h-5 mr-3" />
          Manage Beacons
        </Button>
      </Card>

      <div className="text-center text-xs text-muted-foreground pt-4">TrackPack v1.0.0</div>
    </div>
  )
}
