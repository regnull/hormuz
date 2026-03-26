import Anthropic from '@anthropic-ai/sdk';
import { GameState } from '@/types/game';

/**
 * Generate turn narrative dynamically
 * ALWAYS uses AI for unique, contextual content
 */
export async function generateTurnNarrative(
  gameState: GameState,
  storyArc: string
): Promise<string> {
  // Always try AI generation first (no longer optional)
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.warn('No ANTHROPIC_API_KEY found, falling back to templates');
    return generateTemplateNarrative(gameState, storyArc);
  }

  try {
    return await generateAINarrative(gameState, storyArc);
  } catch (error) {
    console.error('AI narrative generation failed, falling back to template:', error);
    return generateTemplateNarrative(gameState, storyArc);
  }
}

/**
 * Generate narrative using Claude API
 */
async function generateAINarrative(
  gameState: GameState,
  storyArc: string
): Promise<string> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });

  const context = buildNarrativeContext(gameState, storyArc);

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1500,
    system: NARRATIVE_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: context,
      },
    ],
    temperature: 0.8,
  });

  const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
  return responseText || generateTemplateNarrative(gameState, storyArc);
}

const NARRATIVE_SYSTEM_PROMPT = `
You are a master storyteller creating narrative content for "Hormuz", a geopolitical crisis simulation game.

Your role is to write tense, realistic situation reports for the U.S. President navigating an Iranian nuclear crisis.

Writing Guidelines:
- Write in present tense, active voice
- Keep it tense and engaging (this is a thriller, not a textbook)
- Include specific details about the situation
- Reference recent player decisions and their consequences
- Balance hope and danger - the situation is serious but not hopeless
- Use short paragraphs (2-4 sentences max)
- Include dialogue from advisors when appropriate
- Aim for 300-400 words total

Structure:
1. Opening: Brief time/location stamp and situation summary
2. Recent developments: What has happened since last turn
3. Current status: Key facts about Iran, Israel, regional actors
4. Advisor perspectives: Brief quotes from 2-3 advisors
5. Critical information: What the President needs to know
6. Stakes: What happens if this isn't handled well

Tone: Professional but human. The President is under enormous pressure.
`;

function buildNarrativeContext(gameState: GameState, storyArc: string): string {
  const { worldState, actors, turnHistory, currentTurn } = gameState;

  // Build complete turn-by-turn history
  const historyText = turnHistory.length > 0
    ? turnHistory.map(entry => `
**Turn ${entry.turnNumber}: ${entry.title}**
Days Elapsed: ${entry.worldStateSnapshot.daysElapsed}
Iran Enrichment: ${entry.worldStateSnapshot.iranEnrichmentLevel}%
Threat Level: ${entry.worldStateSnapshot.threatLevel}

Situation:
${entry.situation}

President's Decision:
${entry.chosenOption.label}
`).join('\n---\n')
    : 'This is the first turn.';

  return `
**Context for Turn ${currentTurn} Narrative:**

Story Arc: ${storyArc}
Days Elapsed: ${worldState.daysElapsed}

**COMPLETE TURN HISTORY:**
${historyText}

---

**Current World State (After Previous Decisions):**
- Iran Enrichment: ${worldState.iranEnrichmentLevel}%
- Israel Strike Readiness: ${worldState.israelStrikeReadiness}%
- Oil Price: $${worldState.oilPrice}/barrel
- Public Approval: ${worldState.publicApproval}%
- Threat Level: ${worldState.threatLevel}

**Actor Attitudes:**
- Iran: ${actors.iran.attitude}/100 (${actors.iran.attitude > 0 ? 'cooperative' : 'hostile'})
- Israel: ${actors.israel.attitude}/100 (${actors.israel.attitude > 0 ? 'allied' : 'strained'})
- Saudi Arabia: ${actors.saudi.attitude}/100
- Russia: ${actors.russia.attitude}/100
- China: ${actors.china.attitude}/100

**What Should Happen Next:**
${getStoryArcGuidance(storyArc, gameState)}

Write a compelling situation report (300-400 words) for the President that:
1. References and builds upon what happened in previous turns
2. Describes what has happened since the last decision and its consequences
3. Explains the current state of the crisis
4. Includes 2-3 brief advisor quotes
5. Sets up the tension for the next choice

IMPORTANT: This narrative should feel like a direct continuation of the story.
Make it feel real, urgent, and consequential.
  `.trim();
}

function getStoryArcGuidance(storyArc: string, gameState: GameState): string {
  switch (storyArc) {
    case 'escalation':
      return 'Tensions are rising. Military confrontation becomes more likely. Iran and/or Israel may be preparing for action. Urgency increasing.';
    case 'deescalation':
      return 'Diplomatic progress is possible. Iran showing willingness to negotiate. But trust is fragile and hawks on both sides remain skeptical.';
    case 'crisis':
      return 'Critical moment. A major decision or development is forcing the situation to a head. The next choice could determine war or peace.';
    case 'resolution':
      return 'The endgame is approaching. The crisis is moving toward one of the five possible endings. Stakes are at their highest.';
    default:
      return 'The situation continues to evolve. Multiple factors in play. President must carefully weigh options.';
  }
}

/**
 * Fallback: Generate narrative from templates
 */
function generateTemplateNarrative(gameState: GameState, storyArc: string): string {
  const { worldState, currentTurn, choiceHistory } = gameState;
  const lastChoice = choiceHistory[choiceHistory.length - 1];

  // Build narrative from templates
  const intro = `**${worldState.daysElapsed} Days Into Crisis**
**Location**: Situation Room, White House

`;

  const situationUpdate = generateSituationUpdate(worldState, lastChoice);
  const advisorInput = generateAdvisorDialogue(worldState, storyArc);
  const assessment = generateThreatAssessment(worldState);

  return intro + situationUpdate + '\n\n' + advisorInput + '\n\n' + assessment;
}

function generateSituationUpdate(worldState: any, lastChoice: any): string {
  if (worldState.iranEnrichmentLevel >= 90) {
    return `The crisis has reached a critical juncture. Iran's uranium enrichment has advanced to ${worldState.iranEnrichmentLevel}%, putting them on the threshold of weapons capability. Intelligence estimates they could assemble a crude nuclear device within weeks.`;
  } else if (worldState.iranEnrichmentLevel >= 70) {
    return `The situation continues to evolve. Iran's nuclear program has reached ${worldState.iranEnrichmentLevel}% enrichment. While still short of weapons-grade, the trajectory is concerning. Your previous decisions have shaped the current dynamics.`;
  } else {
    return `Progress has been made in limiting Iran's nuclear program. Current enrichment stands at ${worldState.iranEnrichmentLevel}%, down from previous levels. However, the fundamental issues remain unresolved.`;
  }
}

function generateAdvisorDialogue(worldState: any, storyArc: string): string {
  const dialogues = [];

  if (storyArc === 'escalation') {
    dialogues.push(`**Secretary of Defense:** "Mr. President, our military options remain viable, but the window is narrowing. Iran is hardening its defenses daily."`);
    dialogues.push(`**National Security Advisor:** "We're approaching a point of no return. If we're going to act, it needs to be soon."`);
  } else if (storyArc === 'deescalation') {
    dialogues.push(`**Secretary of State:** "The diplomatic channel is bearing fruit, but we need to maintain pressure to keep Iran engaged."`);
    dialogues.push(`**CIA Director:** "Iran appears genuinely interested in a deal, but hardliners could derail progress at any moment."`);
  } else {
    dialogues.push(`**National Security Advisor:** "We're at a critical decision point. Multiple paths forward, each with significant implications."`);
    dialogues.push(`**Chairman of the Joint Chiefs:** "Whatever you decide, Mr. President, we're ready to execute."`);
  }

  return dialogues.join('\n\n');
}

function generateThreatAssessment(worldState: any): string {
  if (worldState.threatLevel === 'critical') {
    return `**Current Assessment:** The situation is at critical levels. Regional war is a distinct possibility. Oil markets are in crisis. Immediate action required.`;
  } else if (worldState.threatLevel === 'high') {
    return `**Current Assessment:** Threat level remains high. Military forces on both sides are postured for potential conflict. Diplomatic efforts continue but face significant obstacles.`;
  } else {
    return `**Current Assessment:** The situation is tense but manageable. Both military and diplomatic options remain viable. Careful navigation required.`;
  }
}
