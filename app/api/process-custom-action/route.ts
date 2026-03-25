import { NextRequest, NextResponse } from 'next/server';
import { processCustomAction } from '@/lib/game-engine/custom-action-processor';

/**
 * API route for server-side custom action processing
 * This keeps the ANTHROPIC_API_KEY secure on the server
 */
export async function POST(request: NextRequest) {
  try {
    const { input, gameState } = await request.json();

    console.log('[Custom Action API] Processing action:', input);

    const result = await processCustomAction(input, gameState);

    console.log('[Custom Action API] Result:', result.feasible ? 'Success' : 'Not feasible');

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Custom Action API] Error:', error);
    return NextResponse.json(
      {
        feasible: false,
        narrative: 'Failed to process action due to a technical error. Please try again.',
        effects: [],
        scoreImpact: {},
      },
      { status: 500 }
    );
  }
}
