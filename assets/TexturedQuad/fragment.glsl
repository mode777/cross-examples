precision mediump float;

uniform sampler2D texture0;
varying vec2 vUV;


void main(void) {
    vec4 frag = texture2D(texture0, vUV);

    gl_FragColor = frag;
}