// The scripted apostate. It keeps its distance from the nearest follower, jumps blood spit
// and shockwaves, and dashes when cornered. The balance script plays it as is; the cycle
// mode gives it a memory too, so between fights it wanders the arena, climbing ledges and
// dropping through them, and looks like someone playing rather than a script.

import { W, type Game, type Input, type Player, type Point } from './engine'

export type BotMemory = { target: Point | null; retarget: number; airJumped: boolean }

export const makeBotMemory = (): BotMemory => ({ target: null, retarget: 0, airJumped: false })

export function steer(g: Game, p: Player, input: Input, memory?: BotMemory, dt = 1 / 60) {
  let nearest: Game['enemies'][number] | null = null
  let distance = Infinity
  for (const e of g.enemies) {
    const d = Math.hypot(e.x - p.x, e.y - e.h / 2 - (p.y - p.h / 2))
    if (d < distance) {
      distance = d
      nearest = e
    }
  }
  input.left = false
  input.right = false
  input.down = false
  input.jumpHeld = false
  // Jump anything heading this way: orbs at body height, waves along the ground.
  for (const spit of g.spits) {
    const time = (p.x - spit.x) / (spit.vx || 1e-6)
    if (time <= 0 || time > 0.35) continue
    const height = spit.kind === 'wave' ? Math.abs(spit.y - p.y) < 12 : Math.abs(spit.y + spit.vy * time - (p.y - 35)) < 45
    if (height) {
      input.pressed.add('jump')
      input.jumpHeld = true
      if (time < 0.15) input.pressed.add('dash')
    }
  }
  // Nothing close: wander, if it has a memory to wander with; otherwise drift to the middle.
  if (!nearest || distance > 380) {
    if (memory) wander(g, p, input, memory, dt)
    else if (Math.abs(W / 2 - p.x) > 40) input[W / 2 > p.x ? 'right' : 'left'] = true
    return
  }
  if (memory) memory.target = null
  const dx = nearest.x - p.x
  if (distance < 180) input[dx > 0 ? 'left' : 'right'] = true
  else if (distance > 380) input[dx > 0 ? 'right' : 'left'] = true
  if ((p.x < 60 && input.left) || (p.x > W - 60 && input.right)) {
    input.left = !input.left
    input.right = !input.right
    input.pressed.add('jump')
    input.jumpHeld = true
  }
  if (distance < 110) {
    input.pressed.add('jump')
    input.jumpHeld = true
  }
  if (distance < 70) input.pressed.add('dash')
}

/** Head for a spot somewhere in the arena: a ledge or a place on the floor, picked afresh every few seconds. */
function wander(g: Game, p: Player, input: Input, memory: BotMemory, dt: number) {
  memory.retarget -= dt
  if (!memory.target || memory.retarget <= 0) {
    const spots: Point[] = [
      ...g.arena.platforms.map((platform) => ({ x: platform.x + platform.w / 2, y: platform.y })),
      { x: 160 + Math.random() * (W - 320), y: g.arena.surfaces[0].y },
    ]
    memory.target = spots[Math.floor(Math.random() * spots.length)]
    memory.retarget = 3 + Math.random() * 3
  }
  const target = memory.target
  const dx = target.x - p.x
  const dy = target.y - p.y
  if (Math.abs(dx) > 14) input[dx > 0 ? 'right' : 'left'] = true
  if (p.onGround) memory.airJumped = false
  // Above: jump when close enough underneath, and jump again near the top of the arc.
  if (dy < -20 && Math.abs(dx) < 160) {
    if (p.onGround) input.pressed.add('jump')
    else if (!memory.airJumped && p.vy > -60) {
      input.pressed.add('jump')
      memory.airJumped = true
    }
    input.jumpHeld = true
  }
  // Below: drop through the ledge it is standing on.
  if (dy > 20 && p.onPlatform && Math.abs(dx) < 200) {
    input.down = true
    input.pressed.add('down')
  }
  if (Math.abs(dx) < 14 && Math.abs(dy) < 12) memory.retarget = Math.min(memory.retarget, 0.6)
}
