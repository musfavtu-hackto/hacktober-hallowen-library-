import React from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, RotateCcw, BookOpen, CheckCircle, ShieldCheck, Download } from 'lucide-react';
import { EndingId } from '../types/game';

interface EndingScreenProps {
  onRestart: () => void;
}

export const EndingScreen: React.FC<EndingScreenProps> = ({ onRestart }) => {
  const { state } = useGame();

  const endingsMeta: Record<EndingId, { title: string; subtitle: string; badge: string; color: string }> = {
    forgotten: {
      title: "The Forgotten Ending",
      subtitle: "The Doors Relock with Silence",
      badge: "ENDING 1 OF 4",
      color: "text-stone-400 border-stone-700 bg-stone-900"
    },
    truth_revealed: {
      title: "The Truth Revealed",
      subtitle: "Lucia Morales Restored to the Living",
      badge: "ENDING 2 OF 4 · CANON TRIUMPH",
      color: "text-amber-400 border-amber-600 bg-amber-950/40"
    },
    eternal_archivist: {
      title: "The Eternal Archivist",
      subtitle: "The Keeper of the Unwritten Register",
      badge: "ENDING 3 OF 4 · GUARDIAN PATH",
      color: "text-amber-300 border-amber-500 bg-amber-950/50"
    },
    guardian_cempasuchil: {
      title: "The Guardian of the Cempasúchil",
      subtitle: "The Golden Bridge of Eternity",
      badge: "SECRET 4TH ENDING · TRANSCENDENCE",
      color: "text-amber-200 border-amber-400 bg-amber-950/60"
    }
  };

  const currentEnding = state.activeEnding ? endingsMeta[state.activeEnding] : endingsMeta.truth_revealed;
  const restoredCount = state.memories.filter(m => m.restored).length;

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="relative max-w-3xl w-full bg-[#0c0c12] border border-amber-900/60 rounded-3xl p-8 lg:p-12 shadow-2xl text-center overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-radial-gradient from-amber-500/10 via-transparent to-transparent pointer-events-none" />

        {/* Ending Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-4 border border-amber-500/40 text-amber-300 bg-amber-950/40">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{currentEnding.badge}</span>
        </div>

        {/* Ending Title */}
        <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-100 mb-2">
          {currentEnding.title}
        </h2>
        <p className="font-cormorant text-xl text-amber-300 italic mb-8">
          {currentEnding.subtitle}
        </p>

        {/* Epilogue Card */}
        <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-6 sm:p-8 mb-8 text-left">
          <div className="text-[11px] font-mono text-stone-400 uppercase tracking-widest mb-3 flex items-center justify-between">
            <span>Epilogue Narrative</span>
            <span>Recorded at Dawn, November 2</span>
          </div>

          <p className="font-cormorant text-lg sm:text-xl text-stone-200 leading-relaxed italic">
            “{state.epilogueText || "As the morning bells toll across the campus, the library returns to silence. But the memory of Lucia Morales is no longer lost."}”
          </p>
        </div>

        {/* Investigation Summary Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left mb-8">
          <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
            <span className="text-[10px] font-mono uppercase text-stone-400 block mb-1">Memories Restored</span>
            <span className="text-base font-bold text-amber-400 font-mono">{restoredCount} / 4</span>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
            <span className="text-[10px] font-mono uppercase text-stone-400 block mb-1">Clues Logged</span>
            <span className="text-base font-bold text-stone-200 font-mono">{state.clues.length}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
            <span className="text-[10px] font-mono uppercase text-stone-400 block mb-1">Investigation Turns</span>
            <span className="text-base font-bold text-stone-200 font-mono">{state.turnCount}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
            <span className="text-[10px] font-mono uppercase text-stone-400 block mb-1">Final Tension</span>
            <span className="text-base font-bold text-emerald-400 font-mono">{state.tension}%</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onRestart}
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-stone-950 font-semibold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Investigate Again (Try Another Path)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
