attribute vec2 position;
attribute vec2 uv;

varying vec2 vUV;

void main(void) {
    vUV = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
}