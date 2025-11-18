import { supabase } from "./supabaseClient";

export async function updateBeaconSeen(id: string, rssi: number | null) {
  const { error } = await supabase
    .from("beacons")
    .update({
      last_seen: new Date().toISOString(),
      rssi: rssi,
    })
    .eq("id", id);

  if (error) console.error("Supabase beacon update error:", error);
}

export async function logNotification(title: string, message: string) {
  const { error } = await supabase
    .from("notifications")
    .insert([{ title, message }]);

  if (error) console.error("Supabase notification error:", error);
}