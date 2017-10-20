import { registerComponent } from 'aframe'
import { Observable } from 'rxjs'

export default registerComponent('only-grab-once', {
  init() {
    this.observable = Observable.fromEvent(this.el, 'grab-end').take(1)
  },

  play() {
    const { el } = this

    this.subscription = this.observable.subscribe(() => {
      el.removeAttribute('grabbable')
    })
  },

  pause() {
    this.subscription.unsubscribe()
    this.subscription = null
  },

  remove() {
    this.pause()
    this.observable = null
  }
})
