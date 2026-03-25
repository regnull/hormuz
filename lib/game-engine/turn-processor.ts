import { GameState } from '@/types/game';
import { Turn, Option, Effect } from '@/types/turn';
import { getTurnData } from '@/lib/data/turns/index';
import { calculateScoreImpact } from './scoring-engine';
import { checkAchievements } from './achievement-tracker';

/**
 * Process a player's choice and update game state
 */
export async function processChoice(
  state: GameState,
  optionId: string
): Promise<GameState> {
  // Get current turn data (async for dynamic generation)
  const currentTurn = await getTurnData(state.currentTurn, state);
  if (!currentTurn) {
    throw new Error(`Turn ${state.currentTurn} not found`);
  }

  // Find the selected option
  const option = currentTurn.options.find(opt => opt.id === optionId);
  if (!option) {
    throw new Error(`Option ${optionId} not found in turn ${state.currentTurn}`);
  }

  // Create a copy of the state
  const newState: GameState = JSON.parse(JSON.stringify(state));

  // Apply effects
  for (const effect of option.effects) {
    applyEffect(newState, effect);
  }

  // Update score
  const scoreImpact = calculateScoreImpact(option, newState);
  newState.score.diplomatic += scoreImpact.diplomatic;
  newState.score.strategic += scoreImpact.strategic;
  newState.score.economic += scoreImpact.economic;
  newState.score.domestic += scoreImpact.domestic;
  newState.score.regional += scoreImpact.regional;
  newState.score.total =
    newState.score.diplomatic +
    newState.score.strategic +
    newState.score.economic +
    newState.score.domestic +
    newState.score.regional;

  // Record the choice
  newState.choiceHistory.push({
    turnNumber: state.currentTurn,
    optionId: option.id,
    timestamp: new Date(),
  });

  // Record turn history with full context for LLM
  newState.turnHistory.push({
    turnNumber: state.currentTurn,
    title: currentTurn.title,
    situation: currentTurn.situation,
    chosenOption: {
      id: option.id,
      label: option.label,
    },
    worldStateSnapshot: {
      iranEnrichmentLevel: state.worldState.iranEnrichmentLevel,
      israelStrikeReadiness: state.worldState.israelStrikeReadiness,
      threatLevel: state.worldState.threatLevel,
      daysElapsed: state.worldState.daysElapsed,
    },
  });

  // Advance to next turn
  if (option.nextTurnId) {
    newState.currentTurn = option.nextTurnId;
  } else {
    newState.currentTurn += 1;
  }

  // Check achievements
  const newAchievements = checkAchievements(newState);
  newState.achievements = [...newState.achievements, ...newAchievements];

  return newState;
}

/**
 * Apply an effect to the game state
 */
function applyEffect(state: GameState, effect: Effect): void {
  // Check probability
  const roll = Math.random();
  if (roll >= effect.probability) {
    return; // Effect doesn't happen
  }

  // Parse target (e.g., "iran.attitude", "worldState.oilPrice")
  const parts = effect.target.split('.');

  if (parts[0] === 'worldState' && parts[1]) {
    applyWorldStateEffect(state, parts[1], effect.change);
  } else if (parts[0] in state.actors && parts[1]) {
    applyActorEffect(state, parts[0], parts[1], effect.change);
  }
}

function applyWorldStateEffect(
  state: GameState,
  key: string,
  change: number | string
): void {
  const worldState = state.worldState as any;

  if (key in worldState) {
    if (typeof change === 'number' && typeof worldState[key] === 'number') {
      worldState[key] += change;

      // Clamp values
      if (key === 'iranEnrichmentLevel') {
        worldState[key] = Math.max(0, Math.min(100, worldState[key]));
      } else if (key === 'israelStrikeReadiness') {
        worldState[key] = Math.max(0, Math.min(100, worldState[key]));
      } else if (key === 'publicApproval') {
        worldState[key] = Math.max(0, Math.min(100, worldState[key]));
      } else if (key === 'politicalCapital') {
        worldState[key] = Math.max(0, Math.min(100, worldState[key]));
      }
    } else if (typeof change === 'string') {
      worldState[key] = change;
    }
  }
}

function applyActorEffect(
  state: GameState,
  actorId: string,
  key: string,
  change: number | string
): void {
  const actor = (state.actors as any)[actorId];

  if (actor && key in actor) {
    if (typeof change === 'number' && typeof actor[key] === 'number') {
      actor[key] += change;

      // Clamp attitude and readiness
      if (key === 'attitude') {
        actor[key] = Math.max(-100, Math.min(100, actor[key]));
      } else if (key === 'militaryReadiness') {
        actor[key] = Math.max(0, Math.min(100, actor[key]));
      }
    } else if (typeof change === 'string') {
      actor[key] = change;
    }
  }
}
