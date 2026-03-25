# Sample Turn Implementation

This document shows a complete example of a game turn, including code structure and content.

## Turn Data Structure

```typescript
// src/lib/data/turns/turn-02-diplomatic.ts

import { Turn } from '@/types/turn';

export const turn02Diplomatic: Turn = {
  id: 2,
  title: "Diplomacy Attempt",

  // Prerequisites: Player chose diplomatic option in Turn 1
  prerequisites: [
    {
      type: 'choice',
      turnId: 1,
      optionId: '1d-diplomacy'
    }
  ],

  situation: `**72 Hours Later — Mixed Signals**

You announced an emergency international summit and warned Iran that military force remains on the table if enrichment continues.

The diplomatic machine has spun up. European allies support the effort. Oman has agreed to mediate. But the situation is more complex than it appears.

**🇮🇷 Iran's Response**

Tehran has not accepted your demand immediately, but they've signaled through Oman that they're willing to talk. The Iranian Foreign Minister made a carefully worded statement:

> "Iran seeks peaceful resolution and is open to negotiations with mutual respect."

However, your intelligence paints a concerning picture. Satellite imagery shows enrichment continuing at Fordow. Trucks have been observed moving equipment into hardened tunnels—possibly shielding critical components before a potential strike.

**CIA Assessment**: *"Iran appears to be negotiating in good faith while simultaneously preparing for war. Classic hedging strategy."*

**🇮🇱 Israel Grows Impatient**

The Israeli Prime Minister called you directly this morning, voice tight with frustration:

> "Mr. President, we cannot wait much longer. Every day Iran gets closer to nuclear breakout. If Fordow becomes completely hardened, our window closes forever."

Israeli intelligence believes Iran is weeks—not months—from assembling a nuclear device.

Your military attaché in Tel Aviv reports:
- Israeli strike aircraft on 24-hour alert
- Submarines moving into the Arabian Sea
- Air refueling tankers repositioned to Cyprus

**Mossad Warning**: *"Israel will act unilaterally within 5-7 days if talks appear to be stalling."*`,

  intelligence: [
    {
      source: "CIA",
      content: "Iranian ballistic missile units dispersing to pre-surveyed launch sites. Consistent with defensive preparations.",
      reliability: "confirmed",
      icon: "target"
    },
    {
      source: "NSA (SIGINT)",
      content: "Intercepted communications suggest Iran may attempt 'nuclear breakout' within 2-3 weeks if diplomacy fails.",
      reliability: "likely",
      icon: "radio"
    },
    {
      source: "CENTCOM",
      content: "Hezbollah leadership in Lebanon holding urgent meetings. Readiness level elevated but no imminent attack indicators.",
      reliability: "confirmed",
      icon: "shield"
    },
    {
      source: "State Dept",
      content: "European allies strongly support diplomatic track. Germany and France offering to host talks in Brussels.",
      reliability: "confirmed",
      icon: "users"
    },
    {
      source: "Economic Intel",
      content: "Oil markets up 12% overnight on war fears. Saudi Arabia quietly increasing production to stabilize prices.",
      reliability: "confirmed",
      icon: "trending-up"
    }
  ],

  sceneImage: "diplomatic-summit",
  mood: "tense",

  options: [
    {
      id: "2a-secret-deal",
      label: "Secret Deal Attempt",
      description: `Use Oman to offer Iran a secret compromise:

**U.S. Offers:**
• Iran freezes enrichment above 60%
• Limited sanctions relief ($10-15B in frozen assets)
• No U.S. strike during negotiations

**Iran Must:**
• Halt weapons-grade enrichment immediately
• Allow IAEA inspectors limited access
• Stop installing advanced centrifuges

This could prevent war but requires trusting Iran's intentions. Israel may view this as weakness.`,

      type: "diplomatic",
      risk: "medium",
      icon: "handshake",

      effects: [
        {
          target: "iran.attitude",
          change: 20,
          probability: 0.7,
          description: "Iran moderately pleased with offer"
        },
        {
          target: "israel.attitude",
          change: -30,
          probability: 0.9,
          description: "Israel frustrated with perceived weakness"
        },
        {
          target: "iranEnrichmentLevel",
          change: -5,
          probability: 0.4,
          description: "Iran may slow enrichment slightly"
        },
        {
          target: "oilPrice",
          change: -8,
          probability: 0.8,
          description: "Markets calm on diplomatic progress"
        },
        {
          target: "allianceStrength.europe",
          change: 15,
          probability: 0.9,
          description: "European allies support diplomatic approach"
        }
      ],

      scoreImpact: {
        diplomatic: 35,
        strategic: -10,
        economic: 15,
        domestic: 0,
        regional: 10
      },

      requirements: [
        {
          type: "worldState",
          variable: "publicApproval",
          operator: ">",
          value: 40
        }
      ],

      nextTurnId: 3, // Leads to consequence: Iran negotiates but stalls
    },

    {
      id: "2b-pressure-iran",
      label: "Pressure Iran Hard",
      description: `Give Iran a 72-hour ultimatum to halt enrichment or face military action.

**Actions:**
• Move B-2 bombers to Diego Garcia
• Position additional carrier in Persian Gulf
• Coordinate messaging with Israel
• Prepare strike packages

This demonstrates resolve and may force Iran's hand. But it could also trigger Iranian pre-emptive escalation or a hasty strike by Israel.`,

      type: "military",
      risk: "high",
      icon: "zap",

      effects: [
        {
          target: "iran.attitude",
          change: -25,
          probability: 1.0,
          description: "Iran views this as provocation"
        },
        {
          target: "iran.militaryReadiness",
          change: 30,
          probability: 0.95,
          description: "Iran raises military readiness"
        },
        {
          target: "israel.attitude",
          change: 25,
          probability: 0.9,
          description: "Israel appreciates show of force"
        },
        {
          target: "oilPrice",
          change: 15,
          probability: 0.9,
          description: "Markets spike on escalation fears"
        },
        {
          target: "threatLevel",
          change: "high",
          probability: 1.0,
          description: "Threat level rises"
        }
      ],

      scoreImpact: {
        diplomatic: -20,
        strategic: 25,
        economic: -15,
        domestic: 10,
        regional: -15
      },

      nextTurnId: 4, // Leads to: Iran responds with counter-threats
    },

    {
      id: "2c-delay-israel",
      label: "Buy More Time",
      description: `Call the Israeli Prime Minister and request 30 more days to negotiate.

**Your Case:**
• Diplomacy is showing promise
• Iran appears willing to talk
• A strike now would end negotiations
• U.S. will support Israel if talks fail

This preserves the diplomatic track but requires Israeli cooperation. Israel may refuse and strike anyway, or reluctantly agree while Iran continues advancing its program.`,

      type: "diplomatic",
      risk: "medium",
      icon: "clock",

      effects: [
        {
          target: "israel.patience",
          change: -20,
          probability: 0.7,
          description: "Israel's patience wears thin"
        },
        {
          target: "israelStrikeReadiness",
          change: 10,
          probability: 0.6,
          description: "Israel continues strike preparations"
        },
        {
          target: "iranEnrichmentLevel",
          change: 15,
          probability: 0.8,
          description: "Iran uses time to advance program",
          delay: 1
        },
        {
          target: "allianceStrength.israel",
          change: -15,
          probability: 0.5,
          description: "U.S.-Israel relationship strained"
        }
      ],

      scoreImpact: {
        diplomatic: 15,
        strategic: -15,
        economic: 5,
        domestic: -5,
        regional: 0
      },

      nextTurnId: 5, // Israel reluctantly agrees but sets hard deadline
    },

    {
      id: "2d-coordinate-strike",
      label: "Prepare Joint Strike (Covertly)",
      description: `Secretly coordinate a U.S.-Israel strike plan while negotiations continue publicly.

**Military Planning:**
• Identify high-value targets (Fordow, Natanz, Isfahan)
• Position assets for rapid strike
• Develop strike packages
• Plan for Iranian retaliation

Diplomacy continues on the surface as a cover. If leaked, talks collapse immediately and international support evaporates. If successful, you maintain the element of surprise.`,

      type: "covert",
      risk: "critical",
      icon: "eye-off",

      effects: [
        {
          target: "militaryReadiness.strike",
          change: 40,
          probability: 1.0,
          description: "Strike capability ready within 72 hours"
        },
        {
          target: "israel.attitude",
          change: 35,
          probability: 0.95,
          description: "Israel fully aligned with U.S."
        },
        {
          target: "allianceStrength.europe",
          change: -30,
          probability: 0.3,
          description: "Risk of leak causing diplomatic catastrophe"
        },
        {
          target: "diplomatic.credibility",
          change: -40,
          probability: 0.3,
          description: "If exposed, U.S. credibility destroyed"
        }
      ],

      scoreImpact: {
        diplomatic: -25,
        strategic: 30,
        economic: -10,
        domestic: 5,
        regional: -20
      },

      requirements: [
        {
          type: "worldState",
          variable: "militaryReadiness",
          operator: ">",
          value: 60
        }
      ],

      nextTurnId: 6, // Strike preparations advance, diplomatic talks continue
    }
  ]
};
```

## How This Turn Gets Rendered

### Component Flow

```typescript
// src/app/game/page.tsx

'use client';

import { useGameStore } from '@/stores/game-store';
import { TurnDisplay } from '@/components/game/TurnDisplay';
import { useEffect } from 'react';

export default function GamePage() {
  const { gameState, loadCurrentTurn } = useGameStore();

  useEffect(() => {
    loadCurrentTurn();
  }, [loadCurrentTurn]);

  if (!gameState) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-950">
      <TurnDisplay />
    </main>
  );
}
```

```typescript
// src/components/game/TurnDisplay.tsx

import { useGameStore } from '@/stores/game-store';
import { SituationReport } from './SituationReport';
import { IntelligencePanel } from './IntelligencePanel';
import { ChoiceGrid } from './ChoiceGrid';
import { SceneImage } from '@/components/shared/SceneImage';
import { TurnCounter } from './TurnCounter';

export function TurnDisplay() {
  const { currentTurn, gameState } = useGameStore();

  if (!currentTurn) return null;

  return (
    <div className="relative min-h-screen">
      {/* Background scene */}
      <SceneImage
        scene={currentTurn.sceneImage}
        mood={currentTurn.mood}
        className="absolute inset-0 z-0"
      />

      {/* Content overlay */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <TurnCounter
          current={gameState.currentTurn}
          max={gameState.maxTurns}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <SituationReport
              title={currentTurn.title}
              situation={currentTurn.situation}
            />

            <ChoiceGrid options={currentTurn.options} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <IntelligencePanel briefs={currentTurn.intelligence} />
          </div>
        </div>
      </div>
    </div>
  );
}
```

```typescript
// src/components/game/ChoiceCard.tsx

import { Option } from '@/types/turn';
import { useGameStore } from '@/stores/game-store';
import { motion } from 'framer-motion';
import { Shield, Zap, Eye, HandshakeIcon } from 'lucide-react';

const iconMap = {
  diplomatic: HandshakeIcon,
  military: Zap,
  covert: Eye,
  economic: Shield
};

const riskColors = {
  low: 'border-green-500 bg-green-500/10',
  medium: 'border-yellow-500 bg-yellow-500/10',
  high: 'border-orange-500 bg-orange-500/10',
  critical: 'border-red-500 bg-red-500/10'
};

export function ChoiceCard({ option }: { option: Option }) {
  const { makeChoice } = useGameStore();
  const Icon = iconMap[option.type];

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => makeChoice(option.id)}
      className={`
        relative p-6 rounded-lg border-2
        ${riskColors[option.risk]}
        text-left transition-all
        hover:shadow-lg
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5" />
          <h3 className="font-bold text-lg">{option.label}</h3>
        </div>

        <span className={`
          text-xs px-2 py-1 rounded uppercase font-semibold
          ${option.risk === 'critical' ? 'bg-red-500 text-white' : ''}
          ${option.risk === 'high' ? 'bg-orange-500 text-white' : ''}
          ${option.risk === 'medium' ? 'bg-yellow-500 text-black' : ''}
          ${option.risk === 'low' ? 'bg-green-500 text-white' : ''}
        `}>
          {option.risk} risk
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-300 whitespace-pre-line">
        {option.description}
      </p>

      {/* Type badge */}
      <div className="mt-4">
        <span className="text-xs uppercase tracking-wide text-slate-400">
          {option.type} option
        </span>
      </div>
    </motion.button>
  );
}
```

## Consequence Generation Example

When player selects Option 2A (Secret Deal Attempt):

```typescript
// src/lib/game-engine/consequence-simulator.ts

export function generateConsequence(
  gameState: GameState,
  option: Option
): ConsequenceResult {

  const results: string[] = [];
  const updates: StateUpdate[] = [];

  // Roll dice for each effect
  for (const effect of option.effects) {
    const roll = Math.random();

    if (roll < effect.probability) {
      // Effect happens
      updates.push({
        target: effect.target,
        change: effect.change,
        delay: effect.delay || 0
      });

      results.push(effect.description);
    }
  }

  // Generate narrative based on what happened
  const narrative = buildNarrative(option, results, gameState);

  return {
    narrative,
    updates,
    nextTurnId: option.nextTurnId
  };
}

function buildNarrative(
  option: Option,
  results: string[],
  state: GameState
): string {
  // Example for Option 2A
  if (option.id === '2a-secret-deal') {
    return `
**Your Decision: Secret Deal Through Oman**

You authorize backchannel diplomacy through Oman's Sultan, who has historically mediated between Washington and Tehran.

Within 48 hours, the proposal is quietly delivered to Iran's negotiating team in Muscat.

**🇮🇷 Iran's Response**

${results.includes("Iran moderately pleased")
  ? "Tehran does not accept immediately, but the response is cautiously positive. The Iranian negotiator tells Oman: 'We are willing to discuss this framework.'"
  : "Iran's response is cold. They counter-propose keeping enrichment at 80% and demand full sanctions relief. Your offer appears insufficient."
}

**🇮🇱 Israel Reacts**

${results.includes("Israel frustrated")
  ? "The Israeli Prime Minister discovers the talks through intelligence and calls you, furious: 'Mr. President, a freeze is not enough. Iran will cheat, wait, and restart. This is a mistake.'"
  : "Israel is unaware of the secret channel for now, but continues preparations."
}

**Intelligence Update**

${results.includes("Iran may slow enrichment")
  ? "Satellite imagery shows enrichment activity at Fordow has slowed slightly—possibly a good-faith gesture."
  : "No change in Iranian nuclear activity. Enrichment continues at maximum pace."
}

The situation remains fluid. You have bought time, but the crisis is far from over.
    `.trim();
  }

  return "Narrative for this choice...";
}
```

## Visual Rendering

The turn renders with:

1. **Background**: `diplomatic-summit.jpg` with dark overlay
2. **Mood filter**: Slight tension (subtle red vignette)
3. **Text**: Situation report in readable card with transparency
4. **Intelligence**: Sidebar with 5 color-coded briefs
5. **Choices**: 4 cards in 2x2 grid (responsive to 1 column on mobile)
6. **Animations**: Fade in on load, hover effects on cards

This creates an immersive, readable experience that conveys the gravity of the decisions while remaining playable and engaging.
