import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { X, Lock, Unlock, HelpCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface PuzzleModalProps {
  puzzleType: 'dewey' | 'safe';
  onClose: () => void;
}

export const PuzzleModal: React.FC<PuzzleModalProps> = ({ puzzleType, onClose }) => {
  const { solvePuzzle, state } = useGame();
  const [inputVal, setInputVal] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(
    puzzleType === 'dewey' ? state.solvedPuzzles.deweyLock : state.solvedPuzzles.basementSafe
  );

  const isDewey = puzzleType === 'dewey';

  const title = isDewey
    ? 'Dewey Decimal Lock: Section 394'
    : 'Foundation Vault Safe of 1948';

  const hint = isDewey
    ? 'HINT: Look at the typewritten call slip retrieved from the Underwood typewriter or think of the Dewey classification for Customs & Folklore (394 or 394.266).'
    : 'HINT: Inscribed above the brass dial: "The year of birth of she who guarded our names." (Lucia Morales was born in 1922).';

  const handleAttempt = () => {
    setErrorMsg('');
    const solved = solvePuzzle(puzzleType, inputVal);
    if (solved) {
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1400);
    } else {
      setErrorMsg('The tumblers click rigidly. Incorrect code.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#0e0e14] border border-amber-900/60 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isSuccess ? 'bg-emerald-950/60 text-emerald-400' : 'bg-amber-950/60 text-amber-400'}`}>
              {isSuccess ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-cinzel text-lg font-bold text-stone-100">{title}</h3>
              <p className="text-xs text-stone-400 font-mono">
                Authoritative Mechanized Lock Validator
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Puzzle Body */}
        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-cinzel text-xl font-bold text-emerald-300">
              Mechanism Unlocked!
            </h4>
            <p className="text-xs text-stone-300 font-cormorant italic max-w-sm mx-auto">
              {isDewey
                ? 'Section 394 swings outward. The forgotten photograph of Lucia Morales is recovered.'
                : 'The heavy steel pins retract. The master foundation register of 1948 is in your hands.'}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-xs text-stone-300 mb-4 leading-relaxed font-sans">
              Enter the classification code or security sequence to disengage the mechanical pins.
            </p>

            {/* Input Dial */}
            <div className="space-y-4 mb-6">
              <input
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAttempt()}
                placeholder={isDewey ? "e.g. 394 or 394.266" : "e.g. 1922"}
                className="w-full text-center tracking-[0.2em] font-mono text-xl py-3 px-4 bg-stone-950 border border-stone-700 focus:border-amber-500 rounded-lg text-amber-200 placeholder:text-stone-400 placeholder:tracking-normal focus:outline-none"
              />

              {errorMsg && (
                <div className="text-xs text-red-400 font-mono text-center">
                  {errorMsg}
                </div>
              )}

              {/* Number Buttons Helper for Touch / Click */}
              <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'].map(k => (
                  <button
                    key={k}
                    onClick={() => {
                      if (k === '⌫') setInputVal(prev => prev.slice(0, -1));
                      else setInputVal(prev => prev + k);
                    }}
                    className="py-2.5 rounded bg-stone-900 hover:bg-stone-800 text-stone-200 font-mono text-sm border border-stone-800 hover:border-amber-700/50 transition-colors cursor-pointer"
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>

            {/* Hint Box */}
            <div className="bg-stone-950/70 border border-stone-800/80 rounded-lg p-3 text-xs text-stone-400 mb-6 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>{hint}</span>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleAttempt}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-stone-950 font-semibold text-xs rounded-lg shadow-md transition-all cursor-pointer"
            >
              Disengage Tumblers
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
