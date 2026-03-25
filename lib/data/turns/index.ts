import { Turn } from '@/types/turn';
import { turn01 } from './turn-01';

/**
 * Map of all turns in the game
 */
const TURNS: Record<number, Turn> = {
  1: turn01,
  // More turns will be added here
};

/**
 * Get turn data by turn number
 */
export function getTurnData(turnNumber: number): Turn | null {
  return TURNS[turnNumber] || null;
}

/**
 * Get all available turn numbers
 */
export function getAvailableTurns(): number[] {
  return Object.keys(TURNS).map(Number).sort((a, b) => a - b);
}
