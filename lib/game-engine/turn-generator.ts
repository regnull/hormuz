import { GameState } from '@/types/game';
import { Turn, Option } from '@/types/turn';
import { generateTurnNarrative } from './narrative-generator';
import { generateOptions } from './option-generator';
import { generateAIOptions } from './ai-option-generator';
import { determineStoryArc } from './story-arc';
import { generateTurnImage, getCachedTurnImage, cacheTurnImage } from './image-generator';

/**
 * Dynamically generate a turn based on current game state
 * This replaces the need for turn-01.ts, turn-02.ts, etc.
 */
export async function generateTurn(gameState: GameState): Promise<Turn> {
  const turnNumber = gameState.currentTurn;

  console.log(`[Turn Generator] Generating turn ${turnNumber}...`);

  // Determine what kind of turn this should be based on game state
  const storyArc = determineStoryArc(gameState);
  console.log(`[Turn Generator] Story arc: ${storyArc}`);

  // Generate narrative (this calls LLM)
  console.log(`[Turn Generator] Generating narrative via LLM...`);
  const situation = await generateTurnNarrative(gameState, storyArc);
  console.log(`[Turn Generator] Narrative generated (${situation.length} chars)`);

  // Generate options via LLM (with fallback to templates)
  console.log(`[Turn Generator] Generating options via LLM...`);
  let options = await generateAIOptions(gameState, storyArc);

  if (!options) {
    console.log(`[Turn Generator] AI options failed, using template options`);
    options = generateOptions(gameState, storyArc);
  } else {
    console.log(`[Turn Generator] AI options generated (${options.length} options)`);
  }

  const title = generateTurnTitle(gameState, storyArc);
  const intelligence = generateIntelligenceBriefs(gameState);
  const scene = determineScene(gameState);
  const mood = determineMood(gameState);

  // Generate or retrieve cached image
  console.log(`[Turn Generator] Generating turn image...`);
  let imageUrl = getCachedTurnImage(turnNumber);

  if (!imageUrl) {
    imageUrl = await generateTurnImage(gameState, title, situation, turnNumber);
    if (imageUrl) {
      cacheTurnImage(turnNumber, imageUrl);
      console.log(`[Turn Generator] Image generated and cached`);
    }
  } else {
    console.log(`[Turn Generator] Using cached image`);
  }

  const turn: Turn = {
    id: turnNumber,
    title,
    situation,
    intelligence,
    sceneImage: scene,
    mood,
    options,
  };

  // Add generated image URL to turn if available
  if (imageUrl) {
    (turn as any).generatedImageUrl = imageUrl;
  }

  console.log(`[Turn Generator] Turn ${turnNumber} generation complete`);
  return turn;
}

/**
 * Generate intelligence briefs based on current situation
 */
function generateIntelligenceBriefs(gameState: GameState) {
  const briefs = [];
  const { worldState, actors } = gameState;

  // CIA brief on Iran's nuclear program
  if (worldState.iranEnrichmentLevel >= 90) {
    briefs.push({
      source: 'CIA',
      content: `CRITICAL: Iran at ${worldState.iranEnrichmentLevel}% enrichment. Weapons capability imminent.`,
      reliability: 'confirmed' as const,
      icon: 'alert-triangle',
    });
  } else if (worldState.iranEnrichmentLevel >= 70) {
    briefs.push({
      source: 'CIA',
      content: `Iran continues enrichment at ${worldState.iranEnrichmentLevel}%. Estimated ${Math.ceil((100 - worldState.iranEnrichmentLevel) / 3)} weeks to weapons-grade.`,
      reliability: 'confirmed' as const,
      icon: 'shield',
    });
  } else {
    briefs.push({
      source: 'CIA',
      content: `Iran's enrichment slowed to ${worldState.iranEnrichmentLevel}%. Progress toward nuclear capability delayed.`,
      reliability: 'confirmed' as const,
      icon: 'shield',
    });
  }

  // Israeli readiness brief
  if (worldState.israelStrikeReadiness >= 80) {
    briefs.push({
      source: 'Mossad',
      content: `Israel at maximum strike readiness (${worldState.israelStrikeReadiness}%). Window for action closing. Unilateral strike possible within 48-72 hours.`,
      reliability: 'confirmed' as const,
      icon: 'plane',
    });
  } else if (worldState.israelStrikeReadiness >= 50) {
    briefs.push({
      source: 'Mossad',
      content: `Israeli strike capability at ${worldState.israelStrikeReadiness}%. Military planning continues but no immediate action expected.`,
      reliability: 'likely' as const,
      icon: 'plane',
    });
  }

  // Regional military brief
  if (actors.iran.militaryReadiness >= 70) {
    briefs.push({
      source: 'CENTCOM',
      content: `Iranian military at elevated readiness (${actors.iran.militaryReadiness}%). Defensive preparations suggest anticipation of strike. Proxy forces on alert.`,
      reliability: 'confirmed' as const,
      icon: 'crosshair',
    });
  } else {
    briefs.push({
      source: 'CENTCOM',
      content: `Iranian military posture moderate (${actors.iran.militaryReadiness}%). No immediate attack indicators. U.S. forces maintain readiness.`,
      reliability: 'confirmed' as const,
      icon: 'crosshair',
    });
  }

  // Diplomatic brief based on alliance strength
  const avgAlliance = Object.values(worldState.allianceStrength).reduce((a, b) => a + b, 0) /
    Object.keys(worldState.allianceStrength).length;

  if (avgAlliance >= 70) {
    briefs.push({
      source: 'State Department',
      content: `Alliance cohesion strong. European and Gulf partners aligned with U.S. approach. Diplomatic support solid.`,
      reliability: 'confirmed' as const,
      icon: 'users',
    });
  } else if (avgAlliance >= 50) {
    briefs.push({
      source: 'State Department',
      content: `Allied support mixed. Some partners expressing concerns about current strategy. Diplomatic coordination challenging.`,
      reliability: 'confirmed' as const,
      icon: 'users',
    });
  } else {
    briefs.push({
      source: 'State Department',
      content: `Alliance strain evident. Multiple partners distancing from U.S. position. Diplomatic isolation risk increasing.`,
      reliability: 'confirmed' as const,
      icon: 'users',
    });
  }

  // Economic brief
  if (worldState.oilPrice >= 150) {
    briefs.push({
      source: 'Treasury',
      content: `Oil at $${worldState.oilPrice}/barrel. Markets in crisis. Global economic impact severe. Immediate action needed.`,
      reliability: 'confirmed' as const,
      icon: 'trending-up',
    });
  } else if (worldState.oilPrice >= 120) {
    briefs.push({
      source: 'Economic Intelligence',
      content: `Oil price spike to $${worldState.oilPrice}/barrel causing economic concern. Markets extremely volatile on crisis fears.`,
      reliability: 'confirmed' as const,
      icon: 'trending-up',
    });
  } else if (worldState.oilPrice <= 90) {
    briefs.push({
      source: 'Economic Intelligence',
      content: `Oil prices stabilizing at $${worldState.oilPrice}/barrel. Markets cautiously optimistic about crisis management.`,
      reliability: 'confirmed' as const,
      icon: 'trending-up',
    });
  }

  return briefs.slice(0, 5); // Return top 5 most relevant
}

/**
 * Determine scene image based on game state
 */
function determineScene(gameState: GameState): string {
  const { worldState, choiceHistory } = gameState;

  // Check recent choices for context
  const lastChoice = choiceHistory[choiceHistory.length - 1];
  const lastOptionType = lastChoice?.optionId || '';

  if (worldState.threatLevel === 'critical' || worldState.iranEnrichmentLevel >= 95) {
    return 'war-room';
  }

  if (lastOptionType.includes('diplomatic') || lastOptionType.includes('deal')) {
    return 'diplomatic-summit';
  }

  if (lastOptionType.includes('strike') || lastOptionType.includes('military')) {
    return 'carrier-ops';
  }

  if (lastOptionType.includes('intelligence') || lastOptionType.includes('cia')) {
    return 'situation-room';
  }

  // Default based on threat level
  if (worldState.threatLevel === 'high') {
    return 'war-room';
  } else if (worldState.threatLevel === 'medium') {
    return 'situation-room';
  }

  return 'situation-room';
}

/**
 * Determine mood based on threat level and trajectory
 */
function determineMood(gameState: GameState): 'calm' | 'tense' | 'crisis' | 'war' {
  const { worldState } = gameState;

  if (worldState.threatLevel === 'critical' || worldState.iranEnrichmentLevel >= 95) {
    return 'war';
  } else if (worldState.threatLevel === 'high' || worldState.iranEnrichmentLevel >= 85) {
    return 'crisis';
  } else if (worldState.threatLevel === 'medium' || worldState.iranEnrichmentLevel >= 70) {
    return 'tense';
  } else {
    return 'calm';
  }
}

/**
 * Generate turn title based on story arc
 */
function generateTurnTitle(gameState: GameState, storyArc: string): string {
  const turnNumber = gameState.currentTurn;
  const { worldState } = gameState;

  // Special titles for critical moments
  if (worldState.threatLevel === 'critical') {
    return 'Point of No Return';
  }

  if (worldState.iranEnrichmentLevel >= 95) {
    return 'Nuclear Threshold';
  }

  if (worldState.iranEnrichmentLevel <= 30) {
    return 'Program in Ruins';
  }

  // Story arc based titles
  const arcTitles: Record<string, string[]> = {
    escalation: [
      'Rising Tensions',
      'The Pressure Builds',
      'Countdown to Conflict',
      'On the Edge',
      'Brinkmanship',
    ],
    deescalation: [
      'Diplomatic Opening',
      'Path to Peace',
      'Negotiating Room',
      'Cooling Off',
      'Détente',
    ],
    crisis: [
      'Critical Moment',
      'Decision Point',
      'The Crucible',
      'Under Pressure',
      'Moment of Truth',
    ],
    resolution: [
      'Endgame',
      'Final Hours',
      'Resolution',
      'The Aftermath',
      'New Reality',
    ],
  };

  const titles = arcTitles[storyArc] || arcTitles.crisis;
  const index = Math.min(turnNumber - 2, titles.length - 1);

  return titles[Math.max(0, index)];
}
