import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'; // TouchableOpacity still used in IntroScreen/GameScreen/FinalScreen
import { StatusBar } from 'expo-status-bar';

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
    gotX: 218, gotY: 318, house: 'Lannister',
    images: [px(2225439)],
  },
  {
    id: 2, name: 'Mdina, Malta', gotName: "King's Landing (S1)",
    description: "The Silent City — an ancient walled hilltop used in the earliest days of the show, before Dubrovnik became the throne's permanent home.",
    gotX: 205, gotY: 308, house: 'Baratheon',
    images: [px(4388158)],
  },
  {
    id: 3, name: 'Thingvellir, Iceland', gotName: 'The Vale / Beyond the Wall',
    description: "A volcanic rift valley standing in for the frozen North. The land itself seems to crack open, as if the gods tore it asunder.",
    gotX: 238, gotY: 252, house: 'Stark',
    images: [px(1633351)],
  },
  {
    id: 4, name: 'Ballintoy, Northern Ireland', gotName: 'The Iron Islands',
    description: "Rugged basalt coast — seat of House Greyjoy. Here the sea is never still, and the ironborn take what is theirs with iron and blood.",
    gotX: 68, gotY: 264, house: 'Greyjoy',
    images: [px(3800109)],
  },
  {
    id: 5, name: 'Seville, Spain', gotName: 'Dorne / Water Gardens',
    description: "The sun-drenched Alcázar of Seville — seat of House Martell. In Dorne the sun is a weapon and the water a mercy.",
    gotX: 175, gotY: 448, house: 'Martell',
    images: [px(1388030)],
  },
  {
    id: 6, name: 'Vatnajökull, Iceland', gotName: 'Beyond the Wall',
    description: "Europe's largest glacier — the eternal frozen wilderness where the dead walk and the living dare not follow.",
    gotX: 152, gotY: 78, house: "Night's Watch",
    images: [px(1433052)],
  },
  {
    id: 7, name: 'Essaouira, Morocco', gotName: 'Astapor',
    description: "The red city of Astapor, where Daenerys Targaryen purchased the Unsullied and set fire to a slaver's world.",
    gotX: 555, gotY: 415, house: 'Targaryen',
    images: [px(2549018)],
  },
  {
    id: 8, name: 'Dark Hedges, N. Ireland', gotName: 'The Kingsroad',
    description: "An eerie tunnel of ancient beech trees — the Kingsroad north, where Arya Stark fled south disguised among the condemned.",
    gotX: 162, gotY: 215, house: 'Stark',
    images: [px(1563356)],
  },
];

// ─── Utils ────────────────────────────────────────────────────────────────────

function gotMapDistance(x1: number, y1: number, x2: number, y2: number) {
  return Math.round(Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2));
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
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cinzel+Decorative:wght@400;700&family=IM+Fell+English:ital@0;1&display=swap';
    document.head.appendChild(link);

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
        height: 213px;
      }
      .map-overlay.expanded {
        width: min(740px, 74vw);
        height: min(480px, 64vh);
        box-shadow:
          0 0 0 1px #5a3f18,
          0 16px 60px rgba(0,0,0,0.9),
          inset 0 0 0 1px rgba(212,168,64,0.22);
      }
      .map-overlay.result {
        width: min(740px, 74vw);
        height: min(480px, 64vh);
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
        z-index: 101;
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
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(link); document.head.removeChild(style); };
  }, []);
}

// ─── WorldMap (parchment cartographic style) ─────────────────────────────────

const MAP_W = 1000;
const MAP_H = 560;

// Palette — aged atlas / "Lands of Ice and Fire" feel
const C = {
  sea:       '#8fb5cc',   // muted atlas blue
  seaDeep:   '#6a94b0',   // deeper water
  land:      '#d4b878',   // aged parchment ochre
  landAlt:   '#caa660',   // slightly darker land
  dorne:     '#c8a050',   // sun-baked ochre
  sothoryos: '#b89050',   // dark exotic ochre
  shore:     '#4a2e0e',   // dark brown coastline ink
  ink:       '#2e1a08',   // main ink colour
  inkMed:    '#4a3018',   // medium ink
  inkLight:  '#7a5a30',   // light ink for borders
  wall:      '#e8e8e0',   // pale stone
  wallStroke:'#a0b0a0',
  mountain:  '#7a5a30',   // mountain ink
  snow:      '#e8e4d8',   // snowy areas
  forest:    '#7a8a48',   // subtle forest tint
  parchBg:   '#d4b878',   // map background (parchment)
};

function WorldMap({ onGuess, pendingGuess, result, disabled }: {
  onGuess: (x: number, y: number) => void;
  pendingGuess: { x: number; y: number } | null;
  result: RoundResult | null;
  disabled: boolean;
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<{ sx: number; sy: number; px: number; py: number } | null>(null);
  const movedRef = useRef(false);
  // Keep latest zoom/pan accessible inside the non-reactive wheel handler
  const stRef = useRef({ zoom: 1, pan: { x: 0, y: 0 } });
  stRef.current = { zoom, pan };

  // Derived viewBox values
  const vw = MAP_W / zoom;
  const vh = MAP_H / zoom;
  const vx = Math.max(0, Math.min(MAP_W - vw, pan.x));
  const vy = Math.max(0, Math.min(MAP_H - vh, pan.y));

  // Returns the pixel rect of the actual SVG content (accounts for letterboxing
  // from preserveAspectRatio="xMidYMid meet"). The viewBox always has ratio
  // MAP_W:MAP_H, but the container may differ, leaving empty bars on sides or top/bottom.
  const getSvgContentRect = (el: SVGSVGElement, cvw: number, cvh: number) => {
    const rect = el.getBoundingClientRect();
    const svgAspect = cvw / cvh;
    const containerAspect = rect.width / rect.height;
    let cw: number, ch: number, ox: number, oy: number;
    if (containerAspect > svgAspect) {
      ch = rect.height; cw = rect.height * svgAspect;
      ox = (rect.width - cw) / 2; oy = 0;
    } else {
      cw = rect.width; ch = rect.width / svgAspect;
      ox = 0; oy = (rect.height - ch) / 2;
    }
    return { left: rect.left + ox, top: rect.top + oy, width: cw, height: ch };
  };

  // Non-passive wheel listener so we can call preventDefault (stops page scroll)
  // Handles both scroll-wheel zoom and trackpad pinch (ctrlKey=true)
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const { zoom: z, pan: p } = stRef.current;
      const curVW = MAP_W / z;
      const curVH = MAP_H / z;
      const cr = getSvgContentRect(el as SVGSVGElement, curVW, curVH);
      const cx = (e.clientX - cr.left) / cr.width;
      const cy = (e.clientY - cr.top)  / cr.height;
      const factor = e.deltaY < 0 ? 1.18 : 1 / 1.18;
      const nz = Math.max(1, Math.min(12, z * factor));
      const nvw = MAP_W / nz;
      const nvh = MAP_H / nz;
      setZoom(nz);
      setPan({
        x: Math.max(0, Math.min(MAP_W - nvw, p.x + curVW * cx - nvw * cx)),
        y: Math.max(0, Math.min(MAP_H - nvh, p.y + curVH * cy - nvh * cy)),
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Reset zoom when a new round starts (result cleared)
  useEffect(() => {
    if (!result) { setZoom(1); setPan({ x: 0, y: 0 }); }
  }, [result]);

  // Drag-to-pan
  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    dragRef.current = { sx: e.clientX, sy: e.clientY, px: pan.x, py: pan.y };
    movedRef.current = false;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.sx;
    const dy = e.clientY - dragRef.current.sy;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) movedRef.current = true;
    const el = svgRef.current;
    if (!el) return;
    const cr = getSvgContentRect(el, vw, vh);
    setPan({
      x: Math.max(0, Math.min(MAP_W - vw, dragRef.current.px - (dx / cr.width)  * vw)),
      y: Math.max(0, Math.min(MAP_H - vh, dragRef.current.py - (dy / cr.height) * vh)),
    });
  };
  const onMouseUp = () => { dragRef.current = null; };

  // Double-click resets zoom
  const onDblClick = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (disabled || movedRef.current) return;
    const cr = getSvgContentRect(e.currentTarget, vw, vh);
    onGuess(
      vx + ((e.clientX - cr.left) / cr.width)  * vw,
      vy + ((e.clientY - cr.top)  / cr.height) * vh,
    );
  };

  const gp = pendingGuess ?? null;
  const ap = result ? { x: result.location.gotX, y: result.location.gotY } : null;
  const rp = result ? { x: result.guessX, y: result.guessY } : null;
  const cursorStyle = disabled ? 'default' : dragRef.current ? 'grabbing' : zoom > 1.05 ? 'grab' : 'crosshair';

  return (
    // @ts-ignore
    <svg
      ref={svgRef}
      viewBox={`${vx} ${vy} ${vw} ${vh}`}
      style={{ width: '100%', height: '100%', display: 'block', cursor: cursorStyle, userSelect: 'none' } as React.CSSProperties}
      onClick={handleClick}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onDoubleClick={onDblClick}
    >
      <defs>
        {/* Parchment noise texture */}
        <filter id="parchment" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="2" result="noise"/>
          <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise"/>
          <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blended"/>
          <feComposite in="blended" in2="SourceGraphic" operator="in"/>
        </filter>
        {/* Soft glow for pins */}
        <filter id="pinGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        {/* Ocean gradient */}
        <radialGradient id="seaGrad" cx="45%" cy="40%" r="65%">
          <stop offset="0%"   stopColor="#9dc5d8"/>
          <stop offset="100%" stopColor="#5a8aaa"/>
        </radialGradient>
        {/* Parchment land gradient */}
        <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#dcc080"/>
          <stop offset="100%" stopColor="#c8a860"/>
        </linearGradient>
        {/* Aged border gradient */}
        <linearGradient id="borderGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#8a6030"/>
          <stop offset="50%"  stopColor="#6a4820"/>
          <stop offset="100%" stopColor="#8a6030"/>
        </linearGradient>
        {/* Sea hatch pattern */}
        <pattern id="seaHatch" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
          <line x1="0" y1="8" x2="8" y2="0" stroke="#7aa8c0" strokeWidth="0.4" opacity="0.5"/>
        </pattern>
      </defs>

      {/* ── OCEAN BASE ── */}
      <rect width={MAP_W} height={MAP_H} fill="url(#seaGrad)"/>
      <rect width={MAP_W} height={MAP_H} fill="url(#seaHatch)" opacity="0.4"/>

      {/* Subtle latitude lines */}
      {[...Array(8)].map((_,i) => (
        <line key={`lat${i}`} x1="0" y1={i*74} x2={MAP_W} y2={i*74}
          stroke="#6a9ab8" strokeWidth="0.4" opacity="0.5" strokeDasharray="4,8"/>
      ))}
      {[...Array(14)].map((_,i) => (
        <line key={`lon${i}`} x1={i*74} y1="0" x2={i*74} y2={MAP_H}
          stroke="#6a9ab8" strokeWidth="0.4" opacity="0.5" strokeDasharray="4,8"/>
      ))}

      {/* ── WESTEROS — detailed coastline ── */}
      {/*
        Clockwise from NW. Key features included:
        The Bite, The Fingers (Vale), Crackclaw Point,
        Blackwater Bay, Cape Wrath, Dorne peninsula,
        western coast with Westerlands bays, The Neck.
      */}
      <path
        d={`
          M 84,72
          L 91,65 L 104,59 L 118,57 L 134,56 L 150,57
          L 165,59 L 180,62 L 196,64 L 210,67 L 220,71 L 227,78
          L 228,90 L 226,105 L 225,118 L 225,130
          L 231,142 L 237,155 L 241,167 L 244,178
          L 246,189 L 242,199 L 245,209
          L 254,215 L 261,219 L 266,226 L 263,233
          L 257,237 L 265,243 L 271,251 L 267,259 L 259,262
          L 264,272 L 271,281 L 269,291
          L 262,299 L 253,307 L 242,312 L 231,315
          L 246,322 L 254,332 L 252,343 L 247,355
          L 243,366 L 254,373 L 259,385 L 251,396
          L 243,407 L 237,418 L 228,430
          L 216,440 L 203,450 L 193,457 L 184,464
          L 175,469 L 165,470 L 154,467 L 144,459
          L 135,447 L 126,430 L 116,408
          L 106,382 L 97,354 L 89,326 L 83,300
          L 79,273 L 77,248 L 77,225
          L 74,210 L 71,194 L 70,178
          L 68,161 L 67,147 L 67,130
          L 67,116 L 69,101 L 73,87 L 78,78 L 84,72 Z
        `}
        fill="url(#landGrad)" stroke={C.shore} strokeWidth="1.8" strokeLinejoin="round"
      />
      {/* Snow / Beyond the Wall tint */}
      <path
        d="M 84,72 L 227,78 L 225,130 L 67,130 L 67,116 L 69,101 L 73,87 L 78,78 Z"
        fill={C.snow} opacity="0.5" stroke="none"
      />
      {/* Dorne — distinct warmer ochre peninsula */}
      <path
        d={`
          M 135,447 L 152,438 L 165,434 L 178,436
          L 192,444 L 202,453 L 197,463 L 186,469
          L 175,470 L 163,467 L 152,459 L 144,450 Z
        `}
        fill={C.dorne} stroke={C.shore} strokeWidth="1"
      />
      {/* Islands */}
      <ellipse cx="258" cy="330" rx="10" ry="6.5" fill={C.landAlt} stroke={C.shore} strokeWidth="1"/>
      <ellipse cx="240" cy="388" rx="5" ry="8.5" fill={C.landAlt} stroke={C.shore} strokeWidth="0.9"/>
      <ellipse cx="232" cy="217" rx="7" ry="4.5" fill={C.landAlt} stroke={C.shore} strokeWidth="0.8"/>
      <ellipse cx="246" cy="221" rx="4.5" ry="3" fill={C.landAlt} stroke={C.shore} strokeWidth="0.7"/>

      {/* ── IRON ISLANDS — scattered archipelago ── */}
      <path d="M 56,254 L 73,249 L 79,261 L 67,269 L 55,262 Z" fill={C.landAlt} stroke={C.shore} strokeWidth="1.1"/>
      <path d="M 52,269 L 66,265 L 71,277 L 59,282 L 50,274 Z" fill={C.landAlt} stroke={C.shore} strokeWidth="1"/>
      <path d="M 61,244 L 73,241 L 76,251 L 65,254 L 58,248 Z" fill={C.landAlt} stroke={C.shore} strokeWidth="0.9"/>
      <path d="M 48,279 L 61,276 L 64,287 L 51,291 L 46,283 Z" fill={C.landAlt} stroke={C.shore} strokeWidth="0.9"/>
      <ellipse cx="70" cy="248" rx="4" ry="3" fill={C.landAlt} stroke={C.shore} strokeWidth="0.7"/>

      {/* ── THE WALL ── */}
      <line x1="67" y1="130" x2="225" y2="130" stroke={C.wallStroke} strokeWidth="6" strokeLinecap="square"/>
      <line x1="67" y1="130" x2="225" y2="130" stroke={C.wall} strokeWidth="2.5" strokeLinecap="square"/>
      {[78,100,122,145,168,192,215].map(x => (
        <rect key={x} x={x-4} y={123} width={9} height={13} fill={C.wall} stroke={C.wallStroke} strokeWidth="0.8"/>
      ))}

      {/* ── ESSOS — detailed coastline ── */}
      {/*
        Clockwise from NW peninsula tip. Features:
        Free Cities jagged coast, Slaver's Bay, Jade Sea coast,
        eastern shadow lands coast.
      */}
      <path
        d={`
          M 330,148
          L 360,142 L 390,136 L 418,131 L 448,127
          L 480,124 L 514,120 L 548,117 L 582,115
          L 618,113 L 656,111 L 696,109 L 736,108
          L 780,107 L 824,107 L 868,108 L 912,109
          L 944,110 L 960,112
          L 960,155 L 960,210 L 960,270 L 960,330 L 960,390
          L 957,410 L 946,428 L 928,440
          L 904,449 L 876,454 L 845,452 L 815,449
          L 789,443 L 764,445 L 740,448 L 716,455
          L 692,460 L 668,461 L 646,458 L 624,453
          L 602,449 L 580,450 L 558,447 L 536,444
          L 514,441 L 490,439 L 466,436 L 442,432
          L 418,426 L 396,417 L 374,406 L 354,394
          L 339,381 L 329,365 L 322,347 L 318,328
          L 316,308 L 317,286 L 319,265 L 323,244
          L 326,224 L 328,204 L 329,182 L 330,162 Z
        `}
        fill="url(#landGrad)" stroke={C.shore} strokeWidth="1.8" strokeLinejoin="round"
      />
      {/* Slaver's Bay — proper enclosed bay shape */}
      <path
        d={`
          M 533,385 L 548,374 L 568,368 L 592,366
          L 618,370 L 636,382 L 638,398 L 628,412
          L 608,421 L 584,424 L 560,420 L 540,410
          L 531,397 Z
        `}
        fill={C.seaDeep} stroke={C.shore} strokeWidth="0.9"
      />
      {/* Gulf of Grief / southern Essos bays */}
      <path
        d="M 432,418 L 456,412 L 470,420 L 462,432 L 442,434 L 430,426 Z"
        fill={C.seaDeep} stroke={C.shore} strokeWidth="0.7" opacity="0.85"
      />
      {/* Red Waste tint */}
      <ellipse cx="782" cy="290" rx="115" ry="80" fill="#a86820" opacity="0.18"/>
      {/* Dothraki grassland tint */}
      <ellipse cx="562" cy="252" rx="125" ry="68" fill="#7a7028" opacity="0.13"/>

      {/* ── SOTHORYOS — northern coast visible ── */}
      <path
        d={`
          M 385,524 L 420,516 L 460,512 L 504,510
          L 548,511 L 596,513 L 644,514 L 696,513
          L 748,511 L 800,510 L 852,511 L 900,513
          L 940,514 L 960,513
          L 960,560 L 385,560 Z
        `}
        fill={C.sothoryos} stroke={C.shore} strokeWidth="1"
      />

      {/* ── KINGDOM BORDER LINES (dashed ink) ── */}
      {/* North/South boundary ~ The Neck */}
      <line x1="72" y1="210" x2="262" y2="215" stroke={C.inkMed} strokeWidth="0.8" strokeDasharray="4,5" opacity="0.55"/>
      {/* Vale border */}
      <line x1="220" y1="215" x2="262" y2="215" stroke={C.inkMed} strokeWidth="0.8" strokeDasharray="4,5" opacity="0.55"/>
      {/* Dorne boundary */}
      <line x1="130" y1="420" x2="208" y2="440" stroke={C.inkMed} strokeWidth="0.8" strokeDasharray="4,5" opacity="0.55"/>

      {/* ── MOUNTAINS ── (ink triangle symbols, medieval style) */}
      {/* Northern mountains */}
      {[
        [100,154],[118,150],[136,156],[152,152],
      ].map(([x,y],i) => (
        <polygon key={`nm${i}`}
          points={`${x},${y-10} ${x+9},${y+2} ${x-9},${y+2}`}
          fill={C.mountain} stroke={C.mountain} strokeWidth="0.3" opacity="0.85"/>
      ))}
      {/* Mountains of the Moon (Vale) */}
      {[
        [240,234],[253,228],[266,234],[258,240],
      ].map(([x,y],i) => (
        <polygon key={`vm${i}`}
          points={`${x},${y-12} ${x+10},${y+2} ${x-10},${y+2}`}
          fill={C.mountain} stroke={C.mountain} strokeWidth="0.3" opacity="0.85"/>
      ))}
      {/* Red Mountains (Dorne border) */}
      {[
        [142,430],[155,426],[168,422],[180,426],[192,430],
      ].map(([x,y],i) => (
        <polygon key={`dm${i}`}
          points={`${x},${y-9} ${x+8},${y+2} ${x-8},${y+2}`}
          fill="#8a5820" stroke="#6a4010" strokeWidth="0.3" opacity="0.8"/>
      ))}
      {/* Bone Mountains (Essos) */}
      {[652,668,684,700,716,732,748].map((x,i) => (
        <polygon key={`bm${i}`}
          points={`${x},${225-i*3} ${x+13},${250} ${x-13},${250}`}
          fill={C.mountain} stroke={C.mountain} strokeWidth="0.3" opacity="0.88"/>
      ))}
      {[660,676,692,708,724,740].map((x,i) => (
        <polygon key={`bm2${i}`}
          points={`${x},${238-i*2} ${x+10},${254} ${x-10},${254}`}
          fill={C.mountain} stroke={C.mountain} strokeWidth="0.3" opacity="0.75"/>
      ))}
      {/* Shadow Lands mountains */}
      {[895,910,925,940,955].map((x,i) => (
        <polygon key={`sm${i}`}
          points={`${x},${340-i*6} ${x+11},${365} ${x-11},${365}`}
          fill="#6a5020" stroke={C.mountain} strokeWidth="0.3" opacity="0.7"/>
      ))}

      {/* ── FOREST PATCHES (small ink clusters) ── */}
      {[
        [142,185],[155,182],[148,195],
        [112,358],[124,362],[118,368],
        [192,295],[200,288],[196,300],
      ].map(([x,y],i) => (
        <circle key={`f${i}`} cx={x} cy={y} r="5.5" fill={C.forest} opacity="0.22"/>
      ))}

      {/* ── REGION LABELS ── */}
      {([
        { t: 'BEYOND THE WALL', x: 152, y: 90,  s: 10, c: '#4a6878', it: true  },
        { t: 'THE NORTH',       x: 148, y: 178, s: 11, c: C.ink           },
        { t: 'THE GIFT',        x: 148, y: 153, s:  7, c: C.inkMed, it: true },
        { t: 'THE VALE',        x: 248, y: 242, s:  9, c: C.ink           },
        { t: 'THE RIVERLANDS',  x: 174, y: 262, s:  8, c: C.ink           },
        { t: 'THE WESTERLANDS', x:  90, y: 290, s:  8, c: C.ink           },
        { t: 'THE CROWNLANDS',  x: 220, y: 298, s:  7, c: C.inkMed, it: true },
        { t: 'THE STORMLANDS',  x: 234, y: 355, s:  8, c: C.ink           },
        { t: 'THE REACH',       x: 126, y: 368, s: 10, c: C.ink           },
        { t: 'DORNE',           x: 176, y: 450, s: 12, c: '#6a3808'       },
        { t: 'THE NARROW SEA',  x: 296, y: 292, s:  9, c: '#3a5e78', it: true },
        { t: 'THE SHIVERING SEA',x:152, y:  46, s:  9, c: '#3a5e78', it: true },
        { t: 'FREE CITIES',     x: 368, y: 210, s: 10, c: C.ink           },
        { t: 'THE DOTHRAKI SEA',x: 562, y: 265, s: 11, c: '#5a4820', it: true },
        { t: 'THE RED WASTE',   x: 782, y: 312, s: 10, c: '#6a3810', it: true },
        { t: 'SOTHORYOS',       x: 640, y: 536, s: 11, c: '#4a3810', it: true },
        { t: 'THE JADE SEA',    x: 858, y: 452, s:  9, c: '#3a5e78', it: true },
        { t: 'SHADOW LANDS',    x: 920, y: 350, s:  8, c: '#4a3818', it: true },
      ] as Array<{ t: string; x: number; y: number; s: number; c: string; it?: boolean }>)
        .map(({ t, x, y, s, c, it }) => (
          <text key={t} x={x} y={y} textAnchor="middle" fontSize={s} fill={c}
            fontFamily="'Cinzel', serif" letterSpacing="1.2"
            fontStyle={it ? 'italic' : 'normal'}
            style={{ userSelect: 'none', pointerEvents: 'none' } as React.CSSProperties}>
            {t}
          </text>
        ))
      }

      {/* THE WALL label */}
      <text x="150" y="124" textAnchor="middle" fontSize="8" fill="#7a9a7a"
        fontFamily="'Cinzel', serif" letterSpacing="3"
        style={{ userSelect: 'none', pointerEvents: 'none' } as React.CSSProperties}>
        THE WALL
      </text>

      {/* ── CITY DOTS + LABELS ── */}
      {([
        { t: "KING'S LANDING", x: 222, y: 322, c: '#8a5810', bold: true },
        { t: 'DRAGONSTONE',    x: 261, y: 343, c: '#7a2818' },
        { t: 'WINTERFELL',     x: 158, y: 194, c: '#3a5878', bold: true },
        { t: 'CASTLE BLACK',   x: 155, y: 144, c: '#4a5848' },
        { t: 'THE EYRIE',      x: 251, y: 258, c: '#485870' },
        { t: 'CASTERLY ROCK',  x:  90, y: 307, c: '#8a5810' },
        { t: 'HIGHGARDEN',     x: 125, y: 378, c: '#4a6828' },
        { t: 'SUNSPEAR',       x: 184, y: 462, c: '#7a3808' },
        { t: 'PYKE',           x:  57, y: 282, c: '#486070' },
        { t: 'OLDTOWN',        x: 112, y: 410, c: '#5a4818' },
        { t: 'HARRENHAL',      x: 190, y: 275, c: '#5a4830' },
        { t: 'BRAAVOS',        x: 358, y: 186, c: '#6a5820' },
        { t: 'PENTOS',         x: 336, y: 257, c: '#6a5820' },
        { t: 'LYS',            x: 345, y: 325, c: '#6a5820' },
        { t: 'VOLANTIS',       x: 437, y: 384, c: '#6a5820' },
        { t: 'ASTAPOR',        x: 557, y: 426, c: '#7a2818', bold: true },
        { t: 'YUNKAI',         x: 583, y: 411, c: '#6a5020' },
        { t: 'MEEREEN',        x: 606, y: 394, c: '#8a5810', bold: true },
        { t: 'VAES DOTHRAK',   x: 572, y: 235, c: '#6a4818' },
        { t: 'QARTH',          x: 696, y: 408, c: '#6a5020' },
        { t: 'ASSHAI',         x: 924, y: 395, c: '#4a3828' },
      ] as Array<{ t: string; x: number; y: number; c: string; bold?: boolean }>)
        .map(({ t, x, y, c, bold }) => (
          <g key={t}>
            <circle cx={x} cy={y-11} r="2.8" fill={c} opacity="0.9"/>
            <text x={x} y={y} textAnchor="middle" fontSize="7.5" fill={c}
              fontFamily="'Cinzel', serif" letterSpacing="0.5"
              fontWeight={bold ? '700' : '400'}
              style={{ userSelect: 'none', pointerEvents: 'none' } as React.CSSProperties}>
              {t}
            </text>
          </g>
        ))
      }

      {/* ── DECORATIVE MAP BORDER ── */}
      <rect x="3" y="3" width={MAP_W-6} height={MAP_H-6}
        fill="none" stroke="#7a5820" strokeWidth="2.5" opacity="0.7"/>
      <rect x="7" y="7" width={MAP_W-14} height={MAP_H-14}
        fill="none" stroke="#8a6830" strokeWidth="1" opacity="0.4"/>
      {/* Corner ornaments */}
      {[[12,12],[MAP_W-12,12],[12,MAP_H-12],[MAP_W-12,MAP_H-12]].map(([cx,cy],i) => (
        <g key={`corner${i}`} transform={`translate(${cx},${cy})`}>
          <circle r="4" fill="none" stroke="#7a5820" strokeWidth="1.2" opacity="0.7"/>
          <circle r="1.5" fill="#8a6828" opacity="0.7"/>
        </g>
      ))}

      {/* ── COMPASS ROSE ── */}
      <g transform="translate(940, 52)">
        <circle cx="0" cy="0" r="22" fill="#d4b060" stroke="#8a5820" strokeWidth="1.5" opacity="0.9"/>
        <circle cx="0" cy="0" r="17" fill="none" stroke="#8a5820" strokeWidth="0.8" opacity="0.7"/>
        <circle cx="0" cy="0" r="5"  fill="none" stroke="#8a5820" strokeWidth="0.8" opacity="0.7"/>
        {/* Cardinal petals */}
        <polygon points="0,-20 3,-6 -3,-6"   fill="#5a3010" opacity="0.9"/>
        <polygon points="0,20  3,6  -3,6"    fill="#8a6828" opacity="0.7"/>
        <polygon points="-20,0 -6,-3 -6,3"  fill="#8a6828" opacity="0.7"/>
        <polygon points="20,0  6,-3  6,3"   fill="#8a6828" opacity="0.7"/>
        {/* Intercardinal petals (smaller) */}
        <polygon points="0,-20 2,-8 -2,-8"  fill="#7a5820" opacity="0.4" transform="rotate(45)"/>
        <polygon points="0,-20 2,-8 -2,-8"  fill="#7a5820" opacity="0.4" transform="rotate(135)"/>
        <polygon points="0,-20 2,-8 -2,-8"  fill="#7a5820" opacity="0.4" transform="rotate(225)"/>
        <polygon points="0,-20 2,-8 -2,-8"  fill="#7a5820" opacity="0.4" transform="rotate(315)"/>
        <circle cx="0" cy="0" r="3.5" fill="#d4a030"/>
        <text x="0" y="-26" textAnchor="middle" fontSize="9" fill="#3a1e08"
          fontFamily="'Cinzel', serif" fontWeight="700"
          style={{ userSelect: 'none', pointerEvents: 'none' } as React.CSSProperties}>N</text>
        <text x="0"  y="33" textAnchor="middle" fontSize="7.5" fill="#6a5030"
          fontFamily="'Cinzel', serif"
          style={{ userSelect: 'none', pointerEvents: 'none' } as React.CSSProperties}>S</text>
        <text x="-30" y="4" textAnchor="middle" fontSize="7.5" fill="#6a5030"
          fontFamily="'Cinzel', serif"
          style={{ userSelect: 'none', pointerEvents: 'none' } as React.CSSProperties}>W</text>
        <text x="30"  y="4" textAnchor="middle" fontSize="7.5" fill="#6a5030"
          fontFamily="'Cinzel', serif"
          style={{ userSelect: 'none', pointerEvents: 'none' } as React.CSSProperties}>E</text>
      </g>

      {/* ── RESULT: line between guess and answer ── */}
      {result && rp && ap && (
        <line x1={rp.x} y1={rp.y} x2={ap.x} y2={ap.y}
          stroke="#8a3010" strokeWidth="2" strokeDasharray="6,4" opacity="0.9"/>
      )}

      {/* Pending guess pin */}
      {!result && gp && (
        <g transform={`translate(${gp.x},${gp.y - 20})`} filter="url(#pinGlow)">
          <circle r="11" fill="#c0391b" stroke="#f0e0c0" strokeWidth="2" opacity="0.95"/>
          <circle r="4"  fill="#f0e8d8" opacity="0.9"/>
          <line x1="0" y1="11" x2="0" y2="20" stroke="#c0391b" strokeWidth="1.5"/>
        </g>
      )}
      {/* Post-result: guess pin */}
      {result && rp && (
        <g transform={`translate(${rp.x},${rp.y - 20})`} filter="url(#pinGlow)">
          <circle r="11" fill="#c0391b" stroke="#f0e0c0" strokeWidth="2" opacity="0.9"/>
          <circle r="4"  fill="#f0e8d8" opacity="0.85"/>
          <line x1="0" y1="11" x2="0" y2="20" stroke="#c0391b" strokeWidth="1.5"/>
        </g>
      )}
      {/* Actual location star */}
      {result && ap && (
        <g transform={`translate(${ap.x},${ap.y})`} filter="url(#pinGlow)">
          <circle r="13" fill="#d4a030" stroke="#f5e8c0" strokeWidth="2.5" opacity="0.97"/>
          <text textAnchor="middle" dy="5" fontSize="13" fill="#1a0e04" fontWeight="bold"
            style={{ userSelect: 'none', pointerEvents: 'none' } as React.CSSProperties}>★</text>
        </g>
      )}

      {/* Legend */}
      {result && (
        <g transform="translate(12, 525)">
          <rect x="-2" y="-12" width="200" height="24" fill="rgba(210,180,100,0.85)" rx="1"/>
          <rect x="-2" y="-12" width="200" height="24" rx="1" fill="none" stroke="#8a6028" strokeWidth="0.8"/>
          <circle cx="14" cy="0" r="7" fill="#c0391b" stroke="#f0e0c0" strokeWidth="1.2"/>
          <circle cx="14" cy="0" r="2.5" fill="#f0e8d8"/>
          <text x="26" y="4" fontSize="8" fill="#2a1808"
            fontFamily="'Cinzel', serif" letterSpacing="0.8"
            style={{ userSelect: 'none', pointerEvents: 'none' } as React.CSSProperties}>YOUR GUESS</text>
          <circle cx="120" cy="0" r="8" fill="#d4a030" stroke="#f5e8c0" strokeWidth="1.5"/>
          <text textAnchor="middle" x="120" y="4" fontSize="9" fill="#1a0e04"
            style={{ userSelect: 'none', pointerEvents: 'none' } as React.CSSProperties}>★</text>
          <text x="133" y="4" fontSize="8" fill="#2a1808"
            fontFamily="'Cinzel', serif" letterSpacing="0.8"
            style={{ userSelect: 'none', pointerEvents: 'none' } as React.CSSProperties}>ACTUAL</text>
        </g>
      )}

      {/* Click hint */}
      {!disabled && !pendingGuess && (
        <text x={MAP_W/2} y={MAP_H-10} textAnchor="middle" fontSize="8.5" fill="#4a6070"
          fontFamily="'Cinzel', serif" letterSpacing="2.5"
          style={{ pointerEvents: 'none' } as React.CSSProperties}>
          CLICK THE MAP TO PLACE YOUR MARK
        </text>
      )}
    </svg>
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
  const loc = state.locations[state.round];
  const hc  = HOUSE_COLORS[loc.house];
  const isResult = state.phase === 'round-result';
  const hasGuess = !!state.pendingGuess;

  useEffect(() => { if (isResult) setMapExpanded(true); }, [isResult]);

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
        className={`map-overlay ${mapClass}`}
        onMouseEnter={() => { if (!isResult) setMapExpanded(true); }}
        onMouseLeave={() => { if (!isResult) setMapExpanded(false); }}
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
    paddingRight: 'calc(min(740px, 74vw) + 44px)',
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
