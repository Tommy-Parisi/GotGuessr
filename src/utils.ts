/**
 * Distance between two points expressed as 0-1 fractions of the map.
 * Scaled back to the original 1000×560 pixel space so scoring thresholds remain valid.
 */
export function gotMapDistance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = (x2 - x1) * 1000;
  const dy = (y2 - y1) * 560;
  return Math.round(Math.sqrt(dx * dx + dy * dy));
}

/** Score based on GoT map pixel distance. Max map diagonal ≈ 1152 px. */
export function calcGotScore(dist: number): number {
  if (dist < 25) return 5000;
  if (dist < 100) return Math.round(5000 - (dist - 25) * 40);  // 5000→2000 over 75 px
  if (dist < 250) return Math.round(2000 - (dist - 100) * 8);  // 2000→800 over 150 px
  if (dist < 500) return Math.round(800 - (dist - 250) * 2.4); // 800→200 over 250 px
  return Math.max(0, Math.round(200 - (dist - 500) * 0.4));    // 200→0 over 500 px
}

export function getRank(score: number): { title: string; sub: string } {
  if (score >= 20000) return { title: 'The Three-Eyed Raven', sub: 'You see all things' };
  if (score >= 16000) return { title: 'Master of Whisperers', sub: 'Your network spans the world' };
  if (score >= 12000) return { title: 'Knight of the Realm', sub: 'A worthy champion' };
  if (score >= 8000) return { title: 'Squire', sub: 'You show promise' };
  if (score >= 4000) return { title: 'Hedge Knight', sub: 'Lost, but trying' };
  return { title: 'Wildling', sub: 'You know nothing' };
}
