import { registerShader } from 'aframe'

// Create A-Frame shaders out of the .glsl fragment shaders. All of these
// take the same few parameters.

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`

const contextRequire = require.context('.', false, /^.*\.glsl/)
contextRequire.keys().forEach(shaderFile => {
  const shaderName = /\.\/(.*)\.glsl/i.exec(shaderFile)[1]
  registerShader(shaderName, {
    schema: {
      color: { type: 'color', is: 'uniform', default: '#333333' },
      secondaryColor: { type: 'color', is: 'uniform', default: '#CCCCCC' },
      opacity: { type: 'number', is: 'uniform', default: 1.0 }
    },
    fragmentShader: contextRequire(shaderFile),
    vertexShader
  })
})
