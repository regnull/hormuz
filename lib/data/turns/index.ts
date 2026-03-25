import { Turn } from '@/types/turn';
import { GameState } from '@/types/game';
import { turn01 } from './turn-01';
import { generateTurn } from '@/lib/game-engine/turn-generator';

/**
 * Get turn data - uses fixed Turn 1, then dynamic generation
 */
export async function getTurnData(turnNumber: number, gameState?: GameState): Promise<Turn | null> {
  // Turn 1 is always the fixed introduction
  if (turnNumber === 1) {
    return turn01;
  }

  // For turns 2+, generate dynamically based on game state
  if (!gameState) {
    console.error('Game state required for dynamic turn generation');
    return null;
  }

  try {
    return await generateTurn(gameState);
  } catch (error) {
    console.error(`Error generating turn ${turnNumber}:`, error);
    return null;
  }
}

/**
 * Synchronous version for backward compatibility
 * Returns Turn 1 or null (use async version for Turn 2+)
 */
export function getTurnDataSync(turnNumber: number): Turn | null {
  if (turnNumber === 1) {
    return turn01;
  }
  return null;
}
