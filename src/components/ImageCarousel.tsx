import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import type { Location } from '../types';
import { HOUSE_COLORS } from '../data/locations';

interface Props {
  location: Location;
}

export default function ImageCarousel({ location }: Props) {
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState<Set<string>>(new Set());
  const houseColor = HOUSE_COLORS[location.house];

  const go = (dir: 1 | -1) => {
    setIndex(i => (i + dir + location.images.length) % location.images.length);
    setLoading(true);
  };

  const src = location.images[index];
  const hasError = errored.has(src);

  return (
    <View style={styles.container}>
      {!hasError ? (
        <Image
          source={{ uri: src }}
          style={styles.image}
          resizeMode="cover"
          onLoadEnd={() => setLoading(false)}
          onError={() => {
            setErrored(prev => new Set(prev).add(src));
            setLoading(false);
          }}
        />
      ) : (
        <View style={[styles.errorBox, { borderColor: houseColor + '44' }]}>
          <Text style={styles.errorIcon}>⚔</Text>
          <Text style={styles.errorText}>IMAGE UNAVAILABLE</Text>
        </View>
      )}

      {loading && !hasError && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color={houseColor} size="small" />
        </View>
      )}

      {/* Gradient overlay — web only via style */}
      <View style={styles.gradient} pointerEvents="none" />

      {/* Arrows */}
      <TouchableOpacity style={[styles.arrow, styles.arrowLeft]} onPress={() => go(-1)}>
        <Text style={[styles.arrowText, { color: houseColor }]}>‹</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.arrow, styles.arrowRight]} onPress={() => go(1)}>
        <Text style={[styles.arrowText, { color: houseColor }]}>›</Text>
      </TouchableOpacity>

      {/* Dots */}
      <View style={styles.dots}>
        {location.images.map((_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => { setIndex(i); setLoading(true); }}
            style={[
              styles.dot,
              { backgroundColor: i === index ? houseColor : '#2a1a0a', width: i === index ? 22 : 8 },
            ]}
          />
        ))}
      </View>

      {/* Counter */}
      <View style={[styles.counter, { borderColor: houseColor + '33' }]}>
        <Text style={styles.counterText}>{index + 1} / {location.images.length}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050300',
    position: 'relative',
  },
  image: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#050300',
  },
  errorBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    margin: 20,
    borderRadius: 4,
  },
  errorIcon: { fontSize: 32, opacity: 0.3, marginBottom: 8 },
  errorText: { color: '#3a2a0a', fontSize: 10, letterSpacing: 3, fontFamily: 'serif' },
  gradient: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    height: '35%',
    // @ts-ignore
    backgroundImage: 'linear-gradient(to bottom, transparent, rgba(8,5,0,0.42))',
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -22,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderRadius: 2,
    zIndex: 2,
  },
  arrowLeft: { left: 12 },
  arrowRight: { right: 12 },
  arrowText: { fontSize: 26, lineHeight: 28 },
  dots: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 7,
    zIndex: 2,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  counter: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderWidth: 1,
    zIndex: 2,
  },
  counterText: { color: '#6a5a3a', fontSize: 10, letterSpacing: 2, fontFamily: 'serif' },
});
