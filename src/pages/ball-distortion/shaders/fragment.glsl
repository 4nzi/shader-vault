uniform float time;
uniform vec2 resolution;
uniform vec3 mouse;
uniform float progress;
uniform sampler2D tex;
varying vec2 vUv;
varying vec3 vPosition;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() {
    vec2 normalizeUV = vUv * 2.0 - 1.0;
    vec2 direction = normalize(normalizeUV - mouse.xy);
    float dist = length(normalizeUV - mouse.xy);

    float prox = 1.0 - map(dist, 0.0, 0.7, 0.0, 1.0);
    prox = clamp(prox, 0.0, 1.0);

    vec2 zoomedUV = vUv + prox * direction * progress;
    vec2 zoomedUV2 = mix(vUv, mouse.xy + vec2(0.5), prox * 0.14);

    vec4 color = texture2D(tex, zoomedUV2);
    gl_FragColor = color;

}
