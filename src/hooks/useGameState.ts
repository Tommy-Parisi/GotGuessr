import { useState, useCallback } from 'react';
import type { GameState, RoundResult } from '../types';
import { pickRandom } from '../data/locations';
import { gotMapDistance, calcGotScore } from '../utils';

const ROUNDS = 5;

function initialState(): GameState {
  return {
    phase: 'intro',
    locations: pickRandom(ROUNDS),
    round: 0,
    results: [],
    pendingGuess: null,
    totalScore: 0,
  };
}

export function useGameState() {
  const [state, setState] = useState<GameState>(initialState);

  const startGame = useCallback(() => {
    setState(s => ({ ...s, phase: 'playing' }));
  }, []);

  const setGuess = useCallback((x: number, y: number) => {
    setState(s =>
      s.phase === 'playing' ? { ...s, pendingGuess: { x, y } } : s
    );
  }, []);

  const submitGuess = useCallback(() => {
    setState(s => {
      if (!s.pendingGuess || s.phase !== 'playing') return s;
      const loc = s.locations[s.round];
      const dist = gotMapDistance(s.pendingGuess.x, s.pendingGuess.y, loc.gotX, loc.gotY);
      const points = calcGotScore(dist);
      const result: RoundResult = {
        location: loc,
        guessX: s.pendingGuess.x,
        guessY: s.pendingGuess.y,
        distanceLeagues: dist,
        points,
      };
      return {
        ...s,
        phase: 'round-result',
        results: [...s.results, result],
        totalScore: s.totalScore + points,
      };
    });
  }, []);

  const nextRound = useCallback(() => {
    setState(s => {
      const nextRound = s.round + 1;
      if (nextRound >= s.locations.length) {
        return { ...s, phase: 'final' };
      }
      return { ...s, phase: 'playing', round: nextRound, pendingGuess: null };
    });
  }, []);

  const restart = useCallback(() => {
    setState(initialState());
  }, []);

  const currentLocation = state.locations[state.round];
  const currentResult = state.results[state.round];

  return {
    state,
    currentLocation,
    currentResult,
    startGame,
    setGuess,
    submitGuess,
    nextRound,
    restart,
  };
}
