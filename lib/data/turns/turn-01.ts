import { Turn } from '@/types/turn';

/**
 * Turn 1: The Brink
 * The opening turn where the crisis begins
 */
export const turn01: Turn = {
  id: 1,
  title: "The Brink",

  situation: `**Date**: Present Day
**Location**: Situation Room, White House

U.S. intelligence has just confirmed that Iran has enriched uranium close to weapons-grade levels at multiple sites, including Fordow and Natanz. Satellite imagery shows activity consistent with rapid breakout capability—meaning Iran could potentially assemble a nuclear device in weeks, not months.

Your National Security Advisor finishes the briefing and looks at you gravely: *"Mr. President, this is the moment we've feared. Iran is on the threshold."*

Israel has privately told Washington it is prepared to strike within 24–48 hours if the U.S. does not act. Prime Minister Netanyahu sent a direct message this morning:

> "We cannot wait. If America will not stop Iran's nuclear program, Israel will have no choice but to act alone."

## The Situation

**Iranian Capabilities:**
- Fordow facility buried deep underground, nearly invulnerable to conventional strikes
- Natanz enrichment plant operating at full capacity
- Advanced IR-6 centrifuges recently installed
- Estimated 3-4 weeks from assembling a crude nuclear device

**U.S. Forces in Region:**
- Carrier strike group USS Abraham Lincoln in the Persian Gulf
- Air bases in Qatar, UAE, and Bahrain ready
- B-2 stealth bombers can deploy from Diego Garcia
- Special operations forces on standby

**Regional Tensions:**
- Hezbollah in Lebanon has ~150,000 rockets aimed at Israel
- Iraqi militias aligned with Iran threaten U.S. bases
- Saudi Arabia and UAE quietly support stopping Iran but fear retaliation
- Oil markets extremely volatile—war could spike prices above $150/barrel

**International Pressure:**
- European allies urging restraint and renewed negotiations
- Russia warns against U.S. military action
- China offers to mediate talks
- UN Security Council gridlocked

Your military advisors say a joint U.S.–Israeli strike could cripple Iran's nuclear facilities for 5-10 years, but it risks triggering a regional war. Your diplomatic team believes there may still be a narrow window for negotiations.

**The decision is yours, Mr. President.**`,

  intelligence: [
    {
      source: "CIA",
      content: "Iranian air defenses on high alert but not fully mobilized. Window for effective strike exists for 48-72 hours.",
      reliability: "confirmed",
      icon: "shield",
    },
    {
      source: "NSA (SIGINT)",
      content: "Intercepted communications suggest Supreme Leader has not yet made final decision on weaponization. Internal debate ongoing.",
      reliability: "likely",
      icon: "radio",
    },
    {
      source: "CENTCOM",
      content: "U.S. forces positioned for strike operations. Estimated 85% probability of destroying primary targets if action taken within 72 hours.",
      reliability: "confirmed",
      icon: "crosshair",
    },
    {
      source: "State Department",
      content: "European allies willing to support renewed 'snapback' sanctions if Iran refuses negotiations. Unified diplomatic front possible.",
      reliability: "confirmed",
      icon: "users",
    },
    {
      source: "Mossad (Israeli Intelligence)",
      content: "Israel calculates 60% chance of mission success if striking alone. Requesting U.S. refueling support at minimum.",
      reliability: "confirmed",
      icon: "plane",
    },
  ],

  sceneImage: "situation-room",
  mood: "crisis",

  options: [
    {
      id: "1a-joint-strike",
      label: "Authorize Joint U.S.–Israel Strike",
      description: `Launch a coordinated massive air campaign tonight targeting all major nuclear facilities.

**Targets:**
• Fordow enrichment facility (bunker-busters required)
• Natanz enrichment complex
• Isfahan uranium conversion facility
• IRGC missile bases
• Integrated air defense systems

**Outcome:** Likely to set back Iran's nuclear program by 5-10 years. However, this will almost certainly trigger Iranian missile retaliation against Israel and U.S. bases, possible Hezbollah rocket attacks, and a major oil price spike. Regional war is highly probable.`,

      type: "military",
      risk: "critical",
      icon: "zap",

      effects: [
        {
          target: "worldState.iranEnrichmentLevel",
          change: -70,
          probability: 0.9,
          description: "Nuclear facilities severely damaged",
        },
        {
          target: "iran.attitude",
          change: -40,
          probability: 1.0,
          description: "Iran views this as act of war",
        },
        {
          target: "worldState.oilPrice",
          change: 55,
          probability: 0.95,
          description: "Oil markets panic",
        },
        {
          target: "worldState.threatLevel",
          change: "critical",
          probability: 1.0,
          description: "Regional war imminent",
        },
        {
          target: "israel.attitude",
          change: 15,
          probability: 1.0,
          description: "Israel grateful for U.S. action",
        },
        {
          target: "worldState.allianceStrength",
          change: -20,
          probability: 0.7,
          description: "European allies distance themselves",
        },
        {
          target: "worldState.daysElapsed",
          change: 2,
          probability: 1.0,
          description: "Strike and immediate aftermath",
        },
      ],

      scoreImpact: {
        diplomatic: -40,
        strategic: 60,
        economic: -35,
        domestic: 10,
        regional: -30,
      },

      nextTurnId: 2,
    },

    {
      id: "1b-limited-strike",
      label: "Limited U.S. Strike (Covert)",
      description: `Conduct a smaller, precision strike using only U.S. stealth bombers and cruise missiles. Target only Fordow and Natanz. Keep Israel officially uninvolved.

**Approach:**
• B-2 stealth bombers from Diego Garcia
• Massive Ordnance Penetrator bunker-busters
• Tomahawk cruise missiles from submarines
• Strike conducted at night with minimal signature

**Outcome:** More restrained than full attack. May delay program 2-3 years. Lower risk of total war but Iran will still likely retaliate. Gives some diplomatic cover.`,

      type: "covert",
      risk: "high",
      icon: "eye-off",

      effects: [
        {
          target: "worldState.iranEnrichmentLevel",
          change: -45,
          probability: 0.8,
          description: "Primary facilities damaged but not destroyed",
        },
        {
          target: "iran.attitude",
          change: -30,
          probability: 1.0,
          description: "Iran angry but measured response possible",
        },
        {
          target: "worldState.oilPrice",
          change: 30,
          probability: 0.9,
          description: "Oil prices spike moderately",
        },
        {
          target: "worldState.threatLevel",
          change: "high",
          probability: 1.0,
          description: "Tensions very high",
        },
        {
          target: "israel.attitude",
          change: -10,
          probability: 0.6,
          description: "Israel frustrated strike wasn't comprehensive",
        },
        {
          target: "worldState.daysElapsed",
          change: 1,
          probability: 1.0,
          description: "Swift operation",
        },
      ],

      scoreImpact: {
        diplomatic: -20,
        strategic: 35,
        economic: -20,
        domestic: 15,
        regional: -15,
      },

      nextTurnId: 2,
    },

    {
      id: "1c-greenlight-israel",
      label: "Greenlight Israeli Strike",
      description: `Tell Israel the U.S. will provide intelligence and defensive support, but let them conduct the strike independently.

**U.S. Role:**
• Intelligence sharing
• Refueling support (critical for Israeli jets)
• Air defense coordination
• Diplomatic backing if attacked

**Israeli Role:**
• Plan and execute strike
• Take public responsibility
• Accept consequences

**Outcome:** Maintains some U.S. distance from the operation. However, Iran will still likely view U.S. as complicit. Israel's strike may be less effective without full U.S. participation.`,

      type: "military",
      risk: "high",
      icon: "handshake",

      effects: [
        {
          target: "worldState.iranEnrichmentLevel",
          change: -35,
          probability: 0.65,
          description: "Israeli strike partially successful",
        },
        {
          target: "iran.attitude",
          change: -25,
          probability: 1.0,
          description: "Iran blames both Israel and U.S.",
        },
        {
          target: "israel.attitude",
          change: 20,
          probability: 0.9,
          description: "Israel appreciates greenlight",
        },
        {
          target: "worldState.oilPrice",
          change: 40,
          probability: 0.85,
          description: "Markets react to Israeli strike",
        },
        {
          target: "worldState.threatLevel",
          change: "high",
          probability: 1.0,
          description: "Regional tensions spike",
        },
        {
          target: "worldState.publicApproval",
          change: -5,
          probability: 0.5,
          description: "Public divided on supporting Israeli action",
        },
        {
          target: "worldState.daysElapsed",
          change: 1,
          probability: 1.0,
          description: "Israeli operation timeline",
        },
      ],

      scoreImpact: {
        diplomatic: -15,
        strategic: 25,
        economic: -25,
        domestic: 5,
        regional: -20,
      },

      nextTurnId: 2,
    },

    {
      id: "1d-diplomacy",
      label: "Last-Minute Diplomacy",
      description: `Call for an emergency international summit and threaten credible military force if Iran does not halt enrichment immediately.

**Diplomatic Track:**
• Emergency P5+1 meeting (U.S., UK, France, Russia, China, Germany)
• Ultimatum to Iran: freeze enrichment above 60% within 72 hours
• Coordinate with Oman for backchannel negotiations
• Threaten "all options on the table" publicly

**Military Posture:**
• Position forces as show of resolve
• No immediate strike
• Keep options open

**Outcome:** Buys time and maintains international support, but Iran may use the window to further fortify facilities. Israel may lose patience and strike anyway.`,

      type: "diplomatic",
      risk: "medium",
      icon: "message-square",

      effects: [
        {
          target: "worldState.iranEnrichmentLevel",
          change: 5,
          probability: 0.6,
          description: "Iran continues enriching during talks",
        },
        {
          target: "iran.attitude",
          change: 10,
          probability: 0.5,
          description: "Iran cautiously receptive to talks",
        },
        {
          target: "israel.attitude",
          change: -20,
          probability: 0.8,
          description: "Israel frustrated by delay",
        },
        {
          target: "worldState.israelStrikeReadiness",
          change: 15,
          probability: 0.7,
          description: "Israel accelerates strike preparations",
        },
        {
          target: "worldState.allianceStrength",
          change: 15,
          probability: 0.9,
          description: "European allies support diplomatic approach",
        },
        {
          target: "worldState.oilPrice",
          change: 8,
          probability: 0.7,
          description: "Markets cautiously optimistic",
        },
        {
          target: "worldState.publicApproval",
          change: 5,
          probability: 0.8,
          description: "Public supports trying diplomacy first",
        },
        {
          target: "worldState.daysElapsed",
          change: 3,
          probability: 1.0,
          description: "Diplomatic process takes time",
        },
      ],

      scoreImpact: {
        diplomatic: 35,
        strategic: -15,
        economic: 10,
        domestic: 10,
        regional: 15,
      },

      nextTurnId: 2,
    },
  ],
};
