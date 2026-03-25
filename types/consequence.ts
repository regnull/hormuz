/**
 * Consequence types for custom actions and turn results
 */

import { Effect } from './turn';
import { Score } from './game';

export interface ConsequenceResult {
  feasible: boolean;
  narrative: string;
  effects: Effect[];
  scoreImpact: Partial<Score>;
  actionType?: 'diplomatic' | 'military' | 'covert' | 'economic' | 'intelligence';
  nextTurnId?: number;
}

export interface CustomActionResponse {
  feasible: boolean;
  narrative: string;
  effects: Array<{
    target: string;
    change: number | string;
    probability: number;
    description: string;
  }>;
  scoreImpact: {
    diplomatic: number;
    strategic: number;
    economic: number;
    domestic: number;
    regional: number;
  };
  actionType: 'diplomatic' | 'military' | 'covert' | 'economic' | 'intelligence';
}
