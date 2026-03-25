# Hormuz - Implementation Roadmap

## Development Phases

### Phase 0: Project Setup (Days 1-2)
**Goal**: Get development environment ready

#### Tasks
- [ ] Initialize Next.js project with TypeScript
- [ ] Configure Tailwind CSS
- [ ] Set up ESLint and Prettier
- [ ] Install core dependencies
- [ ] Create project structure
- [ ] Set up Git repository
- [ ] Configure Vercel deployment (optional)

#### Dependencies to Install
```bash
# Core
npm install next@latest react@latest react-dom@latest typescript
npm install -D @types/react @types/node

# State management
npm install zustand

# UI & Styling
npm install tailwindcss postcss autoprefixer
npm install @radix-ui/react-dialog @radix-ui/react-progress
npm install framer-motion
npm install lucide-react

# AI Integration
npm install @anthropic-ai/sdk

# Utilities
npm install clsx tailwind-merge
npm install date-fns
```

#### Deliverables
- ✅ Working Next.js dev server
- ✅ Basic page routing
- ✅ Tailwind configured
- ✅ TypeScript compiling

---

### Phase 1: Core Game Engine (Days 3-7)
**Goal**: Build the logic that powers the game

#### Tasks

**Day 3: Data Models**
- [ ] Define TypeScript interfaces (`types/`)
- [ ] Create GameState type
- [ ] Create Turn, Option, Effect types
- [ ] Create Score and Achievement types

**Day 4: State Management**
- [ ] Set up Zustand store
- [ ] Implement game initialization
- [ ] Implement choice processing
- [ ] Add localStorage persistence

**Day 5-6: Game Engine**
- [ ] Write turn processor (apply effects to state)
- [ ] Write consequence simulator (generate narrative results)
- [ ] Write custom action processor (Claude API integration)
- [ ] Write scoring engine (calculate points)
- [ ] Write achievement tracker (check unlock conditions)

**Day 7: Testing**
- [ ] Unit tests for state transitions
- [ ] Unit tests for scoring
- [ ] Test save/load functionality

#### Deliverables
- ✅ Working game state machine
- ✅ Choice → Effect → New State pipeline
- ✅ Scoring calculations
- ✅ Achievement detection

---

### Phase 2: UI Components (Days 8-12)
**Goal**: Build reusable React components

#### Tasks

**Day 8: Base Components**
- [ ] Button component
- [ ] Card component
- [ ] Badge component
- [ ] Progress bar component

**Day 9-10: Game Components**
- [ ] TurnDisplay (main container)
- [ ] SituationReport (narrative text)
- [ ] IntelligencePanel (sidebar)
- [ ] ChoiceCard (single option)
- [ ] ChoiceGrid (4 options)
- [ ] CustomActionInput (free-form text input)
- [ ] SceneImage (background)

**Day 11: Results Components**
- [ ] ScoreBreakdown
- [ ] AchievementGrid
- [ ] DecisionTimeline
- [ ] ShareResults

**Day 12: Polish**
- [ ] Add animations (Framer Motion)
- [ ] Responsive design
- [ ] Dark mode support
- [ ] Accessibility testing

#### Deliverables
- ✅ Complete component library
- ✅ Storybook examples (optional)
- ✅ Responsive on mobile + desktop
- ✅ Passes accessibility audit

---

### Phase 3: Narrative Content (Days 13-20)
**Goal**: Write the actual game story

#### Tasks

**Day 13-14: Core Spine**
- [ ] Write 15 main path turns
- [ ] Write all 5 endings
- [ ] Create Turn 1 (entry point)

**Day 15-17: Branching Content**
- [ ] Write diplomatic branch variations
- [ ] Write military branch variations
- [ ] Write mixed approach variations
- [ ] Write intelligence briefs for each turn

**Day 18: Actor Definitions**
- [ ] Define Iran behavior model
- [ ] Define Israel behavior model
- [ ] Define regional actors
- [ ] Define market reactions

**Day 19: Achievements**
- [ ] Write achievement definitions
- [ ] Set unlock conditions
- [ ] Create achievement badges

**Day 20: Review & Balance**
- [ ] Playtest full game
- [ ] Balance scoring
- [ ] Check narrative consistency
- [ ] Fix any plot holes

#### Deliverables
- ✅ ~60-80 turn variations written
- ✅ All endings complete
- ✅ 20+ achievements defined
- ✅ Playable end-to-end

---

### Phase 4: Visual Assets (Days 21-24)
**Goal**: Create or source all images

#### Tasks

**Day 21: Scene Images**
Generate or source 10-15 core scene images:
- [ ] Situation Room
- [ ] War Room
- [ ] Diplomatic Summit
- [ ] Aircraft Carrier
- [ ] Missile Launch
- [ ] UN Security Council
- [ ] Oil Tanker
- [ ] Regional Map
- [ ] Celebration
- [ ] Disaster

**Options for generation:**
1. Use DALL-E / Midjourney
2. Use stock photos (Unsplash, Pexels)
3. Commission artist
4. Create in Blender (3D renders)

**Day 22: Icons & UI Graphics**
- [ ] Choice type icons (diplomatic, military, covert, economic)
- [ ] Achievement badges
- [ ] UI icons (warning, success, info)
- [ ] Logo/title card

**Day 23: Optimization**
- [ ] Resize images for web
- [ ] Convert to WebP
- [ ] Create blurhash placeholders
- [ ] Set up image CDN (optional)

**Day 24: Integration**
- [ ] Add images to components
- [ ] Test loading performance
- [ ] Add fallbacks
- [ ] Verify mobile rendering

#### Deliverables
- ✅ All scene images ready
- ✅ UI graphics complete
- ✅ Optimized for web
- ✅ Fallbacks in place

---

### Phase 5: Integration & Pages (Days 25-28)
**Goal**: Connect everything together

#### Tasks

**Day 25: Landing Page**
- [ ] Create home/menu page
- [ ] Add "New Game" button
- [ ] Add "Continue" button (if saved game exists)
- [ ] Add settings/credits

**Day 26: Game Page**
- [ ] Connect Zustand store to UI
- [ ] Wire up choice selection
- [ ] Implement turn transitions
- [ ] Add loading states

**Day 27: Results Page**
- [ ] Show final scores
- [ ] Display achievements
- [ ] Show decision timeline
- [ ] Add replay button

**Day 28: Polish**
- [ ] Add page transitions
- [ ] Improve loading states
- [ ] Add sound effects (optional)
- [ ] Final responsive testing

#### Deliverables
- ✅ Complete game flow working
- ✅ All pages connected
- ✅ Save/load functional
- ✅ Ready for testing

---

### Phase 6: Testing & Polish (Days 29-33)
**Goal**: Make it production-ready

#### Tasks

**Day 29: Playtesting**
- [ ] Full playthrough (diplomatic path)
- [ ] Full playthrough (military path)
- [ ] Full playthrough (mixed path)
- [ ] Find bugs and edge cases

**Day 30: Bug Fixes**
- [ ] Fix any game-breaking bugs
- [ ] Balance scoring if needed
- [ ] Adjust difficulty/pacing

**Day 31: Performance**
- [ ] Lighthouse audit
- [ ] Optimize bundle size
- [ ] Lazy load components
- [ ] Test on low-end devices

**Day 32: Accessibility**
- [ ] Keyboard navigation
- [ ] Screen reader testing
- [ ] Color contrast audit
- [ ] ARIA labels

**Day 33: Final Polish**
- [ ] Copywriting review
- [ ] Visual polish
- [ ] Add credits/about page
- [ ] Prepare deployment

#### Deliverables
- ✅ No critical bugs
- ✅ 90+ Lighthouse score
- ✅ WCAG AA compliant
- ✅ Ready to ship

---

### Phase 7: Deployment & Launch (Days 34-35)
**Goal**: Ship it!

#### Tasks

**Day 34: Deployment**
- [ ] Build production bundle
- [ ] Deploy to Vercel/Netlify
- [ ] Test production build
- [ ] Set up analytics (optional)

**Day 35: Launch**
- [ ] Soft launch (share with testers)
- [ ] Gather feedback
- [ ] Fix any critical issues
- [ ] Public launch

#### Deliverables
- ✅ Live production URL
- ✅ Game playable online
- ✅ Monitoring in place

---

## Post-Launch Roadmap

### Version 1.1 (Week 6-8)
- [ ] Add sound effects and music
- [ ] Implement difficulty levels
- [ ] Add more achievements
- [ ] Leaderboard (optional)

### Version 1.2 (Week 9-12)
- [ ] New scenarios (other crises)
- [ ] Multiplayer mode (debate/vote)
- [ ] Educational mode (with historical context)
- [ ] Mobile app version

### Version 2.0 (Month 4+)
- [ ] AI-generated narrative variations
- [ ] Dynamic events (breaking news)
- [ ] Mod support (user-created scenarios)
- [ ] VR mode (situation room simulation)

---

## Technical Milestones

### MVP (Minimum Viable Product) - Day 28
**Must have:**
- ✅ 15 core turns playable
- ✅ At least 3 endings accessible
- ✅ Basic scoring working
- ✅ Can save/load game
- ✅ Runs on desktop browser

### Beta - Day 33
**Must have:**
- ✅ All content complete
- ✅ All 5 endings accessible
- ✅ All achievements unlockable
- ✅ Mobile responsive
- ✅ No major bugs

### V1.0 Launch - Day 35
**Must have:**
- ✅ Production ready
- ✅ Performance optimized
- ✅ Accessibility compliant
- ✅ Analytics integrated
- ✅ Documentation complete

---

## Risk Management

### Technical Risks

**Risk**: State management becomes complex
- **Mitigation**: Keep game state simple, use Zustand, write tests early

**Risk**: Performance issues with large decision tree
- **Mitigation**: Lazy load turn data, code splitting, optimize re-renders

**Risk**: Image loading too slow
- **Mitigation**: Optimize images, use CDN, implement progressive loading

### Content Risks

**Risk**: Not enough narrative variation
- **Mitigation**: Start with quality over quantity, can add variations post-launch

**Risk**: Political sensitivity
- **Mitigation**: Clearly label as fictional simulation, sensitivity review

**Risk**: Scoring feels arbitrary
- **Mitigation**: Playtesting, balance tuning, transparent scoring

### Timeline Risks

**Risk**: Scope creep
- **Mitigation**: Strict MVP definition, defer nice-to-haves to v1.1

**Risk**: Content writing takes too long
- **Mitigation**: Use templates, parallel work, consider AI assistance

**Risk**: Testing reveals major issues late
- **Mitigation**: Continuous testing, early playtesting, modular architecture

---

## Success Metrics

### Launch Criteria
- [ ] Game completes without crashes
- [ ] Average playthrough time: 20-40 minutes
- [ ] Lighthouse score > 90
- [ ] Works on iOS Safari, Chrome, Firefox
- [ ] Load time < 3 seconds

### Post-Launch Goals
- 1,000 completed games in first month
- Average score: 500-700 (indicates balance)
- Achievement unlock rate: 40%+ (not too hard)
- Replay rate: 20%+ (engaging enough to replay)
- Net Promoter Score: 40+ (would recommend)

---

## Team Roles (If Working in Team)

### Developer #1 (Full-stack)
- Next.js setup
- Game engine
- State management
- Deployment

### Developer #2 (Frontend)
- UI components
- Animations
- Responsive design
- Accessibility

### Writer
- Narrative content
- Intelligence briefs
- Achievement text
- Copy editing

### Designer
- Visual design
- Scene images
- Icons
- UI/UX

### QA Tester
- Playtesting
- Bug reporting
- Balance feedback
- Accessibility testing

---

## Solo Developer Path

If building alone, prioritize:

**Week 1**: Setup + Core Engine + Basic UI
**Week 2**: Minimum narrative (10 turns, 2 endings)
**Week 3**: Polish + Visual assets
**Week 4**: Testing + Launch

Ship MVP fast, iterate based on feedback.
