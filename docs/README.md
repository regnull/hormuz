# Hormuz - Game Documentation

> A turn-based geopolitical crisis simulation built with Next.js

## 📚 Documentation Index

### Core Design Documents

1. **[GAME_DESIGN.md](./GAME_DESIGN.md)** - Start here!
   - Game overview and core mechanics
   - Scoring system (5 categories, 1000 points max)
   - 20+ achievements
   - Visual design philosophy
   - Multi-actor simulation

2. **[FREE_FORM_INPUT.md](./FREE_FORM_INPUT.md)** - ⭐ New Feature!
   - Custom action system (type anything!)
   - Claude API integration for interpreting player commands
   - Examples: "Order CIA assessment", "Call Israeli PM", etc.
   - Game balance and anti-exploit measures

3. **[TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md)**
   - Technology stack (Next.js 14 + TypeScript + Zustand)
   - Complete project structure
   - Data models and TypeScript interfaces
   - Game engine architecture
   - Performance and accessibility requirements

4. **[CONTENT_STRATEGY.md](./CONTENT_STRATEGY.md)**
   - 3-act narrative structure (15 turns)
   - 5 distinct endings
   - Actor behavior models (Iran, Israel, regional powers)
   - Writing guidelines and templates
   - Content repository organization

5. **[IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md)**
   - 35-day development plan (7 phases)
   - Day-by-day task breakdown
   - Solo developer path (4-week MVP)
   - Risk management
   - Success metrics

6. **[SAMPLE_TURN.md](./SAMPLE_TURN.md)**
   - Complete working example of a game turn
   - Full TypeScript code samples
   - React component examples
   - Consequence simulation logic

## 🎮 Game Overview

**Hormuz** is a realistic, turn-based geopolitical simulation where you play as the U.S. President navigating an Iranian nuclear crisis.

### Key Features

- ✅ **Turn-based gameplay**: 10-15 turns, each representing 12-72 hours
- ✅ **4 pre-defined options per turn**: Diplomatic, military, covert, economic
- ✅ **Free-form input**: Type custom commands like "Order CIA assessment of X"
- ✅ **Realistic simulation**: Multi-actor system (Iran, Israel, regional powers, markets)
- ✅ **Multiple endings**: 5 distinct outcomes from Diplomatic Victory to Catastrophe
- ✅ **Scoring & achievements**: Track performance across 5 categories, unlock 20+ achievements
- ✅ **Visual storytelling**: 10-15 reusable scene images with dynamic overlays

### Technology

- **Frontend**: Next.js 14 (App Router) + React 18 + TypeScript
- **State**: Zustand with localStorage persistence
- **Styling**: Tailwind CSS + Radix UI primitives
- **Animation**: Framer Motion
- **AI**: Anthropic Claude API for custom action processing

## 🚀 Quick Start

### For Developers

1. **Read the design first**: Start with [GAME_DESIGN.md](./GAME_DESIGN.md)
2. **Understand the architecture**: Review [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md)
3. **Follow the roadmap**: Use [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md)
4. **See it in action**: Check [SAMPLE_TURN.md](./SAMPLE_TURN.md)

### For Content Writers

1. **Review content strategy**: [CONTENT_STRATEGY.md](./CONTENT_STRATEGY.md)
2. **See the format**: [SAMPLE_TURN.md](./SAMPLE_TURN.md)
3. **Start writing**: Use the templates provided

### For Game Designers

1. **Core mechanics**: [GAME_DESIGN.md](./GAME_DESIGN.md)
2. **Custom actions**: [FREE_FORM_INPUT.md](./FREE_FORM_INPUT.md)
3. **Balance tuning**: Scoring section in GAME_DESIGN.md

## 📋 Development Phases

| Phase | Duration | Description |
|-------|----------|-------------|
| **Phase 0** | Days 1-2 | Project setup (Next.js, TypeScript, Tailwind) |
| **Phase 1** | Days 3-7 | Core game engine (state machine, scoring, AI integration) |
| **Phase 2** | Days 8-12 | UI components (turn display, choices, custom input) |
| **Phase 3** | Days 13-20 | Narrative content (~60-80 turn variations) |
| **Phase 4** | Days 21-24 | Visual assets (10-15 scene images, icons) |
| **Phase 5** | Days 25-28 | Integration & pages (connect everything) |
| **Phase 6** | Days 29-33 | Testing & polish (playtesting, accessibility) |
| **Phase 7** | Days 34-35 | Deployment & launch |

**Total**: ~5 weeks to MVP

## 🎯 Key Design Decisions

### 1. Free-Form Input (NEW!)

Players can type custom commands instead of choosing pre-defined options:
- "Order the CIA to assess Iran's actual breakout timeline"
- "Call the Saudi Crown Prince privately"
- "Deploy cyber weapons against Iranian centrifuges"

**How it works:**
- Claude API interprets player input in context
- Returns feasible/infeasible + consequences
- Maintains game balance with guardrails
- Costs ~$0.005 per custom action

See [FREE_FORM_INPUT.md](./FREE_FORM_INPUT.md) for full details.

### 2. Visual Strategy

**10-15 static scene images** (reused with CSS filters) to avoid generating hundreds of AI images:
- Situation Room
- War Room
- Diplomatic Summit
- Aircraft Carrier
- Missile Launch
- Regional Map
- etc.

**Variations** created with CSS filters, overlays, and dynamic text.

### 3. Scoring System

**5 categories**, total 1000 points:
- Diplomatic Success (250 pts)
- Strategic Victory (250 pts)
- Economic Impact (200 pts)
- Domestic Politics (150 pts)
- Regional Stability (150 pts)

Hidden during gameplay, revealed at the end.

### 4. Multiple Endings

1. **Diplomatic Victory** (800-1000 pts) - Lasting agreement
2. **Military Success** (600-800 pts) - Program destroyed, limited conflict
3. **Pyrrhic Victory** (400-600 pts) - Success at huge cost
4. **Stalemate** (300-500 pts) - Problem delayed
5. **Catastrophe** (0-300 pts) - Regional war or nuclear use

## 🏆 Achievements

**20+ unlockable achievements:**

### Peacekeeping
- Peacemaker
- Diplomat's Diplomat
- Alliance Builder
- Economic Strategist

### Military
- Hawk
- Surgical Strike
- Coalition Commander
- Deterrence Master

### Mixed
- Balanced Leader
- Crisis Manager
- Intelligence Wizard
- Long Game

### Special
- Perfect Storm (maximum score - nearly impossible)
- Historical Parallel (Cuban Missile Crisis resolution)

## 📊 Success Metrics

### Launch Criteria
- [ ] Game completes without crashes
- [ ] Average playthrough: 20-40 minutes
- [ ] Lighthouse score > 90
- [ ] Works on iOS Safari, Chrome, Firefox
- [ ] Load time < 3 seconds

### Post-Launch Goals
- 1,000 completed games in first month
- Average score: 500-700 (indicates balance)
- Achievement unlock rate: 40%+
- Replay rate: 20%+
- Net Promoter Score: 40+

## 🔧 Environment Setup

Required environment variables:

```bash
# .env.local
ANTHROPIC_API_KEY=your_api_key_here

# Optional: Enable/disable custom actions
NEXT_PUBLIC_ENABLE_CUSTOM_ACTIONS=true

# Optional: Limit custom actions per game
NEXT_PUBLIC_MAX_CUSTOM_ACTIONS=3
```

## 🎨 Visual Assets Needed

### Scene Images (10-15)
1. Situation Room
2. War Room
3. Diplomatic Summit
4. Aircraft Carrier Operations
5. Missile Launch
6. UN Security Council
7. Oil Tanker/Markets
8. Regional Map
9. Celebration (success)
10. Disaster (failure)

### UI Graphics
- Choice type icons (diplomatic, military, covert, economic)
- Achievement badges (20+)
- Logo/title card
- UI icons (warning, success, info)

## 📝 Content Deliverables

### Narrative Content
- 15 core turns (main path)
- ~45-65 turn variations (branching paths)
- 5 ending narratives
- ~100-150 intelligence briefs
- 20+ achievement descriptions

### Actor Definitions
- Iran behavior model
- Israel behavior model
- Regional powers (Saudi, UAE, Turkey, Qatar)
- Great powers (Russia, China, EU)
- Market reactions

## 🧪 Testing Plan

### Unit Tests
- State transitions
- Scoring calculations
- Achievement unlocking
- Custom action processing

### Integration Tests
- Full turn progression
- Save/load functionality
- Consequence simulation
- API integration

### E2E Tests
- Complete playthrough (diplomatic path)
- Complete playthrough (military path)
- Custom action flows
- Results display

### Manual Testing
- Accessibility audit
- Mobile responsive
- Cross-browser testing
- Playtesting for balance

## 🚢 Deployment

**Recommended platforms:**
- Vercel (Next.js optimized)
- Netlify
- AWS Amplify

**Pre-deployment checklist:**
- [ ] Environment variables configured
- [ ] API keys secured
- [ ] Analytics integrated (optional)
- [ ] Error tracking setup (Sentry, etc.)
- [ ] Performance optimized
- [ ] SEO metadata added

## 📈 Post-Launch Roadmap

### Version 1.1 (Weeks 6-8)
- Sound effects and music
- Difficulty levels
- Additional achievements
- Leaderboard (optional)

### Version 1.2 (Weeks 9-12)
- New scenarios (different crises)
- Multiplayer mode (debate/vote)
- Educational mode (historical context)
- Mobile app version

### Version 2.0 (Month 4+)
- AI-generated narrative variations
- Dynamic events (breaking news)
- Mod support (user scenarios)
- VR mode (situation room simulation)

## 🤝 Contributing

This game is designed to be:
- **Realistic**: Based on actual geopolitical dynamics
- **Educational**: Players learn about crisis management
- **Engaging**: Tense decision-making with real consequences
- **Replayable**: Multiple paths and endings

## 📞 Support

For questions or issues:
1. Review documentation in this directory
2. Check [SAMPLE_TURN.md](./SAMPLE_TURN.md) for examples
3. See [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md) for timeline

## 🎓 Learning Resources

Recommended reading for content writers:
- Historical crisis case studies (Cuban Missile Crisis, etc.)
- Modern geopolitical analysis
- Game writing best practices
- Branching narrative design

## 📄 License

[To be determined]

---

**Ready to build Hormuz?** Start with Phase 0 in the [Implementation Roadmap](./IMPLEMENTATION_ROADMAP.md)!
