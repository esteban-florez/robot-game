import kaboom from 'kaboom'

const RESOLUTION = 256
const SQUARE = 16
const GROUND = [156, 90, 60]
const SPEED = SQUARE * 8

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

k.setGravity(SQUARE * 20)

k.loadSprite('fat', 'sprites/fat-robot.png')
k.loadSprite('grass', 'sprites/grass.png')

const fat = k.add([
  k.pos(k.center()),
  k.scale(2),
  k.sprite('fat'),
  k.anchor('center'),
  k.area(),
  k.body(),
])

k.add([
  k.pos(0, RESOLUTION - SQUARE * 2),
  k.sprite('grass', {
    tiled: true,
    width: RESOLUTION,
  }),
  k.area(),
  k.body({ isStatic: true })
])

k.add([
  k.pos(0, RESOLUTION - SQUARE),
  k.rect(RESOLUTION, SQUARE),
  k.color(GROUND),
])

Object.entries(MOVE_KEYS).forEach(([key, direction]) => {
  fat.onKeyDown(key, () => {
    fat.move(direction.scale(SPEED))
  })
})

fat.onGround(() => {
  // cuando cae el robot va a hacer una onda expansiva pa los laos, no se aún pa que
  // se me ocurre que el robot sea un robot obeso, que cuando cae hace onda expansiva
  // entonces va comiendo chatarra para hacerse más gordo y hacer ondas expansivas más potentes
  // puede haber puertas que necesiten cierto grado de onda expansiva, y tal, cosas así
  // mas onda expansiva, mas matas enemigos que se yo
})