/** Approximate campus centroid for Adamas Knowledge City (Jagannathpur / Barasat–Barrackpore Rd, ~700126).
 * Overlay only — not official survey GPS. Admin-editable.
 */
export const CAMPUS_CENTROID = { lat: 22.7412, lng: 88.4528 } as const;

/** Relative layout extent (matches seed x/y space). */
export const LAYOUT = { width: 1000, height: 800 } as const;

/** Degrees span for the approximate overlay (~campus-scale). */
const SPAN_LAT = 0.0048;
const SPAN_LNG = 0.0056;

export function layoutToLatLng(x: number, y: number): { lat: number; lng: number } {
  const nx = x / LAYOUT.width;
  const ny = y / LAYOUT.height;
  return {
    lat: CAMPUS_CENTROID.lat + SPAN_LAT / 2 - ny * SPAN_LAT,
    lng: CAMPUS_CENTROID.lng - SPAN_LNG / 2 + nx * SPAN_LNG,
  };
}

export function kindColor(kind: string): string {
  switch (kind) {
    case "GATE":
      return "#12100e";
    case "BUILDING":
      return "#a8843a";
    case "FACILITY":
      return "#866530";
    case "JUNCTION":
      return "#968c7a";
    default:
      return "#5c4528";
  }
}

export const MAP_DISCLAIMER =
  "Approximate campus overlay — admin-editable / not official survey GPS";
