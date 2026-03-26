import { NextRequest, NextResponse } from 'next/server';
import { generateGenericTurn } from '@/lib/game-engine/generic-turn-generator';
import { getScenario } from '@/lib/game-engine/generic-turn-processor';
import { GameState } from '@/types/game';

/**
 * API route for server-side turn generation
 * This keeps the ANTHROPIC_API_KEY secure on the server
 */
export async function POST(request: NextRequest) {
  try {
    const { gameState } = await request.json();

    console.log(`[Turn API] Generating turn ${gameState.currentTurn} for scenario: ${gameState.scenarioId}`);

    // Get scenario configuration
    const scenario = getScenario(gameState.scenarioId);

    // Generate turn using LLM
    const turnResponse = await generateGenericTurn(scenario, gameState);

    console.log(`[Turn API] Turn generated:`, {
      situationLength: turnResponse.situation.length,
      choicesCount: turnResponse.choices.length,
      gameStatus: turnResponse.gameStatus,
    });

    return NextResponse.json(turnResponse);
  } catch (error) {
    console.error('[Turn API] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate turn',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
