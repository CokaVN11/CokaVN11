// ABOUTME: Procedural aurora gradient shader with sunset warm colors
// ABOUTME: Generates flowing gradient without external image using 3D simplex noise

/**
 * 3D Simplex noise implementation for flowing color fields
 * Based on Stefan Gustavson's implementation, extended to 3D
 */
const simplexNoise3DGLSL = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    // Permutations
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    // Gradients
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    // Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
`;

/**
 * Vertex shader - passes UV coordinates to fragment shader
 */
export const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Fragment shader - generates flowing aurora gradient
 *
 * Uniforms:
 * - uMouse: Normalized mouse position (0-1)
 * - uTime: Animation time for flowing effect
 * - uDistortionStrength: Intensity of mouse-based distortion
 * - uMouseRadius: Radius of mouse influence
 * - uFlowSpeed: Speed of the aurora flow animation
 * - uNoiseScale: Scale of the noise patterns
 *
 * Color Palette: Sunset Warm
 * - Orange (#F25926) → Pink (#D9408C) → Purple (#7326A6) → Dark (#261440)
 */
export const fragmentShader = `
  ${simplexNoise3DGLSL}

  uniform vec2 uMouse;
  uniform float uTime;
  uniform float uDistortionStrength;
  uniform float uMouseRadius;
  uniform float uFlowSpeed;
  uniform float uNoiseScale;

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;

    // Mouse-based displacement
    vec2 mouseDistance = uv - uMouse;
    float dist = length(mouseDistance);
    float influence = smoothstep(uMouseRadius, 0.0, dist);

    // Prevent division by zero for mouse displacement
    vec2 mouseDisplacement = vec2(0.0);
    if (dist > 0.001) {
      mouseDisplacement = normalize(mouseDistance) * influence * uDistortionStrength;
    }

    // Apply mouse distortion to UV
    vec2 distortedUv = uv + mouseDisplacement;

    // Multi-layer 3D noise for organic flowing movement
    float time = uTime * uFlowSpeed;

    // Primary flow layer (large, slow)
    float noise1 = snoise(vec3(distortedUv * uNoiseScale, time * 0.5));

    // Secondary detail layer (medium, faster)
    float noise2 = snoise(vec3(distortedUv * uNoiseScale * 2.0 + 100.0, time * 0.8));

    // Tertiary shimmer layer (fine, subtle)
    float noise3 = snoise(vec3(distortedUv * uNoiseScale * 4.0 - 50.0, time * 1.2));

    // Combine noise layers with decreasing influence
    float combinedNoise = noise1 * 0.5 + noise2 * 0.35 + noise3 * 0.15;

    // Sunset Warm color palette
    vec3 colorOrange = vec3(0.95, 0.35, 0.15);   // #F25926
    vec3 colorPink = vec3(0.85, 0.25, 0.55);     // #D9408C
    vec3 colorPurple = vec3(0.45, 0.15, 0.65);   // #7326A6
    vec3 colorDark = vec3(0.15, 0.08, 0.25);     // #261440

    // Calculate gradient position based on UV and noise
    float gradientPos = distortedUv.y + combinedNoise * 0.35;

    // Create smooth color transitions
    vec3 gradient = colorDark;
    gradient = mix(gradient, colorPurple, smoothstep(0.0, 0.35, gradientPos));
    gradient = mix(gradient, colorPink, smoothstep(0.3, 0.6, gradientPos));
    gradient = mix(gradient, colorOrange, smoothstep(0.55, 0.9, gradientPos));

    // Add noise-based color variation for more organic feel
    gradient += vec3(noise2 * 0.08, noise2 * 0.05, noise3 * 0.1);

    // Subtle glow highlights based on noise peaks
    float glowIntensity = smoothstep(0.4, 0.8, noise1) * 0.15;
    gradient += vec3(glowIntensity * 0.8, glowIntensity * 0.4, glowIntensity * 0.2);

    // Vignette effect - darken edges
    float vignette = 1.0 - smoothstep(0.3, 0.85, length(uv - 0.5));
    gradient *= 0.85 + vignette * 0.15;

    // Ensure colors stay in valid range
    gradient = clamp(gradient, 0.0, 1.0);

    gl_FragColor = vec4(gradient, 1.0);
  }
`;

/**
 * Shader uniforms configuration with defaults
 */
export const defaultUniforms = {
  uMouse: { value: [0.5, 0.5] },
  uTime: { value: 0 },
  uDistortionStrength: { value: 0.12 },
  uMouseRadius: { value: 0.35 },
  uFlowSpeed: { value: 0.15 },
  uNoiseScale: { value: 2.0 },
};
