import React from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, Play, SkipForward, X, Clock, CheckCircle2, ChevronRight, Award } from 'lucide-react';

interface DemoRunnerModalProps {
  onClose: () => void;
}

export const DemoRunnerModal: React.FC<DemoRunnerModalProps> = ({ onClose }) => {
  const { demoStep, advanceDemo, stopDemo } = useGame();

  const stages = [
    {
      step: 1,
      time: "0:00 – 0:30",
      title: "The Midnight Strike & The Student's Name",
      description: "At 11:59 PM, you enter looking for your stolen notebook. As clocks freeze at 12:00, the Underwood typewriter types your name unassisted. The archive door appears.",
      actionPrompt: "Next: Advance to the Forbidden Stacks & question the ghost."
    },
    {
      step: 2,
      time: "0:30 – 1:15",
      title: "Discovery: Coded Letter & Ghost Dialogue",
      description: "You uncover Lucia's unmailed letter to Sofia and interrogate The Memory Keeper with natural language. Gemma 4 reveals Dewey Decimal 394.266.",
      actionPrompt: "Next: Crack Section 394 & awaken the Memory Altar."
    },
    {
      step: 3,
      time: "1:15 – 2:00",
      title: "Interaction: Cracking Dewey 394 & Unlocking Altar",
      description: "Dewey code 394.266 disengages the mechanical lock, revealing Lucia's preserved photograph from 1948. The doorway to the Día de los Muertos ofrenda unlocks.",
      actionPrompt: "Next: Restore all 4 sacred remembrance offerings."
    },
    {
      step: 4,
      time: "2:00 – 2:35",
      title: "Emotional Reveal: Healing the Erasure",
      description: "The 4 memory fragments (Photograph, Watch, Letter, Cempasúchil) are placed onto the ofrenda. Cold terror transforms into warm candlelight, honor, and deep emotional resonance.",
      actionPrompt: "Next: Enter the Final Chamber of Echoes & conclude the demo."
    },
    {
      step: 5,
      time: "2:35 – 3:00",
      title: "Final Reveal & Technical Provenance",
      description: "Lucia Morales is restored to history. The living archive displays your provenance log, confirming local Gemma 4 inference and authoritative deterministic boundaries.",
      actionPrompt: "Demo Complete! The judges have seen the full story arc."
    }
  ];

  const currentStage = stages.find(s => s.step === demoStep) || stages[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#0e0e14] border border-amber-600/70 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel text-lg font-bold text-stone-100">
                  3-Minute Live Hackathon Demo Sequencer
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                  Track 1
                </span>
              </div>
              <p className="text-xs text-stone-400 font-mono">
                Interactive Walkthrough for Hacktoberfest Judges
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopDemo();
              onClose();
            }}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicator bar */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          {stages.map(s => (
            <div
              key={s.step}
              className={`h-1.5 rounded-full transition-all ${
                demoStep >= s.step ? 'bg-amber-400' : 'bg-stone-800'
              }`}
            />
          ))}
        </div>

        {/* Current Stage Card */}
        <div className="bg-stone-950/80 border border-amber-900/40 rounded-xl p-5 mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-amber-400 font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Step {currentStage.step} of 5 ({currentStage.time})</span>
            </span>
            <span className="text-xs font-mono text-stone-400">Live Stage Execution</span>
          </div>

          <h4 className="font-cinzel text-xl font-bold text-stone-100">
            {currentStage.title}
          </h4>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
            {currentStage.description}
          </p>

          <div className="pt-2 text-xs font-cormorant italic text-amber-300/90">
            {currentStage.actionPrompt}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => {
              stopDemo();
              onClose();
            }}
            className="px-4 py-2 text-xs font-medium text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
          >
            Exit Demo Mode
          </button>

          {demoStep < 5 ? (
            <button
              onClick={advanceDemo}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-stone-950 font-semibold text-xs rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Advance to Next Beat</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                stopDemo();
                onClose();
              }}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-semibold text-xs rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Finish Demo & Explore Freely</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
