precision mediump float;

uniform sampler2D texture;
varying vec2 vUV;

void main(void) {
    vec4 frag = texture2D(texture, vUV);

    gl_FragColor = frag;
    //gl_FragColor = vec4(1.0,1.0,1.0,1.0);
}