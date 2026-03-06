import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>A GAME OF MAPS</Text>
      <Text style={styles.title}>IRON REALM</Text>
      <Text style={styles.subtitle}>GEOGUESS THE SEVEN KINGDOMS</Text>
      <View style={styles.divider} />
      <Text style={styles.body}>
        Five real-world filming locations await. Study each photograph, read the
        landscape, and place your mark upon the map. The realm rewards those who
        truly know its lands.
      </Text>
      <View style={styles.pills}>
        {['5 Rounds', '3 Photos Each', 'No Labels'].map(t => (
          <View key={t} style={styles.pill}>
            <Text style={styles.pillText}>{t}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={onStart} activeOpacity={0.7}>
        <Text style={styles.buttonText}>BEGIN THE JOURNEY</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#080400',
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 7,
    color: '#6a4a18',
    marginBottom: 14,
    fontFamily: 'serif',
  },
  title: {
    fontSize: 64,
    color: '#c9a84c',
    fontWeight: '900',
    fontFamily: 'serif',
    letterSpacing: 4,
    // @ts-ignore
    textShadow: '0 0 50px rgba(201,168,76,0.4)',
  },
  subtitle: {
    fontSize: 12,
    color: '#6a5a3a',
    letterSpacing: 5,
    marginTop: 4,
    marginBottom: 28,
    fontFamily: 'serif',
  },
  divider: {
    width: 60,
    height: 1,
    backgroundColor: '#2a1a08',
    marginBottom: 28,
  },
  body: {
    fontFamily: 'serif',
    color: '#8a7a5a',
    fontSize: 16,
    lineHeight: 28,
    textAlign: 'center',
    maxWidth: 500,
    marginBottom: 32,
    fontStyle: 'italic',
  },
  pills: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 40,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#2a1a08',
  },
  pillText: { color: '#6a4a18', fontSize: 11, letterSpacing: 3, fontFamily: 'serif' },
  button: {
    borderWidth: 2,
    borderColor: '#c9a84c',
    paddingHorizontal: 48,
    paddingVertical: 14,
  },
  buttonText: {
    color: '#c9a84c',
    fontSize: 13,
    letterSpacing: 4,
    fontFamily: 'serif',
    fontWeight: '600',
  },
});
