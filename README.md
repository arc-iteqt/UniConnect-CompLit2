# 🛰️ UniConnect Locator

A simple, school-wide item tracking system that helps students and staff locate lost belongings using small Bluetooth beacons and crowd-sourced phone data — like a private version of Apple AirTags or Tile, built just for our campus.

---

## 🚀 Overview

Each tagged item broadcasts a Bluetooth signal using a small, inexpensive beacon.  
When a student or staff member’s phone (running our app) detects a beacon nearby, it logs the beacon’s ID and the phone’s GPS coordinates, then uploads them to the cloud.  
Our web dashboard displays the **last known location** of every tagged item on a map.

---

## 🧱 Features

- 📡 Detect Bluetooth beacons using nearby phones
- 🗺️ View beacon locations on an interactive map
- 🔍 Search and filter items by name or ID
- 🕓 See “last seen” timestamps and building locations
- 💻 Dashboard view for administrators
- 📱 Mobile-friendly design for students and staff

---

## ⚙️ Tech Stack

| Category | Technology |
|-----------|-------------|
| Frontend | React |
| Hosting | Vercel |
| Backend | Firebase or Supabase (real-time database + API) |
| Maps | Google Maps JS API or Leaflet.js |
| Authentication (optional) | Firebase Auth or Supabase Auth |
| Styling | Tailwind CSS or simple CSS modules |
