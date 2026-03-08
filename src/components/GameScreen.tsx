import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ImageCarousel from './ImageCarousel';
import WorldMap from './WorldMap';
import { HOUSE_COLORS } from '../data/locations';
import type { GameState, RoundResult } from '../types';

interface Props {
  state: GameState;
  currentResult: RoundResult | undefined;
  onGuess: (x: number, y: number) => void;
  onSubmit: () => void;
  onNext: () => void;
  onExit: () => void;
  totalRounds: number;
}

export default function GameScreen({ state, currentResult, onGuess, onSubmit, onNext, onExit, totalRounds }: Props) {
  const loc = state.locations[state.round];
  const hc = HOUSE_COLORS[loc.house];
  const isResult = state.phase === 'round-result';
  const hasGuess = !!state.pendingGuess;

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={onExit} style={styles.exitBtn} activeOpacity={0.7}>
            <Text style={styles.exitText}>← EXIT</Text>
          </TouchableOpacity>
          <Text style={styles.logo}>IRON REALM</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.headerStat}>
            ROUND <Text style={[styles.headerVal, { color: hc }]}>{state.round + 1}</Text>/{totalRounds}
          </Text>
          <Text style={styles.headerStat}>
            SCORE <Text style={styles.headerVal}>{state.totalScore.toLocaleString()}</Text>
          </Text>
        </View>
      </View>

      {/* Body - 2 columns */}
      <View style={styles.body}>

        {/* LEFT — photos */}
        <View style={styles.left}>
          {/* House / location badge */}
          <View style={[styles.badge, { borderLeftColor: hc }]}>
            <Text style={[styles.badgeText, { color: hc }]}>
              {isResult ? `HOUSE ${loc.house.toUpperCase()}  ·  ${loc.gotName}` : 'UNKNOWN LOCATION'}
            </Text>
          </View>

          <View style={styles.imageWrap}>
            <ImageCarousel key={loc.id} location={loc} />
          </View>

          {/* Result info panel */}
          {isResult && currentResult && (
            <View style={styles.resultPanel}>
              <Text style={styles.resultDesc}>{loc.description}</Text>
              <View style={styles.resultStats}>
                <View>
                  <Text style={styles.statLabel}>FILMED AT</Text>
                  <Text style={styles.statVal}>{loc.name}</Text>
                </View>
                <View>
                  <Text style={styles.statLabel}>MAP DISTANCE</Text>
                  <Text style={styles.statVal}>{currentResult.distanceLeagues} leagues</Text>
                </View>
                <View>
                  <Text style={styles.statLabel}>POINTS</Text>
                  <Text style={[styles.statVal, { color: currentResult.points >= 3000 ? hc : '#e8d4a0', fontWeight: '700' }]}>
                    +{currentResult.points.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* RIGHT — map */}
        <View style={styles.right}>
          <Text style={styles.mapLabel}>
            {isResult ? 'THE REALM' : 'WHERE IN THE REALM?'}
          </Text>

          <WorldMap
            onGuess={onGuess}
            pendingGuess={state.pendingGuess}
            result={isResult && currentResult ? currentResult : null}
            disabled={isResult}
          />

          {isResult && (
            <View style={styles.legend}>
              <Text style={styles.legendItem}><Text style={{ color: '#e74c3c' }}>●</Text>  Your guess</Text>
              <Text style={styles.legendItem}><Text style={{ color: '#c9a84c' }}>★</Text>  Actual location</Text>
            </View>
          )}

          <View style={styles.buttonWrap}>
            {!isResult ? (
              <TouchableOpacity
                style={[styles.btn, hasGuess ? styles.btnActive : styles.btnDisabled]}
                onPress={onSubmit}
                disabled={!hasGuess}
                activeOpacity={0.75}
              >
                <Text style={[styles.btnText, { color: hasGuess ? '#c9a84c' : '#3a2a10' }]}>
                  {hasGuess ? 'GUESS' : 'CLICK THE MAP TO GUESS'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.btnNext} onPress={onNext} activeOpacity={0.75}>
                <Text style={styles.btnNextText}>
                  {state.round + 1 >= totalRounds ? 'SEE FINAL RESULTS' : 'NEXT LOCATION →'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0d0a04' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#2a1c08',
    backgroundColor: '#100d04',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  exitBtn: { paddingVertical: 4, paddingHorizontal: 2 },
  exitText: { color: '#6a5a3a', fontSize: 10, letterSpacing: 2, fontFamily: 'serif' },
  logo: { fontSize: 15, fontWeight: '700', color: '#c9a84c', letterSpacing: 3, fontFamily: 'serif' },
  headerRight: { flexDirection: 'row', gap: 24 },
  headerStat: { color: '#6a5a3a', fontSize: 11, letterSpacing: 2, fontFamily: 'serif' },
  headerVal: { color: '#c9a84c', fontWeight: '700' },
  body: { flex: 1, flexDirection: 'row' },
  left: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#2a1c08',
    flexDirection: 'column',
  },
  badge: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2a1c08',
    borderLeftWidth: 3,
  },
  badgeText: { fontSize: 10, letterSpacing: 3, fontFamily: 'serif' },
  imageWrap: { height: 260 },
  resultPanel: {
    flex: 1,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#2a1c08',
    justifyContent: 'center',
  },
  resultDesc: {
    fontFamily: 'serif',
    color: '#9a8a68',
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 14,
    lineHeight: 20,
  },
  resultStats: { flexDirection: 'row', gap: 28, flexWrap: 'wrap' },
  statLabel: { fontSize: 9, color: '#6a5a3a', letterSpacing: 2, fontFamily: 'serif', marginBottom: 4 },
  statVal: { color: '#e8d4a0', fontFamily: 'serif', fontSize: 14 },
  right: {
    flex: 1,
    padding: 14,
    backgroundColor: '#0f0c05',
    flexDirection: 'column',
    gap: 10,
  },
  mapLabel: { fontSize: 9, color: '#6a5a3a', letterSpacing: 3, fontFamily: 'serif' },
  legend: { flexDirection: 'row', gap: 20 },
  legendItem: { color: '#6a5a3a', fontSize: 10, letterSpacing: 1, fontFamily: 'serif' },
  buttonWrap: { marginTop: 'auto' as any },
  btn: {
    padding: 13,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  btnActive: { borderColor: '#c9a84c' },
  btnDisabled: { borderColor: '#3a2a10' },
  btnText: { fontSize: 11, letterSpacing: 3, fontFamily: 'serif', fontWeight: '600' },
  btnNext: {
    padding: 13,
    backgroundColor: '#c9a84c',
    alignItems: 'center',
  },
  btnNextText: { color: '#0d0a04', fontSize: 11, letterSpacing: 3, fontFamily: 'serif', fontWeight: '700' },
});
