attribute vec2 position;
attribute vec4 color;

varying vec4 vColor;

void main(void) {
    vColor = color;
    gl_Position = vec4(position.xy, 0.0, 1.0);
}