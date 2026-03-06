export type House =
  | 'Lannister'
  | 'Stark'
  | 'Targaryen'
  | 'Greyjoy'
  | 'Baratheon'
  | 'Martell'
  | "Night's Watch";

export interface Location {
  id: number;
  name: string;
  gotName: string;
  description: string;
  lat: number;
  lng: number;
  gotX: number; // x position on GoT world map SVG (0–1000)
  gotY: number; // y position on GoT world map SVG (0–560)
  house: House;
  images: string[];
}

export interface RoundResult {
  location: Location;
  guessX: number;
  guessY: number;
  distanceLeagues: number;
  points: number;
}

export type GamePhase = 'intro' | 'playing' | 'round-result' | 'final';

export interface GameState {
  phase: GamePhase;
  locations: Location[];
  round: number;
  results: RoundResult[];
  pendingGuess: { x: number; y: number } | null;
  totalScore: number;
}
