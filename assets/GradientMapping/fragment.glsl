precision mediump float;

uniform sampler2D tex[16];
uniform float grad;
uniform float offset;

varying vec2 vUV;

float floatForByte(float byte){
    return (byte + 0.5) / 255.0;
}

void main(void) {
    
    vec4 frag0 = texture2D(tex[0], vUV);
    vec4 frag1 = texture2D( tex[1], vec2(frag0.x + offset, floatForByte(grad)) );   
    
    gl_FragColor = frag1;
}
