uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

// Hash function for pseudo-random numbers
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// Noise function
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  
  vec2 u = f * f * (3.0 - 2.0 * f);
  
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  vec2 mouse = u_mouse.xy / u_resolution.xy;
  
  // Create moving particle field
  vec2 pos = st * 10.0;
  pos += vec2(sin(u_time * 0.5), cos(u_time * 0.3)) * 2.0;
  
  // Generate particles
  float particles = 0.0;
  for (int i = 0; i < 8; i++) {
    float fi = float(i);
    vec2 particlePos = pos + vec2(sin(u_time * (1.0 + fi * 0.1) + fi), cos(u_time * (1.2 + fi * 0.15) + fi * 2.0)) * 3.0;
    float particleSize = 0.02 + sin(u_time * 2.0 + fi) * 0.01;
    
    // Distance to particle
    float dist = length(fract(particlePos) - 0.5);
    particles += smoothstep(particleSize + 0.02, particleSize, dist);
  }
  
  // Add noise-based background
  float n = noise(st * 20.0 + u_time * 0.5) * 0.1;
  
  // Mouse interaction - create ripples
  float mouseInfluence = 1.0 - smoothstep(0.0, 0.3, length(st - mouse));
  mouseInfluence *= sin(length(st - mouse) * 20.0 - u_time * 10.0) * 0.5 + 0.5;
  
  // Base colors
  vec3 baseColor = vec3(0.05, 0.1, 0.2);
  vec3 particleColor = vec3(0.3, 0.6, 1.0);
  vec3 mouseColor = vec3(1.0, 0.8, 0.4);
  
  // Combine everything
  vec3 finalColor = baseColor + n;
  finalColor += particles * particleColor;
  finalColor += mouseInfluence * mouseColor * 0.5;
  
  gl_FragColor = vec4(finalColor, 1.0);
} 