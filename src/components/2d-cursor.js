// Implements a cursor based on mouse or touch input
// Attempts to conform to A-Frame's cursor events and states

import AFRAME, { registerComponent } from 'aframe'

const { Vector2, Vector3, Quaternion } = AFRAME.THREE

registerComponent('2d-cursor', {
  dependencies: ['raycaster', 'camera'],
  schema: {},

  init() {
    this.pointerPosition = new Vector2()
    this.canvasRect = null
    this.eventListeners = null

    this.generateEventListeners()
  },

  remove() {
    this.removeEventListeners()
  },

  generateEventListeners() {
    const { el } = this
    const { sceneEl } = el
    const { canvas } = sceneEl

    // If the canvas isn't initialized yet, defer this task to the future
    if (!canvas) {
      sceneEl.addEventListener(
        'render-target-loaded',
        this.generateEventListeners.bind(this),
      )
      return
    }

    // prettier-ignore
    this.eventListeners = [
      { target: window, event: 'resize', cb: this.getCanvasRect.bind(this) },
      { target: document, event: 'scroll', cb: this.getCanvasRect.bind(this) },
      { target: canvas, event: 'mousedown', cb: this.onPointerDown.bind(this) },
      { target: canvas, event: 'mousemove', cb: this.onPointerMove.bind(this) },
      { target: canvas, event: 'mouseup', cb: this.onPointerUp.bind(this) },
      { target: canvas, event: 'mouseout', cb: this.onPointerUp.bind(this) },
      { target: canvas, event: 'touchstart', cb: this.onPointerDown.bind(this) },
      { target: canvas, event: 'touchmove', cb: this.onPointerMove.bind(this) },
      { target: canvas, event: 'touchend', cb: this.onPointerUp.bind(this) },
    ]

    this.getCanvasRect()
    this.addEventListeners()
  },

  addEventListeners() {
    this.eventListeners.forEach(({ target, event, cb }) => {
      target.addEventListener(event, cb)
    })
  },

  removeEventListeners() {
    this.eventListeners.forEach(({ target, event, cb }) => {
      target.removeEventListener(event, cb)
    })
  },

  // When the pointer moves, we need to update the direction of the raycaster
  // This is the main effect of this component
  updateRaycaster: (() => {
    // Keep some reusable objects in a closure
    const position = new Vector3()
    const quaternion = new Quaternion()
    const scale = new Vector3() // unused
    const newAttribute = { direction: new Vector3() }

    return function updateRaycaster() {
      const { el, pointerPosition } = this
      const camera = el.getObject3D('camera')

      if (!camera) {
        return
      }

      el.object3D.matrixWorld.decompose(position, quaternion, scale)
      quaternion.inverse()
      newAttribute.direction
        .set(pointerPosition.x, pointerPosition.y, 0.5)
        .unproject(camera)
        .sub(position)
        .applyQuaternion(quaternion)
        .normalize()
      el.setAttribute('raycaster', newAttribute)
    }
  })(),

  getCanvasRect() {
    this.canvasRect = this.el.sceneEl.canvas.getBoundingClientRect()
  },

  setPositionFromEvent(event) {
    if (!event || !this.canvasRect) return

    let x
    let y
    const { width, height, left, top } = this.canvasRect
    const { touches } = event

    if (touches && touches.length > 0) {
      const touch = touches[0]
      x = touch.clientX
      y = touch.clientY
    } else {
      x = event.clientX
      y = event.clientY
    }

    // Adjust for canvas offset when scene is embedded
    x -= left
    y -= top

    // normalize
    x = x / width * 2 - 1
    y = -(y / height) * 2 + 1

    this.pointerPosition.set(x, y)
  },

  updatePointer(event) {
    this.setPositionFromEvent(event, this.pointerPosition)
    this.updateRaycaster()
  },

  onPointerDown(event) {
    this.updatePointer(event)
  },

  onPointerMove(event) {
    this.updatePointer(event)
  },

  onPointerUp(event) {
    this.updatePointer(event)
  },
})
