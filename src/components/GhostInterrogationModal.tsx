import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { X, Send, Sparkles, MessageSquare, Volume2, User, BookOpen } from 'lucide-react';

interface GhostInterrogationModalProps {
  onClose: () => void;
}

interface Message {
  sender: 'player' | 'ghost';
  characterName: string;
  text: string;
  provenance?: string;
}

export const GhostInterrogationModal: React.FC<GhostInterrogationModalProps> = ({ onClose }) => {
  const { askGhostQuestion } = useGame();
  const [selectedChar, setSelectedChar] = useState<'keeper' | 'lucia' | 'scribe'>('keeper');
  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ghost',
      characterName: 'The Memory Keeper',
      text: "You step into the quiet between pages. Ask what you will of the silenced years, but know that every word spoken here leaves an imprint upon the archive.",
      provenance: 'deterministic_canon'
    }
  ]);

  const characters = [
    {
      id: 'keeper' as const,
      name: 'The Memory Keeper',
      role: 'Spirit of the Unwritten Register',
      description: 'Ancient, solemn, speaks in metaphors of binding, ink, and time.'
    },
    {
      id: 'lucia' as const,
      name: 'Lucia Morales (1948)',
      role: 'Expunged Head Archival Scholar',
      description: 'Resolute, scholarly, dedicated to ancestral remembrance and cultural truth.'
    },
    {
      id: 'scribe' as const,
      name: 'The Spectral Scribe',
      role: 'Student Guild Witness',
      description: 'Nervous, whispering catalog secrets and Dewey decimal lock numbers.'
    }
  ];

  const suggestions = [
    "Who erased you from the university in 1948?",
    "What is the secret of Dewey code 394.266?",
    "How do we awaken the Día de los Muertos altar?",
    "Why did every clock in the library stop at midnight?"
  ];

  const handleSend = async (questionText?: string) => {
    const q = questionText || inputQuestion;
    if (!q.trim() || loading) return;

    const charObj = characters.find(c => c.id === selectedChar)!;
    const playerMsg: Message = {
      sender: 'player',
      characterName: 'Alex Rivera',
      text: q
    };

    setMessages(prev => [...prev, playerMsg]);
    setInputQuestion('');
    setLoading(true);

    try {
      const result = await askGhostQuestion(selectedChar, q);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ghost',
          characterName: charObj.name,
          text: result.reply,
          provenance: result.provenance
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ghost',
          characterName: charObj.name,
          text: "The parchment trembles. The words dissolve into the mist before they can be read.",
          provenance: 'deterministic_canon'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-[#0c0c10] border border-amber-900/60 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-[#0e0e14]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-800/60 text-amber-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-lg font-bold text-stone-100">
                Ghost Interrogation Chamber
              </h3>
              <p className="text-xs text-stone-400 font-cormorant italic">
                Direct communion with historical entities powered by local Gemma 4
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

        {/* Character Selector Segmented Control */}
        <div className="flex items-center gap-2 p-3 bg-stone-950/60 border-b border-stone-800/80 overflow-x-auto">
          {characters.map(char => (
            <button
              key={char.id}
              onClick={() => setSelectedChar(char.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all text-left shrink-0 cursor-pointer border ${
                selectedChar === char.id
                  ? 'bg-amber-950/50 border-amber-600/70 text-amber-200 shadow-sm'
                  : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
              }`}
            >
              <div className="font-cinzel font-semibold">{char.name}</div>
              <div className="text-[10px] text-stone-400 font-sans truncate max-w-[170px]">
                {char.role}
              </div>
            </button>
          ))}
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-library-shadow">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.sender === 'player' ? 'items-end' : 'items-start'}`}
            >
              <div className="text-[11px] font-mono text-stone-400 mb-1 flex items-center gap-1.5">
                <span>{msg.characterName}</span>
                {msg.provenance && (
                  <span className="text-[10px] text-amber-500/80">
                    · [{msg.provenance === 'gemma_local' ? 'Gemma 4 Local' : msg.provenance === 'gemini_cloud' ? 'Gemini 2.5 Backup' : 'Story Canon'}]
                  </span>
                )}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.sender === 'player'
                    ? 'bg-stone-800 text-stone-100 border border-stone-700/80 rounded-br-sm'
                    : 'bg-stone-900/90 text-amber-100 border border-amber-900/50 rounded-bl-sm font-cormorant text-base italic'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 italic">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Gemma 4 is consulting the forgotten registry...</span>
            </div>
          )}
        </div>

        {/* Suggested Queries */}
        <div className="px-6 py-2.5 bg-stone-950/80 border-t border-stone-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-mono uppercase text-stone-400 shrink-0">Inquire:</span>
          {suggestions.map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSend(sug)}
              className="text-[11px] px-2.5 py-1 rounded bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-300 border border-stone-800 hover:border-amber-700/50 whitespace-nowrap transition-colors cursor-pointer"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#0e0e14] border-t border-stone-800 flex items-center gap-3">
          <input
            type="text"
            value={inputQuestion}
            onChange={e => setInputQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={`Ask ${characters.find(c => c.id === selectedChar)?.name} about the 1948 expungement...`}
            className="flex-1 bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-lg px-4 py-2.5 text-xs sm:text-sm text-stone-200 placeholder:text-stone-400 focus:outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputQuestion.trim() || loading}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-stone-950 font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Inquire</span>
          </button>
        </div>
      </div>
    </div>
  );
};
