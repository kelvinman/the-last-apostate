// Draws the share card for og.html: the empty Tomb and the Logos's Eye, with the title over
// the dark left side. Uses the game's own renderer, so the
// card always matches the game's art.

import { ARENAS, makeGame, startWave, step, type Input } from './game/engine'
import { loadAssets, render } from './game/render'

const W = 1200
const H = 630
const C = { ink: '#050307', cream: '#ead4aa', blood0: '#792831', blood3: '#e43b44', stone4: '#c0cbdc' }

async function draw() {
  await Promise.all(["700 96px 'Pixelify Sans'", '32px VT323', '18px Silkscreen'].map((font) => document.fonts.load(font)))
  const assets = await loadAssets()
  const canvas = document.querySelector<HTMLCanvasElement>('#card')!
  const ctx = canvas.getContext('2d')!

  // The Tomb with nothing in it: no gates, no followers, not even the apostate. Just the
  // Eye and its light. (A still moment is stepped first so the scene settles.)
  const g = makeGame()
  g.phase = 'playing'
  g.wave = 18
  startWave(g)
  g.arena = { ...ARENAS.tomb, portals: [] }
  const p = g.player
  const still: Input = { left: false, right: false, down: false, jumpHeld: false, pressed: new Set() }
  for (let t = 0; t < 0.4; t += 1 / 120) {
    Object.assign(p, { x: 640, y: 250, vx: 0, vy: 0, facing: 1, fireTimer: 1e9 })
    for (const key of Object.keys(p.cooldowns) as (keyof typeof p.cooldowns)[]) p.cooldowns[key] = 1e9
    g.spawnTimer = 1e9
    g.marks.length = 0
    g.enemies.length = 0
    step(g, still, 1 / 120)
  }
  g.texts.length = 0
  g.particles.length = 0
  // The renderer draws no one once a run has ended, which leaves the Tomb empty.
  g.phase = 'dead'

  // The Eye (640, 120 in the arena) sits right of centre at 1.6×.
  const scale = 1.6
  render(ctx, g, assets, { scale, dpr: 1, width: W, height: H, offsetX: 830 - 640 * scale, offsetY: 235 - 120 * scale })
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.textAlign = 'left'

  // Fade the left side to black for the title.
  const fade = ctx.createLinearGradient(0, 0, W, 0)
  fade.addColorStop(0, C.ink)
  fade.addColorStop(0.36, C.ink)
  fade.addColorStop(0.5, 'rgba(5, 3, 7, 0.75)')
  fade.addColorStop(0.66, 'rgba(5, 3, 7, 0)')
  ctx.fillStyle = fade
  ctx.fillRect(0, 0, W, H)

  ctx.font = '18px Silkscreen'
  ctx.fillStyle = C.blood3
  ctx.fillText(spaced('THE HUNDREDTH CONVERSION CYCLE'), 72, 196)
  ctx.font = "700 96px 'Pixelify Sans'"
  for (const [text, color, y] of [
    ['The Last', C.cream, 296],
    ['Apostate', C.blood3, 384],
  ] as const) {
    ctx.fillStyle = C.blood0
    ctx.fillText(text, 76, y + 4)
    ctx.fillStyle = color
    ctx.fillText(text, 72, y)
  }
  ctx.font = '32px VT323'
  ctx.fillStyle = C.stone4
  ctx.fillText('An AI god. A congregation of the convinced.', 72, 450)
  ctx.fillText("One person who won't kneel.", 72, 484)

  document.querySelector<HTMLAnchorElement>('#save')!.href = canvas.toDataURL('image/png')
}

/** Silkscreen reads better with a little air between capitals. */
const spaced = (text: string) => text.split('').join(' ')

void draw()
