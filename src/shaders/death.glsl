uniform vec3 color;
uniform vec3 secondaryColor;
uniform float opacity;

varying vec2 vUv;

void main() {
  float mixture = step(.5, (vUv.x + vUv.y) * .5);
  gl_FragColor = vec4(mix(color, secondaryColor, mixture), opacity);
}