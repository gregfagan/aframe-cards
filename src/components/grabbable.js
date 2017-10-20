import { registerComponent } from 'aframe'
import CursorDragObserver from '../util/CursorDragObserver'

export default registerComponent('grabbable', {
  init() {
    const { el } = this
    this.dragEvents = new CursorDragObserver(el, dragEvent => {
      let grabberEl
      let detachGrabber
      return dragEvent.do({
        next: whereNow => {
          if (!grabberEl) {
            grabberEl = this.createGrabber(whereNow)
            detachGrabber = this.attachGrabber(grabberEl)
          }

          grabberEl.setAttribute('position', whereNow)
          grabberEl.components['dynamic-body'].syncToPhysics()
        },
        complete: () => detachGrabber(),
        error: err => {
          detachGrabber()
          console.error(err)
        }
      })
    })
  },

  createGrabber(where) {
    const { el } = this
    const grabberEl = document.createElement('a-entity')

    // TODO: why doesn't this version work?
    // const grabberEl = document.createElement('a-grabber')

    grabberEl.setAttribute('position', where)

    grabberEl.setAttribute('geometry', {
      primitive: 'sphere',
      segmentsWidth: 8,
      segmentsHeight: 8,
      radius: 0.005
    })

    grabberEl.setAttribute('dynamic-body', {
      mass: 0
    })

    const localGrabberPoint = where.clone()
    el.object3D.worldToLocal(localGrabberPoint)
    grabberEl.setAttribute('constraint', {
      type: 'pointToPoint',
      collideConnected: false,
      target: `#${el.id}`,
      targetPivot: localGrabberPoint
    })

    // grabberEl.setAttribute('target', `#${el.id}`)
    // grabberEl.setAttribute('target-pivot', localGrabberPoint)

    return grabberEl
  },

  // returns function detachGrabber: () => undefined; call to clean up
  attachGrabber(grabberEl) {
    const { el } = this
    const { sceneEl, body } = el
    sceneEl.appendChild(grabberEl)
    body.velocity.setZero()
    body.angularVelocity.setZero()
    el.emit('grab-begin')
    return () => {
      sceneEl.removeChild(grabberEl)
      el.emit('grab-end')
    }
  },

  play() {
    this.subscription = this.dragEvents.subscribe(() => {
      this.el.sceneEl.systems.physics.driver.world.gravity.set(0, -0.5, 0)
    })
  },

  pause() {
    this.subscription.unsubscribe()
  },

  remove() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }
})
