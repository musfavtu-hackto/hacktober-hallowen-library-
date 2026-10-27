import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { TopBar } from './components/TopBar';
import { TitleScreen } from './components/TitleScreen';
import { LocationView } from './components/LocationView';
import { MemoryAltarView } from './components/MemoryAltarView';
import { ClueJournal } from './components/ClueJournal';
import { CulturalGuide } from './components/CulturalGuide';
import { TechArchitecture } from './components/TechArchitecture';
import { GhostInterrogationModal } from './components/GhostInterrogationModal';
import { PuzzleModal } from './components/PuzzleModal';
import { DemoRunnerModal } from './components/DemoRunnerModal';
import { EndingScreen } from './components/EndingScreen';

const MainAppContent: React.FC = () => {
  const { state, activeModal, openModal, closeModal, resetGame } = useGame();
  const [currentTab, setCurrentTab] = useState<'archive' | 'altar' | 'journal' | 'cultural' | 'tech'>('archive');
  const [hasStarted, setHasStarted] = useState<boolean>(() => {
    // If there is active investigation already in state, player can resume
    return state.turnCount > 0;
  });

  const handleStart = () => {
    setHasStarted(true);
    setCurrentTab('archive');
  };

  const handleContinue = () => {
    setHasStarted(true);
    setCurrentTab('archive');
  };

  const handleOpenRecords = () => {
    setHasStarted(true);
    setCurrentTab('journal');
  };

  const handleOpenCultural = () => {
    setCurrentTab('cultural');
    setHasStarted(true);
  };

  const handleRestart = () => {
    resetGame();
    setHasStarted(false);
    setCurrentTab('archive');
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-stone-200 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Bar Navigation */}
      <TopBar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (!hasStarted) setHasStarted(true);
          setCurrentTab(tab);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {state.activeEnding ? (
          <EndingScreen onRestart={handleRestart} />
        ) : !hasStarted ? (
          <TitleScreen
            onStart={handleStart}
            onContinue={handleContinue}
            onOpenRecords={handleOpenRecords}
            onOpenCultural={handleOpenCultural}
          />
        ) : (
          <div>
            {currentTab === 'archive' && (
              <LocationView
                onOpenGhost={() => openModal('ghost')}
                onOpenAltar={() => setCurrentTab('altar')}
                onOpenJournal={() => setCurrentTab('journal')}
              />
            )}
            {currentTab === 'altar' && <MemoryAltarView />}
            {currentTab === 'journal' && <ClueJournal />}
            {currentTab === 'cultural' && <CulturalGuide />}
            {currentTab === 'tech' && <TechArchitecture />}
          </div>
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-stone-800/60 bg-[#070709] py-5 px-6 text-xs text-stone-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span>THE HAUNTED LIBRARY FILES · Hacktoberfest Hack Day 2026 (Track 1: Best Use of Gemma 4)</span>
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            <span>Día de los Muertos Remembrance</span>
            <span aria-hidden="true">·</span>
            <span>Local AI & Authoritative Game Core</span>
          </div>
        </div>
      </footer>

      {/* Modal Dialogs */}
      {activeModal === 'ghost' && (
        <GhostInterrogationModal onClose={closeModal} />
      )}

      {activeModal === 'puzzle_dewey' && (
        <PuzzleModal puzzleType="dewey" onClose={closeModal} />
      )}

      {activeModal === 'puzzle_safe' && (
        <PuzzleModal puzzleType="safe" onClose={closeModal} />
      )}

      {activeModal === 'demo_runner' && (
        <DemoRunnerModal onClose={closeModal} />
      )}

      {activeModal === 'diagnostics' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-[#0c0c10] border border-stone-800 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
              <h3 className="font-cinzel text-lg font-bold text-stone-100">AI Diagnostics & Engine Status</h3>
              <button
                onClick={closeModal}
                className="text-stone-400 hover:text-stone-200 text-xs px-2 py-1 rounded bg-stone-900 border border-stone-800"
              >
                Close
              </button>
            </div>
            <TechArchitecture />
          </div>
        </div>
      )}

      {activeModal === 'cultural' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-[#0c0c10] border border-amber-900/60 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
              <h3 className="font-cinzel text-lg font-bold text-amber-200">Día de los Muertos Traditions</h3>
              <button
                onClick={closeModal}
                className="text-stone-400 hover:text-stone-200 text-xs px-2 py-1 rounded bg-stone-900 border border-stone-800"
              >
                Close
              </button>
            </div>
            <CulturalGuide />
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <MainAppContent />
    </GameProvider>
  );
}
