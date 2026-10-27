import React from 'react';
import { useGame } from '../context/GameContext';
import { Volume2, VolumeX, Sparkles, BookOpen, Compass, Cpu } from 'lucide-react';

interface TopBarProps {
  currentTab: 'archive' | 'altar' | 'journal' | 'cultural' | 'tech';
  setCurrentTab: (tab: 'archive' | 'altar' | 'journal' | 'cultural' | 'tech') => void;
}

export const TopBar: React.FC<TopBarProps> = ({ currentTab, setCurrentTab }) => {
  const { state, toggleSound, startDemo, openModal } = useGame();

  const restoredCount = state.memories.filter(m => m.restored).length;

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0d]/90 backdrop-blur-md border-b border-stone-800/80 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setCurrentTab('archive')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <div className="font-cinzel text-base lg:text-lg font-bold tracking-wider text-amber-100 group-hover:text-amber-400 transition-colors whitespace-nowrap">
              THE HAUNTED LIBRARY FILES
            </div>
            <div className="text-[11px] font-cormorant italic text-stone-400 tracking-wide hidden sm:block">
              Whispers Beyond November 2 · 1948 Archive
            </div>
          </button>
        </div>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-300">
          <button
            onClick={() => setCurrentTab('archive')}
            className={`cursor-pointer whitespace-nowrap transition-colors pb-0.5 hover:text-amber-300 ${
              currentTab === 'archive'
                ? 'text-amber-400 border-b-2 border-amber-500 font-semibold'
                : 'text-stone-400'
            }`}
          >
            The Archive
          </button>

          <button
            onClick={() => setCurrentTab('altar')}
            className={`cursor-pointer whitespace-nowrap transition-colors pb-0.5 hover:text-amber-300 flex items-center gap-1.5 ${
              currentTab === 'altar'
                ? 'text-amber-400 border-b-2 border-amber-500 font-semibold'
                : 'text-stone-400'
            }`}
          >
            <span>Memory Altar</span>
            <span className="text-[10px] text-amber-500/90 font-mono">
              ({restoredCount}/4)
            </span>
          </button>

          <button
            onClick={() => setCurrentTab('journal')}
            className={`cursor-pointer whitespace-nowrap transition-colors pb-0.5 hover:text-amber-300 flex items-center gap-1.5 ${
              currentTab === 'journal'
                ? 'text-amber-400 border-b-2 border-amber-500 font-semibold'
                : 'text-stone-400'
            }`}
          >
            <span>Clue Journal</span>
            <span className="text-[10px] text-stone-400 font-mono">
              ({state.clues.length})
            </span>
          </button>

          <button
            onClick={() => setCurrentTab('cultural')}
            className={`cursor-pointer whitespace-nowrap transition-colors pb-0.5 hover:text-amber-300 ${
              currentTab === 'cultural'
                ? 'text-amber-400 border-b-2 border-amber-500 font-semibold'
                : 'text-stone-400'
            }`}
          >
            Día de Muertos
          </button>

          <button
            onClick={() => setCurrentTab('tech')}
            className={`cursor-pointer whitespace-nowrap transition-colors pb-0.5 hover:text-amber-300 flex items-center gap-1.5 ${
              currentTab === 'tech'
                ? 'text-amber-400 border-b-2 border-amber-500 font-semibold'
                : 'text-stone-400'
            }`}
          >
            <span>Gemma 4 & Architecture</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Utility Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={state.soundEnabled ? "Mute Atmospheric Soundscape" : "Enable Soundscape (Web Audio)"}
            className="p-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-amber-300 hover:border-amber-700/50 transition-colors cursor-pointer"
            aria-label="Sound Toggle"
          >
            {state.soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* AI Diagnostics Drawer Toggle */}
          <button
            onClick={() => openModal('diagnostics')}
            className="p-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-amber-300 hover:border-amber-700/50 transition-colors cursor-pointer"
            title="Inspect Gemma 4 & Story Provenance"
            aria-label="AI Diagnostics"
          >
            <Cpu className="w-4 h-4" />
          </button>

          {/* Primary Action Button */}
          <button
            onClick={startDemo}
            className="px-3.5 py-1.5 text-xs font-semibold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-stone-950" />
            <span>3-Min Demo</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Row */}
      <div className="md:hidden flex items-center justify-between gap-2 pt-2.5 mt-2 border-t border-stone-800/60 text-xs overflow-x-auto pb-1">
        <button
          onClick={() => setCurrentTab('archive')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'archive' ? 'bg-amber-950/60 text-amber-300' : 'text-stone-400'}`}
        >
          Archive
        </button>
        <button
          onClick={() => setCurrentTab('altar')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'altar' ? 'bg-amber-950/60 text-amber-300' : 'text-stone-400'}`}
        >
          Altar ({restoredCount}/4)
        </button>
        <button
          onClick={() => setCurrentTab('journal')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'journal' ? 'bg-amber-950/60 text-amber-300' : 'text-stone-400'}`}
        >
          Journal ({state.clues.length})
        </button>
        <button
          onClick={() => setCurrentTab('cultural')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'cultural' ? 'bg-amber-950/60 text-amber-300' : 'text-stone-400'}`}
        >
          Traditions
        </button>
        <button
          onClick={() => setCurrentTab('tech')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'tech' ? 'bg-amber-950/60 text-amber-300' : 'text-stone-400'}`}
        >
          AI & Code
        </button>
      </div>
    </header>
  );
};
