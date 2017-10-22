uniform vec3 color;
uniform vec3 secondaryColor;
uniform float opacity;

varying vec2 vUv;

#define PI 3.14159265359

void main() {
  float mixture = step(.5 + .15 * cos((vUv.y - 0.15) * 1.6 * PI), vUv.x);
  gl_FragColor = vec4(mix(color, secondaryColor, mixture), opacity);
}