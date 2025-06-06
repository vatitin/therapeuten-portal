// src/components/Map.tsx
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl, { GeoJSONSource } from 'maplibre-gl';
import { useEffect, useRef } from 'react';
import { Container, Paper } from '@mantine/core';
import type { TherapistLocation } from './therapistLocation';
import * as turf from '@turf/turf';

interface MapProps {
  locations: TherapistLocation[];
  radius: number;
  center?: [number, number];
  selectedTherapistId?: string | null;
}

export function Map({ locations, center, radius, selectedTherapistId }: MapProps) {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<Record<string, maplibregl.Marker>>({});
  const centerMarkerRef = useRef<maplibregl.Marker | null>(null);
  const selectedTherapistMarkerRef = useRef<maplibregl.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current || !selectedTherapistId) return;

    const map = mapRef.current;

    if (selectedTherapistMarkerRef.current) {
      const marker = selectedTherapistMarkerRef.current;
      const lngLat = marker.getLngLat();

      const newMarker = new maplibregl.Marker({
        color: 'green',
      }).setLngLat([
        lngLat.lng,
        lngLat.lat,
      ]);
      selectedTherapistMarkerRef.current.remove();
      marker.remove();

      newMarker.addTo(map);
    }

    const oldMarker = markersRef.current[selectedTherapistId];
    const lngLat = oldMarker.getLngLat();

    //todo check what actually happens if no marker is found
    if (!oldMarker) console.warn(`No marker found for therapist`);

    oldMarker.remove();

    const marker = new maplibregl.Marker({
        color: 'red',
      }).setLngLat([
        lngLat.lng,
        lngLat.lat,
    ]);

    marker.addTo(map);
    markersRef.current[selectedTherapistId] = marker;
    selectedTherapistMarkerRef.current = marker;

    map.flyTo({ 
      speed: 2,
      center: [lngLat.lng, lngLat.lat], zoom: 14
    });

  },[selectedTherapistId])
    

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=PPUA691BI7yVJ7CQUGBI`,
      center: center ?? [10.0, 51.0],
      zoom: 5,
      maxBounds: [
        [5, 46],
        [16, 56],
      ],
      minZoom: 4,
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !center) return;

    const map = mapRef.current;

    if (centerMarkerRef.current) centerMarkerRef.current.remove();

    if (map.getLayer('circle-fill')) {
      map.removeLayer('circle-fill');
    }
    if (map.getLayer('circle-outline')) {
      map.removeLayer('circle-outline');
    }
    if (map.getSource('circle-source')) {
      map.removeSource('circle-source');
    }

    const circleGeoJson = turf.circle(
      turf.point(center),
      radius,
      {
        steps: 200,         
        units: 'kilometers', 
      }
    );

    map.addSource('circle-source', {
      type: 'geojson',
      data: circleGeoJson, 
    });

    map.addLayer({
      id: 'circle-fill',
      type: 'fill',
      source: 'circle-source',
      paint: {
        'fill-color': 'rgba(0, 150, 135, 0.1)', 
        'fill-outline-color': '#009688',
      },
    });

    map.addLayer({
      id: 'circle-outline',
      type: 'line',
      source: 'circle-source',
      paint: {
        'line-color': '#009688',
        'line-width': 2,
      },
    });

    map.flyTo({ 
      speed: 3,
      center, zoom: 12 - radius / 10
    });

    const marker = new maplibregl.Marker().setLngLat([
      center[0],
      center[1],
    ]);

    marker.addTo(map);
    centerMarkerRef.current = marker;

  }, [center, radius]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.values(markersRef.current).forEach(marker => {
      marker.remove();
    });

    // add new markers from props.locations
    if (!locations) return;
    locations.forEach((loc) => {

      const marker = new maplibregl.Marker({
        color: 'green',
      }).setLngLat([
        loc.location.coordinates[1],
        loc.location.coordinates[0],
      ]);

      if (loc.therapistId) {
        marker.setPopup(
          new maplibregl.Popup({ offset: 25 }).setText(loc.therapistId)
        );
      }

      marker.addTo(map);
      markersRef.current[loc.therapistId] = marker;
    });
  }, [locations, radius, center]);

  return (
    <Container>
      <Paper
        ref={mapContainer}
        shadow="md"
        radius="md"
        style={{ width: '100%', height: '70vh'}}
      />
    </Container>
  );
}
