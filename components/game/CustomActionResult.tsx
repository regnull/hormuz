'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, X } from 'lucide-react';

interface CustomActionResultProps {
  success: boolean;
  message: string;
  onClose: () => void;
}

export function CustomActionResult({ success, message, onClose }: CustomActionResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={`max-w-2xl w-full rounded-lg border-2 p-6 ${
          success
            ? 'bg-slate-900 border-blue-500'
            : 'bg-slate-900 border-red-500'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {success ? (
              <CheckCircle2 className="w-6 h-6 text-blue-400" />
            ) : (
              <XCircle className="w-6 h-6 text-red-400" />
            )}
            <h3 className="text-xl font-bold text-slate-100">
              {success ? 'Action Executed' : 'Action Not Feasible'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message */}
        <div className={`rounded-lg p-4 mb-4 ${
          success ? 'bg-blue-500/10' : 'bg-red-500/10'
        }`}>
          <div className="prose prose-invert prose-slate max-w-none">
            <p className="text-slate-200 whitespace-pre-line leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              success
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            }`}
          >
            {success ? 'Continue' : 'Try Again'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
