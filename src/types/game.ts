export type LocationId =
  | 'reading_hall'
  | 'forbidden_stacks'
  | 'unwritten_names'
  | 'restoration_room'
  | 'memory_altar'
  | 'sealed_basement'
  | 'chamber_of_echoes';

export type EndingId =
  | 'forgotten'
  | 'truth_revealed'
  | 'eternal_archivist'
  | 'guardian_cempasuchil';

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  category: 'key' | 'document' | 'artifact' | 'offering';
  icon: string;
  isMemoryOffering?: boolean;
}

export interface MemoryFragment {
  id: string;
  title: string;
  associatedItemId: string;
  personName: string;
  year: string;
  quote: string;
  description: string;
  story: string;
  restored: boolean;
  image?: string;
}

export interface ClueEntry {
  id: string;
  title: string;
  locationFound: string;
  timestamp: string;
  content: string;
  category: 'historical' | 'cipher' | 'personal' | 'ritual';
}

export interface ProvenanceLog {
  id: string;
  source: 'gemma_local' | 'gemini_cloud' | 'deterministic_canon' | 'player_choice';
  label: string;
  timestamp: string;
  latencyMs?: number;
  preview: string;
}

export interface CharacterProfile {
  id: string;
  name: string;
  title: string;
  description: string;
  avatarIcon: string;
}

export interface GameState {
  currentLocationId: LocationId;
  tension: number; // 0 to 100
  turnCount: number;
  timeString: string;
  inventory: InventoryItem[];
  memories: MemoryFragment[];
  clues: ClueEntry[];
  provenanceLogs: ProvenanceLog[];
  solvedPuzzles: {
    deweyLock: boolean;
    typewriterCode: boolean;
    basementSafe: boolean;
    altarAwakened: boolean;
    chamberSeal: boolean;
  };
  inspectedObjects: string[];
  activeEnding: EndingId | null;
  epilogueText: string | null;
  aiMode: 'local_gemma' | 'cloud_gemini' | 'canon_deterministic';
  soundEnabled: boolean;
  notes: string;
}
