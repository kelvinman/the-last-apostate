// Difficulty check: plays many full runs headlessly with two scripted players and reports
// how far they get. Run it after changing BALANCE (or any combat numbers) in
// src/game/engine.ts:
//
//   pnpm balance            # 30 runs per player
//   pnpm balance 100        # more runs, steadier numbers
//   pnpm balance 30 heretic # on another difficulty (doubter, apostate, heretic)
//
// "Idle" never presses anything: with auto-fire and auto-rites the game must not play
// itself, so idle should fall around the first boss. "Dodger" is a simple script that
// keeps its distance, jumps blood spit and shockwaves, and dashes when cornered; a real
// player using ledges and portals should do better than it.

import { steer } from '../src/game/bot'
import { DIFFICULTIES, MAX_WAVE, chooseUpgrade, makeGame, startWave, step, type Difficulty, type Game, type Input } from '../src/game/engine'

type Strategy = (g: Game, input: Input) => void

const idle: Strategy = () => {}

// The same scripted apostate the cycle mode plays, without its wandering (see src/game/bot.ts).
const dodger: Strategy = (g, input) => steer(g, g.player, input)

const difficulty = (process.argv[3] ?? 'apostate') as Difficulty
if (!(difficulty in DIFFICULTIES)) throw new Error(`Unknown difficulty: ${difficulty}`)

function play(strategy: Strategy) {
  const g = makeGame({ difficulty })
  g.phase = 'playing'
  startWave(g)
  const input: Input = { left: false, right: false, down: false, jumpHeld: false, pressed: new Set() }
  const dt = 1 / 60
  let time = 0
  // 25 minutes of game time is plenty for a full 20-sermon run.
  while (time < 25 * 60) {
    if (g.phase === 'upgrade') chooseUpgrade(g, g.offers[Math.floor(Math.random() * g.offers.length)])
    if (g.phase === 'dead' || g.phase === 'won') break
    strategy(g, input)
    step(g, input, dt)
    input.pressed.clear()
    g.events.length = 0
    time += dt
  }
  return { wave: g.wave, won: g.phase === 'won', minutes: time / 60, killedBy: g.lastHurtBy }
}

const runs = Number(process.argv[2] ?? 30)
const rows: Record<string, Record<string, string | number>> = {}
for (const [name, strategy] of [
  ['idle', idle],
  ['dodger', dodger],
] as const) {
  const results = Array.from({ length: runs }, () => play(strategy))
  const waves = results.map((result) => result.wave).sort((a, b) => a - b)
  const at = (fraction: number) => waves[Math.min(waves.length - 1, Math.floor(waves.length * fraction))]
  const killers = new Map<string, number>()
  for (const result of results) if (!result.won) killers.set(result.killedBy, (killers.get(result.killedBy) ?? 0) + 1)
  const topKiller = [...killers.entries()].sort((a, b) => b[1] - a[1])[0]
  rows[name] = {
    'median sermon': at(0.5),
    'p25–p75': `${at(0.25)}–${at(0.75)}`,
    best: waves[waves.length - 1],
    wins: `${results.filter((result) => result.won).length}/${runs}`,
    'avg minutes': Number((results.reduce((sum, result) => sum + result.minutes, 0) / runs).toFixed(1)),
    'top killer': topKiller ? `${topKiller[0]} (${topKiller[1]})` : '–',
  }
}
console.log(`\n${runs} runs per player on ${DIFFICULTIES[difficulty].name}, ${MAX_WAVE} sermons to win\n`)
console.table(rows)
console.log('\nTargets on Apostate: idle falls by about sermon 5; the dodger reaches the high single digits and occasionally wins.\n')
