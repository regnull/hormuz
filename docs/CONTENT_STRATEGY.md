# Hormuz - Content Strategy

## Narrative Design

### Core Narrative Structure

The game follows a branching narrative with **3 major paths**:

1. **Diplomatic Path** - Focuses on negotiations, sanctions, and international pressure
2. **Military Path** - Emphasizes strikes, deterrence, and force
3. **Mixed Path** - Balances diplomacy with military threats

### Turn Structure (15 Turns Maximum)

#### Act I: The Brink (Turns 1-5)
**Establishing the Crisis**

**Turn 1**: Initial intelligence about Iranian nuclear breakout capability
- Choice: Immediate strike vs. diplomacy vs. covert action vs. delay

**Turn 2-3**: First consequences play out
- Diplomatic path: Secret negotiations begin
- Military path: Strike preparations and reactions
- Mixed: Threats while positioning forces

**Turn 4-5**: First escalation point
- Iran's response to initial approach
- Israel's patience running out
- Regional reactions emerging

#### Act II: Escalation or De-escalation (Turns 6-10)
**Crisis Peak**

**Turn 6-7**: Critical decision point
- Diplomatic: Agreement close or failing?
- Military: Limited strike or full campaign?
- Regional actors taking sides

**Turn 8-9**: Consequences intensify
- Military retaliation or diplomatic breakthroughs
- Oil markets react
- Domestic political pressure

**Turn 10**: Point of no return
- War or peace becomes clear
- Final major choice before endgame

#### Act III: Resolution (Turns 11-15)
**Endgame**

**Turn 11-13**: Aftermath
- Managing consequences
- Stabilizing the region
- International reactions

**Turn 14-15**: Long-term outlook
- New equilibrium
- Final scoring
- Achievement unlocks

### Branching Logic

```
Turn 1 (4 options)
  ├─ Diplomatic → Turn 2a
  ├─ Military → Turn 2b
  ├─ Covert → Turn 2c
  └─ Delay → Turn 2d

Turn 2a-d (each with 4 options)
  └─ [16 possible states]

Turn 3+
  └─ Narrative converges into ~8 major story branches

Final Turns
  └─ 5 distinct endings
```

**Total unique content needed**: ~60-80 turn variations

### Five Major Endings

1. **Diplomatic Victory**
   - Iran agrees to freeze enrichment
   - Lasting agreement reached
   - Regional stability maintained
   - **Score**: 800-1000 pts

2. **Military Success**
   - Nuclear facilities destroyed
   - Limited regional conflict
   - Iran's program set back 5-10 years
   - **Score**: 600-800 pts

3. **Pyrrhic Victory**
   - Nuclear program stopped
   - But at huge cost (regional war, oil shock, casualties)
   - **Score**: 400-600 pts

4. **Stalemate**
   - Crisis de-escalates temporarily
   - But Iran retains nuclear capability
   - Problem delayed, not solved
   - **Score**: 300-500 pts

5. **Catastrophe**
   - Regional war
   - Nuclear weapons used (Iran or Israel)
   - Global economic crisis
   - **Score**: 0-300 pts

## Content Generation Plan

### Phase 1: Core Narrative (Week 1-2)
Write the main story spine:
- 15 core turns (main path)
- All 5 endings
- Key branch points

### Phase 2: Branch Content (Week 3-4)
Expand variations:
- 30 additional turn variations
- Alternative consequences
- Actor-specific reactions

### Phase 3: Polish & Balance (Week 5)
- Balance scoring
- Add flavor text
- Write intelligence briefs
- Create achievement conditions

### Phase 4: Testing (Week 6)
- Playtest all major paths
- Verify scoring logic
- Check narrative consistency
- Fix plot holes

## Writing Guidelines

### Tone
- **Serious** but not preachy
- **Realistic** but not overwhelming with jargon
- **Tense** but with moments of hope
- **Educational** without being a textbook

### Style
- **Active voice** preferred
- **Present tense** for immediate situations
- **Past tense** for intelligence reports
- **Short paragraphs** (2-4 sentences max)

### Information Density
- Situation description: 100-150 words
- Intelligence briefs: 20-40 words each (3-5 briefs)
- Choice descriptions: 40-60 words
- Consequence narratives: 150-200 words

### Realism Checklist
For each turn, verify:
- ✓ Actor motivations make sense
- ✓ Military capabilities are plausible
- ✓ Timelines are realistic
- ✓ Economic impacts are logical
- ✓ Diplomatic responses are authentic
- ✓ No magic solutions

### Example Turn Template

```markdown
## Turn [N]: [Title]
**Location**: [Where player is]
**Time**: T+[Hours/Days]

### Situation
[2-3 paragraph narrative describing what has happened since last turn]

[Key developments from each major actor]

[New crisis point or opportunity]

### Intelligence Briefs
**Source: [Agency]** ([Reliability])
[Brief finding]

**Source: [Agency]** ([Reliability])
[Brief finding]

**Source: [Agency]** ([Reliability])
[Brief finding]

### Your Options

#### Option A: [Action Name]
**Type**: [Diplomatic/Military/Covert/Economic]
**Risk**: [Low/Medium/High/Critical]

[Description of what this option entails]

**Likely outcomes:**
- [Positive possibility]
- [Negative risk]

#### Option B: [Action Name]
[Same structure]

#### Option C: [Action Name]
[Same structure]

#### Option D: [Action Name]
[Same structure]

---

**Mr. President, what is your decision?**
```

## Actor Behavior Simulation

### Primary Actors

#### 🇮🇷 Iran
**Core Motivations:**
- Regime survival
- Regional influence
- Nuclear capability as deterrent
- Avoiding destruction

**Decision Factors:**
- Supreme Leader's risk tolerance
- IRGC influence
- Economic pressure
- Domestic politics

**Typical Reactions:**
| Player Action | Iran Response (Probability) |
|--------------|----------------------------|
| Diplomatic offer | Accept (40%), Negotiate (40%), Reject (20%) |
| Military threat | Accelerate program (60%), Disperse assets (30%), Retaliate (10%) |
| Limited strike | Missile retaliation (70%), Restrain (20%), Nuclear breakout (10%) |
| Full strike | Total war (80%), Negotiate (15%), Collapse (5%) |

#### 🇮🇱 Israel
**Core Motivations:**
- Prevent Iranian nuclear weapons (existential threat)
- Maintain military superiority
- U.S. alliance

**Decision Factors:**
- Window of opportunity closing
- Iranian breakout timeline
- U.S. support/opposition

**Typical Reactions:**
| Player Action | Israel Response |
|--------------|-----------------|
| Aggressive diplomacy | Wait (60%), Strike preparation (40%) |
| Greenlight strike | Strike within 48h (90%), Coordinate (10%) |
| Oppose strike | Strike anyway (70%), Wait (30%) |
| Joint strike | Full cooperation (100%) |

#### 🇸🇦 Saudi Arabia
**Core Motivations:**
- Counter Iranian influence
- Oil market stability
- U.S. security guarantee

**Quiet support for stopping Iran, but fears retaliation**

#### 🇷🇺 Russia
**Core Motivations:**
- Maintain influence in Middle East
- Oppose U.S. unilateralism
- Protect arms sales to Iran

**Typically opposes U.S. action but won't intervene militarily**

### Secondary Actors

#### Hezbollah
- Controls 150,000+ rockets in Lebanon
- Will likely attack Israel if Iran orders
- Could trigger two-front war

#### Iraqi Militias
- Can attack U.S. bases in Iraq
- Follow IRGC direction
- Variable discipline

#### Houthis
- Can disrupt Red Sea shipping
- Target Saudi Arabia
- Limited capability vs. U.S.

### Market Reactions

#### Oil Prices
- Tension: +10-20%
- Limited strike: +30-50%
- Regional war: +100-150%
- Strait of Hormuz closure: +200%+

#### Stock Markets
- Risk-off during crisis
- Rally on diplomatic breakthroughs
- Crash on major escalation

## Content Repository Structure

### Data Files Organization

```
src/lib/data/
├── turns/
│   ├── turn-01.ts
│   ├── turn-02-diplomatic.ts
│   ├── turn-02-military.ts
│   ├── turn-02-covert.ts
│   ├── turn-03-*.ts
│   └── ...
│
├── endings/
│   ├── diplomatic-victory.ts
│   ├── military-success.ts
│   ├── pyrrhic-victory.ts
│   ├── stalemate.ts
│   └── catastrophe.ts
│
├── intelligence/
│   ├── cia-briefs.ts
│   ├── military-intel.ts
│   ├── diplomatic-cables.ts
│   └── open-source.ts
│
├── actors/
│   ├── iran.ts
│   ├── israel.ts
│   ├── regional-powers.ts
│   └── great-powers.ts
│
└── achievements/
    ├── peace-achievements.ts
    ├── military-achievements.ts
    ├── mixed-achievements.ts
    └── special-achievements.ts
```

### Sample Turn Data Structure

```typescript
export const turn01: Turn = {
  id: 1,
  title: "The Brink",
  situation: `U.S. intelligence has just confirmed that Iran has enriched uranium close to weapons-grade levels at multiple sites...`,

  intelligence: [
    {
      source: "CIA",
      content: "Iranian air defenses on high alert but not fully mobilized.",
      reliability: "confirmed",
      icon: "shield"
    },
    // ... more briefs
  ],

  sceneImage: "situation-room",
  mood: "tense",

  options: [
    {
      id: "1a-joint-strike",
      label: "Joint U.S.–Israel Strike (Massive)",
      description: "Authorize a large coordinated air campaign tonight...",
      type: "military",
      risk: "critical",
      icon: "plane",

      effects: [
        { target: "iranEnrichmentLevel", change: -80, probability: 0.9 },
        { target: "iran.attitude", change: -50, probability: 1.0 },
        { target: "oilPrice", change: 60, probability: 0.95 },
        // ...
      ],

      scoreImpact: {
        diplomatic: -40,
        strategic: +60,
        economic: -30,
        regional: -20
      },

      nextTurn: 2 // leads to turn-02-military
    },
    // ... other options
  ]
};
```

## Localization Considerations

While initial release is English-only, structure content for future localization:

- All narrative text in separate files (not hardcoded)
- Use i18n keys for UI strings
- Avoid cultural references that don't translate
- Keep sentence structure simple
- Date/time formatting via libraries

## Content Quality Metrics

Before release, verify:
- [ ] All turns have 4 viable options
- [ ] All paths lead to an ending
- [ ] No dead-end branches
- [ ] Scoring is balanced across paths
- [ ] Achievements are attainable
- [ ] No contradictions in narrative
- [ ] Historical/political accuracy reviewed
- [ ] Sensitivity review completed
