import { GameState } from '@/types/game';
import { Option } from '@/types/turn';

/**
 * Generate contextual options based on current game state
 * This creates dynamic choices that adapt to the situation
 */
export function generateOptions(gameState: GameState, storyArc: string): Option[] {
  const options: Option[] = [];

  // Always include at least one diplomatic option
  options.push(generateDiplomaticOption(gameState, storyArc));

  // Include military option if appropriate
  if (gameState.worldState.iranEnrichmentLevel >= 50) {
    options.push(generateMilitaryOption(gameState, storyArc));
  }

  // Include intelligence/analysis option
  options.push(generateIntelligenceOption(gameState, storyArc));

  // Fourth option varies based on situation
  if (storyArc === 'escalation') {
    options.push(generateEscalationOption(gameState));
  } else if (storyArc === 'deescalation') {
    options.push(generateDeescalationOption(gameState));
  } else {
    options.push(generateBalancedOption(gameState));
  }

  return options;
}

function generateDiplomaticOption(gameState: GameState, storyArc: string): Option {
  const { worldState } = gameState;

  return {
    id: `turn${gameState.currentTurn}-diplomatic`,
    label: 'Pursue Diplomatic Solution',
    description: `Engage in negotiations with Iran through international mediators.

**Approach:**
• Propose direct talks or use backchannel
• Offer calibrated incentives for compliance
• Build international coalition for pressure
• Set clear conditions and timelines

${storyArc === 'escalation' ?
  '⚠️ May be seen as weakness given recent escalation' :
  'Maintains international support and gives diplomacy a chance'}`,

    type: 'diplomatic',
    risk: storyArc === 'escalation' ? 'medium' : 'low',
    icon: 'handshake',

    effects: [
      {
        target: 'worldState.daysElapsed',
        change: 3,
        probability: 1.0,
        description: 'Diplomatic process takes time',
      },
      {
        target: 'iran.attitude',
        change: 15,
        probability: 0.7,
        description: 'Iran responds to diplomatic overture',
      },
      {
        target: 'worldState.allianceStrength',
        change: 10,
        probability: 0.8,
        description: 'Allies support diplomatic approach',
      },
      {
        target: 'worldState.oilPrice',
        change: -10,
        probability: 0.7,
        description: 'Markets calm on de-escalation',
      },
      {
        target: 'israel.attitude',
        change: -15,
        probability: 0.6,
        description: 'Israel concerned about delays',
      },
    ],

    scoreImpact: {
      diplomatic: 30,
      strategic: -10,
      economic: 15,
      domestic: 10,
      regional: 20,
    },
  };
}

function generateMilitaryOption(gameState: GameState, storyArc: string): Option {
  const { worldState } = gameState;
  const isHighEnrichment = worldState.iranEnrichmentLevel >= 85;

  return {
    id: `turn${gameState.currentTurn}-military`,
    label: isHighEnrichment ? 'Authorize Military Strike' : 'Increase Military Pressure',
    description: isHighEnrichment ?
      `Launch targeted strikes on Iranian nuclear facilities.

**Targets:**
• Key enrichment facilities
• Command and control
• Defensive systems as needed

**Goal:** Destroy or severely degrade nuclear program before Iran achieves weapons capability.

⚠️ HIGH RISK: Will trigger Iranian retaliation and regional crisis.` :
      `Increase military posture to pressure Iran.

**Actions:**
• Deploy additional forces to region
• Conduct military exercises with allies
• Position assets for potential strike
• Demonstrate capability and resolve

Shows strength while maintaining flexibility for diplomacy.`,

    type: 'military',
    risk: isHighEnrichment ? 'critical' : 'high',
    icon: 'zap',

    effects: [
      {
        target: 'worldState.iranEnrichmentLevel',
        change: isHighEnrichment ? -60 : -10,
        probability: isHighEnrichment ? 0.85 : 0.3,
        description: isHighEnrichment ? 'Strike damages facilities' : 'Pressure slows program',
      },
      {
        target: 'iran.attitude',
        change: isHighEnrichment ? -40 : -20,
        probability: 1.0,
        description: 'Iran views as hostile act',
      },
      {
        target: 'worldState.oilPrice',
        change: isHighEnrichment ? 40 : 20,
        probability: 0.9,
        description: 'Markets spike on military action',
      },
      {
        target: 'worldState.threatLevel',
        change: isHighEnrichment ? 'critical' : 'high',
        probability: isHighEnrichment ? 0.9 : 0.6,
        description: 'Threat level rises',
      },
      {
        target: 'israel.attitude',
        change: 20,
        probability: 0.9,
        description: 'Israel supports strong action',
      },
    ],

    scoreImpact: {
      diplomatic: isHighEnrichment ? -40 : -20,
      strategic: isHighEnrichment ? 60 : 30,
      economic: -30,
      domestic: 15,
      regional: -25,
    },
  };
}

function generateIntelligenceOption(gameState: GameState, storyArc: string): Option {
  return {
    id: `turn${gameState.currentTurn}-intelligence`,
    label: 'Order Intelligence Assessment',
    description: `Direct comprehensive intelligence evaluation before next major decision.

**Focus Areas:**
• Iranian nuclear capabilities and timeline
• Military response scenarios
• Regional actor positioning
• Diplomatic opportunities

**Purpose:** Make informed decision based on complete picture rather than acting hastily.`,

    type: 'intelligence',
    risk: 'low',
    icon: 'brain',

    effects: [
      {
        target: 'worldState.daysElapsed',
        change: 2,
        probability: 1.0,
        description: 'Intelligence gathering requires time',
      },
      {
        target: 'worldState.politicalCapital',
        change: 5,
        probability: 0.7,
        description: 'Methodical approach builds confidence',
      },
      {
        target: 'worldState.iranEnrichmentLevel',
        change: 2,
        probability: 0.5,
        description: 'Iran continues program during assessment',
      },
    ],

    scoreImpact: {
      diplomatic: 5,
      strategic: 20,
      economic: 0,
      domestic: 15,
      regional: 5,
    },
  };
}

function generateEscalationOption(gameState: GameState): Option {
  return {
    id: `turn${gameState.currentTurn}-escalate`,
    label: 'Escalate Pressure',
    description: `Significantly increase pressure on Iran through coordinated measures.

**Actions:**
• Impose additional sanctions
• Increase military deployments
• Coordinate with Israel on strike planning
• Rally international pressure

**Message:** Time is running out for Iran to comply.`,

    type: 'military',
    risk: 'high',
    icon: 'zap',

    effects: [
      {
        target: 'worldState.daysElapsed',
        change: 2,
        probability: 1.0,
        description: 'Rapid escalation timeline',
      },
      {
        target: 'iran.attitude',
        change: -20,
        probability: 0.9,
        description: 'Iran hardens position',
      },
      {
        target: 'iran.militaryReadiness',
        change: 20,
        probability: 0.8,
        description: 'Iran prepares for potential conflict',
      },
      {
        target: 'worldState.oilPrice',
        change: 15,
        probability: 0.85,
        description: 'Markets react to escalation',
      },
      {
        target: 'israel.attitude',
        change: 15,
        probability: 0.9,
        description: 'Israel encouraged by firm stance',
      },
    ],

    scoreImpact: {
      diplomatic: -15,
      strategic: 25,
      economic: -15,
      domestic: 10,
      regional: -10,
    },
  };
}

function generateDeescalationOption(gameState: GameState): Option {
  return {
    id: `turn${gameState.currentTurn}-deescalate`,
    label: 'De-escalate Tensions',
    description: `Take steps to reduce tensions and create diplomatic space.

**Initiatives:**
• Propose mutual de-escalation steps
• Offer limited sanctions relief for verifiable freeze
• Reduce military posture slightly
• Emphasize path to negotiated solution

**Goal:** Prevent situation from spiraling while testing Iran's willingness to compromise.`,

    type: 'diplomatic',
    risk: 'medium',
    icon: 'handshake',

    effects: [
      {
        target: 'worldState.daysElapsed',
        change: 3,
        probability: 1.0,
        description: 'Diplomatic de-escalation process',
      },
      {
        target: 'iran.attitude',
        change: 20,
        probability: 0.7,
        description: 'Iran responds positively',
      },
      {
        target: 'israel.attitude',
        change: -15,
        probability: 0.7,
        description: 'Israel frustrated by perceived weakness',
      },
      {
        target: 'worldState.oilPrice',
        change: -15,
        probability: 0.8,
        description: 'Markets calm significantly',
      },
      {
        target: 'worldState.publicApproval',
        change: 8,
        probability: 0.6,
        description: 'Public supports avoiding war',
      },
    ],

    scoreImpact: {
      diplomatic: 35,
      strategic: -15,
      economic: 20,
      domestic: 15,
      regional: 25,
    },
  };
}

function generateBalancedOption(gameState: GameState): Option {
  return {
    id: `turn${gameState.currentTurn}-balanced`,
    label: 'Maintain Current Course',
    description: `Continue current strategy while closely monitoring situation.

**Approach:**
• Hold military and diplomatic posture steady
• Watch for Iranian moves and respond accordingly
• Maintain alliance coordination
• Stay flexible for adjustments

**Strategy:** Don't escalate or back down unnecessarily. Let current approach play out.`,

    type: 'diplomatic',
    risk: 'medium',
    icon: 'shield',

    effects: [
      {
        target: 'worldState.daysElapsed',
        change: 3,
        probability: 1.0,
        description: 'Monitoring period',
      },
      {
        target: 'worldState.publicApproval',
        change: 5,
        probability: 0.6,
        description: 'Public appreciates steady approach',
      },
    ],

    scoreImpact: {
      diplomatic: 10,
      strategic: 10,
      economic: 5,
      domestic: 10,
      regional: 10,
    },
  };
}
