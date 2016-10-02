attribute vec3 position;
attribute vec2 uv;

varying vec2 vUV;

uniform mat4 ortho;
uniform mat4 projection;
uniform mat4 view;


void main(void) {
    vUV = uv;
    

    gl_Position = projection * view * ortho * vec4(position.x, position.y, position.z, 1.0);
}