import { GameState, Score } from '@/types/game';
import { Option } from '@/types/turn';

/**
 * Calculate the score impact of a choice
 * Base impact comes from the option, but can be modified by world state
 */
export function calculateScoreImpact(
  option: Option,
  state: GameState
): Omit<Score, 'total'> {
  const base = option.scoreImpact;

  // Start with base values
  const impact = {
    diplomatic: base.diplomatic || 0,
    strategic: base.strategic || 0,
    economic: base.economic || 0,
    domestic: base.domestic || 0,
    regional: base.regional || 0,
  };

  // Apply modifiers based on world state

  // Diplomatic actions are more effective with high alliance strength
  if (option.type === 'diplomatic') {
    const avgAlliance = Object.values(state.worldState.allianceStrength).reduce((a, b) => a + b, 0) /
      Object.keys(state.worldState.allianceStrength).length;
    const modifier = (avgAlliance - 50) / 100; // -0.5 to +0.5
    impact.diplomatic *= (1 + modifier);
  }

  // Military actions are penalized if public approval is low
  if (option.type === 'military') {
    const approvalModifier = (state.worldState.publicApproval - 50) / 100;
    impact.domestic *= (1 + approvalModifier);
  }

  // Economic impact scales with oil price changes
  if (Math.abs(impact.economic) > 0) {
    const oilPriceMultiplier = state.worldState.oilPrice / 100; // Higher oil = bigger impact
    impact.economic *= oilPriceMultiplier;
  }

  // Round to integers
  return {
    diplomatic: Math.round(impact.diplomatic),
    strategic: Math.round(impact.strategic),
    economic: Math.round(impact.economic),
    domestic: Math.round(impact.domestic),
    regional: Math.round(impact.regional),
  };
}

/**
 * Calculate final score tier
 */
export function getScoreTier(totalScore: number): {
  tier: string;
  color: string;
  description: string;
} {
  if (totalScore >= 800) {
    return {
      tier: 'Masterful',
      color: 'text-green-400',
      description: 'Outstanding crisis management',
    };
  } else if (totalScore >= 600) {
    return {
      tier: 'Successful',
      color: 'text-blue-400',
      description: 'Effective leadership',
    };
  } else if (totalScore >= 400) {
    return {
      tier: 'Mixed',
      color: 'text-yellow-400',
      description: 'Some successes, some failures',
    };
  } else if (totalScore >= 200) {
    return {
      tier: 'Struggling',
      color: 'text-orange-400',
      description: 'Difficult outcome',
    };
  } else {
    return {
      tier: 'Catastrophic',
      color: 'text-red-400',
      description: 'Crisis mismanaged',
    };
  }
}
