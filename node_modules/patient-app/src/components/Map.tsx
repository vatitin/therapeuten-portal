import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import { useEffect, useRef } from 'react';

function Map(){
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

    return () => map.remove(); 
  }, []);

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
