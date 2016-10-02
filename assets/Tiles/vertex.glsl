attribute vec2 position;
attribute vec2 uv;

varying vec2 vUV;

uniform mat4 projection;
uniform mat4 view;


void main(void) {
    vUV = uv;
    gl_Position = projection * view * vec4(position.xy, 0.0, 1.0);
    //gl_Position = vec4(position.xy, 1.0, 1.0);
}