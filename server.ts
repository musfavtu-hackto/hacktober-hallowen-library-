import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Configuration state for local Ollama / Gemma 4
let ollamaHost = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
let preferredModel = process.env.GEMMA_MODEL || 'gemma4';

// Deterministic Story Engine for 100% offline reliability and authentic lore
const CANON_LORE = {
  studentName: "Alex Rivera",
  date: "November 2, 2026",
  forgottenScholar: {
    name: "Lucia Morales (1922-1948)",
    role: "Head Archival Scholar & Folklorist",
    secret: "In 1948, Lucia refused to purge indigenous and communal remembrance records during the university's ideological catalog reorganization. Before her sudden disappearance at midnight on November 2, 1948, she bound her own life's work into the library's foundation stones.",
    deweyCode: "394.266-M82",
    symbols: ["MARIGOLD_PETAL", "HOURGLASS_FROZEN", "SEALED_LETTER", "HEIRLOOM_WATCH"]
  }
};

// Check local Ollama health
async function testOllamaConnection(host: string, model: string): Promise<{ available: boolean; models: string[]; latencyMs: number; error?: string }> {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${host}/api/tags`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) {
      return { available: false, models: [], latencyMs: Date.now() - start, error: `HTTP ${res.status}` };
    }
    const data = await res.json() as { models?: Array<{ name: string }> };
    const models = (data.models || []).map(m => m.name);
    return {
      available: true,
      models,
      latencyMs: Date.now() - start
    };
  } catch (err: any) {
    return {
      available: false,
      models: [],
      latencyMs: Date.now() - start,
      error: err.message || 'Connection refused (Ollama offline)'
    };
  }
}

// Generate with Ollama
async function generateWithOllama(prompt: string, systemPrompt?: string): Promise<{ text: string; latencyMs: number } | null> {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(`${ollamaHost}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: preferredModel,
        prompt: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
        }
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json() as { response?: string };
    return {
      text: data.response || '',
      latencyMs: Date.now() - start
    };
  } catch {
    return null;
  }
}

// Generate with Gemini Fallback
async function generateWithGemini(prompt: string, systemInstruction?: string): Promise<{ text: string; latencyMs: number } | null> {
  if (!process.env.GEMINI_API_KEY) return null;
  const start = Date.now();
  try {
    const ai = new GoogleGenAI({});
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: systemInstruction ? { systemInstruction } : undefined
    });
    return {
      text: response.text || '',
      latencyMs: Date.now() - start
    };
  } catch {
    return null;
  }
}

// API Routes
app.get('/api/status', async (req: Request, res: Response) => {
  const ollamaCheck = await testOllamaConnection(ollamaHost, preferredModel);
  const geminiAvailable = Boolean(process.env.GEMINI_API_KEY);

  res.json({
    status: 'online',
    ollama: {
      host: ollamaHost,
      model: preferredModel,
      connected: ollamaCheck.available,
      detectedModels: ollamaCheck.models,
      latencyMs: ollamaCheck.latencyMs,
      error: ollamaCheck.error
    },
    gemini: {
      available: geminiAvailable,
      model: 'gemini-2.5-flash'
    },
    fallbackEngine: {
      active: true,
      mode: 'Authoritative Deterministic Canon & Narrative Matrix'
    }
  });
});

app.post('/api/ollama/configure', async (req: Request, res: Response) => {
  const { host, model } = req.body;
  if (host) ollamaHost = host;
  if (model) preferredModel = model;
  const check = await testOllamaConnection(ollamaHost, preferredModel);
  res.json({ success: true, ollamaHost, preferredModel, check });
});

// Story generation endpoint
app.post('/api/story/narrate', async (req: Request, res: Response) => {
  const {
    locationId,
    locationName,
    action,
    inventory,
    tension,
    restoredCount,
    cluesDiscovered
  } = req.body;

  const systemInstruction = `You are the narrative engine of 'THE HAUNTED LIBRARY FILES: Whispers Beyond November 2'.
Atmosphere: Gothic ancient library, midnight on November 2 (Día de los Muertos). Golden marigold petals, ticking stopped clocks, forgotten archival secrets.
Tone: Eerie, atmospheric, respectful of Mexican remembrance traditions, poetic, restrained psychological horror without gratuitous gore.
Rule: Keep responses under 95 words. Focus on immediate sensory details and subtle psychological suspense.`;

  const prompt = `Current Location: ${locationName} (ID: ${locationId})
Player Action: ${action}
Current Fear/Tension Level: ${tension}%
Restored Memories Count: ${restoredCount} of 4
Discovered Clues: ${(cluesDiscovered || []).join(', ') || 'None yet'}
Inventory: ${(inventory || []).map((i: any) => i.name).join(', ') || 'Empty'}

Describe what occurs with atmospheric prose. Hint at the mystery of Lucia Morales and the stopped clocks.`;

  // 1. Try local Ollama / Gemma 4
  const ollamaResult = await generateWithOllama(prompt, systemInstruction);
  if (ollamaResult && ollamaResult.text.trim()) {
    return res.json({
      text: ollamaResult.text.trim(),
      provenance: 'gemma_local',
      modelUsed: `Gemma 4 (${preferredModel}) via Ollama`,
      latencyMs: ollamaResult.latencyMs
    });
  }

  // 2. Try Gemini 2.5 Flash
  const geminiResult = await generateWithGemini(prompt, systemInstruction);
  if (geminiResult && geminiResult.text.trim()) {
    return res.json({
      text: geminiResult.text.trim(),
      provenance: 'gemini_cloud',
      modelUsed: 'Gemini 2.5 Flash (GCP Backup)',
      latencyMs: geminiResult.latencyMs
    });
  }

  // 3. Deterministic Curated Story Canon Matrix
  const fallbackNarratives: Record<string, string> = {
    reading_hall: "The grandfather clock's pendulum sits motionless between tick and tock. Across the walnut reading table, marigold petals drift in air that feels cold as river silt. A single green banker's lamp hums, casting long shadows that whisper against the rows of unborrowed books.",
    forbidden_stacks: "The iron spiral staircase shivers under your weight. Between the leather-bound folios of 1948, the scent of copal incense lingers. A card catalog drawer has slid open on its own, resting on the letter 'M'—as if waiting for a name the university tried to bury.",
    unwritten_names: "Rows of blank vellum registers stretch into the gloom. When your hand hovers near shelf 394, your fingers feel faint warmth, like a candle flame held behind velvet. The ink on the register hasn't dried; it is still actively retreating from the paper.",
    restoration_room: "The binding press stands silent. A brass magnifying loupe reflects not the room behind you, but a sunlit courtyard from eighty years ago. An archival ledger lies open, its spine stitched with bright orange silk thread.",
    memory_altar: "The scent of cempasúchil blooms fills your lungs—heady, sweet, and comforting. Beeswax candles burn without dripping wax. In the ornate silver frames, empty glass waits to receive the faces that history neglected to honor.",
    sealed_basement: "Beneath the stone foundation arches, the temperature drops sharply. Here, water drips into brass basins in a rhythm that matches a human heartbeat. In the center, an iron safe bears a dial inscribed with ancient Dewey decimal categories.",
    chamber_of_echoes: "A vast octagonal chamber where every whisper bounces back as a memory. Golden petals blanket the altar dais. The air vibrates with the collective breathing of those who ask only one thing: do not let our names disappear."
  };

  const defaultText = fallbackNarratives[locationId] ||
    "The library breathes in slow, dusty exhalations. In the stillness past midnight, the line between what was forgotten and what refuses to die grows paper-thin.";

  res.json({
    text: defaultText,
    provenance: 'deterministic_canon',
    modelUsed: 'Deterministic Canon Narrative Engine (Offline Safe)',
    latencyMs: 14
  });
});

// Ghost conversation endpoint
app.post('/api/ghost/interrogate', async (req: Request, res: Response) => {
  const { characterId, question, memoryState } = req.body;

  const characters: Record<string, { name: string; role: string; voice: string }> = {
    keeper: {
      name: "The Memory Keeper",
      role: "Ancient Archival Presence",
      voice: "Solitary, sorrowful, speaks in riddles of paper, ink, and remembrance."
    },
    lucia: {
      name: "Lucia Morales (1948)",
      role: "Erased Chief Archival Scholar",
      voice: "Scholarly, resolute, deeply devoted to honoring ancestors and living memory."
    },
    scribe: {
      name: "The Spectral Scribe",
      role: "Witness of the 1948 Expungement",
      voice: "Nervous, quiet, whispering fragments of catalog codes and locked doors."
    }
  };

  const selectedChar = characters[characterId] || characters.keeper;

  const systemInstruction = `You are roleplaying as ${selectedChar.name}, ${selectedChar.role} in 'THE HAUNTED LIBRARY FILES'.
Character Voice: ${selectedChar.voice}
Setting: Fictional University Library, midnight on Día de los Muertos.
Story Canon: Lucia Morales was erased in November 1948 because she protected historical memory.
Current restored memories count: ${memoryState?.restoredCount || 0}.
Rule: Answer the player's question in character. Keep the answer under 80 words. Be evocative, never break the fourth wall.`;

  const ollamaResult = await generateWithOllama(`Player asks: "${question}"`, systemInstruction);
  if (ollamaResult && ollamaResult.text.trim()) {
    return res.json({
      reply: ollamaResult.text.trim(),
      character: selectedChar.name,
      provenance: 'gemma_local',
      latencyMs: ollamaResult.latencyMs
    });
  }

  const geminiResult = await generateWithGemini(`Player asks: "${question}"`, systemInstruction);
  if (geminiResult && geminiResult.text.trim()) {
    return res.json({
      reply: geminiResult.text.trim(),
      character: selectedChar.name,
      provenance: 'gemini_cloud',
      latencyMs: geminiResult.latencyMs
    });
  }

  // Fallback dialogue matrix
  const lowerQ = (question || '').toLowerCase();
  let fallbackReply = "The silence here is not empty; it is crowded with words that were scraped away. Listen to the petals on the stone.";

  if (lowerQ.includes('who are you') || lowerQ.includes('your name')) {
    fallbackReply = selectedChar.name === "Lucia Morales (1948)"
      ? "I was the keeper of catalog 394. When they ordered the records burned, I hid the names inside the foundation altar. They took my name from the brass plaques, but the marigolds still remember."
      : "I am the voice of the catalog that cannot be burned. Every forgotten student, every silenced scholar—I keep vigil for them until someone brings light to the ofrenda.";
  } else if (lowerQ.includes('dewey') || lowerQ.includes('code') || lowerQ.includes('number') || lowerQ.includes('cipher')) {
    fallbackReply = "Look for 394.266 in the Forbidden Stacks. Customs of remembrance. The numbers were not chosen at random; they were Lucia's final safe combination.";
  } else if (lowerQ.includes('altar') || lowerQ.includes('ofrenda') || lowerQ.includes('muertos') || lowerQ.includes('marigold')) {
    fallbackReply = "The ofrenda is not a tomb—it is an open door. Place the photograph, the gold pocket watch, the unmailed letter, and the marigold blossoms. Light calls to light.";
  } else if (lowerQ.includes('why') || lowerQ.includes('erased') || lowerQ.includes('happen')) {
    fallbackReply = "In the winter of 1948, the regents wished to erase the records of community labor and indigenous memory. Lucia refused to sign the expungement ledger. That night, she walked into the basement archive with four candles—and never came back.";
  }

  res.json({
    reply: fallbackReply,
    character: selectedChar.name,
    provenance: 'deterministic_canon',
    latencyMs: 12
  });
});

// Epilogue generation endpoint
app.post('/api/story/epilogue', async (req: Request, res: Response) => {
  const { endingId, restoredCount, playerNotes, choices } = req.body;

  const endingsMeta: Record<string, { title: string; tone: string }> = {
    forgotten: {
      title: "The Forgotten Ending",
      tone: "Somber, unresolved, escape with haunting guilt"
    },
    truth_revealed: {
      title: "The Truth Revealed",
      tone: "Triumphant, emotional restoration, justice for Lucia Morales"
    },
    eternal_archivist: {
      title: "The Eternal Archivist",
      tone: "Mythic, bittersweet commitment, becoming guardian of the dead"
    },
    guardian_cempasuchil: {
      title: "The Guardian of the Cempasúchil (Secret 4th Ending)",
      tone: "Transcendence, bridge between realms, golden eternal dawn"
    }
  };

  const endInfo = endingsMeta[endingId] || endingsMeta.truth_revealed;

  const prompt = `Write an emotional concluding epilogue for the horror mystery 'THE HAUNTED LIBRARY FILES: Whispers Beyond November 2'.
Ending Title: ${endInfo.title}
Tone: ${endInfo.tone}
Memories Restored: ${restoredCount} of 4.
Key Choices: ${(choices || []).join(', ') || 'Explored the forbidden archive'}.
Explain what happens as dawn breaks on November 2, the university library, and the legacy of Lucia Morales. Length: 110-140 words.`;

  const ollamaResult = await generateWithOllama(prompt);
  if (ollamaResult && ollamaResult.text.trim()) {
    return res.json({
      epilogue: ollamaResult.text.trim(),
      provenance: 'gemma_local',
      latencyMs: ollamaResult.latencyMs
    });
  }

  const geminiResult = await generateWithGemini(prompt);
  if (geminiResult && geminiResult.text.trim()) {
    return res.json({
      epilogue: geminiResult.text.trim(),
      provenance: 'gemini_cloud',
      latencyMs: geminiResult.latencyMs
    });
  }

  const canonEpilogues: Record<string, string> = {
    forgotten: "At 6:00 AM on November 2, the heavy oak doors unseal with a groaning shudder. You stumble out into the damp autumn fog, clutching your research notebook. Behind you, the library windows are dark and silent once more. But whenever you close your eyes, the scent of marigold petals returns, and you know—somewhere beneath the floorboards, a woman with kind eyes and an erased name is still waiting for someone brave enough to remember her.",
    truth_revealed: "As the first golden rays of November 2 pierce through the stained glass rose window, the clocks throughout the library tick into synchrony. On the central marble pedestal, the empty brass plate now gleams with freshly raised letters: 'LUCIA MORALES, 1922-1948 — SHE WHO GUARDED OUR NAMES.' The chill leaves the air, replaced by the warm fragrance of beeswax and marigolds. A forgotten scholar is erased no longer; her story is returned to the living.",
    eternal_archivist: "You do not leave when the morning bells toll. Instead, you seat yourself at the walnut desk in the Restoration Room, dipping Lucia's fountain pen into fresh black ink. The archive has chosen you as its new custodian. For every name that tyrants attempt to blot from history, you will weave a ribbon of marigold petals into the binding. The library will never forget again.",
    guardian_cempasuchil: "Golden light floods the Chamber of Echoes. The marigold petals lift from the floor, swirling in an ethereal spiral that bridges the university library with the boundless realm of the ancestors. Lucia Morales stands before you, her sepia portrait now radiant with lifelike warmth. She bows her head in profound gratitude, placing the golden heirloom pocket watch into your hands. You have not merely solved a puzzle; you have healed an eighty-year-old wound in the memory of the world."
  };

  res.json({
    epilogue: canonEpilogues[endingId] || canonEpilogues.truth_revealed,
    provenance: 'deterministic_canon',
    latencyMs: 15
  });
});

// Standalone open-source artifacts preview endpoint (for Hackathon judges)
app.get('/api/export/manifest', (req: Request, res: Response) => {
  res.json({
    projectName: "THE HAUNTED LIBRARY FILES: Whispers Beyond November 2",
    track: "Hacktoberfest Hack Day 2026 — Track 1: Best Use of Gemma 4",
    stack: {
      frontend: "React 19 + TypeScript + Tailwind CSS v4 + Motion",
      localAI: "Gemma 4 via Ollama (http://localhost:11434)",
      cloudFallback: "Google Gemini 2.5 Flash (@google/genai)",
      deterministicCore: "Authoritative Game Engine & Clue State Machine",
      pythonStreamlitCLI: "Included in open-source repository files"
    },
    features: [
      "Authoritative game state & puzzle validation",
      "Adaptive narrative generated by Gemma 4",
      "Interactive Día de los Muertos Memory Altar (Ofrenda)",
      "Ghost interrogation system with distinct character voices",
      "Story provenance tracking (AI vs Canon vs Player Choice)",
      "3-minute live judge demonstration runner mode",
      "Cultural reverence educational guide for Día de Muertos"
    ]
  });
});

// Mount Vite or serve static
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Haunted Library Server] Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
