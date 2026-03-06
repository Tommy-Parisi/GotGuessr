import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import type { RoundResult } from '../types';
import { getRank } from '../utils';
import { HOUSE_COLORS } from '../data/locations';

interface Props {
  totalScore: number;
  results: RoundResult[];
  onRestart: () => void;
}

export default function FinalScreen({ totalScore, results, onRestart }: Props) {
  const { title, sub } = getRank(totalScore);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.eyebrow}>CAMPAIGN COMPLETE</Text>
      <Text style={styles.score}>{totalScore.toLocaleString()}</Text>
      <Text style={styles.scoreLabel}>TOTAL SCORE</Text>
      <Text style={styles.rank}>{title}</Text>
      <Text style={styles.rankSub}>"{sub}"</Text>

      <View style={styles.results}>
        {results.map((r, i) => {
          const hc = HOUSE_COLORS[r.location.house];
          return (
            <View key={i} style={styles.row}>
              <View style={[styles.rowAccent, { backgroundColor: hc }]} />
              <View style={styles.rowText}>
                <Text style={[styles.rowGot, { color: hc }]}>{r.location.gotName}</Text>
                <Text style={styles.rowName}>{r.location.name}</Text>
              </View>
              <View style={styles.rowScore}>
                <Text style={styles.rowPts}>{r.points.toLocaleString()} pts</Text>
                <Text style={styles.rowDist}>{r.distanceLeagues} leagues off</Text>
              </View>
            </View>
          );
        })}
      </View>

      <TouchableOpacity style={styles.button} onPress={onRestart} activeOpacity={0.7}>
        <Text style={styles.buttonText}>PLAY AGAIN</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
    backgroundColor: '#080400',
  },
  eyebrow: { fontSize: 11, letterSpacing: 6, color: '#6a4a18', marginBottom: 18, fontFamily: 'serif' },
  score: {
    fontSize: 80,
    color: '#c9a84c',
    fontWeight: '900',
    fontFamily: 'serif',
    letterSpacing: 2,
    // @ts-ignore
    textShadow: '0 0 60px rgba(201,168,76,0.5)',
  },
  scoreLabel: { fontSize: 11, letterSpacing: 3, color: '#6a5a3a', marginBottom: 28, fontFamily: 'serif' },
  rank: { fontSize: 26, color: '#e8d4a0', fontWeight: '600', fontFamily: 'serif', marginBottom: 6 },
  rankSub: { fontFamily: 'serif', color: '#6a5a3a', fontSize: 16, fontStyle: 'italic', marginBottom: 44 },
  results: { width: '100%', maxWidth: 480, marginBottom: 48 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#180c00',
  },
  rowAccent: { width: 3, height: 36, marginRight: 14, borderRadius: 2 },
  rowText: { flex: 1 },
  rowGot: { fontSize: 14, fontWeight: '600', fontFamily: 'serif' },
  rowName: { color: '#4a3a18', fontSize: 12, fontFamily: 'serif', marginTop: 2 },
  rowScore: { alignItems: 'flex-end' },
  rowPts: { color: '#e8d4a0', fontSize: 15, fontWeight: '600', fontFamily: 'serif' },
  rowDist: { color: '#4a3a18', fontSize: 11, fontFamily: 'serif', marginTop: 2 },
  button: {
    borderWidth: 2,
    borderColor: '#c9a84c',
    paddingHorizontal: 40,
    paddingVertical: 13,
  },
  buttonText: { color: '#c9a84c', fontSize: 12, letterSpacing: 4, fontFamily: 'serif', fontWeight: '600' },
});
