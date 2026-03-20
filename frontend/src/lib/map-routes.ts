export type LngLatPoint = [number, number];

export function buildCurvedRoute(
  start: LngLatPoint,
  end: LngLatPoint,
  segments = 40,
): LngLatPoint[] {
  const midLng = (start[0] + end[0]) / 2;
  const midLat = (start[1] + end[1]) / 2;
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (!Number.isFinite(distance) || distance === 0) {
    return [start, end];
  }

  const offset = Math.min(Math.max(distance * 0.2, 0.015), 0.22);
  const ctrlLng = midLng + (-dy / distance) * offset;
  const ctrlLat = midLat + (dx / distance) * offset;

  const route: LngLatPoint[] = [];
  for (let index = 0; index <= segments; index += 1) {
    const t = index / segments;
    const invT = 1 - t;
    route.push([
      invT * invT * start[0] + 2 * invT * t * ctrlLng + t * t * end[0],
      invT * invT * start[1] + 2 * invT * t * ctrlLat + t * t * end[1],
    ]);
  }

  return route;
}
