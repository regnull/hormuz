'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/stores/game-store';
import { getTurnData } from '@/lib/data/turns/index';
import { Turn } from '@/types/turn';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { CustomActionInput } from '@/components/game/CustomActionInput';
import { CustomActionResult } from '@/components/game/CustomActionResult';
import { AchievementToast } from '@/components/game/AchievementToast';
import { SceneImage } from '@/components/shared/SceneImage';
import { ChoiceCard } from '@/components/game/ChoiceCard';
import { AnimatePresence, motion } from 'framer-motion';
import { Achievement } from '@/types/game';

export default function GamePage() {
  const {
    gameState,
    isLoading,
    error,
    customActionResult,
    initializeGame,
    makeChoice,
    processCustomActionInput,
    clearError,
    clearCustomActionResult,
  } = useGameStore();

  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [previousAchievementCount, setPreviousAchievementCount] = useState(0);
  const [currentTurn, setCurrentTurn] = useState<Turn | null>(null);
  const [loadingTurn, setLoadingTurn] = useState(false);

  useEffect(() => {
    // Initialize game if no state exists or if it's marked as ended
    if (!gameState || gameState.gameStatus === 'menu') {
      initializeGame();
    }
  }, [gameState?.gameStatus, initializeGame]);

  // Load current turn (async for dynamic generation)
  useEffect(() => {
    if (!gameState) return;

    const loadTurn = async () => {
      setLoadingTurn(true);
      try {
        const turn = await getTurnData(gameState.currentTurn, gameState);
        console.log('[Game Page] Turn loaded:', {
          turnNumber: turn.id,
          title: turn.title,
          hasGeneratedImage: !!(turn as any).generatedImageUrl,
          imageUrl: (turn as any).generatedImageUrl ? (turn as any).generatedImageUrl.substring(0, 60) + '...' : 'none',
        });
        setCurrentTurn(turn);
      } catch (error) {
        console.error('Failed to load turn:', error);
      } finally {
        setLoadingTurn(false);
      }
    };

    loadTurn();
  }, [gameState?.currentTurn]);

  // Track new achievements
  useEffect(() => {
    if (!gameState) return;

    const currentCount = gameState.achievements.length;
    if (currentCount > previousAchievementCount) {
      // New achievement(s) unlocked
      const newOnes = gameState.achievements.slice(previousAchievementCount);
      setNewAchievements(newOnes);
    }
    setPreviousAchievementCount(currentCount);
  }, [gameState?.achievements, previousAchievementCount]);

  const handleCustomAction = async (input: string) => {
    await processCustomActionInput(input);
  };

  const closeAchievement = (achievementId: string) => {
    setNewAchievements(prev => prev.filter(a => a.id !== achievementId));
  };

  // Check if custom actions are enabled
  const customActionsEnabled = process.env.NEXT_PUBLIC_ENABLE_CUSTOM_ACTIONS === 'true';
  const maxCustomActions = parseInt(process.env.NEXT_PUBLIC_MAX_CUSTOM_ACTIONS || '3');
  const customActionsUsed = gameState?.choiceHistory.filter(c => c.optionId.startsWith('custom:')).length || 0;
  const remainingCustomActions = maxCustomActions - customActionsUsed;

  if (!gameState || loadingTurn) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <div className="space-y-2">
            <p className="text-slate-300 text-lg">
              {!gameState ? 'Initializing game...' : 'Generating turn...'}
            </p>
            {loadingTurn && (
              <>
                <p className="text-slate-500 text-sm">Creating AI narrative and artwork</p>
                <p className="text-slate-600 text-xs">This may take 5-15 seconds</p>
                <p className="text-slate-700 text-xs mt-2">Check browser console for progress</p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!currentTurn) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center text-red-400">
          <p>Error: Turn {gameState.currentTurn} not found</p>
          <Link href="/" className="text-blue-400 hover:underline mt-4 inline-block">
            Return to menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 relative">
      {/* Scene Background */}
      <SceneImage
        scene={currentTurn.sceneImage}
        mood={currentTurn.mood}
        generatedImageUrl={(currentTurn as any).generatedImageUrl}
      />

      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Exit Game
            </Link>

            <div className="flex items-center gap-6 text-sm">
              <div className="text-slate-400">
                Turn: <span className="text-slate-200 font-semibold">{gameState.currentTurn}</span> / {gameState.maxTurns}
              </div>
              <div className="text-slate-400">
                Day: <span className="text-slate-200 font-semibold">{gameState.worldState.daysElapsed}</span>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-semibold ${
                gameState.worldState.threatLevel === 'critical' ? 'bg-red-500 text-white' :
                gameState.worldState.threatLevel === 'high' ? 'bg-orange-500 text-white' :
                gameState.worldState.threatLevel === 'medium' ? 'bg-yellow-500 text-black' :
                'bg-green-500 text-white'
              }`}>
                {gameState.worldState.threatLevel.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="container mx-auto px-4 py-4">
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start justify-between">
            <p className="text-red-400">{error}</p>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Turn title */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-100 mb-2">
              {currentTurn.title}
            </h1>
            <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span>Crisis in Progress</span>
            </div>
          </div>

          {/* Situation report */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">Situation Report</h2>
            <div className="prose prose-invert prose-slate max-w-none">
              <div className="text-slate-300 whitespace-pre-line leading-relaxed">
                {currentTurn.situation}
              </div>
            </div>
          </div>

          {/* Intelligence */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">Intelligence Briefs</h2>
            <div className="space-y-3">
              {currentTurn.intelligence.map((brief: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-3 rounded border ${
                    brief.reliability === 'confirmed' ? 'border-green-500/30 bg-green-500/5' :
                    brief.reliability === 'likely' ? 'border-blue-500/30 bg-blue-500/5' :
                    brief.reliability === 'possible' ? 'border-yellow-500/30 bg-yellow-500/5' :
                    'border-slate-500/30 bg-slate-500/5'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-xs font-semibold text-slate-400 min-w-[120px]">
                      {brief.source}
                    </div>
                    <div className="flex-1 text-sm text-slate-300">
                      {brief.content}
                    </div>
                    <div className={`text-xs px-2 py-0.5 rounded ${
                      brief.reliability === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                      brief.reliability === 'likely' ? 'bg-blue-500/20 text-blue-400' :
                      brief.reliability === 'possible' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {brief.reliability}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Choices */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-slate-200 mb-4">Your Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentTurn.options.map((option: any, index: number) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <ChoiceCard
                    option={option}
                    onClick={() => makeChoice(option.id)}
                    disabled={isLoading}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Custom Action Input */}
          <CustomActionInput
            onSubmit={handleCustomAction}
            isLoading={isLoading}
            isEnabled={customActionsEnabled}
            remainingActions={remainingCustomActions}
            maxActions={maxCustomActions}
          />

          {/* Loading state */}
          {isLoading && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-slate-300">Processing your decision...</p>
              </div>
            </div>
          )}

          {/* Custom Action Result Modal */}
          <AnimatePresence>
            {customActionResult && (
              <CustomActionResult
                success={customActionResult.success}
                message={customActionResult.message}
                onClose={clearCustomActionResult}
              />
            )}
          </AnimatePresence>

          {/* Achievement Toasts */}
          <AnimatePresence>
            {newAchievements.map((achievement) => (
              <AchievementToast
                key={achievement.id}
                achievement={achievement}
                onClose={() => closeAchievement(achievement.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
