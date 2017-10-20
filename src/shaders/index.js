import { registerShader } from 'aframe'

// Create A-Frame shaders out of the .glsl fragment shaders. All of these
// take the same few parameters.

const contextRequire = require.context('.', false, /^.*\.glsl/)
for (const shaderFile of contextRequire.keys()) {
  const shaderName = /\.\/(.*)\.glsl/i.exec(shaderFile)[1]
  console.log(shaderName)
  registerShader(shaderName, {
    schema: {
      color: { type: 'color', is: 'uniform', default: 'black' },
      opacity: { type: 'number', is: 'uniform', default: 1.0 }
    },
    fragmentShader: contextRequire(shaderFile)
  })
}
