"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapComponentProps {
  gpsLat: number | undefined;
  gpsLng: number | undefined;
  setGpsLat: (val: number | undefined) => void;
  setGpsLng: (val: number | undefined) => void;
}

export default function MapComponent({ gpsLat, gpsLng, setGpsLat, setGpsLng }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const marker = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const container = L.DomUtil.get(mapRef.current);
    if (container != null && (container as any)._leaflet_id) {
      return;
    }

    leafletMap.current = L.map(mapRef.current).setView([16.0583, 108.2772], 5); // Center VN
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(leafletMap.current);

    leafletMap.current.on("click", (e) => {
      const { lat, lng } = e.latlng;
      setGpsLat(lat);
      setGpsLng(lng);
      // Province will be updated by the useEffect tracking gpsLat/gpsLng
    });

    return () => {
      if (leafletMap.current) {
        leafletMap.current.off();
        leafletMap.current.remove();
        leafletMap.current = null;
      }
      if (marker.current) {
        marker.current.off();
        marker.current = null;
      }
    };
  }, [setGpsLat, setGpsLng]);

  useEffect(() => {
    if (leafletMap.current && gpsLat !== undefined && gpsLng !== undefined) {
      const center: L.LatLngExpression = [gpsLat, gpsLng];
      
      if (!marker.current) {
        marker.current = L.marker(center, { draggable: true }).addTo(leafletMap.current);
        marker.current.on("dragend", function (event) {
          const m = event.target;
          const pos = m.getLatLng();
          setGpsLat(pos.lat);
          setGpsLng(pos.lng);
        });
      } else {
        marker.current.setLatLng(center);
      }

      // Smoothly fly to the location
      const currentCenter = leafletMap.current.getCenter();
      const distance = L.latLng(gpsLat, gpsLng).distanceTo(currentCenter);
      
      // Only fly if the distance is significant to avoid jitter
      if (distance > 10) {
        leafletMap.current.flyTo(center, 15, {
          duration: 1.5,
          easeLinearity: 0.25
        });
      }
    }
  }, [gpsLat, gpsLng, setGpsLat, setGpsLng]);

  return <div ref={mapRef} style={{ height: "350px", width: "100%", zIndex: 0 }} className="rounded-xl border border-[#E0E0E0] shadow-md transition-all" />;
}
