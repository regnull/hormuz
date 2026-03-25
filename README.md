# Hormuz 🎮

A realistic turn-based geopolitical crisis simulation game where you navigate an Iranian nuclear crisis as the U.S. President.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Anthropic API key to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Documentation

Full documentation is in the `/docs` directory:

- **[GAME_DESIGN.md](./docs/GAME_DESIGN.md)** - Game mechanics and design
- **[FREE_FORM_INPUT.md](./docs/FREE_FORM_INPUT.md)** - Custom action system
- **[TECHNICAL_ARCHITECTURE.md](./docs/TECHNICAL_ARCHITECTURE.md)** - Code architecture
- **[IMPLEMENTATION_ROADMAP.md](./docs/IMPLEMENTATION_ROADMAP.md)** - Development plan
- **[CONTENT_STRATEGY.md](./docs/CONTENT_STRATEGY.md)** - Narrative design
- **[SAMPLE_TURN.md](./docs/SAMPLE_TURN.md)** - Code examples

## 🎯 Features

- ✅ **Turn-based gameplay** - Navigate 10-15 critical turns
- ✅ **4 options per turn** - Diplomatic, military, covert, economic choices
- 🚧 **Free-form input** - Type custom commands (coming soon)
- 🚧 **Multiple endings** - 5 distinct outcomes
- 🚧 **Scoring & achievements** - Track performance, unlock 20+ achievements
- 🚧 **Realistic simulation** - Multi-actor system modeling geopolitical dynamics

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **AI**: Anthropic Claude API
- **UI**: Radix UI + Framer Motion
- **Icons**: Lucide React

## 📂 Project Structure

```
hormuz/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/              # Core logic
│   ├── game-engine/  # Game state machine
│   ├── data/         # Game content
│   └── utils/        # Utilities
├── stores/           # Zustand stores
├── types/            # TypeScript types
├── public/           # Static assets
└── docs/             # Documentation
```

## 🎮 Current Status

**Phase 0: Project Setup** ✅ COMPLETE
- [x] Next.js initialized
- [x] Dependencies installed
- [x] TypeScript configured
- [x] Tailwind CSS set up
- [x] Project structure created
- [x] Landing page implemented

**Next: Phase 1 - Core Game Engine**
- [ ] Game state machine
- [ ] Zustand store
- [ ] Turn processor
- [ ] Custom action processor (Claude API)
- [ ] Scoring engine

## 🔑 Environment Variables

```bash
# Required for custom actions
ANTHROPIC_API_KEY=your_api_key_here

# Optional
NEXT_PUBLIC_ENABLE_CUSTOM_ACTIONS=true
NEXT_PUBLIC_MAX_CUSTOM_ACTIONS=3
```

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🎯 Roadmap

- [x] **Phase 0**: Project setup (Days 1-2)
- [ ] **Phase 1**: Core game engine (Days 3-7)
- [ ] **Phase 2**: UI components (Days 8-12)
- [ ] **Phase 3**: Narrative content (Days 13-20)
- [ ] **Phase 4**: Visual assets (Days 21-24)
- [ ] **Phase 5**: Integration (Days 25-28)
- [ ] **Phase 6**: Testing & polish (Days 29-33)
- [ ] **Phase 7**: Deployment (Days 34-35)

See [IMPLEMENTATION_ROADMAP.md](./docs/IMPLEMENTATION_ROADMAP.md) for details.

## 🤝 Contributing

This game is designed to be:
- **Realistic** - Based on actual geopolitical dynamics
- **Educational** - Players learn about crisis management
- **Engaging** - Tense decision-making with real consequences
- **Replayable** - Multiple paths and endings

## 📄 License

TBD

---

**Ready to navigate the crisis?** 🌍
