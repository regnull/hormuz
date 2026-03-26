import { GameState } from '@/types/game';
import { TurnResponse } from '@/lib/scenarios/types';
import { HORMUZ_SCENARIO } from '@/lib/scenarios/hormuz';

/**
 * Process a player's choice in the generic game engine
 * Updates conversation history and game state
 */
export function processGenericChoice(
  gameState: GameState,
  choiceLabel: string
): GameState {
  const newState: GameState = JSON.parse(JSON.stringify(gameState));

  // Get the current turn's situation (it should be displayed but not yet in conversation history)
  const currentSituation = (gameState as any).currentSituation || '';

  // Add this turn to conversation history
  newState.conversationHistory.push({
    turnNumber: gameState.currentTurn,
    situation: currentSituation,
    playerChoice: choiceLabel,
    timestamp: new Date(),
  });

  // Advance turn counter
  newState.currentTurn += 1;

  // Legacy: Also update old choiceHistory for backwards compatibility
  newState.choiceHistory.push({
    turnNumber: gameState.currentTurn,
    optionId: choiceLabel,
    timestamp: new Date(),
  });

  return newState;
}

/**
 * Update game state with ending information
 */
export function endGame(
  gameState: GameState,
  endingType: string,
  endingNarrative: string
): GameState {
  const newState: GameState = JSON.parse(JSON.stringify(gameState));

  newState.gameStatus = 'ended';
  newState.endingType = endingType as any;
  newState.endingNarrative = endingNarrative;
  newState.completedAt = new Date();

  console.log(`[Game Engine] Game ended with ${endingType}`);

  return newState;
}

/**
 * Get the scenario configuration for a game
 */
export function getScenario(scenarioId: string) {
  // For now, only Hormuz scenario
  // In the future, this would load from a registry
  if (scenarioId === 'hormuz') {
    return HORMUZ_SCENARIO;
  }

  throw new Error(`Unknown scenario: ${scenarioId}`);
}
