import type { MapBbox } from "@yunicity/types";
import type { Region } from "react-native-maps";

/** Convert a MapView region into the API bounding-box contract. */
export function regionToBbox(region: Region): MapBbox {
  const latHalf = region.latitudeDelta / 2;
  const lonHalf = region.longitudeDelta / 2;
  return {
    lat_min: region.latitude - latHalf,
    lat_max: region.latitude + latHalf,
    lon_min: region.longitude - lonHalf,
    lon_max: region.longitude + lonHalf,
  };
}

/**
 * Approximate integer zoom as a react-native-maps latitude span.
 * Kept local to the mobile map; not a general geo library.
 */
export function zoomToLatitudeDelta(zoom: number): number {
  return 360 / Math.pow(2, zoom);
}
