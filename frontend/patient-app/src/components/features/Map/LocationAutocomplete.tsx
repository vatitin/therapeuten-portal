// src/components/LocationAutocomplete.tsx
import { useState, useEffect, useRef } from 'react';
import { Autocomplete, Loader } from '@mantine/core';

const MAPBOX_TOKEN = 'pk.eyJ1IjoidmF0aXRpbiIsImEiOiJjbWF5OHg1YzUwNmpqMmpzNnR4MjljdXlvIn0.4eCQ0SxTDSfCIdGgpzK2ow';

export interface LocationAutocompleteValues {
    coordinates: [number, number],
    placeName: string
}

type LocationAutocompleteProps = {
    onSearch: (values: LocationAutocompleteValues) => void;
};

export function LocationAutocomplete({ onSearch }: LocationAutocompleteProps) {
  const [value, setValue] = useState('');
  const [data, setData] = useState<string[]>([]);
  const [coordsMap, setCoordsMap] = useState<Record<string, [number, number]>>({});
  const [loading, setLoading] = useState(false);

  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!value || value.trim().length < 2) {
      setData([]);
      setCoordsMap({});
      return;
    }

    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = window.setTimeout(() => {
      setLoading(true);

      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          value
        )}.json?` +
          `access_token=${MAPBOX_TOKEN}` +
          `&autocomplete=true` +
          `&types=postcode,address,place` +
          `&country=de` +
          `&limit=5`
      )
        .then((res) => res.json())
        .then((geoData) => {
          if (!geoData.features || !Array.isArray(geoData.features)) {
            setData([]);
            setCoordsMap({});
            return;
          }
          
          const newData: string[] = [];
          const newMap: Record<string, [number, number]> = {};
          for (const feature of geoData.features) {
            const label = feature.place_name as string;
            const coords = feature.geometry.coordinates as [number, number];
            newData.push(label);
            newMap[label] = coords;
          }
          setData(newData);
          setCoordsMap(newMap);
        })
        .catch(() => {
          setData([]);
          setCoordsMap({});
        })
        .finally(() => {
          setLoading(false);
        });
    }, 300);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [value]);

  return (
    <Autocomplete
      label="Location"
      placeholder={"PLZ oder Stadt"}
      value={value}
      onChange={(val: string) => setValue(val)}
      data={data}
      rightSection={loading ? <Loader size="xs" /> : null}
      onOptionSubmit={(value: string) => {
        const placeName = value;
        const coords = coordsMap[placeName];
        if (coords) {
          onSearch({coordinates: coords, placeName});
        }
      }}
      // Wenn der Nutzer nur Enter drückt, ohne aus der Liste auszuwählen,
      // könnte man zusätzlich hier noch auf coordsMap[value] prüfen.
    />
  );
}
