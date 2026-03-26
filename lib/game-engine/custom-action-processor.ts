import Anthropic from '@anthropic-ai/sdk';
import { GameState } from '@/types/game';
import { ConsequenceResult, CustomActionResponse } from '@/types/consequence';

/**
 * Process a custom action using Claude API
 */
export async function processCustomAction(
  input: string,
  gameState: GameState
): Promise<ConsequenceResult> {
  // Validate input
  if (!input || input.trim().length === 0) {
    return {
      feasible: false,
      narrative: 'Please enter a valid action.',
      effects: [],
      scoreImpact: {},
    };
  }

  if (input.length > 200) {
    return {
      feasible: false,
      narrative: 'Action is too long. Please keep it under 200 characters.',
      effects: [],
      scoreImpact: {},
    };
  }

  // Check if API key is available
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      feasible: false,
      narrative: 'Custom actions require an Anthropic API key. Please set ANTHROPIC_API_KEY in your environment.',
      effects: [],
      scoreImpact: {},
    };
  }

  try {
    const anthropic = new Anthropic({ apiKey });

    // Build context
    const context = buildGameContext(gameState);
    const prompt = buildCustomActionPrompt(input, context);

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2000,
      system: GAME_MASTER_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    // Parse response
    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const response = parseClaudeResponse(responseText);

    // Convert to ConsequenceResult
    return {
      feasible: response.feasible,
      narrative: response.narrative,
      effects: response.effects,
      scoreImpact: {
        diplomatic: response.scoreImpact.diplomatic,
        strategic: response.scoreImpact.strategic,
        economic: response.scoreImpact.economic,
        domestic: response.scoreImpact.domestic,
        regional: response.scoreImpact.regional,
      },
      actionType: response.actionType,
      nextTurnId: gameState.currentTurn + 1,
    };
  } catch (error) {
    console.error('Error calling Claude API:', error);
    return {
      feasible: false,
      narrative: 'Failed to process action due to a technical error. Please try again.',
      effects: [],
      scoreImpact: {},
    };
  }
}

function buildGameContext(gameState: GameState): string {
  return `
**Current Situation:**
Turn: ${gameState.currentTurn} of ${gameState.maxTurns}
Days Elapsed: ${gameState.worldState.daysElapsed}

**Key Variables:**
- Iran Enrichment Level: ${gameState.worldState.iranEnrichmentLevel}%
- Israel Strike Readiness: ${gameState.worldState.israelStrikeReadiness}%
- Oil Price: $${gameState.worldState.oilPrice}/barrel
- Public Approval: ${gameState.worldState.publicApproval}%
- Threat Level: ${gameState.worldState.threatLevel}
- Political Capital: ${gameState.worldState.politicalCapital}

**Actor Attitudes:**
${Object.entries(gameState.actors).map(([id, actor]) =>
  `- ${actor.name}: ${actor.attitude > 0 ? '+' : ''}${actor.attitude}/100 (readiness: ${actor.militaryReadiness}%)`
).join('\n')}

**Alliance Strength:**
${Object.entries(gameState.worldState.allianceStrength).map(([name, strength]) =>
  `- ${name}: ${strength}%`
).join('\n')}

**Recent Decisions (last 3):**
${gameState.choiceHistory.slice(-3).map(choice =>
  `Turn ${choice.turnNumber}: ${choice.optionId}`
).join('\n') || 'None yet'}
  `.trim();
}

const GAME_MASTER_SYSTEM_PROMPT = `
You are the Game Master for "Hormuz", a realistic geopolitical crisis simulation game.

The player is the U.S. President navigating an Iranian nuclear crisis.

Your role is to:
1. Interpret the player's custom action
2. Determine if it's feasible given their position and resources
3. Simulate realistic consequences based on:
   - Current world state
   - Actor motivations and constraints
   - Historical precedent
   - Game balance

Rules for realistic simulation:
- The President has significant power but faces constraints (Congress, allies, international law, resources)
- Every action takes time and has opportunity costs
- Actors respond rationally to incentives
- No magic solutions exist
- Some actions are simply infeasible or would be refused by advisors

Response Format - Return ONLY valid JSON:
{
  "feasible": true/false,
  "narrative": "200-300 word description of what happens",
  "effects": [
    {
      "target": "worldState.variableName or actorId.variableName",
      "change": number or "string",
      "probability": 0.0-1.0,
      "description": "what this effect represents"
    }
  ],
  "scoreImpact": {
    "diplomatic": number (-50 to +50),
    "strategic": number (-50 to +50),
    "economic": number (-50 to +50),
    "domestic": number (-50 to +50),
    "regional": number (-50 to +50)
  },
  "actionType": "diplomatic" | "military" | "covert" | "economic" | "intelligence"
}

If the action is NOT feasible:
- Set feasible: false
- Explain why in the narrative (advisors refuse, legally impossible, violates norms, etc.)
- Empty effects and zero scoreImpact
- Still categorize the actionType

Examples of FEASIBLE actions:
✅ "Order CIA to assess Iran's nuclear timeline" - Intelligence gathering
✅ "Call Israeli Prime Minister privately" - Diplomatic outreach
✅ "Deploy additional carrier to Persian Gulf" - Military positioning (takes time)
✅ "Request emergency UN Security Council meeting" - Diplomatic pressure
✅ "Authorize cyber operation against Iranian centrifuges" - Covert action

Examples of INFEASIBLE actions:
❌ "Launch nuclear first strike on Iran" - Violates norms, advisors would refuse
❌ "Convince Iran to surrender immediately" - Unrealistic
❌ "Teleport troops to Tehran" - Impossible
❌ "Personally assassinate Iranian leaders" - Not presidential role
❌ "Ignore the situation completely" - Shirking responsibility

Keep narratives engaging, tense, and realistic. You're writing a thriller, not a textbook.
`;

function buildCustomActionPrompt(input: string, context: string): string {
  return `
${context}

**Player's Custom Action:**
"${input}"

Simulate the consequences of this action. Determine:
1. Is it feasible for the U.S. President to do this?
2. What realistically happens as a result?
3. How do actors respond?
4. What are the effects on the world state?

Return your response as valid JSON matching the specified format.
  `.trim();
}

function parseClaudeResponse(text: string): CustomActionResponse {
  try {
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate structure
    if (typeof parsed.feasible !== 'boolean') {
      throw new Error('Invalid response structure');
    }

    return parsed as CustomActionResponse;
  } catch (error) {
    console.error('Failed to parse Claude response:', error);
    console.error('Response text:', text);

    // Return a fallback
    return {
      feasible: false,
      narrative: 'Failed to process your action. The system encountered an error. Please try rephrasing your command.',
      effects: [],
      scoreImpact: {
        diplomatic: 0,
        strategic: 0,
        economic: 0,
        domestic: 0,
        regional: 0,
      },
      actionType: 'intelligence',
    };
  }
}
