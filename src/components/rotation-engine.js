import AFRAME from 'aframe'

AFRAME.registerComponent('rotation-engine', {
  schema: {
    rpm: { default: 1 },
  },

  tick(time) {
    const minutes = time / (60 * 1000)
    const rotation = minutes * this.data.rpm * 360.0 % 360.0
    this.el.setAttribute('rotation', `0 ${rotation} 0`)
  },
})
