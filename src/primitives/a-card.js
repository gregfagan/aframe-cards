import { registerPrimitive } from 'aframe'

export default registerPrimitive('a-card', {
  defaultComponents: {
    geometry: {
      primitive: 'plane',
      width: 0.0635,
      height: 0.0889
    },
    material: {
      shader: 'void',
      side: 'double'
    },
    'dynamic-body': {
      mass: 1,
      linearDamping: 0.1,
      angularDamping: 0.5
    },
    'body-thickness': 0.0025
  }
})
