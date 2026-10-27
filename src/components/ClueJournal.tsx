import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { BookOpen, Search, Key, Sparkles, Clock, MapPin, Tag, CheckCircle } from 'lucide-react';

export const ClueJournal: React.FC = () => {
  const { state, updateNotes } = useGame();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'historical' | 'cipher' | 'personal' | 'ritual'>('all');

  const filteredClues = state.clues.filter(clue => {
    const matchesSearch =
      clue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clue.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clue.locationFound.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || clue.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Journal Title */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-amber-500 mb-1">
            Archival Dossier & Field Log
          </div>
          <h2 className="font-cinzel text-3xl font-bold text-stone-100">
            The Investigator's Journal
          </h2>
          <p className="font-cormorant text-stone-300 italic text-base">
            Documenting the erased history of Lucia Morales and the 1948 Expungement.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-xs text-stone-300 font-mono">
            Discovered Clues: <span className="text-amber-400 font-bold">{state.clues.length}</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-xs text-stone-300 font-mono">
            Artifacts: <span className="text-amber-400 font-bold">{state.inventory.length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Search & Clues List */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Search Bar & Category Filters (Buttons / Tabs) */}
          <div className="bg-[#0e0e14] border border-stone-800 rounded-xl p-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search clues, locations, dates, or keywords..."
                className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-lg pl-9 pr-4 py-2 text-xs sm:text-sm text-stone-200 placeholder:text-stone-400 focus:outline-none"
              />
            </div>

            {/* Segmented Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', label: 'All Clues' },
                { id: 'historical', label: 'Historical' },
                { id: 'cipher', label: 'Ciphers' },
                { id: 'personal', label: 'Personal Letters' },
                { id: 'ritual', label: 'Remembrance' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    categoryFilter === cat.id
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                      : 'text-stone-400 hover:text-stone-200 bg-stone-900/60 border border-transparent'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clues Cards */}
          <div className="space-y-3">
            {filteredClues.length === 0 ? (
              <div className="p-8 text-center bg-[#0e0e14] border border-stone-800 rounded-xl text-stone-400 text-xs">
                No recorded clues match your query. Explore more reading rooms or examine bookshelves.
              </div>
            ) : (
              filteredClues.map(clue => (
                <div
                  key={clue.id}
                  className="bg-[#0e0e14] border border-stone-800/90 rounded-xl p-5 hover:border-amber-700/50 transition-all shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-500/90">
                      [{clue.category.toUpperCase()}]
                    </span>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-stone-400">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      <span>{clue.locationFound}</span>
                      <span aria-hidden="true">·</span>
                      <Clock className="w-3 h-3 text-stone-400" />
                      <span>{clue.timestamp}</span>
                    </div>
                  </div>

                  <h3 className="font-cinzel text-base font-bold text-stone-100 mb-2">
                    {clue.title}
                  </h3>

                  <p className="text-xs text-stone-300 leading-relaxed font-sans">
                    {clue.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Inventory & Personal Investigator Notes */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Inventory Pocket */}
          <div className="bg-[#0e0e14] border border-stone-800 rounded-2xl p-5">
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
              <Key className="w-3.5 h-3.5" />
              <span>Recovered Archival Items</span>
            </div>

            {state.inventory.length === 0 ? (
              <p className="text-xs text-stone-400 italic">No artifacts collected yet.</p>
            ) : (
              <div className="space-y-2.5">
                {state.inventory.map(item => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg bg-stone-900/80 border border-stone-800 text-xs space-y-1"
                  >
                    <div className="font-semibold text-stone-200 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>{item.name}</span>
                      </div>
                      {item.isMemoryOffering && (
                        <span className="text-[10px] text-amber-400 font-mono">Altar Item</span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-400 leading-normal">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Personal Investigator Notes Notebook */}
          <div className="bg-[#0e0e14] border border-stone-800 rounded-2xl p-5 flex-1 flex flex-col">
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Investigator Field Notes</span>
            </div>
            <p className="text-xs text-stone-400 mb-3">
              Jot down observations, hypotheses, and Dewey decimal combinations. Auto-saved in your archive session.
            </p>
            <textarea
              value={state.notes}
              onChange={e => updateNotes(e.target.value)}
              placeholder="e.g. Dewey 394.266 = Customs of Remembrance. Lucia was born in 1922..."
              rows={8}
              className="w-full flex-1 bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-lg p-3 text-xs text-stone-200 font-mono placeholder:text-stone-400 focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
