"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

// 1. Dynamically import the Globe to prevent Next.js "window is not defined" SSR errors
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

// 2. Your exact marker locations converted to lat/lng
const MARKERS = [
  { lat: 14.5995, lng: 120.9842, name: "Manila" },
  { lat: 19.076, lng: 72.8777, name: "Mumbai" },
  { lat: 23.8103, lng: 90.4125, name: "Dhaka" },
  { lat: 30.0444, lng: 31.2357, name: "Cairo" },
  { lat: 39.9042, lng: 116.4074, name: "Beijing" },
  { lat: -23.5505, lng: -46.6333, name: "São Paulo" },
  { lat: 19.4326, lng: -99.1332, name: "Mexico City" },
  { lat: 40.7128, lng: -74.006, name: "New York" },
  { lat: 34.6937, lng: 135.5022, name: "Osaka" },
  { lat: 41.0082, lng: 28.9784, name: "Istanbul" },
];

// 3. The internal Globe Component
function RealEarthGlobe({ className }: { className?: string }) {
  const globeEl = useRef<any>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Auto-rotate the globe once it mounts
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      globeEl.current.controls().enableZoom = false; // Prevents the user from zooming in/out
    }
  }, [mounted]);

  // Don't render anything on the server to avoid hydration mismatches
  if (!mounted) return null;

  return (
    <div
      className={cn(
        "relative mx-auto aspect-square w-full max-w-[800px] flex items-center justify-center cursor-grab active:cursor-grabbing",
        className,
      )}
    >
      <Globe
        ref={globeEl}
        width={800}
        height={800}
        // High-res real Earth textures from NASA via unpkg
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        // Setting background to transparent so it blends with the page background
        backgroundColor="rgba(0,0,0,0)"
        // Injecting the orange markers directly onto the globe surface
        htmlElementsData={MARKERS}
        htmlElement={() => {
          const el = document.createElement("div");
          el.style.backgroundColor = "rgba(251, 100, 21, 0.9)";
          el.style.width = "12px";
          el.style.height = "12px";
          el.style.borderRadius = "50%";
          el.style.boxShadow = "0 0 12px rgba(251, 100, 21, 1)";
          el.style.pointerEvents = "none"; // Ensures the markers don't block grabbing the globe
          return el;
        }}
      />
    </div>
  );
}

// 4. The Default Export required by Next.js for a route
export default function GlobePage() {
  return (
    // Adjust this background color to match your site's theme
    <main className="flex min-h-screen items-center justify-center bg-[#F6F4F0] overflow-hidden">
      <RealEarthGlobe />
    </main>
  );
}
