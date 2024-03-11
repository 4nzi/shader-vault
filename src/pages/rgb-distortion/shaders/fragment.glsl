uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float progress;
uniform sampler2D tex;
uniform sampler2D displacement;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
    vec4 displace = texture2D(displacement, vUv.xy);
    vec2 displaceUV = vec2(vUv.x, vUv.y);
    displaceUV.y = mix(vUv.y, displace.r - 0.2, progress);

    vec4 color = texture2D(tex, displaceUV);
    color.r = texture2D(tex, displaceUV + vec2(0.0, 0.1) * progress).r;
    color.g = texture2D(tex, displaceUV + vec2(0.0, 0.2) * progress).g;
    color.b = texture2D(tex, displaceUV + vec2(0.0, 0.3) * progress).b;

    gl_FragColor = color;
}
