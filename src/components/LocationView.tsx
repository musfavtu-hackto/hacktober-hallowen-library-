import React from 'react';
import { useGame } from '../context/GameContext';
import {
  Compass,
  Key,
  Lock,
  Search,
  MessageSquare,
  Sparkles,
  Flame,
  ArrowRight,
  BookOpen,
  AlertTriangle,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { LocationId } from '../types/game';

interface LocationViewProps {
  onOpenGhost: () => void;
  onOpenAltar: () => void;
  onOpenJournal: () => void;
}

export const LocationView: React.FC<LocationViewProps> = ({
  onOpenGhost,
  onOpenAltar,
  onOpenJournal
}) => {
  const {
    state,
    currentLocation,
    activeNarrative,
    narrativeLoading,
    moveToLocation,
    inspectHotspot,
    triggerEnding
  } = useGame();

  const handleExitClick = (targetId: LocationId, lockReq?: string) => {
    if (lockReq) {
      if (lockReq === 'brass_key' && !state.inventory.some(i => i.id === 'brass_key')) {
        alert("The heavy iron grate is locked. You need the Archivist's Brass Key (1948) from the Reading Hall.");
        return;
      }
      if (lockReq === 'altar_complete' && !state.memories.every(m => m.restored)) {
        alert("The Chamber of Echoes remains closed. The spirits require all 4 remembrance offerings to be placed on the altar first.");
        return;
      }
      if (lockReq === 'basement_safe' && !state.solvedPuzzles.basementSafe) {
        alert("The passage ahead is sealed behind the Foundation Vault. You must crack the safe combination first.");
        return;
      }
    }
    moveToLocation(targetId);
  };

  const restoredCount = state.memories.filter(m => m.restored).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Investigation HUD Ribbon */}
      <div className="bg-[#0e0e12] border border-stone-800 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        {/* Location & Time Stamp */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-900/60 text-amber-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-cinzel text-lg font-bold text-stone-100">
                {currentLocation.name}
              </h2>
              <span className="text-stone-600">·</span>
              <span className="text-xs font-mono text-amber-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{state.timeString}</span>
              </span>
            </div>
            <p className="text-xs text-stone-400 font-cormorant italic">
              {currentLocation.subtitle}
            </p>
          </div>
        </div>

        {/* Tension / Fear Meter & Quick Stats */}
        <div className="flex items-center gap-6">
          {/* Tension / Psychological Fear */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5 text-xs text-stone-300 font-mono mb-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              <span>Tension Level:</span>
              <span className={`font-bold ${state.tension > 60 ? 'text-red-400' : state.tension > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {state.tension}%
              </span>
            </div>
            <div className="w-32 sm:w-44 h-1.5 bg-stone-900 rounded-full overflow-hidden border border-stone-800">
              <div
                className={`h-full transition-all duration-500 ${
                  state.tension > 60 ? 'bg-red-500' : state.tension > 30 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.max(5, state.tension)}%` }}
              />
            </div>
          </div>

          {/* Quick Action: Ghost Interrogation */}
          <button
            onClick={onOpenGhost}
            className="px-3 py-2 bg-stone-900 hover:bg-stone-800 border border-amber-900/60 text-amber-300 hover:text-amber-200 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Ask</span>
            <span>Memory Keeper</span>
          </button>
        </div>
      </div>

      {/* Main Location Canvas & Narrative Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Left Column: Atmospheric Room Scene */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-[#09090c] shadow-2xl group">
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <img
                src={currentLocation.image}
                alt={currentLocation.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover brightness-90 group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090c] via-transparent to-black/20" />

              {/* Marigold Petals Atmospheric Shimmer */}
              <div className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 text-[11px] font-mono text-amber-300/90 bg-stone-950/70 backdrop-blur-sm px-2.5 py-1 rounded-md border border-amber-900/40">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Cempasúchil petals drift upon the stone</span>
              </div>
            </div>
          </div>

          {/* Room Exits / Navigation */}
          <div className="bg-[#0e0e12] border border-stone-800 rounded-xl p-4">
            <div className="text-xs font-mono uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Passages & Thresholds</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentLocation.exits.map(exit => {
                const isLocked = exit.lockRequirement && (
                  (exit.lockRequirement === 'brass_key' && !state.inventory.some(i => i.id === 'brass_key')) ||
                  (exit.lockRequirement === 'altar_complete' && !state.memories.every(m => m.restored)) ||
                  (exit.lockRequirement === 'basement_safe' && !state.solvedPuzzles.basementSafe)
                );

                return (
                  <button
                    key={exit.targetId}
                    onClick={() => handleExitClick(exit.targetId, exit.lockRequirement)}
                    className={`py-2.5 px-3.5 rounded-lg text-xs font-medium text-left transition-all flex items-center justify-between gap-2 border cursor-pointer ${
                      isLocked
                        ? 'bg-stone-950/60 border-stone-800/80 text-stone-400 hover:border-red-900/50'
                        : 'bg-stone-900/90 hover:bg-stone-800 border-stone-700/80 hover:border-amber-500/50 text-stone-200'
                    }`}
                  >
                    <span className="truncate">{exit.label}</span>
                    {isLocked ? (
                      <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Gemma 4 Adaptive Narrative & Interactive Hotspots */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Adaptive Story Narrative Box */}
          <div className="bg-[#101015] border border-amber-900/40 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>The Living Archive</span>
                </span>
                {narrativeLoading && (
                  <span className="text-[10px] text-amber-400 font-mono animate-pulse">
                    Gemma 4 weavings...
                  </span>
                )}
              </div>

              {/* Story Narrative Text */}
              <div className="font-cormorant text-lg text-stone-200 leading-relaxed italic mb-4 min-h-[90px]">
                {activeNarrative}
              </div>
            </div>

            {/* Provenance Stamp */}
            <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px] font-mono text-stone-400">
              <span>Source: Authoritative Gemma 4 / Canon</span>
              <span>Turn #{state.turnCount}</span>
            </div>
          </div>

          {/* Interactive Investigation Hotspots in this Room */}
          <div className="bg-[#0e0e12] border border-stone-800 rounded-2xl p-5 flex-1">
            <div className="text-xs font-mono uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span>Points of Investigation</span>
            </div>

            <div className="space-y-2.5">
              {currentLocation.hotspots.map(spot => {
                const hasInspected = state.inspectedObjects.includes(spot.id);
                return (
                  <button
                    key={spot.id}
                    onClick={() => inspectHotspot(spot)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-start justify-between gap-3 cursor-pointer ${
                      hasInspected
                        ? 'bg-stone-900/50 border-stone-800/80 hover:border-stone-700 text-stone-300'
                        : 'bg-stone-900/90 border-amber-900/50 hover:border-amber-500/60 text-stone-100 hover:bg-stone-800'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold text-stone-200 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>{spot.name}</span>
                      </div>
                      <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
                        {spot.inspectText}
                      </p>
                    </div>

                    <span className="text-[10px] uppercase font-mono tracking-wider text-amber-500 shrink-0 pt-0.5">
                      {hasInspected ? 'Examine' : 'Investigate'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Special Final Chamber Conclusion Triggers (if in Chamber of Echoes) */}
      {currentLocation.id === 'chamber_of_echoes' && (
        <div className="bg-gradient-to-r from-amber-950/40 via-stone-900 to-amber-950/40 border border-amber-700/60 rounded-2xl p-6 text-center my-6">
          <div className="max-w-2xl mx-auto">
            <h3 className="font-cinzel text-2xl font-bold text-amber-200 mb-2">
              The Hour of Choosing has Arrived
            </h3>
            <p className="font-cormorant text-stone-300 italic mb-6">
              Lucia Morales and the ancestral spirits stand before you in the warm amber glow. The university bells prepare to ring 6:00 AM. How will you answer the archive?
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => triggerEnding('truth_revealed')}
                className="py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-stone-950 text-xs font-semibold rounded-lg shadow-md transition-all cursor-pointer"
              >
                Restore Lucia's Name & Leave Truth to the Living
              </button>

              <button
                onClick={() => triggerEnding('eternal_archivist')}
                className="py-3 px-4 bg-stone-900 hover:bg-stone-800 border border-amber-600/50 text-amber-300 text-xs font-semibold rounded-lg transition-all cursor-pointer"
              >
                Remain as the Eternal Archivist of Forgotten Souls
              </button>

              <button
                onClick={() => triggerEnding('forgotten')}
                className="py-3 px-4 bg-stone-950 hover:bg-stone-900 border border-stone-800 text-stone-400 text-xs font-semibold rounded-lg transition-all cursor-pointer"
              >
                Flee with Your Notebook and Lock the Heavy Oak Doors
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Access Inventory Bar at bottom of screen */}
      <div className="bg-[#0b0b0e] border border-stone-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono uppercase text-stone-400">
            Archival Inventory ({state.inventory.length} artifacts):
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap flex-1 justify-end">
          {state.inventory.length === 0 ? (
            <span className="text-xs text-stone-400 italic">No items gathered yet. Search the reading tables and stacks.</span>
          ) : (
            state.inventory.map(item => (
              <div
                key={item.id}
                title={item.description}
                className="px-2.5 py-1 rounded bg-stone-900 border border-stone-700/80 text-xs text-stone-200 flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{item.name}</span>
                {item.isMemoryOffering && (
                  <span className="text-[10px] text-amber-400 font-mono">(Altar Offering)</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
