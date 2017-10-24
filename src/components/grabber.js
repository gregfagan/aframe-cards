import { registerComponent } from 'aframe'
// import CANNON from 'cannon'

export default registerComponent('grabber', {
  init() {
    const { el } = this
    el.addEventListener('body-loaded', () => {
      // el.body.type = CANNON.Body.KINEMATIC
      el.body.collisionResponse = false
    })
  }
})
