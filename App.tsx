import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'; // TouchableOpacity still used in IntroScreen/GameScreen/FinalScreen
import { StatusBar } from 'expo-status-bar';
import { QUARTERMAESTER_LABELS, MAJOR_LABEL_KEYS } from './src/data/locations';

// ─── Types ────────────────────────────────────────────────────────────────────

type House = 'Lannister' | 'Stark' | 'Targaryen' | 'Greyjoy' | 'Baratheon' | 'Martell' | "Night's Watch";

interface Location {
  id: number;
  name: string;
  gotName: string;
  description: string;
  gotX: number;
  gotY: number;
  house: House;
  images: string[];
}

interface RoundResult {
  location: Location;
  guessX: number;
  guessY: number;
  distanceLeagues: number;
  points: number;
}

type GamePhase = 'intro' | 'playing' | 'round-result' | 'final';

interface GameState {
  phase: GamePhase;
  locations: Location[];
  round: number;
  results: RoundResult[];
  pendingGuess: { x: number; y: number } | null;
  totalScore: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const HOUSE_COLORS: Record<House, string> = {
  Lannister: '#d4a840',
  Stark:     '#7a9ab5',
  Targaryen: '#b03020',
  Greyjoy:   '#7a8a9a',
  Baratheon: '#c8900c',
  Martell:   '#c86010',
  "Night's Watch": '#445566',
};

const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`;

const ALL_LOCATIONS: Location[] = [
  {
    id: 1, name: 'Dubrovnik, Croatia', gotName: "King's Landing",
    description: "Seat of the Iron Throne, capital of the Seven Kingdoms. The city's ancient walls echo with the cries of ravens and the clash of swords.",
    gotX: 0.218, gotY: 0.568, house: 'Lannister',
    images: [px(2225439)],
  },
  {
    id: 2, name: 'Mdina, Malta', gotName: "King's Landing (S1)",
    description: "The Silent City — an ancient walled hilltop used in the earliest days of the show, before Dubrovnik became the throne's permanent home.",
    gotX: 0.205, gotY: 0.550, house: 'Baratheon',
    images: [px(4388158)],
  },
  {
    id: 3, name: 'Thingvellir, Iceland', gotName: 'The Vale / Beyond the Wall',
    description: "A volcanic rift valley standing in for the frozen North. The land itself seems to crack open, as if the gods tore it asunder.",
    gotX: 0.238, gotY: 0.450, house: 'Stark',
    images: [px(1633351)],
  },
  {
    id: 4, name: 'Ballintoy, Northern Ireland', gotName: 'The Iron Islands',
    description: "Rugged basalt coast — seat of House Greyjoy. Here the sea is never still, and the ironborn take what is theirs with iron and blood.",
    gotX: 0.068, gotY: 0.471, house: 'Greyjoy',
    images: [px(3800109)],
  },
  {
    id: 5, name: 'Seville, Spain', gotName: 'Dorne / Water Gardens',
    description: "The sun-drenched Alcázar of Seville — seat of House Martell. In Dorne the sun is a weapon and the water a mercy.",
    gotX: 0.175, gotY: 0.800, house: 'Martell',
    images: [px(1388030)],
  },
  {
    id: 6, name: 'Vatnajökull, Iceland', gotName: 'Beyond the Wall',
    description: "Europe's largest glacier — the eternal frozen wilderness where the dead walk and the living dare not follow.",
    gotX: 0.152, gotY: 0.139, house: "Night's Watch",
    images: [px(1433052)],
  },
  {
    id: 7, name: 'Essaouira, Morocco', gotName: 'Astapor',
    description: "The red city of Astapor, where Daenerys Targaryen purchased the Unsullied and set fire to a slaver's world.",
    gotX: 0.555, gotY: 0.741, house: 'Targaryen',
    images: [px(2549018)],
  },
  {
    id: 8, name: 'Dark Hedges, N. Ireland', gotName: 'The Kingsroad',
    description: "An eerie tunnel of ancient beech trees — the Kingsroad north, where Arya Stark fled south disguised among the condemned.",
    gotX: 0.162, gotY: 0.384, house: 'Stark',
    images: [px(1563356)],
  },
];

// ─── Utils ────────────────────────────────────────────────────────────────────

function gotMapDistance(x1: number, y1: number, x2: number, y2: number) {
  // Coordinates are normalized map fractions (0-1), left->right and top->bottom.
  // Scale evenly so score weighting is fair in all directions.
  const dx = (x2 - x1) * 1000;
  const dy = (y2 - y1) * 1000;
  return Math.round(Math.sqrt(dx * dx + dy * dy));
}

function calcGotScore(dist: number) {
  if (dist < 25) return 5000;
  if (dist < 100) return Math.round(5000 - (dist - 25) * 40);
  if (dist < 250) return Math.round(2000 - (dist - 100) * 8);
  if (dist < 500) return Math.round(800 - (dist - 250) * 2.4);
  return Math.max(0, Math.round(200 - (dist - 500) * 0.4));
}

function getRank(score: number) {
  if (score >= 20000) return { title: 'The Three-Eyed Raven', sub: 'You see all things' };
  if (score >= 16000) return { title: 'Master of Whisperers', sub: 'Your network spans the world' };
  if (score >= 12000) return { title: 'Knight of the Realm', sub: 'A worthy champion' };
  if (score >= 8000)  return { title: 'Squire', sub: 'You show promise' };
  if (score >= 4000)  return { title: 'Hedge Knight', sub: 'Lost, but trying' };
  return { title: 'Wildling', sub: 'You know nothing' };
}

function pickRandom(n: number): Location[] {
  return [...ALL_LOCATIONS].sort(() => Math.random() - 0.5).slice(0, n);
}

function makeInitialState(): GameState {
  return { phase: 'intro', locations: pickRandom(5), round: 0, results: [], pendingGuess: null, totalScore: 0 };
}

// ─── Global CSS ───────────────────────────────────────────────────────────────

function useGlobalCSS() {
  useEffect(() => {
    if (typeof window === 'undefined') return; // SSR safety

    // Google Fonts
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cinzel+Decorative:wght@400;700&family=IM+Fell+English:ital@0;1&display=swap';
    document.head.appendChild(link);

    // Leaflet CSS
    const leafletLink = document.createElement('link');
    leafletLink.rel = 'stylesheet';
    leafletLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(leafletLink);

    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after { box-sizing: border-box; }

      html, body {
        margin: 0; padding: 0;
        background: #1a1008;
        overflow: hidden;
        font-family: 'Cinzel', serif;
      }

      /* ── Warm firelit background ── */
      body {
        background:
          radial-gradient(ellipse at 50% 0%,   rgba(80,40,5,0.55)  0%, transparent 60%),
          radial-gradient(ellipse at 20% 80%,  rgba(60,25,5,0.35)  0%, transparent 55%),
          radial-gradient(ellipse at 80% 90%,  rgba(50,20,5,0.30)  0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%,  #231608 0%, #160e06 60%, #0e0904 100%);
      }

/* ── Ambient ember flicker on gold elements ── */
      @keyframes emberPulse {
        0%,100% { text-shadow: 0 0 28px rgba(212,168,64,0.45), 0 0 60px rgba(212,140,20,0.18); }
        50%      { text-shadow: 0 0 38px rgba(212,168,64,0.65), 0 0 80px rgba(212,140,20,0.28); }
      }
      @keyframes fadeUp {
        from { opacity:0; transform: translateY(18px); }
        to   { opacity:1; transform: translateY(0); }
      }
      @keyframes scanline {
        0%  { background-position: 0 0; }
        100%{ background-position: 0 100%; }
      }

      .title-glow { animation: emberPulse 4s ease-in-out infinite; }
      .fade-up    { animation: fadeUp 0.7s ease forwards; }

      /* ── Map overlay (GeoGuessr-style) ── */
      .map-overlay {
        --map-aspect: 1; /* Quartermaester tile world is square (2^z by 2^z tiles) */
        --map-frame-extra: 8px; /* room for ornamental border/frame */
        position: absolute;
        bottom: 22px;
        right: 22px;
        z-index: 100;
        border-radius: 2px;
        overflow: hidden;
        transition:
          width  0.4s cubic-bezier(0.4,0,0.2,1),
          height 0.4s cubic-bezier(0.4,0,0.2,1),
          box-shadow 0.4s ease;
        cursor: crosshair;
        /* parchment frame */
        border: 2px solid #7a5a28;
        box-shadow:
          0 0 0 1px #3a2510,
          0 8px 40px rgba(0,0,0,0.85),
          inset 0 0 0 1px rgba(212,168,64,0.12);
      }
      .map-overlay.collapsed {
        width: 340px;
        height: calc((340px / var(--map-aspect)) + var(--map-frame-extra));
      }
      .map-overlay.expanded {
        width: min(700px, 70vw);
        height: calc((min(700px, 70vw) / var(--map-aspect)) + var(--map-frame-extra));
        box-shadow:
          0 0 0 1px #5a3f18,
          0 16px 60px rgba(0,0,0,0.9),
          inset 0 0 0 1px rgba(212,168,64,0.22);
      }
      .map-overlay.result {
        width: min(700px, 70vw);
        height: calc((min(700px, 70vw) / var(--map-aspect)) + var(--map-frame-extra));
        cursor: default;
        box-shadow:
          0 0 0 1px #7a5a28,
          0 16px 60px rgba(0,0,0,0.92),
          inset 0 0 0 1px rgba(212,168,64,0.28);
      }
      .map-overlay svg {
        width: 100%;
        height: 100%;
        display: block;
      }

      /* ── Map action buttons ── */
      .map-guess-btn, .map-next-btn {
        position: absolute;
        bottom: 12px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1200;
        font-family: 'Cinzel', serif;
        letter-spacing: 2.5px;
        font-size: 10px;
        font-weight: 600;
        cursor: pointer;
        padding: 9px 22px;
        white-space: nowrap;
        border-radius: 1px;
        transition: all 0.2s;
      }
      .map-guess-btn {
        border: 1.5px solid #d4a840;
        background: rgba(14,9,3,0.92);
        color: #d4a840;
      }
      .map-guess-btn:hover:not(:disabled) {
        background: rgba(212,168,64,0.15);
        box-shadow: 0 0 18px rgba(212,168,64,0.25);
      }
      .map-guess-btn:disabled {
        border-color: #7a6040;
        color: #9a7848;
        cursor: default;
      }
      .map-next-btn {
        border: none;
        background: linear-gradient(135deg, #c9a030, #a87828);
        color: #0e0903;
        font-weight: 700;
        box-shadow: 0 2px 12px rgba(212,168,64,0.35);
      }
      .map-next-btn:hover {
        background: linear-gradient(135deg, #d4aa38, #b88230);
        box-shadow: 0 4px 20px rgba(212,168,64,0.5);
      }

      /* ── Divider ornament ── */
      .orn-divider {
        display: flex; align-items: center; gap: 14px;
        width: 100%; max-width: 420px; margin: 0 auto;
      }
      .orn-divider::before, .orn-divider::after {
        content: '';
        flex: 1;
        height: 1px;
        background: linear-gradient(to right, transparent, #5a3a14, transparent);
      }

      /* ── Leaflet map customization ── */
      .leaflet-container {
        background: #0a0a0a !important;
        font-family: 'Cinzel', serif;
      }
      .leaflet-control-layers, .leaflet-control-zoom, .leaflet-control-attribution,
      .leaflet-bar, .leaflet-control { display: none !important; }
      .leaflet-top, .leaflet-bottom { display: none !important; }

      /* ── Map location labels (modern, lightweight) ── */
      .qm-label {
        background: transparent !important;
        border: 0 !important;
        box-shadow: none !important;
        color: #f3f6fb;
        font-family: 'Cinzel', serif;
        line-height: 1;
        letter-spacing: 0.2px;
        white-space: nowrap;
        pointer-events: none;
        transition: opacity 120ms linear;
        transform: translate(-50%, -100%);
      }
      .qm-label::before { display: none !important; }
      .qm-label-minor {
        font-size: 10px;
        font-weight: 600;
        text-shadow: 0 1px 2px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,0.55);
      }
      .qm-label-major {
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.5px;
        color: #ffffff;
        text-shadow: 0 1px 3px rgba(0,0,0,0.98), 0 0 8px rgba(0,0,0,0.65);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      try {
        document.head.removeChild(link);
        document.head.removeChild(leafletLink);
        document.head.removeChild(style);
      } catch (e) {
        // Cleanup safety
      }
    };
  }, []);
}

// ─── Quartermaester Tile Encoding (Keyhole Quadtree) ────────────────────────

const EMPTY_TILE =
  'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

const MAP_ZOOM_SETTINGS = {
  initialZoom: 4.2,
  minZoom: 2.5,
  maxZoom: 5.3,
  // Keep overall speed while using finer steps for smoother motion.
  zoomSnap: 0.05,
  zoomDelta: 0.2,
  wheelPxPerZoomLevel: 12,
  wheelDebounceTime: 0,
};

const MAP_BOUNDS = {
  minLat: -85,
  maxLat: 85,
  minLng: -180,
  maxLng: 180,
};

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function fractionToLatLng(x: number, y: number): [number, number] {
  const lng = MAP_BOUNDS.minLng + (clamp01(x) * (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng));
  const lat = MAP_BOUNDS.maxLat - (clamp01(y) * (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat));
  return [lat, lng];
}

function latLngToFraction(lat: number, lng: number): { x: number; y: number } {
  const x = (lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng);
  const y = (MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat);
  return { x: clamp01(x), y: clamp01(y) };
}

// Mirrors quartermaester.info/ASoIaF-objects.js getTileCode(coord, zoom).
function getTileCode(coord: { x: number; y: number }, z: number): string {
  let range = Math.pow(2, z);
  let xx = coord.x;
  let yy = coord.y;
  let code = "t";
  for (let i = 0; i < z; i++) {
    range = range / 2;
    if (yy < range) {
      if (xx < range) {
        code += "q";  // top-left
      } else {
        code += "r";  // top-right
        xx -= range;
      }
    } else {
      if (xx < range) {
        code += "t";  // bottom-left
        yy -= range;
      } else {
        code += "s";  // bottom-right
        xx -= range;
        yy -= range;
      }
    }
  }
  return code;
}

// Mirrors quartermaester.info/ASoIaF-objects.js isOutsideTileRange(coord, zoom).
function isOutsideTileRange(coord: { x: number; y: number }, zoom: number): boolean {
  const tileRange = 1 << zoom;
  if (coord.x < 0 || coord.x >= tileRange) return true;
  if (coord.y < 0 || coord.y >= tileRange) return true;
  return false;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ─── WorldMap (Leaflet-based custom map) ───────────────────────────────────

function WorldMap({ onGuess, pendingGuess, result, disabled }: {
  onGuess: (x: number, y: number) => void;
  pendingGuess: { x: number; y: number } | null;
  result: RoundResult | null;
  disabled: boolean;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null); // Use 'any' since L is imported dynamically
  const leafletRef = useRef<any>(null);
  const gameLayerRef = useRef<any>(null);
  const disabledRef = useRef(disabled);
  const onGuessRef = useRef(onGuess);

  useEffect(() => {
    disabledRef.current = disabled;
    onGuessRef.current = onGuess;
  }, [disabled, onGuess]);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    // Dynamically import Leaflet only on client
    import('leaflet').then((module) => {
      const L = module.default;
      leafletRef.current = L;

      const QuartermaesterTileLayer = (L.TileLayer as any).extend({
        getTileUrl(coords: any) {
          const coord = { x: coords.x, y: coords.y };
          const zoom = coords.z;
          if (isOutsideTileRange(coord, zoom)) return EMPTY_TILE;
          const code = getTileCode(coord, zoom);
          return `https://quartermaester.info/nat/${code}.jpg`;
        },
      });

      // Quartermaester uses Google Maps' spherical mercator tile grid.
      const map = L.map(mapRef.current!, {
        center: [0, -105],
        zoom: MAP_ZOOM_SETTINGS.initialZoom,
        minZoom: MAP_ZOOM_SETTINGS.minZoom,
        maxZoom: MAP_ZOOM_SETTINGS.maxZoom,
        zoomSnap: MAP_ZOOM_SETTINGS.zoomSnap,
        zoomDelta: MAP_ZOOM_SETTINGS.zoomDelta,
        wheelPxPerZoomLevel: MAP_ZOOM_SETTINGS.wheelPxPerZoomLevel,
        wheelDebounceTime: MAP_ZOOM_SETTINGS.wheelDebounceTime,
        preferCanvas: true,
        fadeAnimation: true,
        zoomAnimation: true,
        zoomAnimationThreshold: 8,
        zoomControl: false,
        attributionControl: false,
        dragging: true,
        touchZoom: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        worldCopyJump: false,
        maxBounds: L.latLngBounds([[MAP_BOUNDS.minLat, MAP_BOUNDS.minLng], [MAP_BOUNDS.maxLat, MAP_BOUNDS.maxLng]]),
        maxBoundsViscosity: 1.0,
      });

      const tileLayer = new QuartermaesterTileLayer('', {
        tileSize: 256,
        noWrap: true,
        bounds: L.latLngBounds([[MAP_BOUNDS.minLat, MAP_BOUNDS.minLng], [MAP_BOUNDS.maxLat, MAP_BOUNDS.maxLng]]),
        minZoom: MAP_ZOOM_SETTINGS.minZoom,
        maxZoom: MAP_ZOOM_SETTINGS.maxZoom,
        maxNativeZoom: 5,
        // Performance mode: only refresh tiles after zoom settles.
        updateWhenZooming: false,
        updateInterval: 100,
        keepBuffer: 2,
      });
      tileLayer.addTo(map);

      const labelsLayer = L.layerGroup().addTo(map);
      const labelMarkers: Array<{ marker: any; isMajor: boolean }> = [];
      QUARTERMAESTER_LABELS.forEach((location) => {
        const isMajor = MAJOR_LABEL_KEYS.has(location.key);
        const marker = L.marker([location.lat, location.lng], {
          interactive: false,
          keyboard: false,
          icon: L.divIcon({
            className: `qm-label ${isMajor ? 'qm-label-major' : 'qm-label-minor'}`,
            html: `<span>${escapeHtml(location.name)}</span>`,
            iconSize: [0, 0],
            iconAnchor: [0, 0],
          }),
        });
        marker.setZIndexOffset(isMajor ? 1000 : 0);
        marker.addTo(labelsLayer);
        labelMarkers.push({ marker, isMajor });
      });

      const clamp = (n: number) => Math.max(0, Math.min(1, n));
      const updateLabelOpacity = () => {
        const z = map.getZoom();
        // Major labels should remain visible even at minimum zoom.
        const majorOpacity = clamp(0.85 + ((z - MAP_ZOOM_SETTINGS.minZoom) * 0.2));
        // Minor labels fade out as user zooms out.
        const minorOpacity = clamp((z - 3.35) / 1.15);

        labelMarkers.forEach(({ marker, isMajor }) => {
          const el = marker.getElement() as HTMLElement | null;
          if (!el) return;
          const opacity = isMajor ? majorOpacity : minorOpacity;
          el.style.opacity = opacity.toFixed(3);
          el.style.display = opacity < 0.03 ? 'none' : 'block';
        });
      };
      map.on('zoomend', updateLabelOpacity);
      setTimeout(updateLabelOpacity, 0);

      gameLayerRef.current = L.layerGroup().addTo(map);

      map.on('click', (e: any) => {
        if (disabledRef.current) return;
        const { x, y } = latLngToFraction(e.latlng.lat, e.latlng.lng);
        onGuessRef.current(x, y);
      });

      leafletMapRef.current = map;
      
      // Invalidate size after a brief delay to ensure container is ready
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    });

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Re-invalidate map size when result changes (UI expands/collapses)
  useEffect(() => {
    if (leafletMapRef.current) {
      setTimeout(() => {
        leafletMapRef.current.invalidateSize();
      }, 300);
    }
  }, [result]);

  // Keep Leaflet synced with collapsed/expanded container transitions.
  useEffect(() => {
    if (!mapRef.current) return;
    const el = mapRef.current;
    const observer = new ResizeObserver(() => {
      if (leafletMapRef.current) {
        leafletMapRef.current.invalidateSize();
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  
  // Render gameplay pins and result line in map coordinates (not viewport coordinates).
  useEffect(() => {
    if (!leafletMapRef.current || !gameLayerRef.current || !leafletRef.current) return;
    const layer = gameLayerRef.current;
    layer.clearLayers();
    const L = leafletRef.current;

    const pending = pendingGuess ?? null;
    const answer = result ? { x: result.location.gotX, y: result.location.gotY } : null;
    const guessed = result ? { x: result.guessX, y: result.guessY } : null;

    if (!result && pending) {
      const [lat, lng] = fractionToLatLng(pending.x, pending.y);
      L.circleMarker([lat, lng], {
        radius: 11,
        color: '#f0e0c0',
        weight: 2,
        fillColor: '#c0391b',
        fillOpacity: 0.95,
        interactive: false,
      }).addTo(layer);
      L.circleMarker([lat, lng], {
        radius: 4,
        color: '#f0e8d8',
        weight: 0,
        fillColor: '#f0e8d8',
        fillOpacity: 0.9,
        interactive: false,
      }).addTo(layer);
    }

    if (result && guessed && answer) {
      const [gLat, gLng] = fractionToLatLng(guessed.x, guessed.y);
      const [aLat, aLng] = fractionToLatLng(answer.x, answer.y);

      L.polyline([[gLat, gLng], [aLat, aLng]], {
        color: '#8a3010',
        weight: 2,
        dashArray: '6,4',
        opacity: 0.9,
        interactive: false,
      }).addTo(layer);

      L.circleMarker([gLat, gLng], {
        radius: 11,
        color: '#f0e0c0',
        weight: 2,
        fillColor: '#c0391b',
        fillOpacity: 0.9,
        interactive: false,
      }).addTo(layer);
      L.circleMarker([gLat, gLng], {
        radius: 4,
        color: '#f0e8d8',
        weight: 0,
        fillColor: '#f0e8d8',
        fillOpacity: 0.85,
        interactive: false,
      }).addTo(layer);

      L.circleMarker([aLat, aLng], {
        radius: 13,
        color: '#f5e8c0',
        weight: 2.5,
        fillColor: '#d4a030',
        fillOpacity: 0.97,
        interactive: false,
      }).addTo(layer);
      L.marker([aLat, aLng], {
        interactive: false,
        icon: L.divIcon({
          className: 'qm-label qm-label-major',
          html: '<span style="color:#1a0e04; text-shadow:none;">★</span>',
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        }),
      }).addTo(layer);
    }
  }, [pendingGuess, result]);

  return (
    // @ts-ignore
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' } as React.CSSProperties}>

      {/* Leaflet map container */}
      {/* @ts-ignore */}
      <div
        ref={mapRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          cursor: disabled ? 'default' : 'crosshair',
        } as React.CSSProperties}
      />
      {!disabled && !pendingGuess && (
        // @ts-ignore
        <div style={{
          position: 'absolute',
          left: '50%',
          bottom: 44,
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          zIndex: 1001,
          color: 'rgba(255,255,255,0.5)',
          fontFamily: "'Cinzel', serif",
          fontSize: 11,
          letterSpacing: 2,
          userSelect: 'none',
        } as React.CSSProperties}>
          CLICK THE MAP TO PLACE YOUR MARK
        </div>
      )}

    {/* @ts-ignore */}
    </div>
  );
}

// ─── LocationImage (single photo) ─────────────────────────────────────────────

function ImageCarousel({ location }: { location: Location }) {
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);
  const hc = HOUSE_COLORS[location.house];
  const src = location.images[0];

  return (
    <View style={cSt.container}>
      {!errored ? (
        <Image source={{ uri: src }} style={cSt.image} resizeMode="cover"
          onLoadEnd={() => setLoading(false)}
          onError={() => { setErrored(true); setLoading(false); }}/>
      ) : (
        <View style={[cSt.errorBox, { borderColor: hc+'55' }]}>
          <Text style={cSt.errIcon}>⚔</Text>
          <Text style={cSt.errText}>IMAGE UNAVAILABLE</Text>
        </View>
      )}
      {loading && !errored && (
        <View style={cSt.loadOverlay}><ActivityIndicator color={hc} size="large"/></View>
      )}
      {/* Bottom gradient */}
      {/* @ts-ignore */}
      <View style={cSt.gradient} pointerEvents="none"/>
    </View>
  );
}

const cSt = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#0a0604', position: 'relative' },
  image:       { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  loadOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0604' },
  errorBox:    { flex: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 1, margin: 20 },
  errIcon:     { fontSize: 36, opacity: 0.25, marginBottom: 10 },
  errText:     { color: '#4a3018', fontSize: 11, letterSpacing: 3, fontFamily: "'Cinzel', serif" },
  gradient:    { position: 'absolute', left: 0, right: 0, bottom: 0, height: '50%', backgroundImage: 'linear-gradient(to bottom, transparent, rgba(6,3,1,0.82))' } as any,
});

// ─── IntroScreen ──────────────────────────────────────────────────────────────

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <View style={iSt.root}>
      {/* Subtle top light beam */}
      {/* @ts-ignore */}
      <View style={iSt.topBeam} pointerEvents="none"/>

      <Text style={iSt.eyebrow}>A GAME OF MAPS</Text>

      {/* @ts-ignore */}
      <Text style={[iSt.title, { fontFamily: "'Cinzel Decorative', serif" } as any]} className="title-glow">
        GOTGUESSER
      </Text>

      {/* Ornamental divider */}
      {/* @ts-ignore */}
      <View style={iSt.dividerRow}>
        {/* @ts-ignore */}
        <View style={iSt.divLine}/>
        <Text style={iSt.divGlyph}>✦</Text>
        <Text style={iSt.divSword}>⚔</Text>
        <Text style={iSt.divGlyph}>✦</Text>
        {/* @ts-ignore */}
        <View style={iSt.divLine}/>
      </View>

      <Text style={iSt.subtitle}>GEOGUESS THE SEVEN KINGDOMS</Text>

      <Text style={iSt.body}>
        Five real-world filming locations await. Study each photograph, read the{'\n'}
        landscape, and place your mark upon the map of the known world.{'\n'}
        The realm rewards those who truly know its lands.
      </Text>

      <View style={iSt.pillRow}>
        {['5 Rounds', '1 Photo Each', 'No Labels'].map(t => (
          <View key={t} style={iSt.pill}>
            <Text style={iSt.pillTxt}>{t}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={iSt.btn} onPress={onStart} activeOpacity={0.75}>
        <Text style={iSt.btnTxt}>BEGIN THE JOURNEY</Text>
      </TouchableOpacity>

      <Text style={iSt.footer}>WINTER IS COMING</Text>
    </View>
  );
}

const iSt = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    // transparent — lets the warm body gradient show through
    backgroundColor: 'transparent',
  },
  topBeam: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 220,
    backgroundImage: 'radial-gradient(ellipse at 50% -10%, rgba(212,168,64,0.12) 0%, transparent 70%)',
  } as any,
  eyebrow: {
    fontSize: 11, letterSpacing: 8, color: '#7a5a28',
    marginBottom: 16, fontFamily: "'Cinzel', serif",
  },
  title: {
    fontSize: 68, color: '#d4a840', fontWeight: '900',
    letterSpacing: 5, marginBottom: 0,
    // @ts-ignore
    textShadow: '0 0 40px rgba(212,168,64,0.5), 0 2px 4px rgba(0,0,0,0.8)',
  },
  dividerRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginVertical: 22, width: '100%', maxWidth: 440,
  },
  divLine:   { flex: 1, height: 1, backgroundColor: '#3a2510', opacity: 0.8 },
  divGlyph:  { color: '#6a4820', fontSize: 10, opacity: 0.7 },
  divSword:  { color: '#c9a030', fontSize: 20, opacity: 0.6 },
  subtitle: {
    fontSize: 11, color: '#7a5a28', letterSpacing: 6,
    marginBottom: 32, fontFamily: "'Cinzel', serif",
  },
  body: {
    fontFamily: "'IM Fell English', serif",
    color: '#a08860', fontSize: 16, lineHeight: 28,
    textAlign: 'center', maxWidth: 520, marginBottom: 36,
    fontStyle: 'italic',
  },
  pillRow: { flexDirection: 'row', gap: 12, marginBottom: 44, flexWrap: 'wrap', justifyContent: 'center' },
  pill:    { paddingHorizontal: 16, paddingVertical: 6, borderWidth: 1, borderColor: '#3a2510' },
  pillTxt: { color: '#7a5828', fontSize: 10, letterSpacing: 3, fontFamily: "'Cinzel', serif" },
  btn: {
    borderWidth: 1.5, borderColor: '#c9a030',
    paddingHorizontal: 56, paddingVertical: 16,
    // @ts-ignore
    boxShadow: '0 0 24px rgba(201,160,48,0.2)',
  },
  btnTxt: {
    color: '#d4a840', fontSize: 12, letterSpacing: 5,
    fontFamily: "'Cinzel', serif", fontWeight: '700',
  },
  footer: {
    marginTop: 48, fontSize: 11, letterSpacing: 10,
    color: '#9a7848', fontFamily: "'Cinzel', serif",
    // @ts-ignore
    textShadow: '0 0 20px rgba(154,120,72,0.5)',
  },
});

// ─── FinalScreen ──────────────────────────────────────────────────────────────

function FinalScreen({ totalScore, results, onRestart }: {
  totalScore: number;
  results: RoundResult[];
  onRestart: () => void;
}) {
  const { title, sub } = getRank(totalScore);
  return (
    <ScrollView contentContainerStyle={fSt.container}>
      <Text style={fSt.eyebrow}>CAMPAIGN COMPLETE</Text>
      <Text style={fSt.score}>{totalScore.toLocaleString()}</Text>
      <Text style={fSt.scoreLabel}>TOTAL SCORE</Text>

      <View style={fSt.divRow}>
        <View style={fSt.divLine}/><Text style={fSt.divSymbol}>✦</Text><View style={fSt.divLine}/>
      </View>

      <Text style={fSt.rank}>{title}</Text>
      <Text style={fSt.rankSub}>"{sub}"</Text>

      <View style={fSt.results}>
        {results.map((r, i) => {
          const hc = HOUSE_COLORS[r.location.house];
          return (
            <View key={i} style={fSt.row}>
              <View style={[fSt.accent, { backgroundColor: hc }]}/>
              <View style={fSt.rowTxt}>
                <Text style={[fSt.gotName, { color: hc }]}>{r.location.gotName}</Text>
                <Text style={fSt.realName}>{r.location.name}</Text>
              </View>
              <View style={fSt.rowRight}>
                <Text style={fSt.pts}>{r.points.toLocaleString()}</Text>
                <Text style={fSt.dist}>{r.distanceLeagues} leagues</Text>
              </View>
            </View>
          );
        })}
      </View>

      <TouchableOpacity style={fSt.btn} onPress={onRestart} activeOpacity={0.75}>
        <Text style={fSt.btnTxt}>PLAY AGAIN</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const fSt = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingVertical: 60, backgroundColor: 'transparent' },
  eyebrow:   { fontSize: 10, letterSpacing: 8, color: '#6a4818', marginBottom: 20, fontFamily: "'Cinzel', serif" },
  score:     { fontSize: 82, color: '#d4a840', fontWeight: '900', fontFamily: "'Cinzel Decorative', serif", letterSpacing: 2, textShadow: '0 0 60px rgba(212,168,64,0.55)' } as any,
  scoreLabel:{ fontSize: 10, letterSpacing: 4, color: '#6a5028', marginBottom: 10, fontFamily: "'Cinzel', serif" },
  divRow:    { flexDirection: 'row', alignItems: 'center', gap: 14, width: '100%', maxWidth: 300, marginVertical: 22 },
  divLine:   { flex: 1, height: 1, backgroundColor: '#3a2510' },
  divSymbol: { color: '#6a4818', fontSize: 11 },
  rank:      { fontSize: 26, color: '#d4a840', fontWeight: '600', fontFamily: "'Cinzel', serif", marginBottom: 8 },
  rankSub:   { fontFamily: "'IM Fell English', serif", color: '#7a6040', fontSize: 16, fontStyle: 'italic', marginBottom: 48 },
  results:   { width: '100%', maxWidth: 500, marginBottom: 52 },
  row:       { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#241408' },
  accent:    { width: 3, height: 40, marginRight: 16, borderRadius: 1.5 },
  rowTxt:    { flex: 1 },
  gotName:   { fontSize: 14, fontWeight: '600', fontFamily: "'Cinzel', serif", marginBottom: 3 },
  realName:  { color: '#5a4020', fontSize: 11, fontFamily: "'Cinzel', serif" },
  rowRight:  { alignItems: 'flex-end' },
  pts:       { color: '#d4a840', fontSize: 16, fontWeight: '700', fontFamily: "'Cinzel', serif" },
  dist:      { color: '#4a3018', fontSize: 10, fontFamily: "'Cinzel', serif", marginTop: 2 },
  btn:       { borderWidth: 1.5, borderColor: '#c9a030', paddingHorizontal: 44, paddingVertical: 15, boxShadow: '0 0 20px rgba(201,160,48,0.18)' } as any,
  btnTxt:    { color: '#d4a840', fontSize: 12, letterSpacing: 5, fontFamily: "'Cinzel', serif", fontWeight: '700' },
});

// ─── GameScreen ───────────────────────────────────────────────────────────────

function GameScreen({ state, currentResult, onGuess, onSubmit, onNext, onExit, totalRounds }: {
  state: GameState;
  currentResult: RoundResult | undefined;
  onGuess: (x: number, y: number) => void;
  onSubmit: () => void;
  onNext: () => void;
  onExit: () => void;
  totalRounds: number;
}) {
  const [mapExpanded, setMapExpanded] = useState(false);
  const mapOverlayRef = useRef<HTMLDivElement>(null);
  const loc = state.locations[state.round];
  const hc  = HOUSE_COLORS[loc.house];
  const isResult = state.phase === 'round-result';
  const hasGuess = !!state.pendingGuess;

  useEffect(() => { if (isResult) setMapExpanded(true); }, [isResult]);

  useEffect(() => {
    if (isResult || !mapExpanded) return;
    const handlePointerDown = (event: MouseEvent) => {
      const root = mapOverlayRef.current;
      if (!root) return;
      const target = event.target as Node | null;
      if (target && !root.contains(target)) {
        setMapExpanded(false);
      }
    };
    window.addEventListener('mousedown', handlePointerDown);
    return () => window.removeEventListener('mousedown', handlePointerDown);
  }, [isResult, mapExpanded]);

  const mapClass = isResult ? 'result' : mapExpanded ? 'expanded' : 'collapsed';

  return (
    <View style={gSt.root}>

      {/* ── Header ── */}
      <View style={gSt.header}>
        <View style={gSt.hLeft}>
          <TouchableOpacity onPress={onExit} style={gSt.exitBtn} activeOpacity={0.7}>
            <Text style={gSt.exitTxt}>← EXIT</Text>
          </TouchableOpacity>
          <View style={gSt.logoBorder}>
            <Text style={gSt.logo}>GOTGUESSER</Text>
          </View>
        </View>

        {isResult && currentResult ? (
          <View style={[gSt.houseBadge, { borderColor: hc }]}>
            <Text style={[gSt.houseTxt, { color: hc }]}>
              HOUSE {loc.house.toUpperCase()}
            </Text>
            <Text style={gSt.houseLocation}>  ·  {loc.gotName}</Text>
          </View>
        ) : (
          <Text style={gSt.centerLabel}>WHERE IN THE KNOWN WORLD?</Text>
        )}

        <View style={gSt.hRight}>
          <View style={gSt.statBox}>
            <Text style={gSt.statLabel}>ROUND</Text>
            <Text style={gSt.statVal}>{state.round+1} / {totalRounds}</Text>
          </View>
          <View style={[gSt.statBox, { borderLeftWidth: 1, borderLeftColor: '#2e1c0a', paddingLeft: 18 }]}>
            <Text style={gSt.statLabel}>SCORE</Text>
            <Text style={gSt.statVal}>{state.totalScore.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {/* ── Full-screen photo ── */}
      <View style={gSt.photoWrap}>
        <ImageCarousel key={loc.id} location={loc}/>

        {/* Result bar at bottom of photo */}
        {isResult && currentResult && (
          <View style={gSt.resultBar}>
            <Text style={gSt.resultDesc}>{loc.description}</Text>
            <View style={gSt.statsRow}>
              <View style={gSt.statCol}>
                <Text style={gSt.rStatLabel}>FILMED AT</Text>
                <Text style={gSt.rStatVal}>{loc.name}</Text>
              </View>
              <View style={gSt.statDivider}/>
              <View style={gSt.statCol}>
                <Text style={gSt.rStatLabel}>DISTANCE</Text>
                <Text style={gSt.rStatVal}>{currentResult.distanceLeagues} leagues</Text>
              </View>
              <View style={gSt.statDivider}/>
              <View style={gSt.statCol}>
                <Text style={gSt.rStatLabel}>POINTS</Text>
                <Text style={gSt.rStatVal}>
                  +{currentResult.points.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* ── GeoGuessr-style collapsible map ── */}
      {/* @ts-ignore */}
      <div
        ref={mapOverlayRef}
        className={`map-overlay ${mapClass}`}
        onMouseEnter={() => { if (!isResult) setMapExpanded(true); }}
      >
        <WorldMap
          onGuess={onGuess}
          pendingGuess={state.pendingGuess}
          result={isResult && currentResult ? currentResult : null}
          disabled={isResult}
        />

        {!isResult ? (
          // @ts-ignore
          <button className="map-guess-btn" onClick={onSubmit} disabled={!hasGuess}>
            {hasGuess ? 'COMMIT TO THIS LOCATION' : 'CLICK MAP TO PLACE GUESS'}
          </button>
        ) : (
          // @ts-ignore
          <button className="map-next-btn" onClick={onNext}>
            {state.round+1 >= totalRounds ? 'SEE FINAL RESULTS  →' : 'NEXT LOCATION  →'}
          </button>
        )}
      </div>

    </View>
  );
}

const gSt = StyleSheet.create({
  root:        { flex: 1, backgroundColor: 'transparent' },
  header:      {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 22, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#2a1808',
    backgroundColor: 'rgba(14,8,3,0.88)',
    zIndex: 10,
    // @ts-ignore
    backdropFilter: 'blur(6px)',
  },
  hLeft:       { flexDirection: 'row', alignItems: 'center', gap: 16 },
  exitBtn:     { paddingVertical: 4, paddingHorizontal: 2 },
  exitTxt:     { color: '#c8a060', fontSize: 11, letterSpacing: 2, fontFamily: "'Cinzel', serif" },
  logoBorder:  { borderLeftWidth: 1, borderLeftColor: '#3a2408', paddingLeft: 16 },
  logo:        {
    fontSize: 17, fontWeight: '700', color: '#d4a840', letterSpacing: 3,
    fontFamily: "'Cinzel Decorative', serif",
    // @ts-ignore
    textShadow: '0 0 16px rgba(212,168,64,0.35)',
  },
  houseBadge:  { flexDirection: 'row', alignItems: 'center', borderWidth: 1, paddingHorizontal: 14, paddingVertical: 5 },
  houseTxt:    { fontSize: 10, letterSpacing: 2.5, fontFamily: "'Cinzel', serif", fontWeight: '700' },
  houseLocation:{ fontSize: 10, letterSpacing: 1.5, fontFamily: "'Cinzel', serif", color: '#8a7050' },
  centerLabel: { fontSize: 10, letterSpacing: 3.5, color: '#b89058', fontFamily: "'Cinzel', serif" },
  hRight:      { flexDirection: 'row', alignItems: 'center', gap: 0 },
  statBox:     { paddingHorizontal: 18, alignItems: 'flex-end' },
  statLabel:   { fontSize: 8, letterSpacing: 2.5, color: '#c8a868', fontFamily: "'Cinzel', serif", marginBottom: 2 },
  statVal:     { fontSize: 16, color: '#d4a840', fontFamily: "'Cinzel', serif", fontWeight: '700' },
  statOf:      { fontSize: 12, color: '#9a7848', fontWeight: '400' },
  photoWrap:   { flex: 1, position: 'relative' },
  resultBar:   {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingLeft: 30, paddingVertical: 20,
    // @ts-ignore
    paddingRight: 'calc(min(700px, 70vw) + 44px)',
    backgroundColor: 'rgba(10,6,2,0.90)',
    borderTopWidth: 1, borderTopColor: '#2a1808',
    zIndex: 5,
    // @ts-ignore
    backdropFilter: 'blur(8px)',
  },
  resultDesc:  { fontFamily: "'IM Fell English', serif", color: '#a08860', fontSize: 14, fontStyle: 'italic', marginBottom: 16, lineHeight: 22 },
  statsRow:    { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  statCol:     { paddingHorizontal: 22 },
  statDivider: { width: 1, height: 36, backgroundColor: '#2a1808' },
  rStatLabel:  { fontSize: 8, color: '#a08858', letterSpacing: 2.5, fontFamily: "'Cinzel', serif", marginBottom: 6 },
  rStatVal:    { color: '#d4a840', fontFamily: "'Cinzel', serif", fontSize: 15 },
});

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  useGlobalCSS();

  const [state, setState] = useState<GameState>(makeInitialState);

  const startGame   = useCallback(() => setState(s => ({ ...s, phase: 'playing' })), []);
  const setGuess    = useCallback((x: number, y: number) =>
    setState(s => s.phase === 'playing' ? { ...s, pendingGuess: { x, y } } : s), []);
  const submitGuess = useCallback(() => setState(s => {
    if (!s.pendingGuess || s.phase !== 'playing') return s;
    const loc  = s.locations[s.round];
    const dist = gotMapDistance(s.pendingGuess.x, s.pendingGuess.y, loc.gotX, loc.gotY);
    const pts  = calcGotScore(dist);
    const result: RoundResult = {
      location: loc, guessX: s.pendingGuess.x, guessY: s.pendingGuess.y,
      distanceLeagues: dist, points: pts,
    };
    return { ...s, phase: 'round-result', results: [...s.results, result], totalScore: s.totalScore + pts };
  }), []);
  const nextRound   = useCallback(() => setState(s => {
    const nr = s.round + 1;
    return nr >= s.locations.length
      ? { ...s, phase: 'final' }
      : { ...s, phase: 'playing', round: nr, pendingGuess: null };
  }), []);
  const restart     = useCallback(() => setState(makeInitialState()), []);

  const currentLocation = state.locations[state.round];
  const currentResult   = state.results[state.round];

  return (
    <View style={rootSt.root}>
      <StatusBar style="light"/>
      {state.phase === 'intro' && <IntroScreen onStart={startGame}/>}
      {(state.phase === 'playing' || state.phase === 'round-result') && currentLocation && (
        <GameScreen
          state={state}
          currentResult={currentResult}
          onGuess={setGuess}
          onSubmit={submitGuess}
          onNext={nextRound}
          onExit={restart}
          totalRounds={state.locations.length}
        />
      )}
      {state.phase === 'final' && (
        <FinalScreen totalScore={state.totalScore} results={state.results} onRestart={restart}/>
      )}
    </View>
  );
}

const rootSt = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
    // @ts-ignore
    minHeight: '100vh',
  },
});
