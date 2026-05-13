import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationMapProps {
  position: [number, number];
  onLocationSelect: (lat: number, lng: number) => void;
}

export default function LocationMap({ position, onLocationSelect }: LocationMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize map
    const map = L.map(containerRef.current).setView(position, 13);
    mapRef.current = map;

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Create custom icon
    const customIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    // Add marker
    const marker = L.marker(position, { icon: customIcon }).addTo(map);
    markerRef.current = marker;

    // Handle map click
    map.on("click", (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
      marker.setLatLng(e.latlng);
    });

    // Cleanup
    return () => {
      map.remove();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update marker position when position prop changes
  useEffect(() => {
    if (markerRef.current && mapRef.current) {
      markerRef.current.setLatLng(position);
      mapRef.current.setView(position);
    }
  }, [position]);

  return <div ref={containerRef} className="w-full h-[300px] rounded-lg overflow-hidden border border-[#E0E0E0]" />;
}
