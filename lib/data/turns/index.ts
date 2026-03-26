import { Turn } from '@/types/turn';
import { GameState } from '@/types/game';
import { generateGenericTurn } from '@/lib/game-engine/generic-turn-generator';
import { getScenario } from '@/lib/game-engine/generic-turn-processor';
import { generateTurnImage, getCachedTurnImage, cacheTurnImage } from '@/lib/game-engine/image-generator';

/**
 * Get turn data using the generic LLM-driven engine
 * Generates situation, choices, and determines if game has ended
 */
export async function getTurnData(turnNumber: number, gameState: GameState): Promise<Turn | null> {
  try {
    console.log(`[getTurnData] Generating turn ${turnNumber}`);

    // Get the scenario configuration
    const scenario = getScenario(gameState.scenarioId);

    // Generate turn using LLM with full conversation history
    const turnResponse = await generateGenericTurn(scenario, gameState);

    // If game has ended, return ending turn
    if (turnResponse.gameStatus === 'ended') {
      console.log(`[getTurnData] Game ended: ${turnResponse.endingType}`);
      return {
        id: turnNumber,
        title: `Game Over: ${turnResponse.endingType}`,
        situation: turnResponse.situation + '\n\n' + (turnResponse.endingNarrative || ''),
        intelligence: [],
        sceneImage: 'situation-room',
        mood: 'war',
        options: [], // No options on ending turn
      };
    }

    // Convert TurnResponse choices to Turn options
    const options = turnResponse.choices.map((choice, index) => ({
      id: choice.id,
      label: choice.label,
      description: choice.description + (choice.consequences ? `\n\n**Likely outcome:** ${choice.consequences}` : ''),
      type: 'diplomatic' as const, // Generic type for now
      effects: [], // Effects determined by LLM
      scoreImpact: {},
      icon: 'shield',
      risk: 'medium' as const,
    }));

    // Generate image for this turn
    console.log(`[getTurnData] Generating image for turn ${turnNumber}`);
    let imageUrl = getCachedTurnImage(turnNumber);

    if (!imageUrl) {
      const title = `Turn ${turnNumber}`;
      imageUrl = await generateTurnImage(
        gameState,
        title,
        turnResponse.situation
      );

      if (imageUrl) {
        cacheTurnImage(turnNumber, imageUrl);
        console.log(`[getTurnData] ✅ Image generated and cached:`, imageUrl);
      } else {
        console.log(`[getTurnData] ⚠️ No image generated`);
      }
    } else {
      console.log(`[getTurnData] Using cached image`);
    }

    const turn: Turn = {
      id: turnNumber,
      title: `Turn ${turnNumber}`,
      situation: turnResponse.situation,
      intelligence: [], // No intelligence briefs in generic engine
      sceneImage: 'situation-room',
      mood: determineMood(),
      options,
    };

    // Add generated image
    if (imageUrl) {
      (turn as any).generatedImageUrl = imageUrl;
    }

    // Store current situation in a temporary field so we can add it to conversation history
    // when the player makes a choice
    (gameState as any).currentSituation = turnResponse.situation;

    return turn;
  } catch (error) {
    console.error(`[getTurnData] Error generating turn ${turnNumber}:`, error);
    return null;
  }
}

function determineMood(): 'calm' | 'tense' | 'crisis' | 'war' {
  // Default mood for now - could be enhanced to analyze situation text
  return 'tense';
}
