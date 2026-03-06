# Iron Realm — GoT GeoGuesser

A lightweight TypeScript React Native Web app. Guess the real-world filming locations of Game of Thrones from photos, then place your mark on a world map.

## Stack

- **React Native** + **React Native Web** (runs in browser, zero native build needed)
- **Expo** (web-only config, webpack bundler)
- **TypeScript** (strict mode)
- No external state libraries, no router, no CSS frameworks — just RN StyleSheet

## Setup

```bash
npm install
npm run web
```

Open http://localhost:8081 in your browser.

## Build for production

```bash
npm run build:web
# output in dist/
```

## Project structure

```
App.tsx                     # Root, renders phase-based screens
src/
  types/index.ts            # GameState, Location, RoundResult types
  data/locations.ts         # 8 filming locations + Pexels image URLs
  utils.ts                  # haversine distance, scoring, lat/lng→SVG
  hooks/
    useGameState.ts         # All game logic in one hook
  components/
    IntroScreen.tsx         # Title / start screen
    GameScreen.tsx          # Playing + round result (2-column layout)
    ImageCarousel.tsx       # Photo viewer with prev/next arrows
    WorldMap.tsx            # SVG world map, click-to-guess
    FinalScreen.tsx         # Score summary + rank
```

## Scoring

| Distance | Points |
|----------|--------|
| < 50 km  | 5,000  |
| < 300 km | 3,500–5,000 |
| < 1,500 km | 1,500–3,000 |
| < 5,000 km | 500–1,200 |
| 5,000+ km | 0–500 |

Max score: **25,000** (Five-Eyed Raven territory)
