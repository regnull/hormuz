'use client';

import { motion } from 'framer-motion';
import { Trophy, X } from 'lucide-react';
import { Achievement } from '@/types/game';

interface AchievementToastProps {
  achievement: Achievement;
  onClose: () => void;
}

const categoryColors = {
  peace: 'from-green-500 to-emerald-500',
  military: 'from-red-500 to-orange-500',
  mixed: 'from-blue-500 to-cyan-500',
  special: 'from-purple-500 to-pink-500',
  negative: 'from-gray-500 to-slate-500',
};

const categoryIcons = {
  peace: '🕊️',
  military: '⚔️',
  mixed: '⚖️',
  special: '⭐',
  negative: '💀',
};

export function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -100, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: -100, x: '-50%' }}
      className="fixed top-4 left-1/2 z-50 w-full max-w-md px-4"
    >
      <div className="bg-slate-900 border-2 border-yellow-500 rounded-lg shadow-2xl overflow-hidden">
        {/* Header gradient */}
        <div className={`h-2 bg-gradient-to-r ${categoryColors[achievement.category]}`} />

        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-yellow-400 font-semibold uppercase tracking-wide">
                    Achievement Unlocked!
                  </p>
                  <h4 className="text-lg font-bold text-slate-100 mt-1">
                    {categoryIcons[achievement.category]} {achievement.name}
                  </h4>
                  <p className="text-sm text-slate-300 mt-1">
                    {achievement.description}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-300 transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
