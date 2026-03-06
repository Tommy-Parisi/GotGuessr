import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useGameState } from './src/hooks/useGameState';
import IntroScreen from './src/components/IntroScreen';
import GameScreen from './src/components/GameScreen';
import FinalScreen from './src/components/FinalScreen';

export default function App() {
  const { state, currentLocation, currentResult, startGame, setGuess, submitGuess, nextRound, restart } = useGameState();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      {state.phase === 'intro' && (
        <IntroScreen onStart={startGame} />
      )}
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
        <FinalScreen
          totalScore={state.totalScore}
          results={state.results}
          onRestart={restart}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#080400',
    // @ts-ignore
    minHeight: '100vh',
  },
});
