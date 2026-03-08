import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import type { RoundResult } from '../types';

interface Props {
  onGuess: (x: number, y: number) => void;
  pendingGuess: { x: number; y: number } | null;
  result: RoundResult | null;
  disabled: boolean;
}

export default function WorldMap({ onGuess, pendingGuess, result, disabled }: Props) {
  const overlayRef = useRef<any>(null);

  const handleMouseDown = (e: any) => {
    if (disabled) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    onGuess(x, y);
    // Temporarily pass the click through to the iframe so the map still pans/zooms
    if (overlayRef.current) {
      overlayRef.current.style.pointerEvents = 'none';
      setTimeout(() => {
        if (overlayRef.current) overlayRef.current.style.pointerEvents = '';
      }, 150);
    }
  };

  const gp = pendingGuess ?? null;
  const ap = result ? { x: result.location.gotX, y: result.location.gotY } : null;
  const rp = result ? { x: result.guessX, y: result.guessY } : null;

  // Percentage strings for SVG attributes
  const pct = (v: number) => `${(v * 100).toFixed(3)}%`;

  return (
    <View style={styles.container}>
      {/* @ts-ignore */}
      <div style={{ position: 'relative', width: '100%', height: '100%' } as React.CSSProperties}>

        {/* Quartermaester interactive map */}
        {/* @ts-ignore */}
        <iframe
          src="https://quartermaester.info"
          title="Westeros Map"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: 4,
          } as React.CSSProperties}
        />

        {/* Transparent overlay — intercepts clicks before they reach the iframe */}
        {/* @ts-ignore */}
        <div
          ref={overlayRef}
          onMouseDown={handleMouseDown}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            cursor: disabled ? 'default' : 'crosshair',
            pointerEvents: disabled ? 'none' : 'auto',
          } as React.CSSProperties}
        />

        {/* SVG marker layer — pins, line, prompt text */}
        {/* @ts-ignore */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 11,
            overflow: 'visible',
          } as React.CSSProperties}
        >
          {/* Dashed line between guess and actual location */}
          {result && rp && ap && (
            // @ts-ignore
            <line
              x1={pct(rp.x)} y1={pct(rp.y)}
              x2={pct(ap.x)} y2={pct(ap.y)}
              stroke="#c9a84c" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.8"
            />
          )}

          {/* Pending guess pin */}
          {!result && gp && (
            <>
              {/* @ts-ignore */}
              <circle cx={pct(gp.x)} cy={pct(gp.y)} r="8" fill="#e74c3c" stroke="#fff" strokeWidth="1.5" opacity="0.95" />
              {/* @ts-ignore */}
              <circle cx={pct(gp.x)} cy={pct(gp.y)} r="3" fill="#fff" opacity="0.9" />
            </>
          )}

          {/* Post-result guess pin */}
          {result && rp && (
            <>
              {/* @ts-ignore */}
              <circle cx={pct(rp.x)} cy={pct(rp.y)} r="8" fill="#e74c3c" stroke="#fff" strokeWidth="1.5" opacity="0.9" />
              {/* @ts-ignore */}
              <circle cx={pct(rp.x)} cy={pct(rp.y)} r="3" fill="#fff" opacity="0.85" />
            </>
          )}

          {/* Actual location gold star */}
          {result && ap && (
            <>
              {/* @ts-ignore */}
              <circle cx={pct(ap.x)} cy={pct(ap.y)} r="10" fill="#c9a84c" stroke="#fff" strokeWidth="2" opacity="0.95" />
              {/* @ts-ignore */}
              <text x={pct(ap.x)} y={pct(ap.y)} textAnchor="middle" dy="4" fontSize="10" fill="#0a0500" fontWeight="bold">★</text>
            </>
          )}

          {/* Prompt text */}
          {!disabled && !pendingGuess && (
            // @ts-ignore
            <text
              x="50%" y="95%"
              textAnchor="middle"
              fontSize="11"
              fill="rgba(255,255,255,0.35)"
              fontFamily="serif"
              letterSpacing="2"
              style={{ userSelect: 'none' } as React.CSSProperties}
            >
              CLICK THE MAP TO PLACE YOUR MARK
            </text>
          )}
        </svg>

      {/* @ts-ignore */}
      </div>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', aspectRatio: 1000 / 560 },
});
