// src/components/Map.tsx
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import { useEffect, useRef, useState } from 'react';
import { Box } from '@mantine/core';
import type { TherapistLocation } from '../../../types/therapistLocation';
import * as turf from '@turf/turf';

interface MapProps {
  locations: TherapistLocation[];
  radius?: number;
  center?: [number, number];
  selectedTherapistId?: string | null;
}

export function Map({ locations, center, radius, selectedTherapistId }: MapProps) {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<Record<string, maplibregl.Marker>>({});
  const centerMarkerRef = useRef<maplibregl.Marker | null>(null);
  const selectedTherapistMarkerRef = useRef<maplibregl.Marker | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [markersRefReady, setMarkersRefReady] = useState(false);

  useEffect(() => {
    console.log("mapref.current, therID,  mapReady, markersReefREady", !!mapRef.current, !!selectedTherapistId, !!mapReady, !!markersRefReady)
    if (!mapRef.current || !selectedTherapistId || !mapReady || !markersRefReady) return;

    const map = mapRef.current;

    if (selectedTherapistMarkerRef.current) {
      const marker = selectedTherapistMarkerRef.current;
      const lngLat = marker.getLngLat();

      const newMarker = new maplibregl.Marker({
      }).setLngLat([
        lngLat.lng,
        lngLat.lat,
      ]);

      selectedTherapistMarkerRef.current.remove();
      marker.remove();
      console.log("add therapist marker", marker)
      newMarker.addTo(map);
    }

    const oldMarker = markersRef.current[selectedTherapistId];
    
    //todo check what actually happens if no marker is found
    if (!oldMarker) console.warn(`No marker found for therapist`);

    const lngLat = markersRef.current[selectedTherapistId].getLngLat();

    oldMarker.remove();

    const marker = new maplibregl.Marker({
        color: 'green',
      }).setLngLat([
        lngLat.lng,
        lngLat.lat,
    ]);
    console.log("setMarker", marker)
    marker.addTo(map);
    markersRef.current[selectedTherapistId] = marker;
    selectedTherapistMarkerRef.current = marker;

    map.flyTo({ 
      speed: 2,
      center: [lngLat.lng, lngLat.lat], zoom: 14
    });

  },[selectedTherapistId, mapReady, markersRefReady])
    
  useEffect(() => {
    if (!mapContainer.current) return;
    console.log("mapcontainer useEffect 2")

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

    map.once('load', () => {
      mapRef.current = map;
      setMapReady(true);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;

    console.log("radius, map, center", !!radius, !!map, !!center)
    if(!radius || !mapReady || !center || !map) return;
    
    if (centerMarkerRef.current) centerMarkerRef.current.remove();

    if (map.getLayer('circle-fill')) map.removeLayer('circle-fill');
    if (map.getLayer('circle-outline')) map.removeLayer('circle-outline');
    if (map.getSource('circle-source')) map.removeSource('circle-source');
    
    const marker = new maplibregl.Marker().setLngLat([
      center[1],
      center[0],
    ]);

    marker.addTo(map);
    centerMarkerRef.current = marker;
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
  }, [radius, center, mapReady])

  useEffect(() => {

    const map = mapRef.current;
    if (!map || !mapReady) return;

    Object.values(markersRef.current).forEach(marker => {
      marker.remove();
    });

    // add new markers from props.locations
    if (!locations) return;
    locations.forEach((loc) => {

      const marker = new maplibregl.Marker({
      }).setLngLat([
        loc.location.coordinates[0],
        loc.location.coordinates[1],
      ]);

      if (loc.therapistId) {
        marker.setPopup(
          new maplibregl.Popup({ offset: 25 }).setText(loc.therapistId)
        );
      }

      marker.addTo(map);
      markersRef.current[loc.therapistId] = marker;
    });
    setMarkersRefReady(true);
  }, [locations, radius, center, mapReady]);

  return (
    <Box 
      ref={mapContainer}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
