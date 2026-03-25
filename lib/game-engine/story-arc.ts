import { GameState } from '@/types/game';

/**
 * Determine the current story arc based on game state
 * This helps the turn generator create appropriate content
 */
export function determineStoryArc(gameState: GameState): string {
  const { worldState, choiceHistory, currentTurn } = gameState;

  // Analyze trajectory
  const recentChoices = choiceHistory.slice(-3);
  const militaryChoices = recentChoices.filter(c =>
    c.optionId.includes('strike') ||
    c.optionId.includes('military') ||
    c.optionId.includes('escalate')
  ).length;

  const diplomaticChoices = recentChoices.filter(c =>
    c.optionId.includes('diplomatic') ||
    c.optionId.includes('deal') ||
    c.optionId.includes('deescalate') ||
    c.optionId.includes('talk')
  ).length;

  // Determine arc based on state and trajectory

  // Crisis arc - things are getting worse
  if (
    worldState.threatLevel === 'critical' ||
    worldState.iranEnrichmentLevel >= 95 ||
    worldState.oilPrice >= 150 ||
    militaryChoices >= 2
  ) {
    return 'crisis';
  }

  // Escalation arc - building toward conflict
  if (
    worldState.threatLevel === 'high' ||
    worldState.israelStrikeReadiness >= 80 ||
    militaryChoices > diplomaticChoices
  ) {
    return 'escalation';
  }

  // De-escalation arc - moving toward diplomacy
  if (
    diplomaticChoices >= 2 ||
    worldState.iranEnrichmentLevel < worldState.iranEnrichmentLevel - 10 || // Program slowing
    Object.values(worldState.allianceStrength).reduce((a, b) => a + b, 0) /
      Object.keys(worldState.allianceStrength).length >= 70
  ) {
    return 'deescalation';
  }

  // Resolution arc - approaching endgame
  if (currentTurn >= 12) {
    return 'resolution';
  }

  // Default - crisis management
  return 'crisis';
}

/**
 * Determine if game should end and what ending to use
 */
export function checkForEnding(gameState: GameState): {
  shouldEnd: boolean;
  endingType: 'diplomatic' | 'military' | 'pyrrhic' | 'stalemate' | 'catastrophe' | null;
} {
  const { worldState, currentTurn, score } = gameState;

  // Catastrophe - nuclear war or total breakdown
  if (
    worldState.iranEnrichmentLevel >= 100 ||
    worldState.threatLevel === 'critical' && worldState.oilPrice >= 200
  ) {
    return { shouldEnd: true, endingType: 'catastrophe' };
  }

  // Diplomatic victory - program stopped through negotiation
  if (
    worldState.iranEnrichmentLevel <= 20 &&
    Object.values(worldState.allianceStrength).every(s => s >= 60) &&
    score.diplomatic >= 150
  ) {
    return { shouldEnd: true, endingType: 'diplomatic' };
  }

  // Military success - program destroyed militarily
  if (
    worldState.iranEnrichmentLevel <= 20 &&
    score.strategic >= 150
  ) {
    return { shouldEnd: true, endingType: 'military' };
  }

  // Pyrrhic victory - success but at huge cost
  if (
    worldState.iranEnrichmentLevel <= 30 &&
    (worldState.oilPrice >= 180 || score.regional <= -50)
  ) {
    return { shouldEnd: true, endingType: 'pyrrhic' };
  }

  // Stalemate - reached max turns without resolution
  if (currentTurn >= 15) {
    return { shouldEnd: true, endingType: 'stalemate' };
  }

  // Continue playing
  return { shouldEnd: false, endingType: null };
}
