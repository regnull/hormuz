# Dynamic Turn Generation System

## Overview

Instead of manually creating `turn-01.ts`, `turn-02.ts`, ..., `turn-15.ts`, Hormuz now **dynamically generates turns** based on the current game state.

This revolutionary approach means:
- ✅ No need to write 15 manual turn files
- ✅ Infinite replay variety
- ✅ Content adapts to player choices
- ✅ Game responds intelligently to strategy
- ✅ Easier to extend and maintain

## How It Works

### Turn 1: Fixed Introduction
- Always uses `turn-01.ts` (the opening crisis)
- Establishes the baseline scenario
- Presents the initial 4 options

### Turns 2-15: Dynamic Generation
- Generated on-the-fly by `turn-generator.ts`
- Content based on:
  - Current game state
  - Player's previous choices
  - Story arc trajectory
  - Threat levels
  - Actor attitudes

## Architecture

```
Player Makes Choice (Turn 1)
  ↓
Turn Processor applies effects
  ↓
Game State Updates
  ↓
Player advances to Turn 2
  ↓
┌─────────────────────────────────────┐
│ DYNAMIC TURN GENERATION BEGINS      │
├─────────────────────────────────────┤
│ 1. Determine Story Arc              │
│    - Escalation                     │
│    - De-escalation                  │
│    - Crisis                         │
│    - Resolution                     │
├─────────────────────────────────────┤
│ 2. Generate Narrative                │
│    - AI-powered (optional)          │
│    - Template-based (fallback)      │
├─────────────────────────────────────┤
│ 3. Generate Options                  │
│    - Diplomatic option              │
│    - Military option (conditional)  │
│    - Intelligence option            │
│    - Context-specific 4th option    │
├─────────────────────────────────────┤
│ 4. Create Intelligence Briefs        │
│    - CIA (nuclear program status)   │
│    - Mossad (Israeli readiness)     │
│    - CENTCOM (military posture)     │
│    - State Dept (diplomatic status) │
│    - Economic (oil prices)          │
├─────────────────────────────────────┤
│ 5. Determine Scene & Mood            │
│    - Scene based on last choice     │
│    - Mood based on threat level     │
├─────────────────────────────────────┤
│ 6. Check for Ending Conditions       │
│    - Diplomatic victory?            │
│    - Military success?              │
│    - Catastrophe?                   │
│    - Stalemate (turn 15)?           │
└─────────────────────────────────────┘
  ↓
Turn Displayed to Player
```

## Key Components

### 1. Story Arc System (`story-arc.ts`)

Determines the current narrative direction:

**Escalation Arc**
- Triggered by: Military choices, high threat level, hostile Iran
- Narrative: "Tensions rising... conflict looming..."
- Options: More military-focused

**De-escalation Arc**
- Triggered by: Diplomatic choices, improving relations
- Narrative: "Progress being made... but fragile..."
- Options: More diplomatic-focused

**Crisis Arc**
- Triggered by: Critical threat level, near-weapons capability
- Narrative: "Point of no return approaching..."
- Options: Urgent, high-stakes

**Resolution Arc**
- Triggered by: Turn 12+, clear trajectory
- Narrative: "Endgame nearing..."
- Options: Final decisive moves

### 2. Narrative Generator (`narrative-generator.ts`)

Creates the situation report text.

**AI Mode** (if `ANTHROPIC_API_KEY` is set):
- Sends game state to Claude API
- Receives unique, contextual narrative
- Fallsback to templates if API fails

**Template Mode** (default):
- Uses pre-written templates
- Fills in current state values
- Deterministic but varied

Example AI Prompt:
```
Story Arc: escalation
Iran Enrichment: 85%
Israel Strike Readiness: 75%
Last Decision: diplomatic

Write a tense situation report (300-400 words) showing:
1. Consequences of diplomatic approach
2. Iran's continued enrichment
3. Israel's growing impatience
4. Oil market reactions
5. Advisor perspectives
```

### 3. Option Generator (`option-generator.ts`)

Creates the 4 choice options dynamically.

**Always Included:**
1. **Diplomatic Option** - Negotiations, de-escalation
2. **Intelligence Option** - Gather more info, buy time

**Conditionally Included:**
3. **Military Option** - Only if enrichment ≥ 50%
   - Changes based on enrichment level:
     - 85%+: "Authorize Strike" (critical risk)
     - 50-84%: "Increase Pressure" (high risk)

4. **4th Option (Context-Dependent):**
   - Escalation arc → "Escalate Pressure"
   - De-escalation arc → "De-escalate Further"
   - Crisis arc → "Maintain Course"

Each option includes:
- Dynamic description based on current state
- Effects that reference actual values
- Scoring impacts
- Next turn advancement

### 4. Intelligence Brief Generator

Creates 5 relevant intelligence briefs based on:

| Condition | Brief Generated |
|-----------|----------------|
| Enrichment ≥ 90% | "CRITICAL: Iran at [X]% enrichment. Weapons capability imminent." |
| Enrichment 70-89% | "Iran continues enrichment at [X]%. Estimated [Y] weeks to weapons-grade." |
| Israel Ready ≥ 80% | "Israel at maximum readiness. Unilateral strike possible within 48-72 hours." |
| Iranian Military ≥ 70% | "Iranian military at elevated readiness. Defensive preparations evident." |
| Oil Price ≥ 150 | "Oil at $[X]/barrel. Markets in crisis. Global economic impact severe." |

### 5. Scene & Mood Determination

**Scene Selection:**
```typescript
if (threatLevel === 'critical') → 'war-room'
else if (lastChoice.includes('diplomatic')) → 'diplomatic-summit'
else if (lastChoice.includes('strike')) → 'carrier-ops'
else → 'situation-room'
```

**Mood Selection:**
```typescript
if (threatLevel === 'critical') → 'war'
else if (enrichment ≥ 85) → 'crisis'
else if (enrichment ≥ 70) → 'tense'
else → 'calm'
```

### 6. Ending Detection

Checks after each turn if game should end:

| Condition | Ending |
|-----------|--------|
| Enrichment = 100% OR oil ≥ $200 | Catastrophe |
| Enrichment ≤ 20% + alliances strong + diplomatic score high | Diplomatic Victory |
| Enrichment ≤ 20% + strategic score high | Military Success |
| Enrichment ≤ 30% + oil ≥ $180 | Pyrrhic Victory |
| Turn ≥ 15 | Stalemate |

## Example Turn Generation

```typescript
// Game State at Turn 3
{
  currentTurn: 3,
  worldState: {
    iranEnrichmentLevel: 87,
    israelStrikeReadiness: 78,
    threatLevel: 'high',
    oilPrice: 115,
  },
  choiceHistory: [
    { turnNumber: 1, optionId: '1d-diplomacy' },
    { turnNumber: 2, optionId: '2a-continue-pressure' },
  ]
}

// Generated Turn
{
  id: 3,
  title: "The Pressure Builds",  // From escalation arc
  situation: "...Iran continues enrichment despite diplomatic efforts...",

  intelligence: [
    { source: 'CIA', content: 'Iran at 87% enrichment...' },
    { source: 'Mossad', content: 'Israel at 78% readiness...' },
    ...
  ],

  sceneImage: 'situation-room',  // Based on state
  mood: 'crisis',  // threat level = high, enrichment = 87%

  options: [
    { id: 'turn3-diplomatic', label: 'Pursue Diplomatic Solution' },
    { id: 'turn3-military', label: 'Authorize Military Strike' },  // High enrichment
    { id: 'turn3-intelligence', label: 'Order Intelligence Assessment' },
    { id: 'turn3-escalate', label: 'Escalate Pressure' },  // Escalation arc
  ]
}
```

## Advantages

### 1. Infinite Replayability
Every playthrough can be different because content adapts to choices.

### 2. Responsive Gameplay
The game "understands" your strategy:
- Go military → Game presents escalation narrative
- Go diplomatic → Game shows negotiation progress
- Mix approaches → Game reflects complexity

### 3. Maintainability
Instead of maintaining 15 turn files:
- 1 generator system
- Templates for common scenarios
- Easy to tweak logic

### 4. Scalability
Want 20 turns instead of 15? Change one number.
Want new story arcs? Add to the arc detector.

### 5. AI Enhancement (Optional)
With API key, every turn can be:
- Uniquely written
- Contextually appropriate
- Never repetitive

## Configuration

### Enable AI Narratives
```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_ENABLE_NARRATIVE_AI=true  # Optional
```

Without this, game uses templates (works great!).

### Adjust Turn Limits
```typescript
// lib/game-engine/story-arc.ts
export function checkForEnding(gameState: GameState) {
  if (currentTurn >= 15) {  // Change this number
    return { shouldEnd: true, endingType: 'stalemate' };
  }
}
```

## Future Enhancements

### Planned:
- [ ] Player personality tracking (hawk vs. dove)
- [ ] Dynamic event injection (breaking news)
- [ ] Branching story paths with memory
- [ ] Custom ending narratives
- [ ] Historical comparison system

### Possible:
- [ ] Multiplayer (vote on choices)
- [ ] Difficulty levels (affect probability rolls)
- [ ] Sandbox mode (infinite turns)
- [ ] Alternative scenarios (North Korea, etc.)

## Technical Notes

### Performance
- Turn generation is async (~100-500ms)
- AI narratives add 1-3s (optional)
- Template mode is instant
- No performance impact on gameplay

### Caching
Could cache generated turns in localStorage for speed, but current approach ensures fresh content every time.

### Error Handling
- Falls back to templates if AI fails
- Returns null if generation fails
- Game catches errors and shows "Turn not found"

## Comparison

### Old System (Manual)
```
turn-01.ts (800 lines)
turn-02.ts (800 lines)
turn-03.ts (800 lines)
...
turn-15.ts (800 lines)
= 12,000 lines of repetitive code
```

### New System (Dynamic)
```
turn-01.ts (fixed intro - 600 lines)
turn-generator.ts (200 lines)
narrative-generator.ts (300 lines)
option-generator.ts (400 lines)
story-arc.ts (150 lines)
= 1,650 lines of smart code
```

**Result:** 86% code reduction + infinite variety!

---

**This is the future of narrative game design.** 🚀
