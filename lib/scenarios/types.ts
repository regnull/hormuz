/**
 * Type definitions for game scenarios
 */

export interface GameScenario {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  imageStyle: string;
  maxTurns: number;
}

export interface ConversationTurn {
  turnNumber: number;
  situation: string;
  playerChoice: string;
  timestamp: Date;
}

export interface TurnResponse {
  situation: string;
  choices: Choice[];
  gameStatus: 'continue' | 'ended';
  endingType?: 'victory' | 'defeat' | 'stalemate' | 'disaster' | string;
  endingNarrative?: string;
}

export interface Choice {
  id: string;
  label: string;
  description: string;
  consequences?: string;
}
