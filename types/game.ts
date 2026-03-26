/**
 * Core game state types for Hormuz
 */

export type GameStatus = 'menu' | 'playing' | 'ended';
export type EndingType = 'diplomatic' | 'military' | 'pyrrhic' | 'stalemate' | 'catastrophe' | null;
export type ThreatLevel = 'low' | 'medium' | 'high' | 'critical';

export interface GameState {
  // Scenario
  scenarioId: string;

  // Game progress
  currentTurn: number;
  maxTurns: number;
  gameStatus: GameStatus;
  endingType: EndingType;
  endingNarrative?: string;

  // Conversation history (full LLM conversation)
  conversationHistory: ConversationTurn[];

  // Legacy fields (may be removed in future)
  choiceHistory: Choice[];
  turnHistory: TurnHistoryEntry[];
  actors: Record<ActorId, ActorState>;
  worldState: WorldState;
  score: Score;
  achievements: Achievement[];

  // Meta
  startedAt: Date;
  completedAt: Date | null;
  playerId: string;
}

export interface ConversationTurn {
  turnNumber: number;
  situation: string;
  playerChoice: string;
  timestamp: Date;
}

export interface Choice {
  turnNumber: number;
  optionId: string;
  timestamp: Date;
}

export interface TurnHistoryEntry {
  turnNumber: number;
  title: string;
  situation: string;
  chosenOption: {
    id: string;
    label: string;
  };
  worldStateSnapshot: {
    iranEnrichmentLevel: number;
    israelStrikeReadiness: number;
    threatLevel: ThreatLevel;
    daysElapsed: number;
  };
}

export type ActorId =
  | 'iran'
  | 'israel'
  | 'saudi'
  | 'russia'
  | 'china'
  | 'eu'
  | 'hezbollah'
  | 'iraqiMilitias';

export interface ActorState {
  id: ActorId;
  name: string;
  attitude: number; // -100 to 100
  militaryReadiness: number; // 0 to 100
  capabilities: string[];
  constraints: string[];
}

export interface WorldState {
  // Key variables that change based on decisions
  iranEnrichmentLevel: number; // 0-100%
  israelStrikeReadiness: number; // 0-100
  oilPrice: number; // USD/barrel
  publicApproval: number; // 0-100%
  allianceStrength: Record<string, number>;
  threatLevel: ThreatLevel;
  daysElapsed: number;
  politicalCapital: number; // For limiting custom actions
}

export interface Score {
  total: number;
  diplomatic: number;
  strategic: number;
  economic: number;
  domestic: number;
  regional: number;
}

export type AchievementCategory = 'peace' | 'military' | 'mixed' | 'special' | 'negative';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  unlocked: boolean;
  unlockedAt: Date | null;
}
