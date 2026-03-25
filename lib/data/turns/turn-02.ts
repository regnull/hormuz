import { Turn } from '@/types/turn';

/**
 * Turn 2: Consequences
 * This turn shows the immediate aftermath of the player's Turn 1 decision
 */
export const turn02: Turn = {
  id: 2,
  title: "Immediate Aftermath",

  situation: `**72 Hours Later**
**Location**: Situation Room, White House

Your decision has set events in motion. The situation is evolving rapidly.

## What Happened

Your advisors brief you on the immediate consequences of your decision. Intelligence is flowing in from multiple sources, and the international community is reacting.

**Regional Status:**
The Middle East is on edge. Every capital from Tel Aviv to Tehran is watching your next move. Oil markets are volatile, and military forces across the region remain on high alert.

**Your Position:**
You've committed to a course of action, but the crisis is far from over. Iran's nuclear program continues to be the central concern, and the clock is still ticking.

## Current Assessment

**CIA Director's Report:**
"Mr. President, the situation remains fluid. Iran is watching our every move, and so is the rest of the world. We need to be prepared for multiple scenarios."

**National Security Advisor:**
"We have several paths forward. Each carries its own risks and opportunities. The question is: do we maintain our current approach, or do we adjust based on new intelligence?"

**Secretary of State:**
"The international community is divided. Some allies support our position, others are calling for restraint. We need to carefully manage our relationships while keeping pressure on Iran."

**Chairman of the Joint Chiefs:**
"Military options remain on the table. Our forces are postured and ready, but we await your guidance on how to proceed."

## Key Developments

Intelligence indicates that Iran is closely monitoring the situation and appears to be preparing multiple response options depending on your next move.

Israel continues to express concerns about the timeline and is pressing for more decisive action.

Regional actors are hedging their bets, trying to position themselves advantageously regardless of how this crisis resolves.

Oil markets are showing volatility, but haven't crashed—yet. Traders are waiting to see what happens next.

Your domestic political situation remains stable for now, but pressure is building from multiple directions. Hawks want stronger action, doves want de-escalation, and the public is anxious.`,

  intelligence: [
    {
      source: "CIA",
      content: "Iran continues enrichment activities. Current assessment: 3-4 weeks to potential weapons capability if they decide to break out.",
      reliability: "confirmed",
      icon: "shield",
    },
    {
      source: "NSA (SIGINT)",
      content: "Intercepted communications show Iranian leadership debating response options. No consensus yet on escalation vs. negotiation.",
      reliability: "likely",
      icon: "radio",
    },
    {
      source: "CENTCOM",
      content: "U.S. forces remain at elevated readiness. No hostile actions detected, but Iranian military movements suggest defensive preparations.",
      reliability: "confirmed",
      icon: "crosshair",
    },
    {
      source: "State Department",
      content: "Diplomatic channels remain open. European allies offering to facilitate talks if both sides show willingness.",
      reliability: "confirmed",
      icon: "users",
    },
    {
      source: "Economic Intelligence",
      content: "Oil markets showing moderate volatility. Current price holding but traders nervous about potential supply disruptions.",
      reliability: "confirmed",
      icon: "trending-up",
    },
  ],

  sceneImage: "situation-room",
  mood: "tense",

  options: [
    {
      id: "2a-continue-pressure",
      label: "Maintain Pressure",
      description: `Continue your current approach while monitoring the situation closely.

**Strategy:**
• Keep military forces positioned
• Maintain diplomatic channels
• Watch for Iranian moves
• Coordinate with allies

**Approach:** Stay the course, don't show weakness, but don't escalate unnecessarily. Let your initial decision play out while remaining prepared to adjust.`,

      type: "diplomatic",
      risk: "medium",
      icon: "shield",

      effects: [
        {
          target: "worldState.daysElapsed",
          change: 3,
          probability: 1.0,
          description: "Monitoring period",
        },
        {
          target: "iran.attitude",
          change: -5,
          probability: 0.6,
          description: "Iran interprets this as continued hostility",
        },
        {
          target: "worldState.oilPrice",
          change: 5,
          probability: 0.5,
          description: "Markets remain nervous",
        },
        {
          target: "worldState.publicApproval",
          change: 3,
          probability: 0.7,
          description: "Public appreciates steady approach",
        },
      ],

      scoreImpact: {
        diplomatic: 10,
        strategic: 15,
        economic: 5,
        domestic: 10,
        regional: 5,
      },

      nextTurnId: 3,
    },

    {
      id: "2b-escalate",
      label: "Escalate Pressure",
      description: `Increase pressure on Iran through additional sanctions and military posturing.

**Actions:**
• Announce new sanctions package
• Deploy additional naval assets
• Coordinate with Israel on contingencies
• Rally international support

**Goal:** Make it clear that time is running out for Iran to comply. Show strength and determination.`,

      type: "military",
      risk: "high",
      icon: "zap",

      effects: [
        {
          target: "worldState.daysElapsed",
          change: 2,
          probability: 1.0,
          description: "Rapid escalation timeline",
        },
        {
          target: "iran.attitude",
          change: -15,
          probability: 0.9,
          description: "Iran views this as aggressive",
        },
        {
          target: "iran.militaryReadiness",
          change: 15,
          probability: 0.8,
          description: "Iran prepares for potential conflict",
        },
        {
          target: "worldState.oilPrice",
          change: 15,
          probability: 0.9,
          description: "Markets spike on escalation fears",
        },
        {
          target: "worldState.threatLevel",
          change: "critical",
          probability: 0.6,
          description: "Situation becomes more dangerous",
        },
        {
          target: "israel.attitude",
          change: 10,
          probability: 0.8,
          description: "Israel appreciates show of force",
        },
      ],

      scoreImpact: {
        diplomatic: -10,
        strategic: 25,
        economic: -15,
        domestic: 5,
        regional: -10,
      },

      nextTurnId: 3,
    },

    {
      id: "2c-deescalate",
      label: "De-escalate Tensions",
      description: `Take steps to lower the temperature and create space for diplomacy.

**Initiatives:**
• Propose direct talks with Iran
• Offer temporary sanctions relief for freeze
• Reduce military posture slightly
• Emphasize diplomatic solution

**Reasoning:** Prevent the situation from spiraling out of control. Show good faith and test Iran's willingness to negotiate seriously.`,

      type: "diplomatic",
      risk: "medium",
      icon: "handshake",

      effects: [
        {
          target: "worldState.daysElapsed",
          change: 4,
          probability: 1.0,
          description: "Diplomatic process takes time",
        },
        {
          target: "iran.attitude",
          change: 15,
          probability: 0.7,
          description: "Iran responds positively to outreach",
        },
        {
          target: "israel.attitude",
          change: -20,
          probability: 0.8,
          description: "Israel frustrated with perceived weakness",
        },
        {
          target: "worldState.oilPrice",
          change: -10,
          probability: 0.8,
          description: "Markets calm on de-escalation",
        },
        {
          target: "worldState.publicApproval",
          change: 5,
          probability: 0.6,
          description: "Public supports trying diplomacy",
        },
        {
          target: "worldState.iranEnrichmentLevel",
          change: 5,
          probability: 0.5,
          description: "Iran may use time to advance program",
        },
      ],

      scoreImpact: {
        diplomatic: 30,
        strategic: -15,
        economic: 15,
        domestic: 10,
        regional: 20,
      },

      nextTurnId: 3,
    },

    {
      id: "2d-intelligence",
      label: "Gather More Intelligence",
      description: `Order comprehensive intelligence assessment before next move.

**Directive:**
• CIA deep-dive on Iranian capabilities
• Assessment of all military options
• Evaluation of diplomatic prospects
• Analysis of regional reactions

**Purpose:** Make sure you have the full picture before committing to your next major decision. Knowledge is power.`,

      type: "intelligence",
      risk: "low",
      icon: "brain",

      effects: [
        {
          target: "worldState.daysElapsed",
          change: 2,
          probability: 1.0,
          description: "Intelligence gathering takes time",
        },
        {
          target: "worldState.politicalCapital",
          change: 5,
          probability: 0.7,
          description: "Methodical approach builds confidence",
        },
        {
          target: "worldState.iranEnrichmentLevel",
          change: 3,
          probability: 0.6,
          description: "Iran continues work during analysis",
        },
        {
          target: "israel.attitude",
          change: -10,
          probability: 0.6,
          description: "Israel impatient with delays",
        },
      ],

      scoreImpact: {
        diplomatic: 5,
        strategic: 20,
        economic: 0,
        domestic: 15,
        regional: 5,
      },

      nextTurnId: 3,
    },
  ],
};
