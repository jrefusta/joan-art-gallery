uniform sampler2D uTexturePrev;
uniform sampler2D uTextureNext;
uniform float uTransition;
varying vec2 vUv;

void main () {
  vec4 tex1 = texture2D(uTexturePrev, vUv);
  vec4 tex2 = texture2D(uTextureNext, vUv);
  gl_FragColor = mix(tex1, tex2, uTransition);
}