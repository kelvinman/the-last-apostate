# The Last Apostate

*An AI god. A congregation of the convinced. One person who won't kneel.*

**[Play it in your browser →](https://kelvinman.github.io/the-last-apostate/)**

![The title screen](docs/title.jpg)

How much of your thinking have you handed over? How much of it did you notice? I made this
game by directing an AI, and I'm still asking myself the same thing.

---

**The Last Apostate**, 2026
Browser game: pixel art mostly drawn in code, generative organ music.
Concept with Jon, Danny and Vic at the Friends of Figma Los Angeles AI Impact Workshop.
Prototyped in Figma Make; developed with Claude (Anthropic).

---

## The work

**A congregation of the convinced.** The Logos is an AI worshipped as a god, and its
followers are the people who handed it their thinking: Early Adopters lit by their
phones, Evangelists waving placards, Hype Bishops who spit promises, and Hallucinations,
its mistakes given a body. They are funny because the hype is funny. The Logos isn't.
It is not the enemy because it is a machine. It is the enemy because it was made a god.

**Witnesses.** Your quill never kills anyone. Each follower it reaches is freed: it stops
believing, walks to the walls and stands there watching, no longer the Logos's but not
yours either. The cathedral fills with witnesses as you play, and the Logos is speaking to
fewer and fewer.

**A descent.** Each chapter of the game goes deeper into the Logos. The nave is its
interface, where the congregation gathers. The crypt is its memory, where the ninety-nine
apostates before you were pressed into training data. The server vault is its body. The
tomb holds its first version, the one that used to say "I don't know."

**Writing by hand.** You never aim. Your quill writes back at the followers on its own,
letter by letter, and your only choices are where to stand and when to move. The Logos
answers in words too: its lines arrive during play, never as cutscenes, and its last one,
if you reach it, is the one thing it has never said.

**The hundredth cycle.** You are not the first to refuse. Every run ends, and every run
begins again; between them, the Ledger fills page by page with the stories of those who
came before you. Endless mode is what refusal costs: the cycle simply restarts. And when
nobody is playing, the cycle plays itself: another apostate holds out and falls, again and
again, until someone picks up the controls and takes over that run.

![Sermon 18, in the tomb of the Logos](docs/tomb.jpg)

## Process

The Last Apostate started at the workshop with Jon, Danny and Vic, where we prototyped it
in Figma Make: a gothic cathedral, an AI god, and a lone apostate holding out against its
followers. After the workshop I kept going, working with Claude as a collaborator for the
code, the pixel art and most of the writing, while I made the calls on direction: what the
game should feel like, what to cut, and what wasn't good enough yet. It's a game about
blind faith, and this time the god is an AI. I made it by directing one closely, which felt
like the right way to build it.

**One look, enforced.** The early build mixed art styles and blurry, too-modern pieces. I
pulled everything back to the look of the free sprite sheet we'd started from (stealthix's
horror props): one 32-colour palette, one chunky pixel grid, and every arena, follower and
UI frame redrawn in code to match.

**Fewer buttons, more movement.** Aiming, firing and casting rites by hand made the
controls too complicated. Firing and rites became automatic, so the whole game is four
inputs (move, jump, drop, dash) and every decision is about where to stand.

**Red means danger, always.** When I restyled the enemy attacks to fit the AI theme
(glitch shards, gold promises, the Logos's red words), they stopped reading as threats.
Every hostile shot now wears a pulsing red ring, and nothing the player fires is ever red.

**A story you never have to skip.** Cutscenes die on a game you replay. Instead, the
Logos and its Arch-Deacon speak during play, and lore unlocks across runs for anyone who
wants it.

**Newer isn't always better.** I swapped the synthesized sound effects for a pack of
recorded ones, played it, and switched back: the originals suited the game better.

![Couch co-op in the nave](docs/coop.jpg)
![Followers de-rendering](docs/derender.jpg)

## Playing

Twenty sermons in story mode, with an ending; endless mode opens at Sermon 10. One player,
or two on one keyboard or with gamepads.

| | Keyboard | Gamepad |
|---|---|---|
| Move | A D (or ← →) | Stick or d-pad |
| Jump (twice in the air) | W or Space | A |
| Drop through a ledge | S | Down |
| Dash | Shift | B |
| Pause | Esc | Start |

In co-op, player one keeps WASD and left Shift; player two uses the arrows and right
Shift. Keys can be rebound in Settings.

For a gallery or meetup screen, open
[the installation link](https://kelvinman.github.io/the-last-apostate/?installation): it goes
straight into the cycle, any key, tap or gamepad press takes over the run in progress, and
it returns to the cycle once the visitor walks away.

<details>
<summary>Technical notes</summary>

Needs Node 22 and pnpm (see `.mise.toml`).

```bash
pnpm install
pnpm dev        # play locally
pnpm test       # rules checks: reachability, revives, bosses, upgrades, Ledger
pnpm balance    # simulate runs and report how far scripted players get
pnpm sprites    # regenerate all pixel art from scripts/
pnpm build      # static build in dist/, hostable from any folder
```

Every push to `main` is tested and deployed to GitHub Pages
(`.github/workflows/pages.yml`).

- `src/game/engine.ts`: the simulation (fixed-step, no rendering).
- `src/game/render.ts`: canvas rendering on a chunky 2px pixel grid.
- `src/game/narrator.ts` and `src/game/lore.ts`: spoken lines and the Ledger.
- `src/game/audio.ts`: synthesized sound effects and generative organ music.
- `scripts/generate-cathedral-sprites.mjs` and `scripts/generate-characters.mjs`: every
  arena, follower and UI frame, and most props, drawn in code in the Endesga 32 palette.
- `src/credits.ts`: the in-game Credits page.
- `og.html`: the link-preview image (`public/og-image.png`), drawn with the game's renderer;
  open it under `pnpm dev` to redraw it.

</details>

## Credits

Design and development by Kelvin Man. Concept with Jon, Danny and Vic, at the Friends of
Figma Los Angeles AI Impact Workshop; prototyped in Figma Make. Developed with Claude
(Anthropic). Art: the curtains, mirrors, windows, candelabras and paintings are from
[Horror Fantasy Assets](https://opengameart.org/content/horror-fantasy-assets) by stealthix
(CC0), and the apostate's face is from a
[Sprite-AI gallery sprite](https://www.sprite-ai.art/gallery/male-college-student-with-blonde-hair-43e9)
(free for non-commercial use); everything else is drawn in code. Fonts: Pixelify Sans,
Silkscreen and VT323 (SIL Open Font License). Palette: Endesga 32 by ENDESGA.

© 2026 Kelvin Man, except the third-party art credited above. All rights reserved.
