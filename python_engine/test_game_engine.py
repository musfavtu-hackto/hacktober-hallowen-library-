import unittest
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from game_engine import HauntedLibraryEngine

class TestHauntedLibraryEngine(unittest.TestCase):
    def setUp(self):
        self.game = HauntedLibraryEngine()

    def test_initial_state(self):
        self.assertEqual(self.game.location, "reading_hall")
        self.assertEqual(len(self.game.inventory), 0)
        self.assertEqual(len(self.game.memories_restored), 0)
        self.assertEqual(self.game.tension, 15)

    def test_solve_dewey_success(self):
        success = self.game.solve_dewey("394.266")
        self.assertTrue(success)
        self.assertTrue(self.game.solved_puzzles["dewey"])
        self.assertIn("photo_lucia", self.game.inventory)
        self.assertEqual(self.game.tension, 5)

    def test_solve_dewey_failure(self):
        success = self.game.solve_dewey("999.999")
        self.assertFalse(success)
        self.assertFalse(self.game.solved_puzzles["dewey"])
        self.assertNotIn("photo_lucia", self.game.inventory)

    def test_solve_safe(self):
        success = self.game.solve_safe("1922")
        self.assertTrue(success)
        self.assertTrue(self.game.solved_puzzles["safe"])
        self.assertIn("foundation_register", self.game.inventory)

    def test_altar_memory_restoration_and_ending(self):
        # Gather items
        self.game.inventory.extend([
            "photo_lucia",
            "pocket_watch",
            "unmailed_letter",
            "marigold_offering"
        ])

        # Place offerings
        self.assertTrue(self.game.place_memory_offering("mem_lucia"))
        self.assertTrue(self.game.place_memory_offering("mem_watch"))
        self.assertTrue(self.game.place_memory_offering("mem_letter"))
        self.assertTrue(self.game.place_memory_offering("mem_marigolds"))

        self.assertEqual(len(self.game.memories_restored), 4)
        self.assertTrue(self.game.solved_puzzles["altar"])

        # Solve dewey & check ending
        self.game.solve_dewey("394.266")
        ending = self.game.check_ending()
        self.assertIn(ending, ["truth_revealed", "guardian_cempasuchil"])

if __name__ == '__main__':
    unittest.main()
