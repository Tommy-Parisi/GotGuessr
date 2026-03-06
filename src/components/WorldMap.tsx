import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import type { RoundResult } from '../types';

interface Props {
  onGuess: (x: number, y: number) => void;
  pendingGuess: { x: number; y: number } | null;
  result: RoundResult | null;
  disabled: boolean;
}

const MAP_W = 1000;
const MAP_H = 560;

export default function WorldMap({ onGuess, pendingGuess, result, disabled }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (disabled) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    onGuess(
      ((e.clientX - rect.left) / rect.width) * MAP_W,
      ((e.clientY - rect.top) / rect.height) * MAP_H,
    );
  };

  const gp = pendingGuess ?? null;
  const ap = result ? { x: result.location.gotX, y: result.location.gotY } : null;
  const rp = result ? { x: result.guessX, y: result.guessY } : null;

  return (
    <View style={styles.container}>
      {/* @ts-ignore - SVG rendered directly on web */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        style={{
          width: '100%',
          display: 'block',
          cursor: disabled ? 'default' : 'crosshair',
          borderRadius: 4,
          border: '1px solid #2a3820',
        } as React.CSSProperties}
        onClick={handleClick}
      >
        {/* Sea */}
        <rect width={MAP_W} height={MAP_H} fill="#0e1c2c" />
        {[...Array(12)].map((_, i) => (
          <line key={i} x1="0" y1={i * 48} x2={MAP_W} y2={i * 48} stroke="#101f2e" strokeWidth="1" />
        ))}

        {/* ── WESTEROS ── */}
        <path
          d="M 88,68 L 158,58 L 205,65 L 225,80 L 225,130
             L 238,152 L 245,172 L 250,195 L 262,215
             L 272,238 L 275,258 L 272,278 L 268,298
             L 260,315 L 255,332 L 248,352 L 240,372
             L 230,392 L 220,412 L 208,432 L 198,450
             L 188,465 L 175,470 L 162,464 L 150,452
             L 140,438 L 130,418 L 118,395 L 108,370
             L 98,345 L 90,318 L 85,292 L 82,265
             L 84,238 L 80,212 L 76,185 L 72,158
             L 68,130 L 70,105 L 76,85 L 82,72 Z"
          fill="#1e3318" stroke="#31501f" strokeWidth="1.5"
        />
        {/* Dorne (slightly warmer) */}
        <path
          d="M 140,438 L 155,430 L 168,428 L 182,432
             L 196,442 L 205,455 L 198,465 L 188,470
             L 175,470 L 162,464 L 150,452 Z"
          fill="#253516" stroke="#31501f" strokeWidth="0.8"
        />
        {/* Dragonstone */}
        <ellipse cx="258" cy="330" rx="7" ry="5" fill="#1e3318" stroke="#31501f" strokeWidth="1" />

        {/* Iron Islands */}
        <path d="M 60,256 L 74,251 L 79,262 L 68,270 L 59,263 Z" fill="#1e3318" stroke="#31501f" strokeWidth="1" />
        <path d="M 56,270 L 68,266 L 72,276 L 61,281 L 54,274 Z" fill="#1e3318" stroke="#31501f" strokeWidth="1" />
        <path d="M 64,246 L 74,243 L 76,251 L 67,254 L 61,249 Z" fill="#1e3318" stroke="#31501f" strokeWidth="1" />

        {/* The Wall */}
        <line x1="70" y1="130" x2="225" y2="130" stroke="#b0b8b0" strokeWidth="5" opacity="0.9" />
        <line x1="70" y1="130" x2="225" y2="130" stroke="#dde8dd" strokeWidth="1.5" opacity="0.7" />

        {/* ── ESSOS ── */}
        <path
          d="M 328,148 L 480,128 L 660,115 L 840,108
             L 960,112 L 960,400 L 920,428 L 870,442
             L 820,448 L 770,440 L 730,445 L 695,458
             L 660,460 L 628,455 L 598,448 L 568,452
             L 538,445 L 510,440 L 478,438 L 448,432
             L 418,425 L 390,412 L 365,400 L 345,388
             L 332,368 L 322,345 L 318,322 L 315,298
             L 320,272 L 325,248 L 328,222 L 332,198 Z"
          fill="#1e3318" stroke="#31501f" strokeWidth="1.5"
        />
        {/* Slaver's Bay */}
        <path
          d="M 535,382 L 555,372 L 590,365 L 622,372
             L 638,388 L 628,408 L 608,418 L 582,422
             L 558,418 L 540,406 L 533,392 Z"
          fill="#0e1c2c" stroke="#31501f" strokeWidth="0.8"
        />

        {/* ── SOTHORYOS (partial) ── */}
        <path
          d="M 385,520 L 520,510 L 650,515 L 800,508
             L 920,514 L 960,510 L 960,560 L 385,560 Z"
          fill="#182c12" stroke="#274018" strokeWidth="0.8"
        />

        {/* Bone Mountains */}
        {[658, 678, 698, 718, 738].map((x, i) => (
          <polygon key={x}
            points={`${x},${222 - i * 4} ${x + 11},${248} ${x - 11},${248}`}
            fill="#243d18" stroke="#31501f" strokeWidth="0.5" opacity="0.85"
          />
        ))}
        {[668, 688, 708, 728].map((x, i) => (
          <polygon key={x + 100}
            points={`${x},${232 - i * 3} ${x + 9},${252} ${x - 9},${252}`}
            fill="#243d18" stroke="#31501f" strokeWidth="0.5" opacity="0.85"
          />
        ))}

        {/* ── Region labels ── */}
        {([
          { t: 'BEYOND THE WALL', x: 152, y: 95,  size: 5.5, color: '#6a8090', italic: true },
          { t: 'THE NORTH',       x: 150, y: 178, size: 6,   color: '#6a8870' },
          { t: 'THE VALE',        x: 248, y: 250, size: 5,   color: '#6a8870' },
          { t: 'THE WESTERLANDS', x: 95,  y: 298, size: 4.5, color: '#6a8070' },
          { t: 'THE REACH',       x: 122, y: 362, size: 5,   color: '#6a8070' },
          { t: 'DORNE',           x: 178, y: 452, size: 6.5, color: '#a06830' },
          { t: 'THE NARROW SEA',  x: 290, y: 295, size: 5,   color: '#1e3d5a', italic: true },
          { t: 'FREE CITIES',     x: 368, y: 220, size: 5,   color: '#6a8870' },
          { t: 'THE DOTHRAKI SEA',x: 555, y: 265, size: 6,   color: '#7a6a44', italic: true },
          { t: 'THE RED WASTE',   x: 760, y: 320, size: 5.5, color: '#7a5a38', italic: true },
          { t: 'SOTHORYOS',       x: 640, y: 535, size: 6,   color: '#3a5830', italic: true },
        ] as Array<{ t: string; x: number; y: number; size: number; color: string; italic?: boolean }>)
          .map(({ t, x, y, size, color, italic }) => (
            <text key={t} x={x} y={y} textAnchor="middle" fontSize={size} fill={color}
              fontFamily="serif" letterSpacing="0.8" fontStyle={italic ? 'italic' : 'normal'}
              style={{ userSelect: 'none', pointerEvents: 'none' } as React.CSSProperties}>
              {t}
            </text>
          ))
        }

        {/* Wall label */}
        <text x="150" y="125" textAnchor="middle" fontSize="5" fill="#b0b8b0"
          fontFamily="serif" letterSpacing="1.5"
          style={{ userSelect: 'none', pointerEvents: 'none' } as React.CSSProperties}>
          THE WALL
        </text>

        {/* ── City dots + names ── */}
        {([
          { t: "KING'S LANDING", x: 222, y: 320, color: '#c9a84c' },
          { t: 'DRAGONSTONE',    x: 262, y: 338, color: '#b04030' },
          { t: 'WINTERFELL',     x: 160, y: 192, color: '#7a9ab5' },
          { t: 'CASTLE BLACK',   x: 155, y: 140, color: '#8a9a88' },
          { t: 'THE EYRIE',      x: 248, y: 256, color: '#9abacc' },
          { t: 'CASTERLY ROCK',  x: 92,  y: 305, color: '#c9a84c' },
          { t: 'HIGHGARDEN',     x: 122, y: 372, color: '#70a050' },
          { t: 'IRON ISLANDS',   x: 52,  y: 290, color: '#8899aa' },
          { t: 'BRAAVOS',        x: 360, y: 188, color: '#b8b070' },
          { t: 'PENTOS',         x: 338, y: 258, color: '#b8b070' },
          { t: 'VOLANTIS',       x: 432, y: 378, color: '#b8b070' },
          { t: 'ASTAPOR',        x: 555, y: 425, color: '#c0392b' },
          { t: 'YUNKAI',         x: 578, y: 408, color: '#b8b070' },
          { t: 'MEEREEN',        x: 600, y: 392, color: '#c9a84c' },
          { t: 'VAES DOTHRAK',   x: 568, y: 235, color: '#b0906a' },
          { t: 'QARTH',          x: 692, y: 402, color: '#b8b070' },
        ] as Array<{ t: string; x: number; y: number; color: string }>)
          .map(({ t, x, y, color }) => (
            <g key={t}>
              <circle cx={x} cy={y - 9} r="1.8" fill={color} opacity="0.7" />
              <text x={x} y={y} textAnchor="middle" fontSize="5" fill={color} opacity="0.9"
                fontFamily="serif" letterSpacing="0.4"
                style={{ userSelect: 'none', pointerEvents: 'none' } as React.CSSProperties}>
                {t}
              </text>
            </g>
          ))
        }

        {/* Compass rose */}
        <g transform="translate(940, 50)">
          <circle cx="0" cy="0" r="16" fill="#0e1c2c" stroke="#2a3820" strokeWidth="1" />
          <text x="0" y="-18" textAnchor="middle" fontSize="7" fill="#8a7a5a" fontFamily="serif">N</text>
          <text x="0"  y="24" textAnchor="middle" fontSize="7" fill="#6a6050" fontFamily="serif">S</text>
          <text x="-22" y="4" textAnchor="middle" fontSize="7" fill="#6a6050" fontFamily="serif">W</text>
          <text x="22"  y="4" textAnchor="middle" fontSize="7" fill="#6a6050" fontFamily="serif">E</text>
          <polygon points="0,-14 2,-4 -2,-4" fill="#8a7a5a" />
          <polygon points="0,14 2,4 -2,4"   fill="#6a6050" />
          <polygon points="-14,0 -4,-2 -4,2" fill="#6a6050" />
          <polygon points="14,0 4,-2 4,2"   fill="#6a6050" />
          <circle cx="0" cy="0" r="2.5" fill="#c9a84c" />
        </g>

        {/* Result line */}
        {result && rp && ap && (
          <line x1={rp.x} y1={rp.y} x2={ap.x} y2={ap.y}
            stroke="#c9a84c" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.8" />
        )}

        {/* Pending guess pin */}
        {!result && gp && (
          <g transform={`translate(${gp.x},${gp.y})`}>
            <circle r="8" fill="#e74c3c" stroke="#fff" strokeWidth="1.5" opacity="0.95" />
            <circle r="3" fill="#fff" opacity="0.9" />
          </g>
        )}

        {/* Post-result: guess pin */}
        {result && rp && (
          <g transform={`translate(${rp.x},${rp.y})`}>
            <circle r="8" fill="#e74c3c" stroke="#fff" strokeWidth="1.5" opacity="0.9" />
            <circle r="3" fill="#fff" opacity="0.85" />
          </g>
        )}

        {/* Actual location star */}
        {result && ap && (
          <g transform={`translate(${ap.x},${ap.y})`}>
            <circle r="10" fill="#c9a84c" stroke="#fff" strokeWidth="2" opacity="0.95" />
            <text textAnchor="middle" dy="4" fontSize="10" fill="#0a0500" fontWeight="bold">★</text>
          </g>
        )}

        {!disabled && !pendingGuess && (
          <text x={MAP_W / 2} y={MAP_H - 8} textAnchor="middle" fontSize="7.5" fill="#2e4858"
            fontFamily="serif" letterSpacing="2"
            style={{ pointerEvents: 'none' } as React.CSSProperties}>
            CLICK THE MAP TO PLACE YOUR MARK
          </text>
        )}
      </svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
});
