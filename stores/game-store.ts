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
  customActionResult: {
    success: boolean;
    message: string;
  } | null;

  // Actions
  initializeGame: () => void;
  makeChoice: (optionId: string) => Promise<void>;
  processCustomActionInput: (input: string) => Promise<void>;
  endGame: () => void;
  resetGame: () => void;
  loadGame: (savedState: GameState) => void;
  clearError: () => void;
  clearCustomActionResult: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      gameState: null,
      isLoading: false,
      error: null,
      customActionResult: null,

      // Initialize a new game
      initializeGame: () => {
        const newState = createInitialGameState();
        set({
          gameState: newState,
          error: null,
          customActionResult: null,
        });
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

      // Process a custom action (free-form input)
      processCustomActionInput: async (input: string) => {
        const current = get().gameState;
        if (!current) {
          set({ error: 'No active game' });
          return;
        }

        // Check if custom actions are enabled
        const enabled = process.env.NEXT_PUBLIC_ENABLE_CUSTOM_ACTIONS === 'true';
        if (!enabled) {
          set({
            customActionResult: {
              success: false,
              message: 'Custom actions are not enabled. Please set NEXT_PUBLIC_ENABLE_CUSTOM_ACTIONS=true',
            }
          });
          return;
        }

        // Check political capital
        const maxCustomActions = parseInt(process.env.NEXT_PUBLIC_MAX_CUSTOM_ACTIONS || '3');
        const customActionsUsed = current.choiceHistory.filter(c => c.optionId.startsWith('custom:')).length;

        if (customActionsUsed >= maxCustomActions) {
          set({
            customActionResult: {
              success: false,
              message: `You have used all ${maxCustomActions} custom actions for this game.`,
            }
          });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          // Call server-side API route for custom action processing
          const response = await fetch('/api/process-custom-action', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              input,
              gameState: current,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to process custom action');
          }

          const result: ConsequenceResult = await response.json();

          if (!result.feasible) {
            set({
              customActionResult: {
                success: false,
                message: result.narrative,
              },
              isLoading: false,
            });
            return;
          }

          // Apply the custom action
          const updatedState = applyConsequence(current, result, input);

          set({
            gameState: updatedState,
            customActionResult: {
              success: true,
              message: result.narrative,
            },
            isLoading: false,
          });

          // Check if game should end
          if (shouldEndGame(updatedState)) {
            get().endGame();
          }
        } catch (error) {
          console.error('Error processing custom action:', error);
          set({
            error: error instanceof Error ? error.message : 'Failed to process custom action',
            customActionResult: {
              success: false,
              message: 'Failed to process action. Please try again.',
            },
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
          customActionResult: null,
          isLoading: false,
        });
      },

      // Load a saved game
      loadGame: (savedState: GameState) => {
        set({
          gameState: savedState,
          error: null,
          customActionResult: null,
        });
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Clear custom action result
      clearCustomActionResult: () => {
        set({ customActionResult: null });
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
