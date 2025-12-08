"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Radio,
  Search,
  Bell,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";

interface BeaconLatest {
  id: string;
  beacon_uuid: string;
  rssi: number | null;
  latitude: number | null;
  longitude: number | null;
  seen_at: string;
}

export function DesktopDashboard() {
  const [beacons, setBeacons] = useState<BeaconLatest[]>([]);
  const [selectedBeacon, setSelectedBeacon] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  //
  // 1. Initial fetch
  //
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);

      const { data, error } = await supabase.rpc("get_beacon_with_latest");

      if (error) console.error(error);
      else setBeacons(data || []);

      setLoading(false);
    };

    fetch();
  }, []);

  //
  // 2. Realtime updates
  //
  useEffect(() => {
    const channel = supabase
      .channel("beacon_sightings-stream")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "beacon_sightings" },
        (payload) => {
          const sight = payload.new as BeaconLatest;

          setBeacons((current) => {
            const filtered = current.filter(
              (b) => b.beacon_uuid !== sight.beacon_uuid
            );
            return [{ ...sight }, ...filtered];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const selected = beacons.find((b) => b.beacon_uuid === selectedBeacon);

  //
  // ---- FINAL RETURN (ONLY ONE) ----
  //
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-sidebar flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Radio className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold">UniConnect</h1>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Button variant="default" className="w-full justify-start gap-3 h-11">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Button>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-6">
          <div className="relative max-w-xl w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60" />
            <Input placeholder="Search beacons…" className="pl-10 bg-muted/50" />
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Map + List */}
        <div className="flex flex-1 overflow-hidden">
          {/* Map */}
          <div className="flex-1 relative">
            <iframe
              src="https://app.mappedin.com/map/68e3eb958cda84000b1705d9"
              className="absolute inset-0 w-full h-full border-none"
              allow="fullscreen"
              loading="lazy"
            />

            {selected && (
              <Card className="absolute top-4 left-4 p-4 w-72 shadow-xl">
                <h3 className="font-semibold mb-2">{selected.beacon_uuid}</h3>

                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Last seen: {new Date(selected.seen_at).toLocaleString()}
                </p>

                <p className="text-sm mt-2">RSSI: {selected.rssi ?? "—"}</p>

                <p className="text-sm mt-1">
                  Lat/Lng:{" "}
                  {selected.latitude && selected.longitude
                    ? `${selected.latitude}, ${selected.longitude}`
                    : "—"}
                </p>
              </Card>
            )}
          </div>

          {/* List */}
          <aside className="w-96 border-l bg-card overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Beacons</h2>

              {loading ? (
                <p>Loading…</p>
              ) : beacons.length === 0 ? (
                <p>No beacons yet.</p>
              ) : (
                <div className="space-y-3">
                  {beacons.map((b) => (
                    <Card
                      key={b.beacon_uuid}
                      className="p-4 cursor-pointer hover:shadow-md"
                      onClick={() => setSelectedBeacon(b.beacon_uuid)}
                    >
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">{b.beacon_uuid}</h3>
                        <Badge variant="outline">RSSI {b.rssi}</Badge>
                      </div>

                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {new Date(b.seen_at).toLocaleString()}
                      </p>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}