# Generic LLM-Driven Game Engine

## Overview

The Hormuz game engine is a **generic, prompt-driven interactive narrative system**. It can simulate any scenario by swapping the system prompt.

## Core Concept

The game is entirely driven by:
1. **System Prompt**: Defines the scenario, rules, win/loss conditions, and response format
2. **Conversation History**: Complete record of situations and player choices
3. **LLM Generation**: Claude generates situations, choices, and determines game endings

## Architecture

### Turn Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. Send to LLM:                                         │
│    - System Prompt (defines the game)                   │
│    - Full Conversation History (all previous turns)     │
│    - Request: Generate next turn                        │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 2. LLM Returns:                                         │
│    - Situation description                              │
│    - List of choices (with effects)                     │
│    - Game state indicator (continue/ended)              │
│    - If ended: ending type and outcome description      │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Generate Image:                                      │
│    - Based on situation description                     │
│    - Use DALL-E with scenario-appropriate style         │
│    - Cache image URL                                    │
│    - Log to console                                     │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 4. Display to Player:                                   │
│    - Generated image                                    │
│    - Situation description                              │
│    - Available choices                                  │
│    - (Or ending screen if game ended)                   │
└─────────────────────────────────────────────────────────┘
```

### Conversation History Format

```typescript
interface ConversationTurn {
  turnNumber: number;
  situation: string;        // What the LLM presented
  playerChoice: string;     // What the player chose (label)
  timestamp: Date;
}
```

The full history is sent to the LLM each turn for context continuity.

### LLM Response Format

```json
{
  "situation": "Detailed description of current situation (300-500 words)",
  "choices": [
    {
      "id": "choice-1",
      "label": "Short action title",
      "description": "Detailed explanation of what this choice means",
      "consequences": "Brief preview of likely outcomes"
    }
  ],
  "gameStatus": "continue" | "ended",
  "endingType": "victory" | "defeat" | "stalemate" | "disaster" | null,
  "endingNarrative": "Final outcome description (only if ended)"
}
```

## System Prompt Structure

A game scenario is defined by its system prompt, which must include:

1. **Scenario Description**: What game is this?
2. **Player Role**: Who is the player?
3. **Victory Conditions**: How does the player win?
4. **Defeat Conditions**: How does the player lose?
5. **Response Format**: JSON structure for consistency
6. **Narrative Style**: Tone, perspective, detail level
7. **Choice Guidelines**: How to generate meaningful options

### Example: Hormuz (Iran Nuclear Crisis)

```
You are the Game Master for "Hormuz", a realistic geopolitical crisis simulation.

SCENARIO:
You are the President of the United States. Iran is weeks away from nuclear
weapons capability. Israel is preparing to strike. Navigate this crisis.

VICTORY CONDITIONS:
- Iran's nuclear program is dismantled or frozen
- Regional stability maintained
- U.S. credibility preserved

DEFEAT CONDITIONS:
- All-out war breaks out
- Iran achieves nuclear weapons
- President is impeached/loses political support
- Major humanitarian disaster

GAME RULES:
- Realistic consequences based on geopolitics
- No magic solutions
- Every action has trade-offs
- Game ends after 15 turns or when victory/defeat condition met

RESPONSE FORMAT: [JSON structure specified]
```

### Example: Different Scenario (Medieval Kingdom)

```
You are the Game Master for "Crown & Castle", a medieval kingdom management game.

SCENARIO:
You are the young monarch of a medieval kingdom. Your father just died, leaving
you a realm in turmoil. Rival nobles plot, neighbors threaten invasion, and the
treasury is empty.

VICTORY CONDITIONS:
- Kingdom stable and prosperous after 20 seasons
- Rival nobles subdued or won over
- Treasury positive
- People content

DEFEAT CONDITIONS:
- Overthrown by nobles
- Kingdom conquered
- Peasant revolt succeeds
- Assassinated

[...]
```

## Implementation

### 1. Configurable System Prompts

System prompts are stored in `/lib/scenarios/[scenario-name].ts`:

```typescript
export const HORMUZ_SCENARIO = {
  id: 'hormuz',
  name: 'Hormuz: Nuclear Crisis',
  systemPrompt: `[Full system prompt]`,
  imageStyle: 'Dark comic book, geopolitical thriller',
  maxTurns: 15,
};
```

### 2. Turn Generation

```typescript
async function generateTurn(
  scenario: GameScenario,
  conversationHistory: ConversationTurn[]
): Promise<TurnResponse> {
  const messages = buildConversationMessages(conversationHistory);

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    system: scenario.systemPrompt,
    messages: messages,
    max_tokens: 3000,
  });

  return parseTurnResponse(response);
}
```

### 3. Conversation Messages

```typescript
function buildConversationMessages(history: ConversationTurn[]) {
  const messages = [];

  for (const turn of history) {
    // Add the situation presented to player
    messages.push({
      role: 'assistant',
      content: turn.situation,
    });

    // Add the player's choice
    messages.push({
      role: 'user',
      content: `I choose: ${turn.playerChoice}`,
    });
  }

  // Add request for next turn
  messages.push({
    role: 'user',
    content: 'Generate the next turn based on my choice.',
  });

  return messages;
}
```

### 4. Game State

```typescript
interface GameState {
  scenarioId: string;
  conversationHistory: ConversationTurn[];
  currentTurn: number;
  gameStatus: 'playing' | 'ended';
  endingType: string | null;
}
```

## Benefits

1. **Fully Generic**: Any scenario can be played by changing the system prompt
2. **Narrative Continuity**: LLM sees full history, ensuring coherent storytelling
3. **Dynamic Endings**: LLM determines when and how the game ends
4. **No Hard-Coded Content**: All situations and choices generated by AI
5. **Scalable**: Easy to add new scenarios
6. **Flexible**: Can handle any genre (political, fantasy, sci-fi, historical)

## Example Scenarios

- **Hormuz**: Geopolitical nuclear crisis (current)
- **Medieval Kingdom**: Manage a realm, deal with nobles and neighbors
- **Zombie Outbreak**: Survive and lead during apocalypse
- **Space Station Crisis**: Technical disaster on orbital station
- **Detective Mystery**: Solve a murder case with clues and suspects
- **Startup CEO**: Build a company, handle investors and competition
- **Time Traveler**: Fix paradoxes while avoiding timeline collapse

## Configuration

To add a new scenario:

1. Create `/lib/scenarios/my-scenario.ts`
2. Define system prompt with victory/defeat conditions
3. Specify image generation style
4. Add to scenario selector on main menu
5. Play!

The engine handles everything else automatically.
