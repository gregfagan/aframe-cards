uniform vec3 color;
uniform vec3 secondaryColor;
uniform float opacity;

varying vec2 vUv;

void main() {
  gl_FragColor = vec4(mix(color, secondaryColor, step(0.5, vUv.x)), opacity);
}