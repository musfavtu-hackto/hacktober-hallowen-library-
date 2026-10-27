import React from 'react';
import { useGame } from '../context/GameContext';
import { BookOpen, Sparkles, Compass, History, Volume2, ShieldAlert } from 'lucide-react';

interface TitleScreenProps {
  onStart: () => void;
  onContinue: () => void;
  onOpenRecords: () => void;
  onOpenCultural: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStart,
  onContinue,
  onOpenRecords,
  onOpenCultural
}) => {
  const { state, startDemo, loadGame } = useGame();
  const hasSavedState = typeof window !== 'undefined' && Boolean(localStorage.getItem('haunted_library_save_state_v1'));

  return (
    <div className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-4 py-12">
      {/* Background Cinematic Image with Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/haunted_library_hall_1793091011573.jpg"
          alt="Ancient Haunted Gothic Library"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter brightness-[0.38] contrast-125 scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/75 to-[#08080a]/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/20 via-transparent to-[#08080a]/90" />
      </div>

      {/* Atmospheric floating dust & petal styling */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Date Stamp & Setting */}
        <div className="mb-4 inline-flex items-center gap-3 text-xs tracking-[0.25em] text-amber-400/90 font-mono uppercase">
          <span>NOVEMBER 2 · 12:00:00 AM</span>
          <span aria-hidden="true" className="text-stone-600">|</span>
          <span>UNIVERSITY SECRET ARCHIVE</span>
          <span aria-hidden="true" className="text-stone-600">|</span>
          <span>DÍA DE LOS MUERTOS</span>
        </div>

        {/* Main Title */}
        <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-stone-100 via-amber-100 to-amber-300/80 tracking-tight leading-[1.1] mb-3 text-balance drop-shadow-lg">
          THE HAUNTED LIBRARY FILES
        </h1>

        {/* Subtitle */}
        <p className="font-cormorant italic text-2xl sm:text-3xl text-amber-300/90 mb-4 tracking-wide">
          Whispers Beyond November 2
        </p>

        {/* Tagline */}
        <div className="max-w-xl mx-auto mb-10">
          <p className="font-cormorant text-lg sm:text-xl text-stone-300 italic">
            “Some memories refuse to stay buried.”
          </p>
          <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mt-4" />
        </div>

        {/* Action Buttons Matrix */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md sm:max-w-2xl mb-8">
          <button
            onClick={onStart}
            className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-semibold text-sm rounded-lg shadow-lg hover:shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <BookOpen className="w-4 h-4 text-stone-950" />
            <span>ENTER THE ARCHIVE</span>
          </button>

          {hasSavedState && (
            <button
              onClick={() => {
                if (loadGame()) onContinue();
              }}
              className="w-full sm:w-auto px-6 py-3.5 bg-stone-900/90 hover:bg-stone-800 text-stone-200 border border-stone-700/80 hover:border-amber-500/40 text-sm font-medium rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <History className="w-4 h-4 text-amber-400" />
              <span>CONTINUE INVESTIGATION</span>
            </button>
          )}

          <button
            onClick={onOpenRecords}
            className="w-full sm:w-auto px-6 py-3.5 bg-stone-900/80 hover:bg-stone-800 text-stone-300 border border-stone-800 hover:border-stone-700 text-sm font-medium rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Compass className="w-4 h-4 text-stone-400" />
            <span>THE LOST RECORDS</span>
          </button>

          <button
            onClick={onOpenCultural}
            className="w-full sm:w-auto px-6 py-3.5 bg-stone-900/80 hover:bg-stone-800 text-stone-300 border border-stone-800 hover:border-amber-600/30 text-sm font-medium rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>ABOUT THE MEMORY TRADITION</span>
          </button>
        </div>

        {/* 3-Minute Demo Quick-Action for Hackathon Evaluators */}
        <div className="bg-stone-950/70 border border-amber-900/40 rounded-xl p-4 max-w-xl text-left w-full">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-amber-400 font-mono font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hacktoberfest 2026 Judge Demo</span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Run the curated 3-minute demonstration sequence showcasing Gemma 4, local AI fallback, and memory restoration.
              </p>
            </div>
            <button
              onClick={startDemo}
              className="px-3.5 py-2 text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/50 rounded-lg transition-all cursor-pointer shrink-0"
            >
              Launch Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
