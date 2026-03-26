import Anthropic from '@anthropic-ai/sdk';
import { GameState } from '@/types/game';
import { Option } from '@/types/turn';

/**
 * Generate options using AI based on full turn history
 */
export async function generateAIOptions(
  gameState: GameState,
  storyArc: string
): Promise<Option[] | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.warn('[AI Options] No ANTHROPIC_API_KEY found');
    return null;
  }

  try {
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    const context = buildOptionsContext(gameState, storyArc);

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2500,
      system: OPTIONS_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: context,
        },
      ],
      temperature: 0.7,
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse the JSON response
    const parsed = JSON.parse(responseText);
    return parsed.options;
  } catch (error) {
    console.error('[AI Options] Error generating options:', error);
    return null;
  }
}

const OPTIONS_SYSTEM_PROMPT = `
You are a strategic advisor creating decision options for "Hormuz", a geopolitical crisis simulation game.

Your role is to generate 4 realistic, meaningful options for the U.S. President based on the current crisis situation.

Guidelines:
- Each option should be a plausible course of action given the context
- Options should represent different strategic approaches (diplomatic, military, intelligence, economic, etc.)
- Include realistic risks and consequences
- Make effects probabilistic - some outcomes are uncertain
- Options should build on or react to previous decisions in the turn history

Return your response as valid JSON in this exact format:
{
  "options": [
    {
      "id": "turn{turnNumber}-option1",
      "label": "Short action title (3-6 words)",
      "description": "Detailed explanation with bullet points describing the approach and what it entails. Include potential risks or benefits.",
      "type": "diplomatic|military|intelligence|economic|covert",
      "risk": "low|medium|high|critical",
      "icon": "handshake|zap|brain|shield|eye",
      "effects": [
        {
          "target": "worldState.iranEnrichmentLevel|iran.attitude|israel.attitude|worldState.oilPrice|etc",
          "change": -10 (number for numeric changes, or string for categorical),
          "probability": 0.7,
          "description": "Brief explanation of this effect"
        }
      ],
      "scoreImpact": {
        "diplomatic": 20,
        "strategic": -10,
        "economic": 0,
        "domestic": 15,
        "regional": 5
      }
    }
  ]
}

Valid targets for effects:
- worldState.iranEnrichmentLevel (0-100)
- worldState.israelStrikeReadiness (0-100)
- worldState.oilPrice (number, USD/barrel)
- worldState.publicApproval (0-100)
- worldState.threatLevel (string: "low", "medium", "high", "critical")
- worldState.daysElapsed (number)
- iran.attitude (-100 to 100)
- israel.attitude (-100 to 100)
- saudi.attitude (-100 to 100)
- russia.attitude (-100 to 100)
- china.attitude (-100 to 100)
- hezbollah.attitude (-100 to 100)

Important:
- Generate exactly 4 options
- Make them meaningfully different (not just variations of the same approach)
- Ensure at least one diplomatic and one military-related option
- Make the consequences realistic and balanced
- Return ONLY valid JSON, no other text
`;

function buildOptionsContext(gameState: GameState, storyArc: string): string {
  const { worldState, actors, turnHistory, currentTurn } = gameState;

  // Build complete turn-by-turn history
  const historyText = turnHistory.length > 0
    ? turnHistory.map(entry => `
**Turn ${entry.turnNumber}: ${entry.title}**
Days Elapsed: ${entry.worldStateSnapshot.daysElapsed}
Iran Enrichment: ${entry.worldStateSnapshot.iranEnrichmentLevel}%
Threat Level: ${entry.worldStateSnapshot.threatLevel}

Situation:
${entry.situation.substring(0, 300)}...

President's Decision:
${entry.chosenOption.label}
`).join('\n---\n')
    : 'This is the first turn.';

  return `
**Generate Options for Turn ${currentTurn}:**

Story Arc: ${storyArc}

**COMPLETE TURN HISTORY:**
${historyText}

---

**Current World State:**
- Iran Enrichment: ${worldState.iranEnrichmentLevel}%
- Israel Strike Readiness: ${worldState.israelStrikeReadiness}%
- Oil Price: $${worldState.oilPrice}/barrel
- Public Approval: ${worldState.publicApproval}%
- Threat Level: ${worldState.threatLevel}
- Days Elapsed: ${worldState.daysElapsed}

**Actor Attitudes (all on -100 to 100 scale):**
- Iran: ${actors.iran.attitude} (${actors.iran.attitude > 0 ? 'cooperative' : 'hostile'})
- Israel: ${actors.israel.attitude} (${actors.israel.attitude > 0 ? 'strong ally' : 'strained'})
- Saudi Arabia: ${actors.saudi.attitude}
- Russia: ${actors.russia.attitude}
- China: ${actors.china.attitude}
- Hezbollah: ${actors.hezbollah.attitude}

**Story Arc Guidance:**
${getStoryArcGuidance(storyArc)}

Generate 4 realistic, strategic options for the President that:
1. Build on the context of previous decisions
2. Represent different strategic approaches
3. Have meaningful trade-offs and consequences
4. Are appropriate for the current threat level and story arc

Return valid JSON only.
  `.trim();
}

function getStoryArcGuidance(storyArc: string): string {
  switch (storyArc) {
    case 'escalation':
      return 'Tensions are rising. Options should reflect urgency and the risk of military confrontation.';
    case 'deescalation':
      return 'Diplomatic progress is possible. Options should explore ways to build on momentum while managing skeptics.';
    case 'crisis':
      return 'Critical moment. Options should reflect the high stakes and forcing decisions between competing pressures.';
    case 'resolution':
      return 'Endgame approaching. Options should be definitive moves toward one of the possible endings.';
    default:
      return 'Situation continues to evolve. Options should balance multiple strategic considerations.';
  }
}
