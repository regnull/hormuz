# Free-Form Input System

## Overview

In addition to the 4 pre-defined options on each turn, players can enter free-form text to take custom actions like:

- "Order the CIA to assess Iran's actual breakout timeline"
- "Call the Saudi Crown Prince privately"
- "Deploy cyber weapons against Iranian centrifuges"
- "Leak intelligence to the press about Iran's program"
- "Request emergency UN Security Council meeting"

This feature increases player agency and allows creative problem-solving beyond the standard options.

## User Interface

### Input Component

```
┌─────────────────────────────────────────────────┐
│  Turn 2: Diplomacy Attempt                      │
│                                                  │
│  [Situation Report]                              │
│  [Intelligence Briefs]                           │
│                                                  │
│  Choose Your Action:                             │
│  ┌──────────────┐  ┌──────────────┐            │
│  │ Option A     │  │ Option B     │            │
│  │ Secret Deal  │  │ Pressure Iran│            │
│  └──────────────┘  └──────────────┘            │
│  ┌──────────────┐  ┌──────────────┐            │
│  │ Option C     │  │ Option D     │            │
│  │ Buy Time     │  │ Covert Strike│            │
│  └──────────────┘  └──────────────┘            │
│                                                  │
│  ─────────── Or Take Custom Action ───────────  │
│                                                  │
│  ┌─────────────────────────────────────────────┐│
│  │ > Order the CIA to assess...              ││
│  └─────────────────────────────────────────────┘│
│          [Consult Advisors] or [Enter]          │
│                                                  │
│  💡 Examples: "Call Israel PM", "Deploy cyber   │
│     weapons", "Request intel briefing on X"     │
└─────────────────────────────────────────────────┘
```

### Button: "Consult Advisors" or "Take Action"

When player enters text and clicks, the game processes the custom action.

## Technical Implementation

### Architecture Options

#### Option 1: LLM-Powered (Recommended)
Use Claude API to interpret player input and generate realistic consequences.

**Pros:**
- Extremely flexible
- Can handle any reasonable input
- Generates dynamic, contextual responses
- Maintains narrative quality

**Cons:**
- Requires API calls (cost)
- Latency (1-3 seconds)
- Need to handle API failures

#### Option 2: Pattern Matching
Match player input against predefined patterns and templates.

**Pros:**
- No API costs
- Instant response
- Fully controllable

**Cons:**
- Limited flexibility
- Requires extensive pattern library
- Can feel robotic

#### Option 3: Hybrid Approach
Use pattern matching for common actions, LLM for everything else.

**Pros:**
- Best of both worlds
- Fast for common actions
- Flexible for creative inputs

**Cons:**
- More complex to implement

### Recommended: Option 1 (LLM-Powered)

## Implementation Details

### Data Flow

```
Player enters: "Order CIA assessment of Iran's nuclear scientists"
  ↓
Validate input (not empty, reasonable length)
  ↓
Build context payload:
  - Current game state
  - World state (actor attitudes, enrichment level, etc.)
  - Previous player choices
  - Current turn situation
  ↓
Send to Claude API with structured prompt
  ↓
Claude returns:
  - Feasibility assessment (can this be done?)
  - Consequence narrative
  - State changes (effects)
  - Score impact
  ↓
Apply effects to game state
  ↓
Display result to player
  ↓
Continue to next turn
```

### API Integration

```typescript
// src/lib/game-engine/custom-action-processor.ts

import Anthropic from '@anthropic-ai/sdk';
import { GameState } from '@/types/game';
import { ConsequenceResult } from '@/types/consequence';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function processCustomAction(
  input: string,
  gameState: GameState
): Promise<ConsequenceResult> {

  // Build context
  const context = buildGameContext(gameState);

  // Create prompt
  const prompt = buildCustomActionPrompt(input, context);

  // Call Claude API
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2000,
    system: GAME_MASTER_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7
  });

  // Parse response
  const response = parseClaudeResponse(message.content);

  // Validate and return
  return {
    feasible: response.feasible,
    narrative: response.narrative,
    effects: response.effects,
    scoreImpact: response.scoreImpact,
    nextTurnId: determineNextTurn(gameState, response)
  };
}

function buildGameContext(gameState: GameState): string {
  return `
**Current Situation:**
Turn: ${gameState.currentTurn}
Days Elapsed: ${gameState.worldState.daysElapsed}

**Key Variables:**
- Iran Enrichment Level: ${gameState.worldState.iranEnrichmentLevel}%
- Israel Strike Readiness: ${gameState.worldState.israelStrikeReadiness}%
- Oil Price: $${gameState.worldState.oilPrice}/barrel
- Public Approval: ${gameState.worldState.publicApproval}%
- Threat Level: ${gameState.worldState.threatLevel}

**Actor Attitudes:**
${Object.entries(gameState.actors).map(([id, actor]) =>
  `- ${actor.name}: ${actor.attitude > 0 ? '+' : ''}${actor.attitude}/100`
).join('\n')}

**Recent Decisions:**
${gameState.choiceHistory.slice(-3).map(choice =>
  `Turn ${choice.turnNumber}: ${choice.optionId}`
).join('\n')}
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

Rules:
- Be realistic: The President has immense power but not unlimited power
- Consider second-order effects: Every action has reactions
- Maintain game balance: Don't let players "cheat" with unrealistic actions
- Keep narrative quality high: Write compelling, tense descriptions
- Stay consistent with previous turns

Response Format:
Return a JSON object with:
{
  "feasible": boolean,
  "narrative": "string (200-300 words)",
  "effects": [
    {
      "target": "string (e.g., 'iran.attitude')",
      "change": number,
      "probability": number (0-1),
      "description": "string"
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

If the action is NOT feasible (e.g., "Nuke Iran" or "Teleport to Tehran"), set feasible: false and explain why in the narrative.
`;

function buildCustomActionPrompt(
  input: string,
  context: string
): string {
  return `
${context}

**Player's Custom Action:**
"${input}"

Simulate the consequences of this action. Is it feasible? What happens?

Remember:
- The President can: order intelligence gathering, deploy military assets, make diplomatic overtures, use covert operations, address the public, consult advisors, etc.
- The President cannot: act instantly, violate laws of physics, have perfect information, guarantee outcomes
- Consider: time required, resource constraints, political capital, international reactions

Generate a realistic outcome for this action.
  `.trim();
}

function parseClaudeResponse(content: any): any {
  // Extract JSON from Claude's response
  const text = content[0].text;

  // Find JSON block
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in response');
  }

  return JSON.parse(jsonMatch[0]);
}

function determineNextTurn(
  gameState: GameState,
  response: any
): number {
  // Logic to determine which turn comes next
  // based on the action type and consequences

  if (response.actionType === 'intelligence') {
    // Intelligence gathering doesn't advance time much
    return gameState.currentTurn + 1;
  }

  if (response.actionType === 'military') {
    // Military actions may skip ahead
    return gameState.currentTurn + 2;
  }

  // Default: next sequential turn
  return gameState.currentTurn + 1;
}
```

### UI Component

```typescript
// src/components/game/CustomActionInput.tsx

import { useState } from 'react';
import { useGameStore } from '@/stores/game-store';
import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';

export function CustomActionInput() {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { processCustomAction } = useGameStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);

    try {
      await processCustomAction(input);
      setInput('');
    } catch (error) {
      console.error('Failed to process custom action:', error);
      // Show error to user
    } finally {
      setIsProcessing(false);
    }
  };

  const examples = [
    "Order CIA assessment of Iranian nuclear scientists",
    "Call Israeli Prime Minister privately",
    "Deploy cyber weapons against centrifuges",
    "Request emergency UN Security Council meeting",
    "Leak intelligence to press about Iran's violations"
  ];

  return (
    <div className="mt-8 pt-8 border-t border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-semibold">Or Take Custom Action</h3>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your action (e.g., 'Call the Saudi Crown Prince')..."
            disabled={isProcessing}
            className="
              w-full px-4 py-3
              bg-slate-800 border border-slate-600
              rounded-lg
              text-slate-100 placeholder-slate-400
              focus:outline-none focus:ring-2 focus:ring-blue-500
              disabled:opacity-50
            "
            maxLength={200}
          />

          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="
              absolute right-2 top-1/2 -translate-y-1/2
              px-4 py-2
              bg-blue-600 hover:bg-blue-700
              rounded-md
              text-sm font-medium
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
            "
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Execute'
            )}
          </button>
        </div>

        <div className="mt-2 text-xs text-slate-400">
          <p className="mb-1">💡 Examples:</p>
          <div className="flex flex-wrap gap-2">
            {examples.slice(0, 3).map((example, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setInput(example)}
                className="
                  px-2 py-1
                  bg-slate-700/50 hover:bg-slate-700
                  rounded
                  transition-colors
                "
              >
                "{example.substring(0, 30)}..."
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
```

### Store Integration

```typescript
// src/stores/game-store.ts

import { processCustomAction as processCustomActionAPI } from '@/lib/game-engine/custom-action-processor';

interface GameStore {
  // ... existing state

  // New action
  processCustomAction: (input: string) => Promise<void>;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // ... existing state and actions

      processCustomAction: async (input: string) => {
        const current = get().gameState;
        if (!current) return;

        try {
          // Call API to process
          const result = await processCustomActionAPI(input, current);

          if (!result.feasible) {
            // Show infeasible message to user
            // Could use a toast or modal
            set({
              customActionResult: {
                success: false,
                message: result.narrative
              }
            });
            return;
          }

          // Apply effects to game state
          const updatedState = applyEffects(current, result.effects);

          // Update scores
          updatedState.score = updateScores(
            updatedState.score,
            result.scoreImpact
          );

          // Record custom action in history
          updatedState.choiceHistory.push({
            turnNumber: current.currentTurn,
            optionId: `custom:${input}`,
            timestamp: new Date()
          });

          // Advance to next turn
          updatedState.currentTurn = result.nextTurnId;

          set({
            gameState: updatedState,
            customActionResult: {
              success: true,
              narrative: result.narrative
            }
          });

        } catch (error) {
          console.error('Custom action failed:', error);
          set({
            customActionResult: {
              success: false,
              message: 'Failed to process action. Please try again.'
            }
          });
        }
      }
    }),
    { name: 'hormuz-game-storage' }
  )
);
```

## Game Balance Considerations

### Action Limits

To prevent abuse, consider:

1. **Cooldowns**: Limit custom actions to 1-2 per game
   - OR: Allow unlimited but with diminishing returns

2. **Cost**: Custom actions consume "political capital"
   - Track resource: `gameState.politicalCapital`
   - Each custom action costs 20-30 points
   - Regenerates slowly each turn

3. **Time**: Custom actions may advance time more
   - Intelligence gathering: +1 turn
   - Diplomatic calls: +0.5 turns
   - Military deployments: +2 turns

### Scoring Custom Actions

Custom actions should have score impacts similar to regular options:

- **Creative/Effective**: Bonus points (+10-20)
- **Risky but successful**: Strategic points
- **Infeasible attempts**: Small penalty (-5) for wasting time

### Preventing Exploits

**Guardrails in the system prompt:**

```typescript
const GUARDRAILS = `
IMPORTANT: Prevent these exploits:

❌ "Assassinate Iranian leadership" - Too extreme, violates norms
❌ "Convince Iran to surrender" - Unrealistic
❌ "Hack all Iranian systems" - Capabilities are limited
❌ "Call Xi Jinping to stop supporting Iran" - China won't comply easily
❌ "Threaten nuclear first strike" - Game over scenario

✅ "Order cyber operation against specific facility" - Plausible
✅ "Call Saudi Arabia to coordinate" - Realistic
✅ "Request detailed intel on X" - Within presidential power
✅ "Address nation on TV" - Always available
✅ "Deploy additional naval assets" - Takes time but feasible
`;
```

## Example Outcomes

### Example 1: Intelligence Request

**Input**: "Order CIA to assess how close Iran really is to a bomb"

**Response**:
```json
{
  "feasible": true,
  "narrative": "You convene an emergency meeting with CIA Director and request a comprehensive assessment of Iran's true nuclear timeline.\n\n48 hours later, the report lands on your desk:\n\n**TOP SECRET - PRESIDENT'S EYES ONLY**\n\nCIA assesses with high confidence that Iran is 3-4 weeks from assembling a crude nuclear device if they choose to 'break out.' However, weaponization (mounting it on a missile) would take an additional 6-12 months.\n\nKey finding: Iran has NOT yet made the decision to weaponize. Supreme Leader appears torn between nuclear deterrent and international isolation.\n\nThis intelligence gives you a clearer picture but doesn't change the urgency much—the window is still closing.",

  "effects": [
    {
      "target": "player.intelligenceQuality",
      "change": 20,
      "probability": 1.0,
      "description": "Better understanding of Iranian timeline"
    },
    {
      "target": "daysElapsed",
      "change": 2,
      "probability": 1.0,
      "description": "Analysis takes 2 days"
    }
  ],

  "scoreImpact": {
    "diplomatic": 5,
    "strategic": 10,
    "economic": 0,
    "domestic": 0,
    "regional": 0
  },

  "actionType": "intelligence"
}
```

### Example 2: Diplomatic Outreach

**Input**: "Call Saudi Crown Prince and ask for private message to Iran"

**Response**:
```json
{
  "feasible": true,
  "narrative": "You place a secure call to Crown Prince Mohammed bin Salman in Riyadh.\n\nAfter pleasantries, you make your request: 'Can you send a private message to Tehran that we're serious about force but prefer a deal?'\n\nMBS is cautious: 'Mr. President, we want Iran's nuclear program stopped. But we must be careful—if this fails, Iran may target us. What guarantees can you offer?'\n\nYou negotiate for 30 minutes. MBS agrees to pass the message through Omani intermediaries, but insists on a public U.S. commitment to defend Saudi Arabia if Iran retaliates.\n\nThe message will reach Tehran within 24 hours. Whether Iran takes it seriously remains to be seen.",

  "effects": [
    {
      "target": "allianceStrength.saudi",
      "change": 15,
      "probability": 0.9,
      "description": "Saudi Arabia appreciates consultation"
    },
    {
      "target": "iran.attitude",
      "change": 10,
      "probability": 0.5,
      "description": "Backchannel may soften Iran's stance"
    },
    {
      "target": "daysElapsed",
      "change": 1,
      "probability": 1.0,
      "description": "Diplomatic coordination takes time"
    }
  ],

  "scoreImpact": {
    "diplomatic": 20,
    "strategic": 5,
    "economic": 0,
    "domestic": 0,
    "regional": 10
  },

  "actionType": "diplomatic"
}
```

### Example 3: Infeasible Action

**Input**: "Launch immediate nuclear strike on Iran"

**Response**:
```json
{
  "feasible": false,
  "narrative": "You begin to suggest a nuclear first strike, but before the words leave your mouth, the entire Situation Room erupts.\n\nYour Secretary of Defense: 'Mr. President, I must strongly advise against even considering this option. A nuclear first strike would violate international law, destroy our alliances, and likely trigger World War III.'\n\nYour National Security Advisor: 'Sir, this would be the end of the post-WWII order. Russia and China would respond. This is not a viable option.'\n\nThe Chairman of the Joint Chiefs adds: 'I would be legally obligated to refuse that order, Mr. President.'\n\nYou recognize the reality: some options are simply beyond the pale. You must find another way.",

  "effects": [],

  "scoreImpact": {
    "diplomatic": -10,
    "strategic": -10,
    "economic": 0,
    "domestic": -5,
    "regional": 0
  },

  "actionType": "military"
}
```

## Performance & Cost

### API Costs (Anthropic Pricing)

- Model: Claude 3.5 Sonnet
- Input: ~1,000 tokens (game context)
- Output: ~500 tokens (response)
- Cost: ~$0.005 per custom action

**Estimated costs:**
- 10,000 players × 2 custom actions each = 20,000 API calls
- Total cost: ~$100

### Caching Strategy

To reduce costs, cache common actions:

```typescript
const COMMON_ACTIONS_CACHE = {
  "order cia assessment": cached_response_1,
  "call israeli prime minister": cached_response_2,
  "deploy additional forces": cached_response_3,
  // ... etc
};

// Check cache before API call
const cached = checkCache(input, gameState);
if (cached) return cached;
```

## Environment Variables

```bash
# .env.local
ANTHROPIC_API_KEY=your_api_key_here

# Optional: Enable/disable custom actions
NEXT_PUBLIC_ENABLE_CUSTOM_ACTIONS=true

# Optional: Limit per game
NEXT_PUBLIC_MAX_CUSTOM_ACTIONS=3
```

## Testing Strategy

### Unit Tests

```typescript
describe('Custom Action Processor', () => {
  it('processes feasible intelligence request', async () => {
    const result = await processCustomAction(
      "Order CIA assessment",
      mockGameState
    );

    expect(result.feasible).toBe(true);
    expect(result.actionType).toBe('intelligence');
  });

  it('rejects infeasible actions', async () => {
    const result = await processCustomAction(
      "Launch nukes",
      mockGameState
    );

    expect(result.feasible).toBe(false);
  });
});
```

### Integration Tests

- Test with real Claude API (in CI/CD)
- Verify response format
- Check state updates work correctly

## Future Enhancements

1. **Voice Input**: Allow players to speak their commands
2. **Suggestions**: AI-suggested custom actions based on context
3. **History**: Show previously successful custom actions
4. **Achievements**: Special achievements for creative custom actions
5. **Multiplayer**: Players vote on custom actions in council mode
