import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState } from '@/types/game';
import { ConsequenceResult } from '@/types/consequence';
import { createInitialGameState } from '@/lib/game-engine/initial-state';
import { processGenericChoice } from '@/lib/game-engine/generic-turn-processor';

interface GameStore {
  // State
  gameState: GameState | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  initializeGame: () => void;
  makeChoice: (optionId: string) => Promise<void>;
  processCustomActionInput: (input: string) => Promise<void>;
  endGame: () => void;
  resetGame: () => void;
  loadGame: (savedState: GameState) => void;
  clearError: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      gameState: null,
      isLoading: false,
      error: null,

      // Initialize a new game
      initializeGame: () => {
        console.log('[Game Store] 🎮 Initializing new game...');
        const newState = createInitialGameState();
        console.log('[Game Store] ✅ Initial state created:', {
          scenarioId: newState.scenarioId,
          currentTurn: newState.currentTurn,
          gameStatus: newState.gameStatus,
        });
        set({
          gameState: newState,
          error: null,
        });
        console.log('[Game Store] 💾 State saved to store');
      },

      // Process a regular choice
      makeChoice: async (optionId: string) => {
        const current = get().gameState;
        if (!current) {
          set({ error: 'No active game' });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          // Find the choice label from the optionId
          // optionId format should be the choice label
          const choiceLabel = optionId;

          // Process the choice using generic engine
          const updatedState = processGenericChoice(current, choiceLabel);

          set({
            gameState: updatedState,
            isLoading: false,
          });

          // Check if game has ended (will be determined by next turn generation)
          if (updatedState.gameStatus === 'ended') {
            // Game already ended, no need to call endGame()
            console.log('[Game Store] Game has ended');
          }
        } catch (error) {
          console.error('Error processing choice:', error);
          set({
            error: error instanceof Error ? error.message : 'Failed to process choice',
            isLoading: false,
          });
        }
      },

      // Process a custom action (free-form input) - same as regular choice
      processCustomActionInput: async (input: string) => {
        const current = get().gameState;
        if (!current) {
          set({ error: 'No active game' });
          return;
        }

        // Check if custom actions are enabled
        const enabled = process.env.NEXT_PUBLIC_ENABLE_CUSTOM_ACTIONS === 'true';
        if (!enabled) {
          set({ error: 'Custom actions are not enabled' });
          return;
        }

        // Check custom action limit
        const maxCustomActions = parseInt(process.env.NEXT_PUBLIC_MAX_CUSTOM_ACTIONS || '3');
        const customActionsUsed = current.choiceHistory.filter(c => c.optionId.startsWith('custom:')).length;

        if (customActionsUsed >= maxCustomActions) {
          set({ error: `You have used all ${maxCustomActions} custom actions for this game` });
          return;
        }

        console.log('[Game Store] 🎯 Processing custom action:', input);

        // Process custom action exactly like a regular choice
        // Just use the input text as the choice label and let the LLM handle it
        set({ isLoading: true, error: null });

        try {
          // Process the choice using generic engine (same as regular choices)
          const choiceLabel = `Custom Action: ${input}`;
          const updatedState = processGenericChoice(current, choiceLabel);

          set({
            gameState: updatedState,
            isLoading: false,
          });

          console.log('[Game Store] ✅ Custom action processed, advancing to next turn');
        } catch (error) {
          console.error('[Game Store] ❌ Error processing custom action:', error);
          set({
            error: error instanceof Error ? error.message : 'Failed to process custom action',
            isLoading: false,
          });
        }
      },

      // End the game
      endGame: () => {
        const current = get().gameState;
        if (!current) return;

        set({
          gameState: {
            ...current,
            gameStatus: 'ended',
            completedAt: new Date(),
          }
        });
      },

      // Reset to menu
      resetGame: () => {
        // Clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('hormuz-game-storage');
        }

        set({
          gameState: null,
          error: null,
          isLoading: false,
        });
      },

      // Load a saved game
      loadGame: (savedState: GameState) => {
        set({
          gameState: savedState,
          error: null,
        });
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'hormuz-game-storage',
      partialize: (state) => ({
        gameState: state.gameState,
      }),
    }
  )
);

// Helper functions

function shouldEndGame(state: GameState): boolean {
  // End if reached max turns
  if (state.currentTurn >= state.maxTurns) {
    return true;
  }

  // End if catastrophic failure
  if (state.worldState.threatLevel === 'critical' && state.worldState.iranEnrichmentLevel >= 100) {
    return true;
  }

  // End if complete success
  if (state.worldState.iranEnrichmentLevel <= 20) {
    return true;
  }

  return false;
}

function applyConsequence(
  state: GameState,
  result: ConsequenceResult,
  input: string
): GameState {
  const newState = { ...state };

  // Apply effects
  for (const effect of result.effects) {
    const probability = Math.random();
    if (probability < effect.probability) {
      applyEffect(newState, effect.target, effect.change);
    }
  }

  // Update score
  if (result.scoreImpact) {
    newState.score = {
      total: newState.score.total + (result.scoreImpact.total || 0),
      diplomatic: newState.score.diplomatic + (result.scoreImpact.diplomatic || 0),
      strategic: newState.score.strategic + (result.scoreImpact.strategic || 0),
      economic: newState.score.economic + (result.scoreImpact.economic || 0),
      domestic: newState.score.domestic + (result.scoreImpact.domestic || 0),
      regional: newState.score.regional + (result.scoreImpact.regional || 0),
    };
  }

  // Record choice
  newState.choiceHistory.push({
    turnNumber: state.currentTurn,
    optionId: `custom:${input}`,
    timestamp: new Date(),
  });

  // Advance turn
  if (result.nextTurnId) {
    newState.currentTurn = result.nextTurnId;
  } else {
    newState.currentTurn += 1;
  }

  return newState;
}

function applyEffect(state: GameState, target: string, change: number | string): void {
  // Parse target path (e.g., "iran.attitude", "worldState.oilPrice")
  const parts = target.split('.');

  if (parts[0] === 'worldState' && parts[1]) {
    const key = parts[1] as keyof typeof state.worldState;
    if (typeof state.worldState[key] === 'number' && typeof change === 'number') {
      (state.worldState[key] as number) += change;
    } else if (typeof change === 'string') {
      (state.worldState[key] as any) = change;
    }
  } else if (parts[0] in state.actors && parts[1]) {
    const actorId = parts[0];
    const actor = (state.actors as any)[actorId];
    const key = parts[1];
    if (actor && typeof actor[key] === 'number' && typeof change === 'number') {
      actor[key] += change;
    }
  }
}
