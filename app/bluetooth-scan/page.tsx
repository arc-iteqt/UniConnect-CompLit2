"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BluetoothScanPage() {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function scanForDevices() {
    setError(null);

    if (!navigator.bluetooth) {
      setError("Your browser does not support Web Bluetooth. Try Chrome or Edge on desktop.");
      return;
    }

    try {
      setIsScanning(true);
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["battery_service"], // optional
      });

      setDevices((prev) => [...prev, device]);

      // You could grab more info if the device exposes GATT services:
      const data = {
        name: device.name || "Unknown Device",
        id: device.id,
        timestamp: new Date().toISOString(),
      };

      await supabase.from("devices").insert(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Scan failed");
    } finally {
      setIsScanning(false);
    }
  }

  return (
    <div className="p-6">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Bluetooth Scanner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={scanForDevices} disabled={isScanning}>
            {isScanning ? "Scanning..." : "Scan for Devices"}
          </Button>

          {error && <p className="text-red-500">{error}</p>}

          <ul className="mt-4 space-y-2">
            {devices.map((device, i) => (
              <li key={i} className="border rounded-md p-2">
                <strong>{device.name || "Unnamed Device"}</strong>
                <br />
                <span className="text-sm text-gray-500">{device.id}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}