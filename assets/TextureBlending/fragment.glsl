precision mediump float;

uniform sampler2D tex[16];

uniform float mixer;
uniform float upperRange;
uniform float lowerRange;

varying vec2 vUV;
varying vec4 vBlend;

float getWeight(float fragVertex, float fragAlpha)
{
    float mixBlend = mix(fragVertex, fragAlpha, mixer);
    return smoothstep(lowerRange, upperRange, mixBlend);
}

vec4 blendTex(vec4 orig, vec4 add, float fragVertex) {
    float fragAlpha = add.a;
    add = vec4(add.rgb, 1.0);
    
    float weight = getWeight(fragVertex, fragAlpha);

    return mix(orig, add, weight);
}

void main(void) {
    
    vec4 frag0 = texture2D(tex[0], vUV);
    vec4 frag1 = texture2D(tex[1], vUV);
    vec4 frag2 = texture2D(tex[2], vUV);

    vec4 res = blendTex(frag0, frag1, vBlend.x);
    res = blendTex(res, frag2, vBlend.y);
    
    
    gl_FragColor = res;//mix(res1, res2, 0.5);
}
