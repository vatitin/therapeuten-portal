import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import { useEffect, useRef, useState, type FormEvent } from 'react';

interface TherapistLocation {
  id: string;
  latitude: number;
  longitude: number;
  name?: string;
}

export function Map() {
  const [locations, setLocations] = useState<TherapistLocation[]>([]);
  const [address, setAddress] = useState('');
  const [distance, setDistance] = useState(10);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  // initialize map once
  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=PPUA691BI7yVJ7CQUGBI`,
      center: [10.0, 51.0],
      zoom: 5,
    });

    mapRef.current = map;
    return () => map.remove();
  }, []);

  // clear and render markers when locations update
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // add new markers
    locations.forEach(loc => {
      const marker = new maplibregl.Marker()
        .setLngLat([loc.longitude, loc.latitude]);

      if (loc.name || loc.id) {
        marker.setPopup(
          new maplibregl.Popup({ offset: 25 })
            .setText(loc.name || loc.id)
        );
      }

      marker.addTo(map);
      markersRef.current.push(marker);
    });
  }, [locations]);

  // handle form submission: geocode + fetch locations
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!address) return;
    try {
      // geocode address using MapTiler
      const geoRes = await fetch(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(address)}.json?key=PPUA691BI7yVJ7CQUGBI&limit=1`
      );
      const geoData = await geoRes.json();
      if (!geoData.features?.length) {
        alert('Address not found');
        return;
      }
      const [lng, lat] = geoData.features[0].geometry.coordinates;

      // center map on the result
      mapRef.current?.flyTo({ center: [lng, lat], zoom: 12 });

      // fetch therapist locations within distance
      const locRes = await fetch(
        `http://localhost:3001/patient/locations?lng=${lng}&lat=${lat}&distance=${distance}`
      );
      if (!locRes.ok) throw new Error(`HTTP ${locRes.status}`);
      const data: TherapistLocation[] = await locRes.json();
      setLocations(data);
    } catch (err) {
      console.error('Search error', err);
      alert('Failed to fetch locations');
    }
  };

  return (
    <div className="container my-4">
      <form onSubmit={handleSubmit} className="mb-3 flex gap-2">
        <input
          type="text"
          placeholder="Enter address"
          value={address}
          onChange={e => setAddress(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Distance (km)"
          value={distance}
          onChange={e => setDistance(Number(e.target.value))}
          className="w-24 p-2 border rounded"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Search
        </button>
      </form>

      <div
        ref={mapContainer}
        className="w-full rounded shadow"
        style={{ height: '50vh' }}
      />
    </div>
  );
}
