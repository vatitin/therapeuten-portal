import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import { useEffect, useRef, useState } from 'react';

function Map(){

  interface TherapistLocation {
  id: string;
  latitude: number;
  longitude: number;
  name?: string;
}
  const [locations, setLocations] = useState<TherapistLocation[]>([]);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const mapContainer = useRef<HTMLDivElement | null>(null);

  // todo check CSP Directives recommendations on https://maplibre.org/maplibre-gl-js/docs/
  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=PPUA691BI7yVJ7CQUGBI`,
      center: [10.0, 51.0], 
      zoom: 5,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
      const marker = new maplibregl.Marker()
      .setLngLat([13, 51.1])
      .addTo(map);

    mapRef.current = map;
    return () => map.remove(); 
  }, []);


  useEffect(() => {
    fetch('http://localhost:3001/patient/locations')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<TherapistLocation[]>;
      })
      .then(data => setLocations(data))
      .catch(err => {
        console.error('Failed to load therapist locations', err);
      });
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    console.log(locations.length)
    console.log(!map)
    if (!map || locations.length === 0) return;

    locations.forEach(loc => {
      console.log("lon, lan: " + loc.longitude + " | | " + loc.latitude)
      const marker = new maplibregl.Marker()
        .setLngLat([loc.longitude, loc.latitude]);

      // optional: add a popup with the therapist’s name or ID
      if (loc.id) {
        marker.setPopup(
          new maplibregl.Popup({ offset: 25 }).setText(loc.id)
        );
      }

      marker.addTo(map);
    });
  }, [locations]);






  return (
    <div className="container my-4">
      <div
        ref={mapContainer}
        className="w-100 rounded shadow"
        style={{ height: '50vh' }}
      />
    </div>
  );
};

export { Map };
