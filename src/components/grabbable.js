import { registerComponent } from 'aframe'
import CursorDragObserver from '../util/CursorDragObserver'

export default registerComponent('grabbable', {
  init() {
    const { el } = this
    this.dragEvents = new CursorDragObserver(el, dragEvent => {
      let grabberState
      return dragEvent.do({
        next: whereNow => {
          if (!grabberState) {
            grabberState = this.attachGrabber(whereNow)
          }

          const body = grabberState.el.components['dynamic-body']
          if (body) {
            grabberState.el.setAttribute('position', whereNow)
            body.syncToPhysics()
          }
        },
        complete: () => grabberState.detach(),
        error: err => {
          grabberState.detach()
          console.error(err)
        }
      })
    })
  },

  attachGrabber(where) {
    const { el } = this
    const { sceneEl, body } = el

    // Grabbing immediately halts the element
    body.velocity.setZero()
    body.angularVelocity.setZero()

    // A grabber element is created to serve as an attachment point
    const grabberEl = document.createElement('a-grabber')
    grabberEl.setAttribute('position', where)

    // Attach the grabber to this grabbable element with a
    // point to point constraint
    const targetPivot = where.clone()
    el.object3D.worldToLocal(targetPivot)
    grabberEl.setAttribute('constraint', {
      type: 'pointToPoint',
      collideConnected: false,
      target: `#${el.id}`,
      targetPivot
    })

    // Append the grabber to the scene
    sceneEl.appendChild(grabberEl)

    // Infrom element of the start of grabbing
    el.emit('grab-begin')

    // Return a state object with a reference to the grabber
    // element and a detach method
    return {
      el: grabberEl,
      detach: () => {
        sceneEl.removeChild(grabberEl)
        el.emit('grab-end')
      }
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
