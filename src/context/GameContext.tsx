import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  LocationId,
  EndingId,
  InventoryItem,
  MemoryFragment,
  ClueEntry,
  ProvenanceLog,
  GameState
} from '../types/game';
import {
  INITIAL_LOCATIONS,
  INITIAL_MEMORIES,
  LocationDetail,
  Hotspot
} from '../data/storyContent';
import { soundscape } from '../utils/audio';

interface GameContextType {
  state: GameState;
  currentLocation: LocationDetail;
  activeNarrative: string;
  narrativeLoading: boolean;
  activeModal: string;
  isDemoPlaying: boolean;
  demoStep: number;
  moveToLocation: (locId: LocationId) => Promise<void>;
  inspectHotspot: (hotspot: Hotspot) => Promise<void>;
  solvePuzzle: (puzzleType: 'dewey' | 'safe' | 'typewriter', answer: string) => boolean;
  restoreMemoryToAltar: (memoryId: string) => void;
  askGhostQuestion: (characterId: string, question: string) => Promise<{ reply: string; provenance: string }>;
  triggerEnding: (endingId: EndingId) => Promise<void>;
  saveGame: () => void;
  loadGame: () => boolean;
  resetGame: () => void;
  toggleSound: () => void;
  openModal: (modalName: string) => void;
  closeModal: () => void;
  startDemo: () => void;
  advanceDemo: () => void;
  stopDemo: () => void;
  updateNotes: (text: string) => void;
}

const STORAGE_KEY = 'haunted_library_save_state_v1';

const defaultGameState: GameState = {
  currentLocationId: 'reading_hall',
  tension: 15,
  turnCount: 0,
  timeString: '11:59 PM',
  inventory: [],
  memories: INITIAL_MEMORIES,
  clues: [
    {
      id: 'clue_entry',
      title: 'The Stolen Notebook & The Midnight Date',
      locationFound: 'Library Main Entrance',
      timestamp: '11:59 PM',
      content: 'You came into the University Archives searching for your stolen field notebook. As the clock strikes midnight on November 2, all electric lights flicker and the exit doors seal shut.',
      category: 'historical'
    }
  ],
  provenanceLogs: [
    {
      id: 'log_init',
      source: 'deterministic_canon',
      label: 'Authoritative University Canon',
      timestamp: '11:59 PM',
      preview: 'Library entry protocol initialized. November 2 begins.'
    }
  ],
  solvedPuzzles: {
    deweyLock: false,
    typewriterCode: false,
    basementSafe: false,
    altarAwakened: false,
    chamberSeal: false
  },
  inspectedObjects: [],
  activeEnding: null,
  epilogueText: null,
  aiMode: 'local_gemma',
  soundEnabled: false,
  notes: ''
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return defaultGameState;
  });

  const [activeNarrative, setActiveNarrative] = useState<string>(
    "At 11:59 PM on November 1, you entered the ancient library. At the stroke of midnight, the clocks seized. A quiet carpet of orange cempasúchil petals glimmers along the stone corridor, leading toward secrets eighty years buried."
  );
  const [narrativeLoading, setNarrativeLoading] = useState(false);
  const [activeModal, setActiveModal] = useState<string>('none');
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  const currentLocation = INITIAL_LOCATIONS[state.currentLocationId] || INITIAL_LOCATIONS.reading_hall;

  const calculateTimeString = (turn: number) => {
    if (turn === 0) return '11:59 PM';
    const totalMinutes = turn * 4;
    const hours = 12 + Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const paddedMins = mins < 10 ? `0${mins}` : mins;
    return `${hours === 12 ? 12 : hours % 12}:${paddedMins} AM`;
  };

  const logProvenance = (source: ProvenanceLog['source'], label: string, preview: string, latencyMs?: number) => {
    const newLog: ProvenanceLog = {
      id: `prov_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      source,
      label,
      timestamp: calculateTimeString(state.turnCount),
      preview,
      latencyMs
    };
    setState(prev => ({
      ...prev,
      provenanceLogs: [newLog, ...prev.provenanceLogs].slice(0, 50)
    }));
  };

  // Move to a new location
  const moveToLocation = async (locId: LocationId) => {
    const nextTurn = state.turnCount + 1;
    const nextTime = calculateTimeString(nextTurn);
    soundscape.playClockTick();

    setState(prev => ({
      ...prev,
      currentLocationId: locId,
      turnCount: nextTurn,
      timeString: nextTime
    }));

    setNarrativeLoading(true);
    try {
      const res = await fetch('/api/story/narrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationId: locId,
          locationName: INITIAL_LOCATIONS[locId].name,
          action: `Entered ${INITIAL_LOCATIONS[locId].name}`,
          inventory: state.inventory,
          tension: state.tension,
          restoredCount: state.memories.filter(m => m.restored).length,
          cluesDiscovered: state.clues.map(c => c.title)
        })
      });

      if (res.ok) {
        const data = await res.json();
        setActiveNarrative(data.text);
        logProvenance(data.provenance, data.modelUsed || 'Story Engine', data.text.substring(0, 65) + '...', data.latencyMs);
      } else {
        setActiveNarrative(INITIAL_LOCATIONS[locId].atmosphere);
      }
    } catch {
      setActiveNarrative(INITIAL_LOCATIONS[locId].atmosphere);
    } finally {
      setNarrativeLoading(false);
    }
  };

  // Inspect a room hotspot
  const inspectHotspot = async (hotspot: Hotspot) => {
    soundscape.playPageTurn();
    const nextTurn = state.turnCount + 1;
    const nextTime = calculateTimeString(nextTurn);
    const newTension = Math.max(0, Math.min(100, state.tension + (hotspot.increasesTension || 0)));

    let newInventory = [...state.inventory];
    if (hotspot.rewardsItem && !state.inventory.some(i => i.id === hotspot.rewardsItem!.id)) {
      newInventory.push(hotspot.rewardsItem);
    }

    let newClues = [...state.clues];
    if (hotspot.revealsClue && !state.clues.some(c => c.id === hotspot.revealsClue!.id)) {
      newClues.push(hotspot.revealsClue);
    }

    const newInspected = Array.from(new Set([...state.inspectedObjects, hotspot.id]));

    setState(prev => ({
      ...prev,
      turnCount: nextTurn,
      timeString: nextTime,
      tension: newTension,
      inventory: newInventory,
      clues: newClues,
      inspectedObjects: newInspected
    }));

    if (hotspot.increasesTension && hotspot.increasesTension > 5) {
      soundscape.playTensionStab();
    }

    if (hotspot.triggersPuzzle === 'dewey') {
      setActiveModal('puzzle_dewey');
      return;
    }
    if (hotspot.triggersPuzzle === 'safe') {
      setActiveModal('puzzle_safe');
      return;
    }

    setNarrativeLoading(true);
    try {
      const res = await fetch('/api/story/narrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationId: state.currentLocationId,
          locationName: currentLocation.name,
          action: `Inspected ${hotspot.name}: "${hotspot.inspectText}"`,
          inventory: newInventory,
          tension: newTension,
          restoredCount: state.memories.filter(m => m.restored).length,
          cluesDiscovered: newClues.map(c => c.title)
        })
      });

      if (res.ok) {
        const data = await res.json();
        setActiveNarrative(data.text);
        logProvenance(data.provenance, data.modelUsed, data.text.substring(0, 65) + '...', data.latencyMs);
      } else {
        setActiveNarrative(hotspot.inspectText);
      }
    } catch {
      setActiveNarrative(hotspot.inspectText);
    } finally {
      setNarrativeLoading(false);
    }
  };

  // Solve puzzles with deterministic logic
  const solvePuzzle = (puzzleType: 'dewey' | 'safe' | 'typewriter', answer: string): boolean => {
    const clean = answer.trim().toUpperCase();

    if (puzzleType === 'dewey') {
      // Correct Dewey decimal is 394 or 394.266
      if (clean === '394' || clean === '394.266' || clean === '394266') {
        soundscape.playMemoryChime();
        setState(prev => {
          const hasPhoto = prev.inventory.some(i => i.id === 'photo_lucia');
          const photoItem: InventoryItem = {
            id: 'photo_lucia',
            name: 'Archival Photograph of Lucia Morales (1948)',
            description: 'A restored sepia portrait showing Lucia standing with quiet pride before the foundation records.',
            category: 'artifact',
            icon: 'Image',
            isMemoryOffering: true
          };
          return {
            ...prev,
            solvedPuzzles: { ...prev.solvedPuzzles, deweyLock: true },
            inventory: hasPhoto ? prev.inventory : [...prev.inventory, photoItem],
            tension: Math.max(5, prev.tension - 10)
          };
        });
        setActiveNarrative("With a heavy metallic click, the iron latch of Section 394.266 falls free. Behind the velvet curtain rests the lost photographic plate of Lucia Morales, preserved untouched since 1948.");
        logProvenance('deterministic_canon', 'Dewey Puzzle Validator', 'Section 394.266 unlocked with verified solution.');
        return true;
      }
    }

    if (puzzleType === 'safe') {
      // Safe combination: Lucia's birth year (1922) or full code 1922-394
      if (clean === '1922' || clean === '1922-394' || clean === '1948' || clean === 'LUCIA') {
        soundscape.playMemoryChime();
        setState(prev => {
          const hasRegister = prev.inventory.some(i => i.id === 'foundation_register');
          const registerItem: InventoryItem = {
            id: 'foundation_register',
            name: 'The Uncensored Foundation Register (1948)',
            description: 'Lucia\'s master ledger documenting every expunged student and indigenous record.',
            category: 'document',
            icon: 'BookOpen'
          };
          return {
            ...prev,
            solvedPuzzles: { ...prev.solvedPuzzles, basementSafe: true },
            inventory: hasRegister ? prev.inventory : [...prev.inventory, registerItem],
            tension: Math.max(0, prev.tension - 15)
          };
        });
        setActiveNarrative("The heavy vault door swings open on oiled hinges. The foundation ledger gleams under the glow of your lamp. The names that were erased are now held safely in your hands.");
        logProvenance('deterministic_canon', 'Basement Vault Validator', 'Foundation safe opened with code 1922.');
        return true;
      }
    }

    return false;
  };

  // Restore memory to the altar
  const restoreMemoryToAltar = (memoryId: string) => {
    soundscape.playMemoryChime();
    setState(prev => {
      const updatedMemories = prev.memories.map(m =>
        m.id === memoryId ? { ...m, restored: true } : m
      );
      const allRestored = updatedMemories.every(m => m.restored);
      return {
        ...prev,
        memories: updatedMemories,
        tension: Math.max(0, prev.tension - 15),
        solvedPuzzles: {
          ...prev.solvedPuzzles,
          altarAwakened: allRestored
        }
      };
    });

    const target = state.memories.find(m => m.id === memoryId);
    if (target) {
      setActiveNarrative(`You place ${target.title} onto the candlelit tier of the ofrenda. The beeswax flame flares warm gold, and a gentle voice whispers: "Gracias... We are remembered."`);
      logProvenance('player_choice', 'Ofrenda Remembrance Offering', `Restored memory: ${target.personName} (${target.year})`);
    }
  };

  // Ask ghost
  const askGhostQuestion = async (characterId: string, question: string): Promise<{ reply: string; provenance: string }> => {
    try {
      const res = await fetch('/api/ghost/interrogate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterId,
          question,
          memoryState: {
            restoredCount: state.memories.filter(m => m.restored).length
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        logProvenance(data.provenance, `Ghost Interrogation (${data.character})`, `Q: "${question.substring(0, 30)}..." -> "${data.reply.substring(0, 40)}..."`, data.latencyMs);
        return { reply: data.reply, provenance: data.provenance };
      }
    } catch {}

    const fallback = "The library breathes in silence. Listen to the marigold petals rustling on the stone—they remember what ink was forbidden to write.";
    logProvenance('deterministic_canon', 'Ghost Fallback', fallback);
    return { reply: fallback, provenance: 'deterministic_canon' };
  };

  // Trigger ending
  const triggerEnding = async (endingId: EndingId) => {
    soundscape.playMemoryChime();
    setNarrativeLoading(true);

    try {
      const res = await fetch('/api/story/epilogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endingId,
          restoredCount: state.memories.filter(m => m.restored).length,
          playerNotes: state.notes,
          choices: [
            state.solvedPuzzles.deweyLock ? 'Unlocked Section 394' : 'Left Section 394 locked',
            state.solvedPuzzles.basementSafe ? 'Retrieved Master Ledger' : 'Left Safe Sealed',
            `Restored ${state.memories.filter(m => m.restored).length} of 4 memories on the altar`
          ]
        })
      });

      let epilogue = "";
      let provenance: ProvenanceLog['source'] = 'deterministic_canon';
      if (res.ok) {
        const data = await res.json();
        epilogue = data.epilogue;
        provenance = data.provenance;
      } else {
        epilogue = "As dawn arrives on November 2, the university library settles into serene stillness. The memories you tended will illuminate generations to come.";
      }

      setState(prev => ({
        ...prev,
        activeEnding: endingId,
        epilogueText: epilogue
      }));

      logProvenance(provenance, 'Final Epilogue Generation', epilogue.substring(0, 70) + '...');
    } catch {
      setState(prev => ({
        ...prev,
        activeEnding: endingId,
        epilogueText: "Dawn rises over the campus. The fragrance of cempasúchil remains in the air, a reminder that those who are remembered never truly leave."
      }));
    } finally {
      setNarrativeLoading(false);
    }
  };

  // Save / Load / Reset
  const saveGame = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      logProvenance('player_choice', 'Archive Saved', 'Game state preserved in local storage.');
    }
  };

  const loadGame = (): boolean => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setState(parsed);
          logProvenance('player_choice', 'Archive Loaded', 'Previous investigation state restored.');
          return true;
        } catch {}
      }
    }
    return false;
  };

  const resetGame = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    setState(defaultGameState);
    setActiveNarrative("At 11:59 PM on November 1, you entered the ancient library. At the stroke of midnight, the clocks seized. A quiet carpet of orange cempasúchil petals glimmers along the stone corridor, leading toward secrets eighty years buried.");
    setActiveEndingState(null);
  };

  const setActiveEndingState = (end: EndingId | null) => {
    setState(prev => ({ ...prev, activeEnding: end, epilogueText: null }));
  };

  const toggleSound = () => {
    const nextMuted = soundscape.toggleMute();
    setState(prev => ({ ...prev, soundEnabled: !nextMuted }));
  };

  const openModal = (modalName: string) => setActiveModal(modalName);
  const closeModal = () => setActiveModal('none');

  const updateNotes = (text: string) => {
    setState(prev => ({ ...prev, notes: text }));
  };

  // 3-Minute Live Hackathon Demo Sequencer
  const startDemo = () => {
    setIsDemoPlaying(true);
    setDemoStep(1);
    moveToLocation('reading_hall');
    openModal('demo_runner');
  };

  const advanceDemo = () => {
    const nextStep = demoStep + 1;
    setDemoStep(nextStep);

    if (nextStep === 2) {
      // 0:30-1:15 Discovery & Ghost Conversation
      moveToLocation('forbidden_stacks');
    } else if (nextStep === 3) {
      // 1:15-2:00 Puzzle & Photo
      solvePuzzle('dewey', '394.266');
      moveToLocation('memory_altar');
    } else if (nextStep === 4) {
      // 2:00-2:35 Altar restoration
      restoreMemoryToAltar('mem_lucia');
      restoreMemoryToAltar('mem_watch');
      restoreMemoryToAltar('mem_letter');
      restoreMemoryToAltar('mem_marigolds');
    } else if (nextStep === 5) {
      // 2:35-3:00 Final reveal & epilogue
      moveToLocation('chamber_of_echoes');
      triggerEnding('truth_revealed');
    }
  };

  const stopDemo = () => {
    setIsDemoPlaying(false);
    setDemoStep(0);
    closeModal();
  };

  return (
    <GameContext.Provider
      value={{
        state,
        currentLocation,
        activeNarrative,
        narrativeLoading,
        activeModal,
        isDemoPlaying,
        demoStep,
        moveToLocation,
        inspectHotspot,
        solvePuzzle,
        restoreMemoryToAltar,
        askGhostQuestion,
        triggerEnding,
        saveGame,
        loadGame,
        resetGame,
        toggleSound,
        openModal,
        closeModal,
        startDemo,
        advanceDemo,
        stopDemo,
        updateNotes
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};
