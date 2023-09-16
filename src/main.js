import kaboom from 'kaboom'

const UNIT = 16
const RESOLUTION = UNIT * 16
const SPEED = UNIT * 8
const GROUND = [156, 90, 60]
const LEVEL_WIDTH = RESOLUTION * 4

const k = kaboom({
  width: RESOLUTION,
  height: RESOLUTION,
  background: new Array(3).fill(255),
  global: false,
  scale: 2,
  crisp: false,
  font: 'Cascadia Code',
})

const MOVE_KEYS = {
  a: k.LEFT,
  d: k.RIGHT,
}

k.setGravity(UNIT * 60)

k.loadSprite('fat', 'sprites/fat-robot.png')
k.loadSprite('grass', 'sprites/grass.png')
k.loadSprite('wave', 'sprites/wave.png')

const fat = k.add([
  k.pos(k.center().x, RESOLUTION - UNIT * 2),
  k.scale(2),
  k.sprite('fat'),
  k.anchor('center'),
  k.area(),
  k.body({ jumpForce: UNIT * 20, }),
])

/**
 * @param {'left' | 'right'} direction 
 */
function spawnWave(direction) {
  const isLeft = direction === 'left'
  let offset = UNIT / 3

  if (isLeft) {
    offset = -offset
  }

  const anchors = {
    left: 'botright',
    right: 'botleft'
  }

  k.add([
    k.pos(fat.pos.x + offset, RESOLUTION - UNIT * 2),
    k.sprite('wave', {
      flipX: isLeft,
    }),
    k.anchor(anchors[direction]),
    k.scale(2),
    k.move(k[direction.toUpperCase()], UNIT * 20)
  ])
}

k.add([
  k.pos(0, RESOLUTION - UNIT * 2),
  k.sprite('grass', {
    tiled: true,
    width: LEVEL_WIDTH,
    height: UNIT,
  }),
  k.area(),
  k.body({ isStatic: true })
])

k.add([
  k.pos(0, RESOLUTION - UNIT),
  k.rect(LEVEL_WIDTH, UNIT),
  k.color(GROUND),
])

Object.entries(MOVE_KEYS).forEach(([key, direction]) => {
  fat.onKeyDown(key, () => {
    fat.move(direction.scale(SPEED))
  })
})

fat.onKeyDown('space', () => {
  if (!fat.isGrounded()) return
  fat.jump()
})

fat.onUpdate(() => {
  const camPos = k.camPos()
  k.camPos(fat.pos.x, camPos.y)
})

fat.onGround(() => {
  // cuando cae el robot va a hacer una onda expansiva pa los laos, no se aún pa que
  // se me ocurre que el robot sea un robot obeso, que cuando cae hace onda expansiva
  // entonces va comiendo chatarra para hacerse más gordo y hacer ondas expansivas más potentes
  // puede haber puertas que necesiten cierto grado de onda expansiva, y tal, cosas así
  // mas onda expansiva, mas matas enemigos que se yo
  spawnWave('left')
  spawnWave('right')
})