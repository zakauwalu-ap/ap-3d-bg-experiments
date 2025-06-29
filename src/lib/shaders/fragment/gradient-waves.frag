uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  vec2 mouse = u_mouse.xy / u_resolution.xy;
  
  // Create animated waves
  float wave1 = sin(st.x * 10.0 + u_time * 2.0) * 0.1;
  float wave2 = sin(st.y * 8.0 + u_time * 1.5) * 0.1;
  float wave3 = sin((st.x + st.y) * 6.0 + u_time * 3.0) * 0.05;
  
  // Combine waves
  vec2 distorted = st + vec2(wave1 + wave3, wave2 + wave3);
  
  // Create gradient colors
  vec3 color1 = vec3(0.2, 0.1, 0.4); // Deep purple
  vec3 color2 = vec3(0.1, 0.3, 0.6); // Deep blue
  vec3 color3 = vec3(0.0, 0.1, 0.2); // Almost black
  
  // Mix colors based on position and mouse interaction
  float mixFactor1 = smoothstep(0.0, 1.0, distorted.y);
  float mixFactor2 = smoothstep(0.0, 1.0, length(st - mouse) * 2.0);
  
  vec3 finalColor = mix(color3, mix(color1, color2, mixFactor1), mixFactor2);
  
  // Add some subtle sparkle
  float sparkle = sin(st.x * 100.0 + u_time * 10.0) * sin(st.y * 100.0 + u_time * 8.0);
  sparkle = smoothstep(0.98, 1.0, sparkle) * 0.3;
  
  finalColor += vec3(sparkle);
  
  gl_FragColor = vec4(finalColor, 1.0);
} 