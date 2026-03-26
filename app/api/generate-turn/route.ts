import { NextRequest, NextResponse } from 'next/server';
import { generateGenericTurn } from '@/lib/game-engine/generic-turn-generator';
import { getScenario } from '@/lib/game-engine/generic-turn-processor';
import { GameState } from '@/types/game';
import { log, logError, logEvent } from '@/lib/utils/logger';

/**
 * API route for server-side turn generation
 * This keeps the ANTHROPIC_API_KEY secure on the server
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  try {
    await log('Turn API', 'Received turn generation request');
    const { gameState } = await request.json();

    await logEvent('Turn API', 'Generating turn', {
      turnNumber: gameState.currentTurn,
      scenarioId: gameState.scenarioId,
      conversationHistoryLength: gameState.conversationHistory.length,
    });

    // Get scenario configuration
    const scenario = getScenario(gameState.scenarioId);
    await log('Turn API', `Scenario loaded: ${scenario.name}`);

    // Generate turn using LLM
    const llmStartTime = Date.now();
    const turnResponse = await generateGenericTurn(scenario, gameState);
    const llmElapsed = Date.now() - llmStartTime;

    await logEvent('Turn API', 'Turn generated successfully', {
      llmTime: llmElapsed,
      situationLength: turnResponse.situation.length,
      choicesCount: turnResponse.choices.length,
      gameStatus: turnResponse.gameStatus,
    });

    const totalElapsed = Date.now() - startTime;
    await log('Turn API', `Total API time: ${totalElapsed}ms`);

    return NextResponse.json(turnResponse);
  } catch (error) {
    const totalElapsed = Date.now() - startTime;
    await logError('Turn API', `Error after ${totalElapsed}ms`, error);
    return NextResponse.json(
      {
        error: 'Failed to generate turn',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
