import AFRAME from 'aframe'

AFRAME.registerComponent('highlight-on-hover', {
  schema: { default: '#ffffff' },

  init() {
    this.onStateAdded = this.onStateAdded.bind(this)
    this.onStateRemoved = this.onStateRemoved.bind(this)
    this.el.addEventListener('stateadded', this.onStateAdded)
    this.el.addEventListener('stateremoved', this.onStateRemoved)
  },

  remove() {
    this.el.removeEventListener('stateadded', this.onStateAdded)
    this.el.removeEventListener('stateremoved', this.onStateRemoved)
  },

  onStateAdded(evt) {
    if (evt.detail.state === 'hovered') {
      this.previousColor = this.el.getAttribute('material').color
      this.el.setAttribute('material', 'color', this.data)
    }
  },

  onStateRemoved(evt) {
    if (evt.detail.state === 'hovered') {
      this.el.setAttribute('material', 'color', this.previousColor)
    }
  },
})
