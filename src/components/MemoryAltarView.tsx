import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, Flame, Heart, Clock, Mail, Image, CheckCircle, Info, ChevronRight, Lock } from 'lucide-react';
import { soundscape } from '../utils/audio';

export const MemoryAltarView: React.FC = () => {
  const { state, restoreMemoryToAltar, openModal, moveToLocation, triggerEnding } = useGame();
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(null);

  const restoredMemories = state.memories.filter(m => m.restored);
  const restoredCount = restoredMemories.length;
  const allRestored = restoredCount === 4;

  const handlePlaceOffering = (memId: string, itemId: string) => {
    const hasItem = state.inventory.some(i => i.id === itemId);
    if (!hasItem) {
      alert(`You must first locate the corresponding archival artifact in the library to place this offering.`);
      return;
    }
    restoreMemoryToAltar(memId);
  };

  const selectedMemory = state.memories.find(m => m.id === selectedMemoryId) || state.memories[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Altar Header & Remembrance Banner */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-mono text-amber-400 mb-2">
          <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span>LA OFRENDA DE LA BIBLIOTECA · SACRED COMMEMORATION ALCOVE</span>
        </div>
        <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-stone-100 mb-2">
          The Día de los Muertos Memory Altar
        </h2>
        <p className="font-cormorant text-lg text-stone-300 italic max-w-2xl mx-auto">
          “In Mexican tradition, the departed die three deaths: when the breath leaves the body, when the casket closes, and when no one left on earth remembers their name. Here, we refuse the third death.”
        </p>

        {/* Progress & Cultural Quick Guide Button */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="text-xs font-mono text-stone-400">
            Sacred Offerings Restored: <span className="text-amber-400 font-bold">{restoredCount} of 4</span>
          </div>
          <span className="text-stone-700">·</span>
          <button
            onClick={() => openModal('cultural')}
            className="text-xs text-amber-400 hover:text-amber-300 underline underline-offset-4 flex items-center gap-1 cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Read Cultural Guide</span>
          </button>
        </div>
      </div>

      {/* Main Altar Visual Composition */}
      <div className="relative rounded-2xl overflow-hidden border border-amber-900/50 bg-[#0c0c10] shadow-2xl mb-10">
        {/* Dynamic Altar Background with Ambient Illumination */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden">
          <img
            src="/src/assets/images/memory_altar_ofrenda_1793091012513.jpg"
            alt="Día de los Muertos Sacred Memory Altar"
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover transition-all duration-1000 ${
              allRestored
                ? 'brightness-105 contrast-110 saturate-125'
                : restoredCount >= 2
                ? 'brightness-95 contrast-105'
                : 'brightness-75 contrast-100'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c10] via-[#0c0c10]/40 to-transparent" />

          {/* Candlelight Warmth Overlay */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
              allRestored ? 'opacity-40 bg-amber-500/20 mix-blend-color-dodge' : 'opacity-15'
            }`}
          />

          {/* Altar Status Banner */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-950/80 backdrop-blur-md px-5 py-3 rounded-xl border border-amber-800/40">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${allRestored ? 'bg-amber-500/20 text-amber-300' : 'bg-stone-800 text-stone-400'}`}>
                <Flame className={`w-5 h-5 ${allRestored ? 'text-amber-400 animate-pulse' : ''}`} />
              </div>
              <div>
                <div className="text-sm font-semibold text-stone-200">
                  {allRestored
                    ? 'The Altar Awakens: All Names Restored'
                    : `Memory Offering Tier (${restoredCount}/4 Placed)`}
                </div>
                <div className="text-xs text-stone-400">
                  {allRestored
                    ? 'The veil between past and present is restored with love and honour.'
                    : 'Place the missing historical artifacts from the library to kindle the candles.'}
                </div>
              </div>
            </div>

            {allRestored && (
              <button
                onClick={() => {
                  moveToLocation('chamber_of_echoes');
                }}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-semibold rounded-lg shadow-md transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span>Enter Chamber of Echoes</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* The 4 Sacred Offering Slots */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {state.memories.map((mem, idx) => {
          const hasAssociatedItem = state.inventory.some(i => i.id === mem.associatedItemId);
          const isSelected = selectedMemoryId === mem.id;

          return (
            <div
              key={mem.id}
              onClick={() => setSelectedMemoryId(mem.id)}
              className={`rounded-xl p-5 border transition-all cursor-pointer relative flex flex-col justify-between ${
                mem.restored
                  ? 'bg-amber-950/20 border-amber-600/60 shadow-lg shadow-amber-950/40'
                  : hasAssociatedItem
                  ? 'bg-stone-900/80 border-amber-500/40 hover:border-amber-400'
                  : 'bg-stone-950/60 border-stone-800/80 opacity-75'
              } ${isSelected ? 'ring-1 ring-amber-400' : ''}`}
            >
              <div>
                {/* Offering Tier Label */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500/90">
                    Tier 0{idx + 1} Offering
                  </span>
                  {mem.restored ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Honored</span>
                    </span>
                  ) : hasAssociatedItem ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 animate-pulse">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Ready to Place</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-stone-400">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Artifact Lost</span>
                    </span>
                  )}
                </div>

                {/* Offering Title */}
                <h3 className="font-cinzel text-lg font-bold text-stone-100 mb-1">
                  {mem.title}
                </h3>
                <div className="text-xs text-amber-300 font-cormorant italic mb-3">
                  {mem.personName} · {mem.year}
                </div>

                <p className="text-xs text-stone-400 line-clamp-3 mb-4 leading-relaxed">
                  {mem.description}
                </p>
              </div>

              {/* Action Button */}
              <div>
                {!mem.restored ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlaceOffering(mem.id, mem.associatedItemId);
                    }}
                    disabled={!hasAssociatedItem}
                    className={`w-full py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      hasAssociatedItem
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-md'
                        : 'bg-stone-800 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>{hasAssociatedItem ? 'Place Offering on Altar' : 'Find Artifact in Library'}</span>
                  </button>
                ) : (
                  <div className="py-2 px-3 bg-amber-950/40 border border-amber-800/40 rounded-lg text-center text-xs text-amber-300 font-medium">
                    Memory Restored to History
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Memory Chronicle Box */}
      {selectedMemory && (
        <div className="bg-[#101014] border border-stone-800 rounded-2xl p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {selectedMemory.image && (
              <div className="w-full lg:w-64 shrink-0 rounded-xl overflow-hidden border border-amber-900/60 shadow-xl bg-stone-900">
                <img
                  src={selectedMemory.image}
                  alt={selectedMemory.personName}
                  referrerPolicy="no-referrer"
                  className="w-full aspect-square object-cover sepia-[0.3]"
                />
                <div className="p-3 text-center bg-stone-950 text-xs font-cormorant italic text-stone-400 border-t border-stone-800">
                  Archival Negative: Lucia Morales (1948)
                </div>
              </div>
            )}

            <div className="flex-1">
              <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
                Archival Chronicle · {selectedMemory.year}
              </div>
              <h3 className="font-cinzel text-2xl font-bold text-stone-100 mb-2">
                {selectedMemory.title}: {selectedMemory.personName}
              </h3>

              {/* Quote Block */}
              <blockquote className="my-4 py-3 px-4 bg-stone-950/80 rounded-xl border-l-2 border-amber-500 text-stone-300 font-cormorant italic text-lg leading-relaxed">
                “{selectedMemory.quote}”
              </blockquote>

              <p className="text-sm text-stone-300 leading-relaxed mb-6 font-sans">
                {selectedMemory.story}
              </p>

              {/* Status and Action */}
              <div className="flex items-center gap-4 flex-wrap">
                {selectedMemory.restored ? (
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded-lg">
                    <CheckCircle className="w-4 h-4" />
                    <span>Memory enshrined forever on the library ofrenda.</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handlePlaceOffering(selectedMemory.id, selectedMemory.associatedItemId)}
                    disabled={!state.inventory.some(i => i.id === selectedMemory.associatedItemId)}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-stone-950 font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Flame className="w-4 h-4" />
                    <span>Place This Sacred Offering</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
