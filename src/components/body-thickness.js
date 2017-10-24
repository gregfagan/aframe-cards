import { registerComponent } from 'aframe'

//
// THIS IS A HACK
//
// As of aframe-physics-system 2.1.0, its three-to-cannon dependency constructs
// a collision box for planes with a minimum z thickness of 2cm. That value is a
// good minimum, as small values can penetrate during collisions, but I am simulating
// playing cards which are very thin.
//
// This component adjusts the shape after the dynamic-body component has sent the
// body-loaded event.
//
// A better solution is to modify aframe-physics-system to accept an alternate
// method of generating shapes, possibly by a selector which can point to an
// entity with different geometry to use for collision.
//

export default registerComponent('body-thickness', {
  dependencies: ['dynamic-body'],
  schema: { type: 'number', default: 0.2 },

  init() {
    if (this.el.body) {
      this.adjustBody()
    }
    this.el.addEventListener('body-loaded', () => this.adjustBody())
  },

  adjustBody() {
    const { el, data: thickness } = this
    const { body, components, sceneEl } = el
    const bodyComponent = components['dynamic-body']
    const { wireframe } = bodyComponent

    const halfThickness = thickness / 2

    for (const shape of body.shapes) {
      if (shape.halfExtents) {
        const newExtents = shape.halfExtents.clone()
        newExtents.z = halfThickness
        const newShape = new CANNON.Box(newExtents)
        body.shapes.length = 0
        body.addShape(newShape)

        if (wireframe) {
          sceneEl.object3D.remove(wireframe)
          bodyComponent.createWireframe(body, newShape)
          sceneEl.object3D.add(bodyComponent.wireframe)
        }
      }
    }
  }
})
