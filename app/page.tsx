import Link from "next/link";
import { Shield } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Logo/Title */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <Shield className="w-20 h-20 text-blue-500" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            HORMUZ
          </h1>
          <p className="text-xl text-slate-400">
            Geopolitical Crisis Simulation
          </p>
        </div>

        {/* Description */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6 space-y-3">
          <p className="text-slate-300">
            You are the President of the United States.
          </p>
          <p className="text-slate-300">
            Intelligence confirms Iran is weeks away from nuclear breakout capability.
            Israel is preparing to strike. The region stands on the brink of war.
          </p>
          <p className="text-slate-200 font-semibold">
            Every decision has consequences. Can you navigate the crisis?
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/game"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-lg transition-colors"
          >
            New Game
          </Link>
          <button
            disabled
            className="px-8 py-4 bg-slate-700 text-slate-500 rounded-lg font-semibold text-lg cursor-not-allowed"
          >
            Continue (Coming Soon)
          </button>
        </div>

        {/* Footer */}
        <p className="text-sm text-slate-500">
          A realistic turn-based strategy game • 20-40 minutes
        </p>
      </div>
    </main>
  );
}
