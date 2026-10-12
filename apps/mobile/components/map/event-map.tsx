import { feedTheme } from "@/components/feed/feed-theme";
import {
  regionToBbox,
  zoomToLatitudeDelta,
} from "@/components/map/map-region";
import type { MapBbox, MapEventItem } from "@yunicity/types";
import { MAP_RECENTER, resolveCityMapCenter } from "@yunicity/utils";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, type Region } from "react-native-maps";

const MARKER_COLOR = "#2A2FFF";
const CITY_ANIMATION_MS = 800;

type EventMapProps = {
  city: string;
  events: MapEventItem[];
  selectedEventId: string | null;
  onSelectEvent: (eventId: string | null) => void;
  onBboxChange: (bbox: MapBbox) => void;
  onRecenterPress: () => void;
};

function cityToRegion(city: string): Region {
  const center = resolveCityMapCenter(city);
  const latitudeDelta = zoomToLatitudeDelta(center.zoom);
  const longitudeDelta =
    latitudeDelta / Math.max(Math.cos((center.latitude * Math.PI) / 180), 0.01);
  return {
    latitude: center.latitude,
    longitude: center.longitude,
    latitudeDelta,
    longitudeDelta,
  };
}

export function EventMap({
  city,
  events,
  selectedEventId,
  onSelectEvent,
  onBboxChange,
  onRecenterPress,
}: EventMapProps) {
  const mapRef = useRef<MapView>(null);
  const skipCityAnimationRef = useRef(true);
  const { latitude: centerLatitude, longitude: centerLongitude, zoom: centerZoom } =
    useMemo(() => resolveCityMapCenter(city), [city]);
  const initialRegion = useMemo(() => cityToRegion(city), [city]);

  // initialRegion applies only on mount; animate when the resolved city center changes.
  useEffect(() => {
    if (skipCityAnimationRef.current) {
      skipCityAnimationRef.current = false;
      return;
    }
    mapRef.current?.animateToRegion(cityToRegion(city), CITY_ANIMATION_MS);
  }, [city, centerLatitude, centerLongitude, centerZoom]);

  const handleRegionChangeComplete = useCallback(
    (region: Region) => {
      onBboxChange(regionToBbox(region));
    },
    [onBboxChange],
  );

  const handleRecenter = useCallback(() => {
    const next = cityToRegion(city);
    mapRef.current?.animateToRegion(next, CITY_ANIMATION_MS);
    onRecenterPress();
    onBboxChange(regionToBbox(next));
  }, [city, onBboxChange, onRecenterPress]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        rotateEnabled={false}
        pitchEnabled={false}
        onMapReady={() => {
          onBboxChange(regionToBbox(initialRegion));
        }}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {events.map((event) => (
          <Marker
            key={event.id}
            identifier={event.id}
            coordinate={{
              latitude: event.latitude,
              longitude: event.longitude,
            }}
            onPress={() => onSelectEvent(event.id)}
            accessibilityLabel={event.title}
          >
            <View
              style={[
                styles.marker,
                selectedEventId === event.id ? styles.markerSelected : null,
              ]}
            />
          </Marker>
        ))}
      </MapView>
      <Pressable style={styles.recenterBtn} onPress={handleRecenter}>
        <Text style={styles.recenterText}>{MAP_RECENTER(city)}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 320 },
  map: { flex: 1 },
  marker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: MARKER_COLOR,
    borderWidth: 2,
    borderColor: "#fff",
  },
  markerSelected: {
    transform: [{ scale: 1.2 }],
  },
  recenterBtn: {
    position: "absolute",
    bottom: 16,
    left: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: feedTheme.border,
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  recenterText: { fontSize: 12, fontWeight: "600", color: feedTheme.text },
});
