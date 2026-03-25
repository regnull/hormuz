import { GameState, Achievement, AchievementCategory } from '@/types/game';

interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  check: (state: GameState) => boolean;
}

/**
 * All achievement definitions
 */
const ACHIEVEMENTS: AchievementDefinition[] = [
  // Peace achievements
  {
    id: 'peacemaker',
    name: 'Peacemaker',
    description: 'Resolve the crisis without any military action',
    category: 'peace',
    check: (state) => {
      const militaryChoices = state.choiceHistory.filter(c =>
        c.optionId.includes('strike') || c.optionId.includes('military')
      );
      return state.gameStatus === 'ended' && militaryChoices.length === 0;
    },
  },
  {
    id: 'diplomat',
    name: "Diplomat's Diplomat",
    description: 'Successfully negotiate a lasting agreement',
    category: 'peace',
    check: (state) => {
      return state.endingType === 'diplomatic' && state.score.diplomatic >= 200;
    },
  },
  {
    id: 'alliance-builder',
    name: 'Alliance Builder',
    description: 'Maintain support from all major allies throughout the crisis',
    category: 'peace',
    check: (state) => {
      const alliances = state.worldState.allianceStrength;
      return Object.values(alliances).every(strength => strength >= 60);
    },
  },

  // Military achievements
  {
    id: 'hawk',
    name: 'Hawk',
    description: 'Choose military options 70% of the time',
    category: 'military',
    check: (state) => {
      const militaryChoices = state.choiceHistory.filter(c =>
        c.optionId.includes('strike') || c.optionId.includes('military')
      ).length;
      return militaryChoices / state.choiceHistory.length >= 0.7;
    },
  },
  {
    id: 'surgical-strike',
    name: 'Surgical Strike',
    description: 'Execute a successful limited military operation',
    category: 'military',
    check: (state) => {
      return state.worldState.iranEnrichmentLevel <= 30 &&
             state.worldState.threatLevel !== 'critical';
    },
  },

  // Mixed achievements
  {
    id: 'balanced-leader',
    name: 'Balanced Leader',
    description: 'Mix diplomatic and military pressure effectively',
    category: 'mixed',
    check: (state) => {
      const total = state.choiceHistory.length;
      const military = state.choiceHistory.filter(c =>
        c.optionId.includes('strike') || c.optionId.includes('military')
      ).length;
      const diplomatic = state.choiceHistory.filter(c =>
        c.optionId.includes('diplomatic') || c.optionId.includes('deal')
      ).length;

      const militaryRatio = military / total;
      const diplomaticRatio = diplomatic / total;

      return militaryRatio >= 0.3 && militaryRatio <= 0.6 &&
             diplomaticRatio >= 0.3 && diplomaticRatio <= 0.6;
    },
  },
  {
    id: 'crisis-manager',
    name: 'Crisis Manager',
    description: 'Navigate through multiple escalation points successfully',
    category: 'mixed',
    check: (state) => {
      return state.choiceHistory.length >= 10 && state.score.total >= 500;
    },
  },

  // Special achievements
  {
    id: 'perfect-storm',
    name: 'Perfect Storm',
    description: 'Achieve maximum score in all categories',
    category: 'special',
    check: (state) => {
      return state.score.diplomatic >= 200 &&
             state.score.strategic >= 200 &&
             state.score.economic >= 160 &&
             state.score.domestic >= 120 &&
             state.score.regional >= 120;
    },
  },
  {
    id: 'creative-thinker',
    name: 'Creative Thinker',
    description: 'Use custom actions to solve problems',
    category: 'special',
    check: (state) => {
      const customActions = state.choiceHistory.filter(c =>
        c.optionId.startsWith('custom:')
      ).length;
      return customActions >= 3;
    },
  },

  // Negative achievements
  {
    id: 'brinksman',
    name: 'Brinksman',
    description: 'Come within one choice of nuclear war',
    category: 'negative',
    check: (state) => {
      return state.worldState.threatLevel === 'critical' &&
             state.worldState.iranEnrichmentLevel >= 95;
    },
  },
  {
    id: 'oil-shock',
    name: 'Oil Shock',
    description: 'Cause oil prices to exceed $200/barrel',
    category: 'negative',
    check: (state) => {
      return state.worldState.oilPrice >= 200;
    },
  },
];

/**
 * Check which achievements the player has unlocked
 * Returns only newly unlocked achievements
 */
export function checkAchievements(state: GameState): Achievement[] {
  const unlockedIds = new Set(state.achievements.map(a => a.id));
  const newAchievements: Achievement[] = [];

  for (const def of ACHIEVEMENTS) {
    // Skip if already unlocked
    if (unlockedIds.has(def.id)) continue;

    // Check condition
    if (def.check(state)) {
      newAchievements.push({
        id: def.id,
        name: def.name,
        description: def.description,
        category: def.category,
        unlocked: true,
        unlockedAt: new Date(),
      });
    }
  }

  return newAchievements;
}

/**
 * Get all achievement definitions (for display purposes)
 */
export function getAllAchievements(): Omit<Achievement, 'unlocked' | 'unlockedAt'>[] {
  return ACHIEVEMENTS.map(def => ({
    id: def.id,
    name: def.name,
    description: def.description,
    category: def.category,
  }));
}
