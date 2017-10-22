uniform vec3 color;
uniform vec3 secondaryColor;
uniform float opacity;

varying vec2 vUv;

float stroke(float x, float s, float w) {
  float d = step(s, x + w * .5) - step(s, x - w * .5);
  return clamp(d, 0., 1.);
}

void main() {
  float mixture = stroke(vUv.x, .5, .15);
  gl_FragColor = vec4(mix(color, secondaryColor, mixture), opacity);
}