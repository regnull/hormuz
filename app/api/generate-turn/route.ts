import { NextRequest, NextResponse } from 'next/server';
import { generateGenericTurn } from '@/lib/game-engine/generic-turn-generator';
import { getScenario } from '@/lib/game-engine/generic-turn-processor';
import { GameState } from '@/types/game';

/**
 * API route for server-side turn generation
 * This keeps the ANTHROPIC_API_KEY secure on the server
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  try {
    console.log('[Turn API] 📥 Received turn generation request');
    const { gameState } = await request.json();

    console.log(`[Turn API] 🎲 Generating turn ${gameState.currentTurn} for scenario: ${gameState.scenarioId}`);
    console.log(`[Turn API] 📊 Conversation history: ${gameState.conversationHistory.length} turns`);

    // Get scenario configuration
    console.log('[Turn API] 📖 Loading scenario configuration...');
    const scenario = getScenario(gameState.scenarioId);
    console.log(`[Turn API] ✅ Scenario loaded: ${scenario.name}`);

    // Generate turn using LLM
    console.log('[Turn API] 🤖 Calling LLM to generate turn...');
    const llmStartTime = Date.now();
    const turnResponse = await generateGenericTurn(scenario, gameState);
    const llmElapsed = Date.now() - llmStartTime;

    console.log(`[Turn API] ✅ LLM responded in ${llmElapsed}ms`);
    console.log(`[Turn API] 📝 Turn generated:`, {
      situationLength: turnResponse.situation.length,
      choicesCount: turnResponse.choices.length,
      gameStatus: turnResponse.gameStatus,
    });

    const totalElapsed = Date.now() - startTime;
    console.log(`[Turn API] 🎉 Total API time: ${totalElapsed}ms`);

    return NextResponse.json(turnResponse);
  } catch (error) {
    const totalElapsed = Date.now() - startTime;
    console.error(`[Turn API] ❌ Error after ${totalElapsed}ms:`, error);
    if (error instanceof Error) {
      console.error('[Turn API] 📋 Error details:', {
        name: error.name,
        message: error.message,
      });
    }
    return NextResponse.json(
      {
        error: 'Failed to generate turn',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
