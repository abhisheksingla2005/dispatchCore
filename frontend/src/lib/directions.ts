type LngLatPoint = [number, number];

interface OsrmRouteResponse {
  routes?: Array<{
    geometry?: {
      coordinates?: LngLatPoint[];
    };
  }>;
}

const routeCache = new Map<string, LngLatPoint[]>();

function routeKey(start: LngLatPoint, end: LngLatPoint): string {
  const format = (value: number) => value.toFixed(5);
  return `${format(start[0])},${format(start[1])}:${format(end[0])},${format(end[1])}`;
}

export async function fetchDrivingRoute(
  start: LngLatPoint,
  end: LngLatPoint,
  signal?: AbortSignal,
): Promise<LngLatPoint[]> {
  const key = routeKey(start, end);
  const cached = routeCache.get(key);
  if (cached) return cached;

  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${start[0]},${start[1]};${end[0]},${end[1]}` +
    `?overview=full&geometries=geojson&steps=false`;

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Failed to fetch route: ${response.status}`);
  }

  const data = (await response.json()) as OsrmRouteResponse;
  const coordinates = data.routes?.[0]?.geometry?.coordinates;
  if (!coordinates || coordinates.length < 2) {
    throw new Error("No route geometry returned");
  }

  routeCache.set(key, coordinates);
  return coordinates;
}
