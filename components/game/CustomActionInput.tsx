'use client';

import { useState } from 'react';
import { Sparkles, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomActionInputProps {
  onSubmit: (input: string) => Promise<void>;
  isLoading: boolean;
  isEnabled: boolean;
  remainingActions?: number;
  maxActions?: number;
}

export function CustomActionInput({
  onSubmit,
  isLoading,
  isEnabled,
  remainingActions = 3,
  maxActions = 3,
}: CustomActionInputProps) {
  const [input, setInput] = useState('');
  const [showExamples, setShowExamples] = useState(false);

  const examples = [
    "Order CIA to assess Iran's actual nuclear timeline",
    "Call the Israeli Prime Minister privately",
    "Deploy cyber weapons against Iranian centrifuges",
    "Request emergency UN Security Council meeting",
    "Call Saudi Crown Prince for backchannel to Iran",
    "Authorize covert operation to sabotage enrichment",
    "Address the nation on television about the crisis",
    "Send message to Iranian Supreme Leader via Oman",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !isEnabled) return;

    await onSubmit(input);
    setInput('');
  };

  const usedActions = maxActions - remainingActions;

  return (
    <div className="mt-8 pt-8 border-t border-slate-700">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-slate-100">Custom Action</h3>
            {isEnabled && (
              <span className="text-xs text-slate-400">
                ({remainingActions}/{maxActions} remaining)
              </span>
            )}
          </div>

          <button
            onClick={() => setShowExamples(!showExamples)}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            {showExamples ? 'Hide' : 'Show'} Examples
          </button>
        </div>

        {/* Examples */}
        <AnimatePresence>
          {showExamples && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-3">💡 Example actions you could try:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {examples.map((example, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(example)}
                      disabled={isLoading || !isEnabled}
                      className="text-left px-3 py-2 bg-slate-700/50 hover:bg-slate-700 rounded text-xs text-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      "{example}"
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Warning if disabled */}
        {!isEnabled && (
          <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-3 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5" />
            <div className="text-sm text-yellow-400">
              <p className="font-semibold">Custom actions are not enabled</p>
              <p className="text-xs text-yellow-400/80 mt-1">
                Set <code className="bg-yellow-500/20 px-1 rounded">NEXT_PUBLIC_ENABLE_CUSTOM_ACTIONS=true</code> and add your{' '}
                <code className="bg-yellow-500/20 px-1 rounded">ANTHROPIC_API_KEY</code> to use this feature.
              </p>
            </div>
          </div>
        )}

        {/* Input form */}
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isEnabled
                  ? "Type your action (e.g., 'Call the Saudi Crown Prince')..."
                  : "Custom actions require API key setup"
              }
              disabled={isLoading || !isEnabled}
              className="w-full px-4 py-3 pr-24 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              maxLength={200}
            />

            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {input && (
                <span className="text-xs text-slate-500">
                  {input.length}/200
                </span>
              )}
              <button
                type="submit"
                disabled={!input.trim() || isLoading || !isEnabled}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Execute</span>
                )}
              </button>
            </div>
          </div>

          {/* Character count warning */}
          {input.length > 150 && (
            <p className="text-xs text-yellow-400 mt-1">
              Keep it concise - you have {200 - input.length} characters left
            </p>
          )}
        </form>

        {/* Info */}
        {isEnabled && (
          <div className="text-xs text-slate-400 space-y-1">
            <p>
              ✨ Type any action you'd like to take. Our AI will determine if it's feasible and simulate the consequences.
            </p>
            <p>
              ⚠️ Custom actions consume political capital and count toward your {maxActions}-action limit per game.
            </p>
          </div>
        )}

        {/* Usage indicator */}
        {isEnabled && usedActions > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(usedActions / maxActions) * 100}%` }}
                className={`h-full ${
                  remainingActions === 0 ? 'bg-red-500' :
                  remainingActions === 1 ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`}
              />
            </div>
            <span className="text-xs text-slate-400">
              {usedActions} used
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
