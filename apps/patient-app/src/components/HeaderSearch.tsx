// src/components/HeaderSearch.tsx
import { useState, useRef, type FormEvent } from 'react';
import {
  Burger,
  Group,
  MultiSelect,
  NumberInput,
  Button,
  Box,
  Flex,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MantineLogo } from '@mantinex/mantine-logo';
import classes from './HeaderSearch.module.css';
import { LocationAutocomplete, type LocationAutocompleteValues } from './LocationAutocomplete';

export interface HeaderSearchValues {
  coordinates: number[];
  distance: number;
  categories: string[];
}

interface HeaderSearchProps {
  onSearch: (values: HeaderSearchValues) => void;
}

export function HeaderSearch({ onSearch }: HeaderSearchProps) {
  const [opened, { toggle }] = useDisclosure(false);

  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState<number[]>([]);
  const [distance, setDistance] = useState(10);
  const [categories, setCategories] = useState<string[]>([]);

  const categoryOptions = [
    { value: 'vt', label: 'Verhaltenstherapie' },
    { value: 'tp', label: 'Tiefenpsychologisch fundierte Therapie' },
    { value: 'pa', label: 'Psychoanalyse' },
    { value: 'systemisch', label: 'Systemische Therapie' },
    { value: 'gestalt', label: 'Gestalttherapie' },
    { value: 'emdr', label: 'EMDR' },
    { value: 'hypnose', label: 'Hypnotherapie' },
    { value: 'kunst', label: 'Kunst-/Musiktherapie' },
    { value: 'kip', label: 'Katathymes Bilderleben (KIP)' },
    { value: 'logotherapie', label: 'Logotherapie' },
  ];

  const onLocationAutocompleteSearch = (values: LocationAutocompleteValues) => {
    setCoordinates(values.coordinates);
    setAddress(values.placeName);
    console.log("Address set:", address);
    console.log("Coordinates set:", coordinates);
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!address.trim()) {
      alert('Bitte eine Adresse oder PLZ auswählen.');
      return;
    }
    if (distance <= 0) {
      alert('Bitte eine gültige Distanz eingeben.');
      return;
    }
    onSearch({ coordinates, distance, categories });
  };

  const links = [{ link: '/about', label: 'Features' }];
  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      onClick={(e) => e.preventDefault()}
    >
      {link.label}
    </a>
  ));

  return (
    <Box component="header" className={classes.header}>
      <div className={classes.inner}>
        <Group gap="xs" align="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
            <MantineLogo size={28} />
          </Group>
          <Group gap="xs" align="flex-end">
            <form onSubmit={handleSubmit}>

              <Flex direction="row" gap="xs" align="flex-end">
                <LocationAutocomplete onSearch={onLocationAutocompleteSearch} />

                <NumberInput
                  label="Entfernung (km)"
                  min={0.1}
                  max={30}
                  decimalScale={1}
                  suffix={' km'}
                  value={distance}
                  onChange={(val) => setDistance(Number(val) || 0)}
                  required
                />

                <MultiSelect
                  label="Fachgebiete"
                  placeholder="z. B. VT, EMDR, Hypnose"
                  data={categoryOptions}
                  value={categories}
                  onChange={setCategories}
                  searchable
                />

                <Button type="submit">Suchen</Button>
              </Flex>
              
            </form>
          </Group>
          {/* Zusätzliche Links (optional) */}
          <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
            {items}
          </Group>
        </Group>
      </div>
    </Box>
  );
}
