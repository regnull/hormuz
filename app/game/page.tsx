'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/stores/game-store';
import { getTurnData } from '@/lib/data/turns/index';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function GamePage() {
  const {
    gameState,
    isLoading,
    error,
    initializeGame,
    makeChoice,
    clearError,
  } = useGameStore();

  useEffect(() => {
    // Initialize game if no state exists
    if (!gameState) {
      initializeGame();
    }
  }, [gameState, initializeGame]);

  if (!gameState) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Initializing game...</p>
        </div>
      </div>
    );
  }

  const currentTurn = getTurnData(gameState.currentTurn);

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
    <div className="min-h-screen bg-slate-950">
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
          <div>
            <h2 className="text-xl font-semibold text-slate-200 mb-4">Your Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentTurn.options.map((option: any) => (
                <button
                  key={option.id}
                  onClick={() => makeChoice(option.id)}
                  disabled={isLoading}
                  className={`
                    p-6 rounded-lg border-2 text-left transition-all
                    hover:scale-[1.02] active:scale-[0.98]
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${
                      option.risk === 'critical' ? 'border-red-500 bg-red-500/10 hover:bg-red-500/20' :
                      option.risk === 'high' ? 'border-orange-500 bg-orange-500/10 hover:bg-orange-500/20' :
                      option.risk === 'medium' ? 'border-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20' :
                      'border-green-500 bg-green-500/10 hover:bg-green-500/20'
                    }
                  `}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg text-slate-100">{option.label}</h3>
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

                  <p className="text-sm text-slate-300 whitespace-pre-line mb-3">
                    {option.description}
                  </p>

                  <div className="text-xs uppercase tracking-wide text-slate-400">
                    {option.type} option
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-slate-300">Processing your decision...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
