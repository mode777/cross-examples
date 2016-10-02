attribute vec2 position;
attribute vec2 uv;
attribute vec4 blend;

varying vec2 vUV;
varying vec4 vBlend;

void main(void) {
    vUV = uv;
    vBlend = blend;
    gl_Position = vec4(position.xy, 0.0, 1.0);
}