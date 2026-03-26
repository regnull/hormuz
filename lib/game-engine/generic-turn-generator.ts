import Anthropic from '@anthropic-ai/sdk';
import { GameScenario, ConversationTurn, TurnResponse } from '@/lib/scenarios/types';
import { GameState } from '@/types/game';

/**
 * Generic turn generator that works with any scenario
 * Sends full conversation history to LLM
 * LLM generates situation, choices, and determines if game has ended
 */
export async function generateGenericTurn(
  scenario: GameScenario,
  gameState: GameState
): Promise<TurnResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }

  console.log(`[Generic Turn Generator] Generating turn ${gameState.currentTurn} for scenario: ${scenario.id}`);

  const anthropic = new Anthropic({ apiKey });

  // Build conversation messages from history
  const messages = buildConversationMessages(gameState.conversationHistory);

  console.log(`[Generic Turn Generator] Sending ${messages.length} messages to LLM`);
  console.log(`[Generic Turn Generator] Conversation history has ${gameState.conversationHistory.length} turns`);

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 3500,
      system: scenario.systemPrompt,
      messages: messages,
      temperature: 0.8,
    });

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';
    console.log(`[Generic Turn Generator] Received response (${responseText.length} chars)`);

    // Parse the JSON response
    const turnResponse = parseTurnResponse(responseText);

    console.log(`[Generic Turn Generator] Turn generated:`, {
      situationLength: turnResponse.situation.length,
      choicesCount: turnResponse.choices.length,
      gameStatus: turnResponse.gameStatus,
      endingType: turnResponse.endingType || 'N/A',
    });

    return turnResponse;
  } catch (error) {
    console.error('[Generic Turn Generator] Error:', error);
    throw error;
  }
}

/**
 * Build conversation messages from turn history
 */
function buildConversationMessages(history: ConversationTurn[]): Anthropic.MessageParam[] {
  const messages: Anthropic.MessageParam[] = [];

  if (history.length === 0) {
    // First turn - request opening situation
    messages.push({
      role: 'user',
      content: 'Generate the opening turn of the game. This is turn 1.',
    });
  } else {
    // Add all previous turns as conversation
    for (const turn of history) {
      // Assistant presents the situation
      messages.push({
        role: 'assistant',
        content: JSON.stringify({
          situation: turn.situation,
          turnNumber: turn.turnNumber,
        }),
      });

      // User makes a choice
      messages.push({
        role: 'user',
        content: `I choose: ${turn.playerChoice}`,
      });
    }

    // Request next turn
    messages.push({
      role: 'user',
      content: `Generate the next turn (turn ${history.length + 1}) based on my choice. Show consequences of my decision and present the new situation.`,
    });
  }

  return messages;
}

/**
 * Parse LLM response into TurnResponse
 */
function parseTurnResponse(text: string): TurnResponse {
  try {
    // Try to extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate required fields
    if (!parsed.situation || typeof parsed.situation !== 'string') {
      throw new Error('Invalid or missing situation field');
    }

    if (!parsed.gameStatus || !['continue', 'ended'].includes(parsed.gameStatus)) {
      throw new Error('Invalid or missing gameStatus field');
    }

    if (parsed.gameStatus === 'continue' && (!Array.isArray(parsed.choices) || parsed.choices.length === 0)) {
      throw new Error('No choices provided for continuing game');
    }

    if (parsed.gameStatus === 'ended' && !parsed.endingNarrative) {
      throw new Error('No ending narrative provided for ended game');
    }

    return {
      situation: parsed.situation,
      choices: parsed.choices || [],
      gameStatus: parsed.gameStatus,
      endingType: parsed.endingType || undefined,
      endingNarrative: parsed.endingNarrative || undefined,
    };
  } catch (error) {
    console.error('[Parse Error] Failed to parse LLM response:', error);
    console.error('[Parse Error] Response text:', text);

    // Return a fallback error response
    return {
      situation: 'An error occurred while generating the turn. The system encountered a technical issue.',
      choices: [
        {
          id: 'error-retry',
          label: 'Try Again',
          description: 'Attempt to regenerate this turn.',
        },
      ],
      gameStatus: 'continue',
    };
  }
}
