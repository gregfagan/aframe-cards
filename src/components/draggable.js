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
      const { intersection, target, cursorEl } = event.detail
      const where = intersection.point
      const { ray } = cursorEl.components.raycaster.raycaster

      // Construct a 2D plane that restricts the dragging motion. Currently
      // local Z of the object being dragged, but other strategies (parallel
      // to the camera, parallel to the ground) come to mind.
      const planeNormal = target.object3D
        .localToWorld(new THREE.Vector3(0, 0, 1))
        .normalize()
      const plane = new THREE.Plane(planeNormal, -1 * where.length())

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
    const { sceneEl } = el
    this.dragEvents = new DragEventsObservable(el, dragEvent => {
      const grabberEl = document.createElement('a-grabber')
      sceneEl.appendChild(grabberEl)
      return dragEvent.do({
        next: whereNow => grabberEl.setAttribute('position', whereNow),
        complete: () => sceneEl.removeChild(grabberEl)
      })
    })
  },

  play() {
    this.subscription = this.dragEvents.subscribe()
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
