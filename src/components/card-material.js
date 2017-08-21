import { registerComponent, THREE } from 'aframe'
import vertexShader from '../shaders/vertex.glsl'
import fragmentShader from '../shaders/fragment.glsl'

export default registerComponent('card-material', {
  schema: {
    color: { type: 'color', default: 'black' },
  },

  init() {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        color: { type: 'c', value: new THREE.Color(this.data.color) },
      },
      vertexShader,
      fragmentShader,
    })

    this.applyToMesh()
    this.el.addEventListener('model-loaded', () => this.applyToMesh())
  },

  update() {
    this.material.uniforms.color.value.set(this.data.color)
  },

  applyToMesh() {
    const mesh = this.el.getObject3D('mesh')
    if (mesh) {
      mesh.material = this.material
    }
  },
})
