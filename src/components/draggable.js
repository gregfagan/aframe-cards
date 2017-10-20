import { registerComponent, THREE } from 'aframe'
import { Observable } from 'rxjs'

// Given an A-Frame element which is expected to receive events from a
// `cursor` component (elsewhere), this Observable will emit a stream of
// drag positions in world space (`THREE.Vector3`s).
//
// Subscribing to this stream gives all drag positions for all future drag
// events -- and is endless -- though you may optionally pass a project
// function as a second parameter which maps individual DragEvent streams,
// including complete notifications. Use `do` rather than `subscribe` to
// follow the inner drag events, as the subscription is handled by the
// outer switchMap automatically.
//
class DragEventsObservable {
  constructor(el, project = x => x) {
    // Drag Events are built on top of A-Frame cursor's mouse events,
    // though it does not send move events, so we take them from the
    // canvas directly. This does not support touch and a better
    // solution awaits.
    const mouseDownsEvents = Observable.fromEvent(el, 'mousedown')
    const mouseMoveEvents = Observable.fromEvent(el.sceneEl.canvas, 'mousemove')
    const mouseUpEvents = Observable.fromEvent(el, 'mouseup')

    // For each mouse down event, we generate a new observer stream
    // returning positions based on a ray and plane intersection calculated
    // from values captured by the event handler.
    //
    // The logic to calculate new position values assumes the ray is being
    // updated externally by the cursor component.
    return mouseDownsEvents.switchMap(event => {
      const { intersection, cursorEl } = event.detail
      const where = intersection.point
      const { ray } = cursorEl.components.raycaster.raycaster

      // Construct a 2D plane that restricts the dragging motion. Currently
      // local Z of the object being dragged, but other strategies (parallel
      // to the camera, parallel to the ground) come to mind.
      const normalToCamera = cursorEl.object3D
        .localToWorld(new THREE.Vector3(0, 0, 1))
        .normalize()
      const plane = new THREE.Plane(normalToCamera, -1 * where.length())

      const dragEvents = mouseMoveEvents
        .takeUntil(mouseUpEvents)
        .startWith(where)
        .map(() => ray.intersectPlane(plane)) // assumes ray updated by cursor

      return project(dragEvents)
    })
  }
}

export default registerComponent('draggable', {
  init() {
    const { el } = this
    this.dragEvents = new DragEventsObservable(el, dragEvent => {
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
    return () => sceneEl.removeChild(grabberEl)
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
