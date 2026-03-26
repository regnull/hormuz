import { Turn } from '@/types/turn';
import { GameState } from '@/types/game';
import { TurnResponse } from '@/lib/scenarios/types';
import { generateTurnImage, getCachedTurnImage, cacheTurnImage } from '@/lib/game-engine/image-generator';
import { IMAGE_GENERATION_ENABLED } from '@/lib/config/models';

/**
 * Get turn data using the generic LLM-driven engine
 * Generates situation, choices, and determines if game has ended
 */
export async function getTurnData(turnNumber: number, gameState: GameState): Promise<Turn | null> {
  try {
    console.log(`[getTurnData] 🎲 Starting turn generation for turn ${turnNumber}`);
    console.log(`[getTurnData] 📊 Game state:`, {
      scenarioId: gameState.scenarioId,
      currentTurn: gameState.currentTurn,
      conversationHistoryLength: gameState.conversationHistory.length,
    });

    // Call server-side API route for turn generation
    console.log('[getTurnData] 📡 Calling /api/generate-turn...');
    const response = await fetch('/api/generate-turn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gameState,
      }),
    });

    console.log('[getTurnData] 📬 Response received:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[getTurnData] ❌ API error:', errorData);
      throw new Error(errorData.message || 'Failed to generate turn');
    }

    console.log('[getTurnData] 📖 Parsing turn response...');
    const turnResponse: TurnResponse = await response.json();
    console.log('[getTurnData] ✅ Turn response parsed:', {
      situationLength: turnResponse.situation.length,
      choicesCount: turnResponse.choices.length,
      gameStatus: turnResponse.gameStatus,
    });

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

    // Generate image for this turn (if enabled)
    let imageUrl: string | null = null;

    if (IMAGE_GENERATION_ENABLED) {
      console.log(`[getTurnData] 🎨 Checking for cached image for turn ${turnNumber}...`);
      imageUrl = getCachedTurnImage(turnNumber);

      if (!imageUrl) {
        console.log(`[getTurnData] 🖼️ No cached image, generating new image...`);
        const title = `Turn ${turnNumber}`;
        const startTime = Date.now();

        imageUrl = await generateTurnImage(
          gameState,
          title,
          turnResponse.situation,
          turnNumber
        );

        const elapsed = Date.now() - startTime;

        if (imageUrl) {
          cacheTurnImage(turnNumber, imageUrl);
          console.log(`[getTurnData] ✅ Image generated in ${elapsed}ms and cached`);
          console.log(`[getTurnData] 🔗 Image URL:`, imageUrl.substring(0, 80) + '...');
        } else {
          console.log(`[getTurnData] ⚠️ No image generated (took ${elapsed}ms)`);
        }
      } else {
        console.log(`[getTurnData] ♻️ Using cached image:`, imageUrl.substring(0, 80) + '...');
      }
    } else {
      console.log(`[getTurnData] 🚫 Image generation disabled (set IMAGE_GENERATION_ENABLED=true to enable)`);
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

    console.log(`[getTurnData] 🎉 Turn ${turnNumber} fully generated and ready!`);
    return turn;
  } catch (error) {
    console.error(`[getTurnData] ❌ Error generating turn ${turnNumber}:`, error);
    if (error instanceof Error) {
      console.error(`[getTurnData] 📋 Error details:`, {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 3).join('\n'),
      });
    }
    return null;
  }
}

function determineMood(): 'calm' | 'tense' | 'crisis' | 'war' {
  // Default mood for now - could be enhanced to analyze situation text
  return 'tense';
}
