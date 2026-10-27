# THE HAUNTED LIBRARY FILES: Whispers Beyond November 2
### Hacktoberfest Hack Day 2026 — Track 1: Best Use of Gemma 4

> *“Some memories refuse to stay buried.”*

An extraordinary, atmospheric, locally AI-powered horror mystery and remembrance experience honoring Mexican **Día de los Muertos** traditions and powered by **Google Gemma 4** through **Ollama**.

---

## 1. Hackathon Pitch
At 11:59 PM on November 1, a student enters an ancient university library. At midnight, every clock freezes. An Underwood typewriter spells their name unassisted, and an archive door appears where there was once only stone.

Someone was erased from every catalog, portrait, and memory in 1948: **Lucia Morales**, the chief archivist who gave her life to protect communal and indigenous remembrance records. 

Through Gemma 4 local inference, authoritative state machines, and a breathtaking interactive **Memory Altar (Ofrenda)**, the player solves historical ciphers, speaks with spirits, and restores forgotten memories before dawn breaks.

---

## 2. Key Innovations & Judging Criteria

### Best Use of Gemma 4
- **Living Story Engine**: Context-aware narrative generation driven by player location, fear levels, inventory, and memory restoration state.
- **Dynamic Ghost Interrogation**: Real-time natural language dialogue with three distinct historical entities: The Memory Keeper, Lucia Morales (1948), and The Spectral Scribe.
- **Contextual Epilogues**: Dynamic endings reflecting verified player choices.
- **Authoritative Separation of Concerns**: Gemma 4 creates rich storytelling, while deterministic game logic strictly authorises puzzle solutions, items, and endings.

### Best Open-Source AI & Privacy
- **100% Local by Default**: Operates via Ollama (`http://localhost:11434`) using `gemma4`. No remote cloud API keys required.
- **Zero-Downtime Resilience**: Seamless backup to Gemini 2.5 Flash if configured, plus a handcrafted 50-node deterministic canon fallback if all AI systems are offline.
- **Story Provenance View**: Transparent live auditing of AI-generated vs author canon vs player choices.

### Cultural Reverence (Día de los Muertos)
- Horror arises from **bureaucratic censorship and historical erasure**, never from Mexican traditions.
- The **Ofrenda** represents warmth, hope, and community justice, exploring the poignant concept of the *"Three Deaths"*—where the true death is being forgotten.

---

## 3. Quickstart Guide

### Option A: Web Application (React + Express Server)
```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open in browser at:
# http://localhost:3000
```

### Option B: Local Gemma 4 Setup (Ollama)
```bash
# 1. Download and run Ollama
ollama run gemma4

# 2. Ollama is now available at http://127.0.0.1:11434
# The Haunted Library Files will automatically route narrative and ghost prompts locally!
```

### Option C: Standalone Python Game Engine & CLI
```bash
# 1. Install Python dependencies
pip install -r requirements.txt

# 2. Run the interactive CLI game
python3 python_engine/game_engine.py

# 3. Run the unit test suite
python3 -m unittest python_engine/test_game_engine.py
```

---

## 4. 3-Minute Live Judge Demonstration Script

| Time | Stage | Action & Narrative Beat |
| :--- | :--- | :--- |
| **0:00 – 0:30** | **The Midnight Strike** | Open Title Screen -> Click "ENTER THE ARCHIVE". Clock strikes midnight. Typewriter types your name. |
| **0:30 – 1:15** | **Discovery & Ghost AI** | Move to Forbidden Stacks. Find Lucia's unmailed letter. Open "Ask Memory Keeper" and type: *"What happened in 1948?"*. Gemma 4 explains the expungement. |
| **1:15 – 2:00** | **Interaction & Dewey 394** | Click Iron Shelf 394. Enter Dewey Decimal `394.266`. Lock clicks open; recover Lucia's 1948 photo. Memory Altar unlocks. |
| **2:00 – 2:35** | **Emotional Altar Reveal** | Place all 4 offerings on the Ofrenda. The cold dark room transforms into warm candlelight and marigold radiance. |
| **2:35 – 3:00** | **Final Reveal & Provenance** | Enter Chamber of Echoes. Choose "The Truth Revealed". Read the personalized epilogue and inspect the AI Provenance Log. |

---

## 5. Project Structure

```
├── server.ts                    # Full-Stack Express Server (Ollama + Gemini Proxy + Story Engine)
├── package.json                 # Project dependencies & build scripts
├── requirements.txt             # Python open-source dependencies
├── python_engine/
│   ├── game_engine.py           # Standalone Python CLI & state machine
│   └── test_game_engine.py      # Automated unit tests for puzzles & inventory
├── src/
│   ├── App.tsx                  # Main router & modal controller
│   ├── context/
│   │   └── GameContext.tsx      # Authoritative state machine & event handlers
│   ├── types/
│   │   └── game.ts              # TypeScript interfaces & state definitions
│   ├── data/
│   │   └── storyContent.ts      # Canonical locations, memories, and lore
│   ├── utils/
│   │   └── audio.ts             # Synthesized Web Audio soundscape & chimes
│   └── components/
│       ├── TopBar.tsx           # Standard Top Bar with status & demo triggers
│       ├── TitleScreen.tsx      # Atmospheric opening screen
│       ├── LocationView.tsx     # 7 interactive archive rooms & hotspots
│       ├── MemoryAltarView.tsx  # Interactive Día de los Muertos Ofrenda
│       ├── GhostInterrogationModal.tsx # Multi-character ghost Q&A
│       ├── PuzzleModal.tsx      # Mechanized Dewey & Safe codebreaker
│       ├── ClueJournal.tsx      # Searchable dossier & note taking
│       ├── CulturalGuide.tsx    # Educational guide on Mexican traditions
│       ├── TechArchitecture.tsx # Diagnostics, model configs & provenance audit
│       ├── DemoRunnerModal.tsx  # 3-minute guided demo for evaluators
│       └── EndingScreen.tsx     # 4 branching cinematic conclusions
```

---

## 6. Endings Matrix
1. **The Forgotten Ending**: Player escapes with their notebook, leaving Lucia's name buried in the shadows.
2. **The Truth Revealed**: All 4 memories restored; the brass dedication plaque is reborn with Lucia Morales's name.
3. **The Eternal Archivist**: Player chooses to remain as guardian of the dead, recording every name history attempts to silence.
4. **The Guardian of the Cempasúchil (Secret 4th Ending)**: 0% tension + all memories restored + master ledger retrieved. The veil dissolves into an eternal golden bridge.

---

## 7. Limitations & Future Roadmap
- **Model Quantization**: Support for smaller GGUF quantization profiles on resource-constrained mobile hardware.
- **Voice Synthesis (TTS)**: Integration of Mexican Spanish-accented localized speech for Lucia Morales.
- **Expanded Rooms**: Expansion into the Astronomical Observatory and Cathedral Courtyard.
