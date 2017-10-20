import { registerPrimitive } from 'aframe'

export default registerPrimitive('a-grabber', {
  defaultComponents: {
    'dynamic-body': {
      mass: 0
    },
    constraint: {
      type: 'pointToPoint',
      collideConnected: false
    },
    geometry: {
      primitive: 'sphere',
      segmentsWidth: 8,
      segmentsHeight: 8,
      radius: 0.005
    }
  },

  mappings: {
    target: 'constraint.target',
    'target-pivot': 'constraint.targetPivot'
  }
})
