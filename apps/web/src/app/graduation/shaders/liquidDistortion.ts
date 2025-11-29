// ABOUTME: WebGL shaders for liquid distortion effect on hero image
// ABOUTME: Vertex and fragment shaders with mouse-based displacement and simplex noise

/**
 * Simplex noise implementation for ambient movement
 * Based on Stefan Gustavson's implementation
 */
const simplexNoiseGLSL = `
  // Simplex 2D noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
`;

/**
 * Vertex shader - passes UV and position to fragment shader
 */
export const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Fragment shader - applies liquid distortion effect
 *
 * Uniforms:
 * - uTexture: Hero image texture
 * - uMouse: Normalized mouse position (0-1)
 * - uTime: Animation time for ambient noise
 * - uDistortionStrength: Intensity of mouse-based distortion
 * - uNoiseAmplitude: Intensity of ambient noise
 * - uNoiseSpeed: Speed of ambient noise animation
 * - uMouseRadius: Radius of mouse influence
 */
export const fragmentShader = `
  ${simplexNoiseGLSL}

  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform float uDistortionStrength;
  uniform float uNoiseAmplitude;
  uniform float uNoiseSpeed;
  uniform float uMouseRadius;

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;

    // Calculate distance from mouse
    vec2 mouseDistance = uv - uMouse;
    float dist = length(mouseDistance);

    // Mouse-based displacement (falls off with distance)
    float influence = smoothstep(uMouseRadius, 0.0, dist);
    vec2 mouseDisplacement = normalize(mouseDistance) * influence * uDistortionStrength;

    // Ambient noise displacement
    float noiseX = snoise(vec2(uv.x * 3.0 + uTime * uNoiseSpeed, uv.y * 3.0)) * uNoiseAmplitude;
    float noiseY = snoise(vec2(uv.x * 3.0, uv.y * 3.0 + uTime * uNoiseSpeed)) * uNoiseAmplitude;
    vec2 noiseDisplacement = vec2(noiseX, noiseY);

    // Combine displacements
    vec2 finalUv = uv + mouseDisplacement + noiseDisplacement;

    // Sample texture with distorted UVs
    vec4 color = texture2D(uTexture, finalUv);

    // Add subtle vignette
    float vignette = 1.0 - smoothstep(0.4, 0.9, length(uv - 0.5));
    color.rgb *= 0.9 + vignette * 0.1;

    gl_FragColor = color;
  }
`;

/**
 * Shader uniforms configuration with defaults
 */
export const defaultUniforms = {
  uTexture: { value: null },
  uMouse: { value: [0.5, 0.5] },
  uTime: { value: 0 },
  uDistortionStrength: { value: 0.15 },
  uNoiseAmplitude: { value: 0.05 },
  uNoiseSpeed: { value: 0.3 },
  uMouseRadius: { value: 0.3 },
};
