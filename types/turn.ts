/**
 * Turn and choice types for Hormuz
 */

export type Mood = 'calm' | 'tense' | 'crisis' | 'war';
export type OptionType = 'diplomatic' | 'military' | 'covert' | 'economic' | 'intelligence';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type Reliability = 'confirmed' | 'likely' | 'possible' | 'rumor';

export interface Turn {
  id: number;

  // Narrative
  title: string;
  situation: string; // Main narrative text
  intelligence: IntelligenceBrief[];

  // Visuals
  sceneImage: string; // Reference to scene image
  mood: Mood;

  // Choices
  options: Option[];

  // Conditions for this turn to appear
  prerequisites?: Condition[];
}

export interface Option {
  id: string;
  label: string; // Short title
  description: string; // Detailed explanation
  type: OptionType;

  // What this choice does
  effects: Effect[];

  // Requirements
  requirements?: Requirement[];

  // Scoring impact (base values, modified by world state)
  scoreImpact: Partial<{
    diplomatic: number;
    strategic: number;
    economic: number;
    domestic: number;
    regional: number;
  }>;

  // Visual
  icon: string;
  risk: RiskLevel;

  // Next turn
  nextTurnId?: number;
}

export interface Effect {
  target: string; // What changes (actor, world state variable)
  change: number | string; // How it changes
  probability: number; // 0-1 (some effects are uncertain)
  delay?: number; // Turns before effect appears
  description: string;
}

export interface IntelligenceBrief {
  source: string; // "CIA", "CENTCOM", "Mossad", etc.
  content: string;
  reliability: Reliability;
  icon: string;
}

export interface Condition {
  type: 'choice' | 'worldState' | 'actor';
  turnId?: number;
  optionId?: string;
  variable?: string;
  operator?: '>' | '<' | '=' | '>=' | '<=';
  value?: number | string;
}

export interface Requirement {
  type: 'worldState' | 'actor' | 'politicalCapital';
  variable: string;
  operator: '>' | '<' | '=' | '>=' | '<=';
  value: number;
}
