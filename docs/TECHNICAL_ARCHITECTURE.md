# Hormuz - Technical Architecture

## Technology Stack

### Core Framework
- **Next.js 14+** (App Router)
- **React 18+**
- **TypeScript**
- **Tailwind CSS** for styling

### State Management
- **Zustand** - Lightweight state management for game state
- **React Context** for theming and settings

### Data & Storage
- **localStorage** - Save game progress
- **JSON files** - Game narrative and decision tree data
- **IndexedDB** - Image caching (optional enhancement)

### AI Integration
- **Anthropic Claude API** - Process free-form player input
- **Custom action interpreter** - Parse and simulate player commands

### UI Components
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animations and transitions
- **Lucide React** - Icon system

### External APIs
- **@anthropic-ai/sdk** - Claude API client for custom actions

### Image Handling
- **Next.js Image** component for optimization
- **Placeholder images** with blurhash or gradient fallbacks
- **Static images** for core scenes (10-15 pre-generated)

## Project Structure

```
hormuz/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Landing/menu page
│   │   ├── game/
│   │   │   ├── page.tsx            # Main game page
│   │   │   └── loading.tsx         # Loading state
│   │   ├── results/
│   │   │   └── page.tsx            # End game results
│   │   └── api/                    # API routes (if needed)
│   │
│   ├── components/
│   │   ├── game/
│   │   │   ├── TurnDisplay.tsx     # Main turn container
│   │   │   ├── SituationReport.tsx # Narrative display
│   │   │   ├── ChoiceCard.tsx      # Individual choice option
│   │   │   ├── ChoiceGrid.tsx      # Grid of 4 choices
│   │   │   ├── CustomActionInput.tsx # Free-form text input
│   │   │   ├── IntelligencePanel.tsx # Key facts sidebar
│   │   │   ├── ScoreDisplay.tsx    # Current score (hidden/summary)
│   │   │   ├── TurnCounter.tsx     # Turn number & time
│   │   │   └── ConsequenceAnimation.tsx # Result reveal
│   │   │
│   │   ├── results/
│   │   │   ├── ScoreBreakdown.tsx  # Final scores by category
│   │   │   ├── AchievementGrid.tsx # Unlocked achievements
│   │   │   ├── DecisionTimeline.tsx # Review of player choices
│   │   │   └── ShareResults.tsx    # Social sharing
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Progress.tsx
│   │   │   └── Dialog.tsx
│   │   │
│   │   └── shared/
│   │       ├── SceneImage.tsx      # Background scene display
│   │       ├── IconBadge.tsx       # Choice type icons
│   │       └── TypewriterText.tsx  # Animated text reveal
│   │
│   ├── lib/
│   │   ├── game-engine/
│   │   │   ├── turn-processor.ts   # Process player choices
│   │   │   ├── consequence-simulator.ts # Generate outcomes
│   │   │   ├── custom-action-processor.ts # Process free-form input
│   │   │   ├── scoring-engine.ts   # Calculate scores
│   │   │   ├── achievement-tracker.ts # Check achievements
│   │   │   └── state-machine.ts    # Game state transitions
│   │   │
│   │   ├── data/
│   │   │   ├── narrative.ts        # Turn narratives
│   │   │   ├── choices.ts          # Choice definitions
│   │   │   ├── consequences.ts     # Consequence templates
│   │   │   ├── achievements.ts     # Achievement definitions
│   │   │   └── actors.ts           # Actor behaviors
│   │   │
│   │   └── utils/
│   │       ├── game-state.ts       # State serialization
│   │       ├── scoring.ts          # Scoring utilities
│   │       └── random.ts           # Weighted randomness
│   │
│   ├── stores/
│   │   ├── game-store.ts           # Zustand game state
│   │   └── settings-store.ts       # User preferences
│   │
│   ├── types/
│   │   ├── game.ts                 # Game state types
│   │   ├── turn.ts                 # Turn/choice types
│   │   ├── score.ts                # Scoring types
│   │   └── achievement.ts          # Achievement types
│   │
│   └── data/
│       ├── game-tree.json          # Complete decision tree
│       ├── actors.json             # Actor definitions
│       └── images.json             # Image manifest
│
├── public/
│   ├── images/
│   │   ├── scenes/                 # Core scene images
│   │   ├── icons/                  # UI icons
│   │   └── achievements/           # Achievement badges
│   │
│   └── audio/                      # Sound effects (optional)
│
├── docs/                           # This directory
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

## Core Data Models

### Game State

```typescript
interface GameState {
  // Game progress
  currentTurn: number;
  maxTurns: number;
  gameStatus: 'menu' | 'playing' | 'ended';
  endingType: 'diplomatic' | 'military' | 'disaster' | null;

  // Player decisions
  choiceHistory: Choice[];

  // World state
  actors: Record<ActorId, ActorState>;
  worldState: WorldState;

  // Scoring (hidden until end)
  score: Score;
  achievements: Achievement[];

  // Meta
  startedAt: Date;
  completedAt: Date | null;
  playerId: string;
}

interface Choice {
  turnNumber: number;
  optionId: string;
  timestamp: Date;
}

interface ActorState {
  id: ActorId;
  name: string;
  attitude: number; // -100 to 100
  readiness: number; // 0 to 100 (military/diplomatic)
  capabilities: string[];
  constraints: string[];
}

interface WorldState {
  // Key variables that change based on decisions
  iranEnrichmentLevel: number; // 0-100%
  israelStrikeReadiness: number; // 0-100
  oilPrice: number; // USD/barrel
  publicApproval: number; // 0-100%
  allianceStrength: Record<string, number>;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  daysElapsed: number;
}

interface Score {
  total: number;
  diplomatic: number;
  strategic: number;
  economic: number;
  domestic: number;
  regional: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'peace' | 'military' | 'mixed' | 'special' | 'negative';
  unlocked: boolean;
  unlockedAt: Date | null;
}
```

### Turn Data

```typescript
interface Turn {
  id: number;

  // Narrative
  title: string;
  situation: string; // Main narrative text
  intelligence: IntelligenceBrief[];

  // Visuals
  sceneImage: string; // Reference to scene image
  mood: 'calm' | 'tense' | 'crisis' | 'war';

  // Choices
  options: Option[];

  // Conditions for this turn to appear
  prerequisites?: Condition[];
}

interface Option {
  id: string;
  label: string; // Short title
  description: string; // Detailed explanation
  type: 'diplomatic' | 'military' | 'covert' | 'economic';

  // What this choice does
  effects: Effect[];

  // Requirements
  requirements?: Requirement[];

  // Scoring impact (base values, modified by world state)
  scoreImpact: Partial<Score>;

  // Visual
  icon: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
}

interface Effect {
  target: string; // What changes (actor, world state variable)
  change: number | string; // How it changes
  probability: number; // 0-1 (some effects are uncertain)
  delay?: number; // Turns before effect appears
}

interface IntelligenceBrief {
  source: string; // "CIA", "CENTCOM", "Mossad", etc.
  content: string;
  reliability: 'confirmed' | 'likely' | 'possible' | 'rumor';
  icon: string;
}
```

## Game Engine Flow

```
Player loads game
  ↓
Initialize GameState
  ↓
Load Turn 1 data
  ↓
┌─────────────────────────┐
│  Render Turn Display    │
│  - Situation Report     │
│  - Intelligence Panel   │
│  - Choice Grid          │
│  - Scene Image          │
└─────────────────────────┘
  ↓
Player selects Option
  ↓
┌─────────────────────────┐
│  Process Choice         │
│  1. Validate selection  │
│  2. Apply effects       │
│  3. Update world state  │
│  4. Update actor states │
│  5. Calculate scores    │
│  6. Check achievements  │
│  7. Determine next turn │
└─────────────────────────┘
  ↓
┌─────────────────────────┐
│  Generate Consequences  │
│  - Simulate reactions   │
│  - Create narrative     │
│  - Update intelligence  │
└─────────────────────────┘
  ↓
Animate consequence reveal
  ↓
Check end conditions
  ↓
  ├─ Game continues → Load next turn
  └─ Game ends → Show results
                   ↓
              Final Score
              Achievements
              Decision Review
```

## State Management Pattern

### Zustand Store

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameStore {
  // State
  gameState: GameState | null;

  // Actions
  initializeGame: () => void;
  makeChoice: (optionId: string) => void;
  endGame: () => void;
  resetGame: () => void;
  loadGame: (savedState: GameState) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      gameState: null,

      initializeGame: () => {
        const newState = createInitialGameState();
        set({ gameState: newState });
      },

      makeChoice: (optionId: string) => {
        const current = get().gameState;
        if (!current) return;

        const updatedState = processChoice(current, optionId);
        set({ gameState: updatedState });
      },

      endGame: () => {
        const current = get().gameState;
        if (!current) return;

        set({
          gameState: {
            ...current,
            gameStatus: 'ended',
            completedAt: new Date()
          }
        });
      },

      resetGame: () => {
        set({ gameState: null });
      },

      loadGame: (savedState: GameState) => {
        set({ gameState: savedState });
      }
    }),
    {
      name: 'hormuz-game-storage',
      partialize: (state) => ({ gameState: state.gameState })
    }
  )
);
```

## Image Strategy

### Scene Images (Static Assets)
Generate once and include in `/public/images/scenes/`:

1. `situation-room.jpg` - Default briefing scene
2. `war-room.jpg` - Military planning
3. `diplomatic-summit.jpg` - International negotiations
4. `carrier-ops.jpg` - Military deployment
5. `missile-launch.jpg` - Escalation/attack
6. `un-security-council.jpg` - International pressure
7. `oil-tanker.jpg` - Economic impact
8. `regional-map.jpg` - Strategic overview
9. `celebration.jpg` - Successful resolution
10. `disaster.jpg` - Catastrophic outcome

### Dynamic Overlays
Use CSS and SVG for variations:
- Filters (grayscale for disaster, red tint for war)
- Text overlays (threat level, turn number)
- Icon badges (military, diplomatic, economic)
- Animated elements (pulse effect on critical choices)

### Fallback Strategy
If image loading fails:
```typescript
<div className="bg-gradient-to-br from-slate-900 to-slate-700">
  {/* Text content always readable */}
</div>
```

## Performance Optimizations

1. **Code Splitting**
   - Lazy load results page
   - Split game engine into chunks

2. **Image Optimization**
   - Use Next.js Image component
   - WebP format with JPEG fallback
   - Responsive images

3. **State Updates**
   - Batch state updates
   - Memoize expensive calculations
   - Virtualize long lists (if needed)

4. **Animations**
   - Use CSS transforms (GPU accelerated)
   - Limit simultaneous animations
   - Respect `prefers-reduced-motion`

## Accessibility Requirements

- WCAG 2.1 AA compliance
- Keyboard navigation for all choices
- Screen reader announcements for turn changes
- Focus management
- Color contrast ratios > 4.5:1
- Text resize support up to 200%
- Alternative text for all images

## Testing Strategy

### Unit Tests
- Scoring calculations
- State transitions
- Choice validation
- Achievement unlocking

### Integration Tests
- Turn progression
- Save/load functionality
- Consequence simulation

### E2E Tests
- Complete playthrough (diplomatic path)
- Complete playthrough (military path)
- Save and resume
- Results display
