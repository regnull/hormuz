# Hormuz - Game Design Document

## Overview
**Hormuz** is a turn-based geopolitical crisis simulation where players take on the role of the U.S. President during a high-stakes confrontation over Iran's nuclear program. The game combines realistic diplomatic and military decision-making with strategic consequences.

## Core Concept
- **Genre**: Turn-based strategy / political simulation
- **Setting**: Near-future geopolitical crisis in the Middle East
- **Player Role**: U.S. President
- **Time Span**: ~2-4 weeks of simulated time over 10-15 game turns
- **Win Condition**: Navigate the crisis to a resolution while maximizing your presidential score

## Game Flow

### Beginning
Players start with a briefing on the escalating Iran nuclear crisis. Initial intelligence reports establish the situation and introduce key actors (Iran, Israel, regional powers, allies, oil markets).

### Turns (10-15 total)
Each turn represents 12-72 hours of real-world time:

1. **Situation Report**: Narrative description of current events
2. **Intelligence Update**: Key facts, movements, diplomatic signals
3. **Choice Presentation**: 4 realistic options (diplomatic, military, covert, hybrid)
4. **Player Decision**: Choose one option
5. **Consequence Simulation**: Realistic modeling of reactions from multiple actors
6. **Score Update**: Hidden scoring based on decision

### Ending
The game ends when:
- Crisis is resolved (diplomatically or militarily)
- Nuclear war occurs (game over - worst outcome)
- Player reaches maximum turns
- Critical threshold crossed (Iran gets nukes, total regional war, etc.)

## Scoring System

### Total Score (0-1000 points)

**Categories:**

1. **Diplomatic Success** (0-250 pts)
   - Maintaining alliances
   - Avoiding unnecessary escalation
   - Building international support
   - Effective use of backchannel negotiations

2. **Strategic Victory** (0-250 pts)
   - Preventing Iranian nuclear weapons
   - Protecting U.S. interests
   - Maintaining regional stability
   - Minimizing casualties

3. **Economic Impact** (0-200 pts)
   - Oil market stability
   - Sanctions effectiveness
   - Economic cost of military action
   - Global market confidence

4. **Domestic Politics** (0-150 pts)
   - Public approval
   - Congressional support
   - Media handling
   - Consistency with campaign promises

5. **Regional Stability** (0-150 pts)
   - Preventing wider war
   - Protecting civilian populations
   - Maintaining Gulf state relationships
   - Containing proxy forces

### Achievements (Unlockable)

**Peacekeeping Achievements:**
- **Peacemaker** - Resolve crisis without military action
- **Diplomat's Diplomat** - Successfully negotiate a lasting agreement
- **Alliance Builder** - Maintain support from all major allies
- **Economic Strategist** - Keep oil prices stable throughout

**Military Achievements:**
- **Hawk** - Choose military options 70%+ of the time
- **Surgical Strike** - Execute successful limited military action
- **Coalition Commander** - Coordinate effective joint operations
- **Deterrence Master** - Prevent enemy action through credible threats

**Mixed Strategy Achievements:**
- **Balanced Leader** - Mix diplomatic and military pressure effectively
- **Crisis Manager** - Navigate 3+ major escalation points
- **Intelligence Wizard** - Make 5+ decisions based on intel insights
- **Long Game** - Delay Iranian nuclear capability by 5+ years

**Negative Achievements:**
- **Brinksman** - Come within one choice of nuclear war
- **Escalator** - Trigger regional war
- **Isolationist** - Lose support of all major allies
- **Oil Shock** - Cause oil prices to exceed $200/barrel

**Special Achievements:**
- **Perfect Storm** - Achieve maximum score in all categories (nearly impossible)
- **Historical Parallel** - Resolve crisis similar to Cuban Missile Crisis
- **New World Order** - Establish lasting Middle East peace framework

## Key Game Mechanics

### Multi-Actor Simulation
Every decision affects multiple actors simultaneously:
- **Iran** (revolutionary guard, government, people)
- **Israel** (government, military, intelligence)
- **U.S. Forces** (CENTCOM, military branches)
- **Proxies** (Hezbollah, Iraqi militias, Houthis)
- **Regional Powers** (Saudi Arabia, UAE, Turkey, Qatar)
- **Great Powers** (Russia, China, EU)
- **Markets** (oil, stocks, currencies)
- **Domestic** (Congress, public opinion, media)

### Fog of War
Not all information is accurate:
- Intelligence can be incomplete or wrong
- Actors may bluff or misdirect
- Hidden consequences emerge over time
- Some choices have delayed effects

### Branching Narrative
Decisions create divergent paths:
- Diplomatic path vs. military path
- Overt vs. covert operations
- Unilateral vs. coalition approach
- Escalation vs. de-escalation

### Realistic Constraints
- **Time pressure**: Some choices have deadlines
- **Resource limits**: Military assets take time to position
- **Political capital**: Domestic support affects options
- **International law**: Some actions have diplomatic costs

## Visual Design Philosophy

### Minimalist Graphics Approach
To avoid overwhelming the system with AI-generated images:

1. **Scene Images** (10-15 total for entire game)
   - Situation Room
   - UN Security Council
   - Aircraft carrier operations
   - Missile launch
   - Diplomatic summit
   - War room briefing
   - Regional map
   - Oil tanker/market
   - Celebration/resolution scenes

   These are reused across similar situations with different overlays/filters.

2. **Dynamic Elements** (Generated once, reused)
   - Actor portraits (8-10 key figures)
   - Map overlays showing troop movements
   - Charts (oil prices, approval ratings)
   - Timeline visualization

3. **UI Graphics** (Static)
   - Choice cards with icons
   - Score displays
   - Achievement badges
   - Turn counter
   - Threat level indicator

### Visual Presentation Strategy
- **Scene backdrop**: One reusable image per turn type
- **Text overlay**: Primary information delivery
- **Icon system**: Military, diplomatic, economic, covert operations
- **Color coding**: Green (diplomatic), Red (military), Yellow (warning), Blue (intelligence)

## Technical Considerations

### Image Generation Strategy
1. Generate ~15 core scene images at game initialization or first play
2. Cache images in browser/CDN
3. Use CSS filters and overlays for variation (blur, darken, red tint for war, etc.)
4. Fallback to color gradients if image generation fails

### Performance
- Pre-load scene images
- Lazy load achievement graphics
- Optimize for mobile and desktop
- Save game state to localStorage

### Accessibility
- Text-based game at core (images enhance, not required)
- Screen reader support for all choices
- Keyboard navigation
- High contrast mode
