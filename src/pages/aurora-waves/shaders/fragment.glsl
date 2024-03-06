uniform float time;
varying vec2 vUv;
varying vec3 vPosition;

// NOISE
float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

mat2 rotate2D(float angle) {
    return mat2(
        cos(angle), -sin(angle),
        sin(angle), cos(angle)
    );
}

float lines(vec2 uv, float offset) {
    return smoothstep(
        0.0,
        0.5 + offset * 0.5,
        abs(0.5 * (sin(uv.x * 18.0) + offset * 2.0))
    );
}

void main() {
    float n = noise(vPosition * 2.8 + time * 0.1);

    vec3 mainColor = vec3(
        float(255) / 255.0,
        float(126) / 255.0,
        float(212) / 255.0
    );
    vec3 subColor = vec3(
        float(255) / 255.0,
        float(62) / 255.0,
        float(165) / 255.0
    );
    vec3 accentColor = vec3(
        float(100) / 255.0,
        float(32) / 255.0,
        float(170) / 255.0
    );

    vec2 baseUV = rotate2D(abs(0.5 * time * 0.04)) * vPosition.xy * n;
    float basePattern = lines(baseUV, 0.1);
    float secondPattern = lines(baseUV, 0.5);

    vec3 tempColor = mix(subColor, mainColor, basePattern);
    vec3 mixColor = mix(tempColor, accentColor, secondPattern);

    gl_FragColor = vec4(vec3(mixColor), 1.0);
}
