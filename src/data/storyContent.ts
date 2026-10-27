import { LocationId, MemoryFragment, InventoryItem, ClueEntry } from '../types/game';

export interface Hotspot {
  id: string;
  name: string;
  inspectText: string;
  requiredItem?: string;
  rewardsItem?: InventoryItem;
  revealsClue?: ClueEntry;
  triggersPuzzle?: 'dewey' | 'safe' | 'typewriter';
  increasesTension?: number;
}

export interface LocationDetail {
  id: LocationId;
  name: string;
  subtitle: string;
  atmosphere: string;
  image: string;
  exits: { targetId: LocationId; label: string; lockRequirement?: string }[];
  hotspots: Hotspot[];
}

export const INITIAL_MEMORIES: MemoryFragment[] = [
  {
    id: 'mem_lucia',
    title: 'The Defiant Archivist',
    associatedItemId: 'photo_lucia',
    personName: 'Lucia Morales',
    year: '1948',
    quote: 'To burn a catalog is not to erase history; it only stains the hands of those holding the matches.',
    description: 'A restored sepia portrait showing Lucia standing resolutely before the library catalog.',
    story: 'In October 1948, the university regents voted to purge all records of indigenous oral histories and migrant community labor. Lucia Morales, chief archivist, secretly transcribed every name into hidden parchment ledgers and placed them into the library foundation before her mysterious disappearance.',
    restored: false,
    image: '/src/assets/images/vintage_portrait_lucia_1793091013895.jpg'
  },
  {
    id: 'mem_watch',
    title: 'The Midnight Pact',
    associatedItemId: 'pocket_watch',
    personName: 'Mateo & The Student Guild',
    year: '1948',
    quote: 'When the hands meet at twelve, remember our footsteps upon these stones.',
    description: 'An engraved gold pocket watch stopped forever at precisely 12:00 midnight.',
    story: 'On the eve of the expungement, three student apprentices swore an oath with Lucia beneath the stained glass arch to guard the memory alcove. Even as decades passed and their names were scrubbed from class rosters, the ticking resonance of their promise remained.',
    restored: false
  },
  {
    id: 'mem_letter',
    title: 'The Unsent Farewell',
    associatedItemId: 'unmailed_letter',
    personName: 'Lucia Morales to Sofia Morales',
    year: 'November 1, 1948',
    quote: 'Sofia, if they lock the doors tonight, do not look for me in the cemetery. Look for me in the cempasúchil petals leading to shelf 394.',
    description: 'A delicate handwritten letter folded into an envelope sealed with black wax.',
    story: 'Written in haste by candle glow just one hour before midnight. Lucia knew the university authorities were coming to seize her archive keys. She hid the true catalog numbers in the library Dewey system under folklore and remembrance customs.',
    restored: false
  },
  {
    id: 'mem_marigolds',
    title: 'The Golden Bridge',
    associatedItemId: 'marigold_offering',
    personName: 'The Ancestral Guardians',
    year: 'Timeless',
    quote: 'The dead do not fear silence; they fear only our forgetting.',
    description: 'Fresh aromatic cempasúchil marigolds glowing with ethereal amber warmth.',
    story: 'According to Mexican remembrance traditions, the vivid fragrance and golden hue of cempasúchil petals create a glowing pathway that guides departed spirits back to the warmth of the living. On November 2, the library becomes a bridge between memory and eternity.',
    restored: false
  }
];

export const INITIAL_LOCATIONS: Record<LocationId, LocationDetail> = {
  reading_hall: {
    id: 'reading_hall',
    name: 'The Midnight Reading Hall',
    subtitle: 'Where Clocks Refuse to Tick',
    atmosphere: 'Grand gothic vaulted ceilings, green banker lamps emitting a steady hum, and quiet carpet of golden cempasúchil petals leading across dark flagstones.',
    image: '/src/assets/images/haunted_library_hall_1793091011573.jpg',
    exits: [
      { targetId: 'forbidden_stacks', label: 'Enter The Forbidden Stacks' },
      { targetId: 'unwritten_names', label: 'Pass into Archive of Unwritten Names' },
      { targetId: 'memory_altar', label: 'Step toward The Memory Altar' }
    ],
    hotspots: [
      {
        id: 'stopped_clock',
        name: 'Grandfather Clock of 1948',
        inspectText: 'The pendulum hangs motionless at 12:00:00. The brass face bears an inscription: "Time sleeps when memory is silenced."',
        increasesTension: 5,
        revealsClue: {
          id: 'clue_clock',
          title: 'The Frozen Midnight',
          locationFound: 'The Midnight Reading Hall',
          timestamp: '12:00 AM',
          content: 'Every clock in the building died at the same instant in 1948. The mechanical heart refuses to beat until the missing name is restored.',
          category: 'historical'
        }
      },
      {
        id: 'typewriter_desk',
        name: 'The Ghostly Underwood Typewriter',
        inspectText: 'Fresh ribbon ribbon ink smudges the roller. The keys suddenly depress on their own, typing: "ALEX RIVERA... WELCOME TO THE SEARCH."',
        triggersPuzzle: 'typewriter',
        increasesTension: 10,
        rewardsItem: {
          id: 'dewey_slip',
          name: 'Typewritten Call Slip (394.266)',
          description: 'A fragile catalog card listing Dewey Decimal 394.266 with handwritten notes: "Lucia Morales — Customs of Remembrance".',
          category: 'document',
          icon: 'FileText'
        }
      },
      {
        id: 'banker_desk',
        name: 'Walnut Reading Table No. 4',
        inspectText: 'Scattered beneath fresh marigold petals lies a brass catalog key and a handwritten notebook page.',
        rewardsItem: {
          id: 'brass_key',
          name: 'Archivist Brass Skeleton Key',
          description: 'A heavy brass key stamped with the number "1948" and the initial "L". Unlocks the basement archive grating.',
          category: 'key',
          icon: 'Key'
        }
      }
    ]
  },
  forbidden_stacks: {
    id: 'forbidden_stacks',
    name: 'The Forbidden Stacks',
    subtitle: 'Aisle of Condemned Folios',
    atmosphere: 'Towering shelves of dark polished walnut climbing three stories into shadow. The smell of cedar, beeswax, and damp earth fills the narrow passageways.',
    image: '/src/assets/images/forbidden_stacks_archive_1793091013557.jpg',
    exits: [
      { targetId: 'reading_hall', label: 'Return to Reading Hall' },
      { targetId: 'restoration_room', label: 'Proceed to Restoration Room' },
      { targetId: 'sealed_basement', label: 'Descend to Sealed Basement Archive', lockRequirement: 'brass_key' }
    ],
    hotspots: [
      {
        id: 'dewey_cabinet',
        name: 'Iron Shelf 394 (Customs & Folklore)',
        inspectText: 'A heavy brass dial lock secures Section 394.266. Three digits must be entered to disengage the iron latch.',
        triggersPuzzle: 'dewey',
        rewardsItem: {
          id: 'photo_lucia',
          name: 'Archival Photograph of Lucia Morales (1948)',
          description: 'A rare sepia photograph of Lucia holding the foundation register. The back reads: "Do not forget me, even if they burn the stone."',
          category: 'artifact',
          icon: 'Image',
          isMemoryOffering: true
        }
      },
      {
        id: 'whispering_book',
        name: 'Leather Folio: "Expunged Records of 1948"',
        inspectText: 'The pages have been carved out with a razor blade, leaving a hollow receptacle. Inside rests a sealed letter with black wax.',
        rewardsItem: {
          id: 'unmailed_letter',
          name: 'Lucia\'s Unmailed Letter to Sofia',
          description: 'Folded parchment addressed to Sofia Morales, dated November 1, 1948. Lucia promises her sister that truth cannot be extinguished.',
          category: 'document',
          icon: 'Mail',
          isMemoryOffering: true
        },
        revealsClue: {
          id: 'clue_letter',
          title: 'Lucia\'s Unmailed Letter',
          locationFound: 'Forbidden Stacks',
          timestamp: '12:08 AM',
          content: 'Lucia wrote to her sister Sofia explaining that she placed the master record in the basement altar safe.',
          category: 'personal'
        }
      }
    ]
  },
  unwritten_names: {
    id: 'unwritten_names',
    name: 'The Archive of Unwritten Names',
    subtitle: 'The Ledger of the Silenced',
    atmosphere: 'Shelves holding hundreds of identical blank vellum folios. When you step close, invisible breath leaves condensation on glass vitrines.',
    image: '/src/assets/images/forbidden_stacks_archive_1793091013557.jpg',
    exits: [
      { targetId: 'reading_hall', label: 'Back to Reading Hall' },
      { targetId: 'restoration_room', label: 'Door to Restoration Room' }
    ],
    hotspots: [
      {
        id: 'blank_register',
        name: 'The Erased Registry of 1948',
        inspectText: 'Rows of student names were chemically washed away with acid. Yet under ultraviolet candle reflection, one name shimmers in gold ink: "Lucia Morales — Born 1922, Denied Erasure."',
        revealsClue: {
          id: 'clue_registry',
          title: 'Chemical Erasure Ledger',
          locationFound: 'Archive of Unwritten Names',
          timestamp: '12:14 AM',
          content: 'The regents used acid bleach to purge catalog index cards. Only gold-leaf ink resisted the acid.',
          category: 'historical'
        }
      },
      {
        id: 'gold_pocket_watch_spot',
        name: 'Velvet Case in Glass Vitrine',
        inspectText: 'A glass display case stands unlatched. Inside rests an engraved gold pocket watch, ticking softly in a frequency that bypasses the stopped clocks.',
        rewardsItem: {
          id: 'pocket_watch',
          name: 'The Student Guild Gold Watch',
          description: 'An engraved gold watch bearing the initials "L.M. & M.S. — Midnight Pact, Nov 2 1948".',
          category: 'artifact',
          icon: 'Clock',
          isMemoryOffering: true
        }
      }
    ]
  },
  restoration_room: {
    id: 'restoration_room',
    name: 'The Restoration Room',
    subtitle: 'Where Torn Memories Are Healed',
    atmosphere: 'Bookbinder presses, jars of gum arabic, bone folders, and spools of orange silk thread. Sunlight through tinted skylights is frozen at perpetual amber dusk.',
    image: '/src/assets/images/forbidden_stacks_archive_1793091013557.jpg',
    exits: [
      { targetId: 'forbidden_stacks', label: 'Return to Forbidden Stacks' },
      { targetId: 'memory_altar', label: 'Pass into The Memory Altar' }
    ],
    hotspots: [
      {
        id: 'binding_press',
        name: 'The Cast-Iron Bookbinder Press',
        inspectText: 'Between two heavy iron plates lies a freshly restored folio of Mexican folk customs, bound with orange cempasúchil silk ribbon.',
        revealsClue: {
          id: 'clue_altar_ritual',
          title: 'The Four Pillars of Remembrance',
          locationFound: 'The Restoration Room',
          timestamp: '12:22 AM',
          content: 'To awaken the Memory Altar, four sacred offerings must be placed: The Portrait of the Lost (Photographic memory), The Ticking Promise (Object of time), The Voice of Truth (Written word), and The Golden Flower (Cempasúchil).',
          category: 'ritual'
        }
      },
      {
        id: 'cempasuchil_basket',
        name: 'Woven Basket of Fresh Marigolds',
        inspectText: 'Vibrant, velvety orange blossoms that radiate gentle warmth. Petals detach and drift toward the altar doorway.',
        rewardsItem: {
          id: 'marigold_offering',
          name: 'Luminous Cempasúchil Blossoms',
          description: 'Fresh Day of the Dead marigolds whose fragrance guides lost souls back from oblivion.',
          category: 'offering',
          icon: 'Sparkles',
          isMemoryOffering: true
        }
      }
    ]
  },
  memory_altar: {
    id: 'memory_altar',
    name: 'The Día de los Muertos Memory Altar',
    subtitle: 'The Sacred Ofrenda of the Library',
    atmosphere: 'A stunning multi-tiered ofrenda adorned with hundreds of glowing candles, aromatic cempasúchil garlands, delicate papel picado banners, and antique framed portraits.',
    image: '/src/assets/images/memory_altar_ofrenda_1793091012513.jpg',
    exits: [
      { targetId: 'reading_hall', label: 'Return to Reading Hall' },
      { targetId: 'restoration_room', label: 'Enter Restoration Room' },
      { targetId: 'chamber_of_echoes', label: 'Approach The Chamber of Echoes', lockRequirement: 'altar_complete' }
    ],
    hotspots: [
      {
        id: 'altar_center',
        name: 'The Central Offering Dais',
        inspectText: 'Four silver pedestals await the memory offerings. Placing items here restores the lost souls to the university\'s living history.',
        increasesTension: -20 // Peacefulness and reverence lowers tension!
      },
      {
        id: 'sugar_skull_dish',
        name: 'Calaveras & Pan de Muerto',
        inspectText: 'Traditional sugar skulls decorated with brilliant turquoise and magenta icing, beside sweet round loaves of Pan de Muerto sprinkled with coarse sugar.',
        rewardsItem: {
          id: 'pan_de_muerto',
          name: 'Traditional Pan de Muerto',
          description: 'Sacred bread of the dead, decorated with bone-shaped crust patterns to honor those who came before.',
          category: 'offering',
          icon: 'Heart'
        }
      }
    ]
  },
  sealed_basement: {
    id: 'sealed_basement',
    name: 'The Sealed Basement Archive',
    subtitle: 'The Vault of 1948',
    atmosphere: 'Romanesque stone arches dripping with century-old mineral water. The air is ice-cold, smelling of deep bedrock and old soot.',
    image: '/src/assets/images/forbidden_stacks_archive_1793091013557.jpg',
    exits: [
      { targetId: 'forbidden_stacks', label: 'Climb Stairs to Stacks' },
      { targetId: 'chamber_of_echoes', label: 'Step into Final Chamber of Echoes', lockRequirement: 'basement_safe' }
    ],
    hotspots: [
      {
        id: 'iron_safe_1948',
        name: 'The Heavy Wall Safe of Lucia Morales',
        inspectText: 'A circular steel vault door with four mechanical dials. The plaque reads: "Combination: The year of birth, the Dewey code of remembrance, and the hour of courage."',
        triggersPuzzle: 'safe',
        rewardsItem: {
          id: 'foundation_register',
          name: 'The Uncensored Foundation Register (1948)',
          description: 'Lucia\'s master ledger containing every purged name, signed by 420 students and workers.',
          category: 'document',
          icon: 'BookOpen'
        }
      }
    ]
  },
  chamber_of_echoes: {
    id: 'chamber_of_echoes',
    name: 'The Final Chamber of Echoes',
    subtitle: 'Where All Stories Converge',
    atmosphere: 'An ethereal octagonal rotunda where thousands of suspended paper ribbons rustle in a breeze that exists nowhere else. Golden light pours from above.',
    image: '/src/assets/images/memory_altar_ofrenda_1793091012513.jpg',
    exits: [
      { targetId: 'memory_altar', label: 'Step Back to Memory Altar' },
      { targetId: 'reading_hall', label: 'Leave through the Grand Portal' }
    ],
    hotspots: [
      {
        id: 'echo_dais',
        name: 'The Dais of Eternal Remembrance',
        inspectText: 'Here, the veil between November 1 and November 2 is gossamer thin. The spirits of the library gather to hear your final decision.'
      }
    ]
  }
};
