import { GameState, ActorState } from '@/types/game';

/**
 * Create the initial game state when a new game starts
 */
export function createInitialGameState(): GameState {
  const playerId = generatePlayerId();

  return {
    currentTurn: 1,
    maxTurns: 15,
    gameStatus: 'playing',
    endingType: null,

    choiceHistory: [],

    actors: createInitialActors(),
    worldState: {
      iranEnrichmentLevel: 85, // Close to weapons-grade
      israelStrikeReadiness: 70, // Very ready
      oilPrice: 95, // USD/barrel (elevated)
      publicApproval: 52, // Moderate approval
      allianceStrength: {
        israel: 80,
        saudi: 65,
        europe: 70,
        gulf: 60,
      },
      threatLevel: 'high',
      daysElapsed: 0,
      politicalCapital: 100, // Full political capital at start
    },

    score: {
      total: 0,
      diplomatic: 0,
      strategic: 0,
      economic: 0,
      domestic: 0,
      regional: 0,
    },

    achievements: [],

    startedAt: new Date(),
    completedAt: null,
    playerId,
  };
}

function createInitialActors(): Record<string, ActorState> {
  return {
    iran: {
      id: 'iran',
      name: 'Iran',
      attitude: -60, // Hostile
      militaryReadiness: 50, // Moderate
      capabilities: [
        'Nuclear enrichment',
        'Ballistic missiles',
        'Proxy forces',
        'Cyber warfare',
      ],
      constraints: [
        'Economic sanctions',
        'International isolation',
        'Internal divisions',
      ],
    },

    israel: {
      id: 'israel',
      name: 'Israel',
      attitude: 70, // Strong ally
      militaryReadiness: 85, // Very high
      capabilities: [
        'Advanced air force',
        'Intelligence (Mossad)',
        'Cyber capabilities',
        'Nuclear weapons (undeclared)',
      ],
      constraints: [
        'Limited range for strike',
        'Refueling required',
        'International pressure',
      ],
    },

    saudi: {
      id: 'saudi',
      name: 'Saudi Arabia',
      attitude: 40, // Cautious ally
      militaryReadiness: 30,
      capabilities: [
        'Oil production control',
        'Regional influence',
        'Financial resources',
      ],
      constraints: [
        'Vulnerable to Iranian missiles',
        'Domestic politics',
        'Public opinion',
      ],
    },

    russia: {
      id: 'russia',
      name: 'Russia',
      attitude: -40, // Opposed
      militaryReadiness: 20, // Limited deployment in region
      capabilities: [
        'UN Security Council veto',
        'Arms sales to Iran',
        'Diplomatic influence',
      ],
      constraints: [
        'Ukraine conflict',
        'Limited interests in direct conflict',
      ],
    },

    china: {
      id: 'china',
      name: 'China',
      attitude: -30, // Opposed to US action
      militaryReadiness: 10, // Very limited
      capabilities: [
        'UN Security Council veto',
        'Economic ties with Iran',
        'Diplomatic mediation',
      ],
      constraints: [
        'Economic interests in stability',
        'Taiwan focus',
      ],
    },

    eu: {
      id: 'eu',
      name: 'European Union',
      attitude: 50, // Allied but cautious
      militaryReadiness: 0, // No military role
      capabilities: [
        'Diplomatic mediation',
        'Sanctions enforcement',
        'Economic pressure',
      ],
      constraints: [
        'Energy concerns',
        'Divided member states',
        'Preference for diplomacy',
      ],
    },

    hezbollah: {
      id: 'hezbollah',
      name: 'Hezbollah',
      attitude: -80, // Hostile (Iran proxy)
      militaryReadiness: 60,
      capabilities: [
        '150,000+ rockets',
        'Southern Lebanon positions',
        'Iranian backing',
      ],
      constraints: [
        'Lebanese politics',
        'Economic crisis',
        'Israeli deterrence',
      ],
    },

    iraqiMilitias: {
      id: 'iraqiMilitias',
      name: 'Iraqi Militias',
      attitude: -70, // Hostile (Iran proxies)
      militaryReadiness: 40,
      capabilities: [
        'US base attacks',
        'Iranian weapons',
        'Local knowledge',
      ],
      constraints: [
        'Iraqi government pressure',
        'Limited capabilities',
      ],
    },
  };
}

function generatePlayerId(): string {
  return `player-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
