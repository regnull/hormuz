'use client';

import { motion } from 'framer-motion';
import { Zap, Eye, Shield, HandshakeIcon, DollarSign, Brain } from 'lucide-react';
import { Option } from '@/types/turn';

const iconMap = {
  diplomatic: HandshakeIcon,
  military: Zap,
  covert: Eye,
  economic: DollarSign,
  intelligence: Brain,
};

const riskColors = {
  low: {
    border: 'border-green-500',
    bg: 'bg-green-500/10 hover:bg-green-500/20',
    badge: 'bg-green-500 text-white',
  },
  medium: {
    border: 'border-yellow-500',
    bg: 'bg-yellow-500/10 hover:bg-yellow-500/20',
    badge: 'bg-yellow-500 text-black',
  },
  high: {
    border: 'border-orange-500',
    bg: 'bg-orange-500/10 hover:bg-orange-500/20',
    badge: 'bg-orange-500 text-white',
  },
  critical: {
    border: 'border-red-500',
    bg: 'bg-red-500/10 hover:bg-red-500/20',
    badge: 'bg-red-500 text-white',
  },
};

interface ChoiceCardProps {
  option: Option;
  onClick: () => void;
  disabled?: boolean;
}

export function ChoiceCard({ option, onClick, disabled = false }: ChoiceCardProps) {
  const Icon = iconMap[option.type];
  const colors = riskColors[option.risk];

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`
        p-6 rounded-lg border-2 text-left transition-all
        ${colors.border} ${colors.bg}
        disabled:opacity-50 disabled:cursor-not-allowed
        shadow-lg hover:shadow-xl
        relative overflow-hidden
      `}
    >
      {/* Subtle glow effect */}
      <div className={`absolute inset-0 ${colors.bg} opacity-0 hover:opacity-100 transition-opacity duration-300`} />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 flex-shrink-0" />
            <h3 className="font-bold text-lg text-slate-100">{option.label}</h3>
          </div>

          <span className={`text-xs px-2 py-1 rounded uppercase font-semibold ${colors.badge}`}>
            {option.risk} risk
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-300 whitespace-pre-line mb-3 leading-relaxed">
          {option.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wide text-slate-400">
            {option.type} option
          </span>
        </div>
      </div>
    </motion.button>
  );
}
