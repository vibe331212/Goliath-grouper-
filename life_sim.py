"""
life_sim.py — A text-based life simulation game played in the terminal.

You are born with randomized stats and live one year per turn. Each year you
face random events with choices that change your stats. You move through the
life stages of childhood, school, adulthood, career, and old age. The game
ends when your character dies, and a summary of their life is shown.

This is a deliberately simple, self-contained "basic version" you can expand:
add more events to the EVENTS list, tweak the stage boundaries, or add new
stats. Everything is organized into clearly commented sections.

Run it with:  python3 life_sim.py
"""

import random
import time


# ---------------------------------------------------------------------------
# SECTION 1: Configuration & constants
# ---------------------------------------------------------------------------

# The five core stats. Each ranges from 0 to 100.
STAT_NAMES = ["health", "happiness", "intelligence", "looks", "money"]

# Maximum age used to scale the natural chance of dying from old age.
MAX_AGE = 100

# Life stages defined by (name, minimum age). The player is in the last stage
# whose minimum age they have reached. Kept as data so it is easy to edit.
LIFE_STAGES = [
    ("Childhood", 0),
    ("School", 6),
    ("Adulthood", 18),
    ("Career", 25),
    ("Old Age", 65),
]


# ---------------------------------------------------------------------------
# SECTION 2: Small helpers
# ---------------------------------------------------------------------------

def clamp(value, low=0, high=100):
    """Keep a stat inside its valid range."""
    return max(low, min(high, value))


def slow_print(text, delay=0.0):
    """Print text, optionally with a tiny pause for a more 'live' feel.

    delay is 0 by default so tests / quick play stay instant. Set it to
    something like 0.02 if you want a typewriter effect later.
    """
    print(text)
    if delay:
        time.sleep(delay)


def stage_for_age(age):
    """Return the name of the life stage matching the given age."""
    current = LIFE_STAGES[0][0]
    for name, min_age in LIFE_STAGES:
        if age >= min_age:
            current = name
    return current


# ---------------------------------------------------------------------------
# SECTION 3: The Character
# ---------------------------------------------------------------------------

class Character:
    """Holds the player's stats, age, and life history."""

    def __init__(self, name):
        self.name = name
        self.age = 0
        self.alive = True
        self.cause_of_death = None

        # Randomized starting stats, each 0..100.
        self.stats = {stat: random.randint(0, 100) for stat in STAT_NAMES}

        # A log of notable moments to print in the end-of-life summary.
        self.history = []

    def apply(self, changes):
        """Apply a dict of stat changes, e.g. {'money': +10, 'health': -5}."""
        for stat, delta in changes.items():
            if stat in self.stats:
                self.stats[stat] = clamp(self.stats[stat] + delta)

    def record(self, text):
        """Add a line (prefixed with the current age) to the life history."""
        self.history.append(f"Age {self.age}: {text}")

    def stage(self):
        return stage_for_age(self.age)

    def print_stats(self):
        """Show a compact stat bar for each stat."""
        print(f"\n--- {self.name}, age {self.age} ({self.stage()}) ---")
        for stat in STAT_NAMES:
            value = self.stats[stat]
            bar = "#" * (value // 10) + "-" * (10 - value // 10)
            print(f"  {stat.capitalize():<13} [{bar}] {value}")
        print()


# ---------------------------------------------------------------------------
# SECTION 4: Events
# ---------------------------------------------------------------------------
#
# Each event is a dict with:
#   - "stages": which life stages it can appear in
#   - "prompt": the situation text
#   - "choices": a list of (label, {stat changes}, result_text)
#
# To expand the game, just add more events to this list.

EVENTS = [
    # --- Childhood ---
    {
        "stages": ["Childhood"],
        "prompt": "You find a stray puppy in the yard.",
        "choices": [
            ("Beg your parents to keep it", {"happiness": +12, "money": -5},
             "You adopt the puppy. Best friend unlocked!"),
            ("Walk it back to the shelter", {"happiness": -3, "intelligence": +4},
             "You did the responsible thing, but it stung a little."),
        ],
    },
    {
        "stages": ["Childhood"],
        "prompt": "The other kids dare you to eat a worm.",
        "choices": [
            ("Do it for the glory", {"happiness": +6, "health": -6},
             "Legendary. Also, you felt sick for a day."),
            ("Politely decline", {"intelligence": +5, "happiness": -2},
             "Wise beyond your years."),
        ],
    },

    # --- School ---
    {
        "stages": ["School"],
        "prompt": "Big exam coming up. How do you spend the week?",
        "choices": [
            ("Study hard", {"intelligence": +12, "happiness": -6, "health": -3},
             "You aced it, but you're exhausted."),
            ("Slack off and play games", {"happiness": +10, "intelligence": -8},
             "Fun week. The grade... not so much."),
        ],
    },
    {
        "stages": ["School"],
        "prompt": "The school sports team is holding tryouts.",
        "choices": [
            ("Join the team", {"health": +12, "looks": +6, "intelligence": -3},
             "You make the team and get fit."),
            ("Join the chess club instead", {"intelligence": +10, "health": -2},
             "Checkmate. Your brain thanks you."),
        ],
    },

    # --- Adulthood ---
    {
        "stages": ["Adulthood", "Career"],
        "prompt": "Someone charming asks you out on a date.",
        "choices": [
            ("Start a relationship", {"happiness": +14, "money": -6},
             "You fall in love. Life feels brighter."),
            ("Focus on yourself for now", {"intelligence": +6, "money": +4},
             "You invest in you. No regrets."),
        ],
    },
    {
        "stages": ["Adulthood", "Career"],
        "prompt": "A friend offers you a spot on a risky startup.",
        "choices": [
            ("Take the leap", {"money": +20, "happiness": +5, "health": -8},
             "The gamble pays off... this time."),
            ("Play it safe with a steady job", {"money": +8, "happiness": -2},
             "Stable and secure. Boring, but reliable."),
        ],
    },

    # --- Career ---
    {
        "stages": ["Career"],
        "prompt": "Your boss offers a promotion with long hours.",
        "choices": [
            ("Accept the promotion", {"money": +18, "happiness": -8, "health": -6},
             "More money, less free time."),
            ("Decline and keep balance", {"happiness": +8, "money": -2},
             "You protect your peace of mind."),
        ],
    },
    {
        "stages": ["Career", "Old Age"],
        "prompt": "You have some savings. What do you do with them?",
        "choices": [
            ("Invest in the market", {"money": +15, "happiness": -3},
             "Your portfolio grows nicely."),
            ("Take a dream vacation", {"happiness": +16, "money": -18, "health": +4},
             "Unforgettable memories made."),
        ],
    },

    # --- Old Age ---
    {
        "stages": ["Old Age"],
        "prompt": "Retirement is here. How do you spend your days?",
        "choices": [
            ("Volunteer in the community", {"happiness": +12, "health": +4},
             "Giving back keeps you young at heart."),
            ("Relax quietly at home", {"happiness": +6, "health": +6, "looks": -2},
             "Peaceful, restful days."),
        ],
    },
    {
        "stages": ["Old Age"],
        "prompt": "The doctor recommends a new fitness routine.",
        "choices": [
            ("Commit to it", {"health": +12, "happiness": -2},
             "You feel stronger every week."),
            ("Ignore it and enjoy dessert", {"happiness": +8, "health": -10},
             "Cake now, consequences later."),
        ],
    },
]


# ---------------------------------------------------------------------------
# SECTION 5: Game flow
# ---------------------------------------------------------------------------

def ask_choice(character, event):
    """Show an event and its choices, then return the chosen option."""
    print(event["prompt"])
    for i, (label, _changes, _result) in enumerate(event["choices"], start=1):
        print(f"  {i}. {label}")

    while True:
        raw = input("Choose > ").strip()
        if raw.isdigit():
            index = int(raw) - 1
            if 0 <= index < len(event["choices"]):
                return event["choices"][index]
        print("Please enter a valid choice number.")


def pick_event(character):
    """Pick a random event valid for the character's current life stage."""
    stage = character.stage()
    valid = [e for e in EVENTS if stage in e["stages"]]
    if not valid:
        return None
    return random.choice(valid)


def check_death(character):
    """Decide whether the character dies this year.

    Two ways to die: low health, or an age-scaled chance of old-age death.
    Returns True if the character died.
    """
    # Low health can be fatal.
    if character.stats["health"] <= 0:
        character.alive = False
        character.cause_of_death = "poor health"
        return True

    # The older you get, the higher the yearly chance of dying naturally.
    old_age_chance = max(0.0, (character.age - 60) / (MAX_AGE - 60)) * 0.4
    if character.age >= MAX_AGE:
        old_age_chance = 1.0

    if random.random() < old_age_chance:
        character.alive = False
        character.cause_of_death = "old age"
        return True

    return False


def live_one_year(character):
    """Play a single year: aging, a random event, and a death check."""
    character.age += 1
    character.print_stats()

    event = pick_event(character)
    if event:
        label, changes, result = ask_choice(character, event)
        character.apply(changes)
        print(f"\n>> {result}")
        character.record(f"{result} ({label})")
    else:
        # Fallback if no event exists for this stage yet.
        print("A quiet, uneventful year passes.")

    # A little natural drift so nothing stays static forever.
    character.apply({"health": random.randint(-2, 1)})

    input("\nPress Enter to continue to the next year...")
    return check_death(character)


# ---------------------------------------------------------------------------
# SECTION 6: End-of-life summary
# ---------------------------------------------------------------------------

def show_summary(character):
    """Print the life story and a final score once the character dies."""
    print("\n" + "=" * 50)
    print(f"  {character.name} has died at age {character.age}")
    print(f"  Cause: {character.cause_of_death}")
    print("=" * 50)

    print("\nFinal stats:")
    for stat in STAT_NAMES:
        print(f"  {stat.capitalize():<13} {character.stats[stat]}")

    # A simple life score: the average of all final stats.
    score = sum(character.stats.values()) / len(character.stats)
    print(f"\n  Life score: {score:.1f} / 100")

    print("\nLife story:")
    if character.history:
        for line in character.history:
            print(f"  - {line}")
    else:
        print("  A short life with no notable moments.")

    print("\nThanks for playing!\n")


# ---------------------------------------------------------------------------
# SECTION 7: Main entry point
# ---------------------------------------------------------------------------

def main():
    print("=" * 50)
    print("            WELCOME TO LIFE SIMULATOR")
    print("=" * 50)
    print("Live one year at a time. Your choices shape who you become.\n")

    name = input("What is your character's name? ").strip() or "Alex"
    character = Character(name)

    print(f"\n{name} is born with these starting stats:")
    character.print_stats()
    input("Press Enter to begin life...")

    # Main game loop: keep living years until death.
    while character.alive:
        died = live_one_year(character)
        if died:
            break

    show_summary(character)


if __name__ == "__main__":
    try:
        main()
    except (KeyboardInterrupt, EOFError):
        print("\n\nGame ended early. Goodbye!")
