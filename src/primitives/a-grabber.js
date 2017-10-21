import { registerPrimitive } from 'aframe'

export default registerPrimitive('a-grabber', {
  defaultComponents: {
    geometry: {
      primitive: 'sphere',
      segmentsWidth: 4,
      segmentsHeight: 4,
      radius: 0.005
    },
    visible: 'false',
    'dynamic-body': {
      mass: 0
    }
  }
})
