import { registerPrimitive } from 'aframe'

export default registerPrimitive('a-grabber', {
  defaultComponents: {
    geometry: {
      primitive: 'sphere',
      segmentsWidth: 8,
      segmentsHeight: 8,
      radius: 0.005,
    },
  },
})
