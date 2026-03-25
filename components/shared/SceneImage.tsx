'use client';

import { Mood } from '@/types/turn';

interface SceneImageProps {
  scene: string;
  mood: Mood;
  className?: string;
  generatedImageUrl?: string; // AI-generated image URL
}

const moodFilters = {
  calm: 'brightness-100 saturate-100',
  tense: 'brightness-90 saturate-110 contrast-105',
  crisis: 'brightness-75 saturate-120 contrast-110 hue-rotate-[-5deg]',
  war: 'brightness-60 saturate-150 contrast-115 hue-rotate-[-10deg] sepia-[0.2]',
};

const sceneGradients = {
  'situation-room': 'from-slate-900 via-blue-900/20 to-slate-900',
  'war-room': 'from-slate-900 via-red-900/20 to-slate-900',
  'diplomatic-summit': 'from-slate-900 via-emerald-900/20 to-slate-900',
  'carrier-ops': 'from-slate-900 via-cyan-900/20 to-slate-900',
  'missile-launch': 'from-red-950 via-orange-900/30 to-slate-900',
  'un-security-council': 'from-slate-900 via-blue-800/20 to-slate-900',
  'oil-tanker': 'from-slate-900 via-amber-900/20 to-slate-900',
  'regional-map': 'from-slate-900 via-purple-900/20 to-slate-900',
  'celebration': 'from-slate-900 via-green-800/30 to-slate-900',
  'disaster': 'from-red-950 via-red-900/40 to-black',
};

export function SceneImage({ scene, mood, className = '', generatedImageUrl }: SceneImageProps) {
  const gradient = sceneGradients[scene as keyof typeof sceneGradients] || sceneGradients['situation-room'];
  const filter = moodFilters[mood];

  return (
    <div className={`absolute inset-0 -z-10 ${className}`}>
      {/* AI-generated image or gradient background */}
      {generatedImageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${generatedImageUrl})` }}
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      )}

      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Mood filter */}
      <div className={`absolute inset-0 ${filter} transition-all duration-1000`} />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60" />

      {/* Scanlines effect (subtle) */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 2px)',
        }}
      />
    </div>
  );
}
