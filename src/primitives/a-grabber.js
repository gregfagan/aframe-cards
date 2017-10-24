import { registerPrimitive } from 'aframe'

export default registerPrimitive('a-grabber', {
  defaultComponents: {
    'static-body': {
      shape: 'sphere',
      sphereRadius: 0.002
    },
    grabber: true
  }
})
