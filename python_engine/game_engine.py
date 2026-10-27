"""
THE HAUNTED LIBRARY FILES: Whispers Beyond November 2
Standalone Python Game Engine & Gemma 4 Bridge
Designed for Hacktoberfest Hack Day 2026 - Track 1: Best Use of Gemma 4
"""

import json
import sys
import os
import urllib.request
import urllib.error

OLLAMA_ENDPOINT = "http://127.0.0.1:11434/api/generate"
MODEL_TAG = "gemma4"

class HauntedLibraryEngine:
    def __init__(self):
        self.location = "reading_hall"
        self.time_string = "11:59 PM"
        self.turn = 0
        self.tension = 15
        self.inventory: List[str] = []
        self.memories_restored: List[str] = []
        self.clues: List[Dict[str, str]] = []
        self.solved_puzzles: Dict[str, bool] = {
            "dewey": False,
            "safe": False,
            "altar": False
        }

    def solve_dewey(self, code: str) -> bool:
        """Dewey Decimal 394 or 394.266 unlocks the historical photo of Lucia Morales."""
        clean = code.strip().replace(" ", "")
        if clean in ["394", "394.266", "394266"]:
            self.solved_puzzles["dewey"] = True
            if "photo_lucia" not in self.inventory:
                self.inventory.append("photo_lucia")
            self.tension = max(5, self.tension - 10)
            return True
        return False

    def solve_safe(self, code: str) -> bool:
        """The vault safe combination is Lucia's birth year 1922."""
        clean = code.strip().upper()
        if clean in ["1922", "1922-394", "1948", "LUCIA"]:
            self.solved_puzzles["safe"] = True
            if "foundation_register" not in self.inventory:
                self.inventory.append("foundation_register")
            self.tension = max(0, self.tension - 15)
            return True
        return False

    def place_memory_offering(self, memory_id: str) -> bool:
        """Place offering onto the Día de los Muertos memory altar."""
        valid_offerings = {
            "mem_lucia": "photo_lucia",
            "mem_watch": "pocket_watch",
            "mem_letter": "unmailed_letter",
            "mem_marigolds": "marigold_offering"
        }
        if memory_id in valid_offerings:
            req_item = valid_offerings[memory_id]
            if req_item in self.inventory and memory_id not in self.memories_restored:
                self.memories_restored.append(memory_id)
                self.tension = max(0, self.tension - 15)
                if len(self.memories_restored) == 4:
                    self.solved_puzzles["altar"] = True
                return True
        return False

    def check_ending(self) -> str:
        """Authoritatively evaluate the ending based on verified game state."""
        if len(self.memories_restored) == 4 and self.solved_puzzles["safe"] and self.tension == 0:
            return "guardian_cempasuchil"
        elif len(self.memories_restored) >= 3 and self.solved_puzzles["dewey"]:
            return "truth_revealed"
        elif len(self.memories_restored) >= 2:
            return "eternal_archivist"
        else:
            return "forgotten"

    def generate_narrative_with_gemma(self, action: str):
        """Query local Gemma 4 via Ollama with robust fallback."""
        prompt = (
            f"You are the narrator of 'The Haunted Library Files'. "
            f"Location: {self.location}. Action: {action}. Tension: {self.tension}%. "
            f"Memories Restored: {len(self.memories_restored)} of 4. "
            f"Generate an evocative, respectful 70-word paragraph."
        )
        try:
            req_data = json.dumps({"model": MODEL_TAG, "prompt": prompt, "stream": False}).encode("utf-8")
            req = urllib.request.Request(
                OLLAMA_ENDPOINT,
                data=req_data,
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=3) as response:
                if response.status == 200:
                    data = json.loads(response.read().decode("utf-8"))
                    return {
                        "text": data.get("response", "").strip(),
                        "provenance": "gemma_local"
                    }
        except Exception:
            pass

        # Deterministic Canon Fallback
        return {
            "text": "The pendulum of the grandfather clock hangs frozen. Between the walnut shelves, orange cempasúchil petals glow softly in the dark.",
            "provenance": "deterministic_canon"
        }

if __name__ == "__main__":
    engine = HauntedLibraryEngine()
    print("=== THE HAUNTED LIBRARY FILES (CLI) ===")
    print(f"Current Location: {engine.location}")
    narrative = engine.generate_narrative_with_gemma("Player steps inside at midnight")
    print(f"[{narrative['provenance'].upper()}]: {narrative['text']}")
