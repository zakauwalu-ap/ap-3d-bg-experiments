<script lang="ts">
  import Scene from '$lib/components/three/Scene.svelte';
  
  // Artistic blend of flowing waves (V6) with sophisticated patterns (V15)
  const fragmentShader = `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;

    // Professional color palette from V15
    #define TRUE_BLUE vec3(0.286, 0.42, 0.702)      // #496BB3
    #define RAISIN_BLACK vec3(0.118, 0.141, 0.176)  // #1E242D  
    #define PEACH_YELLOW vec3(0.949, 0.835, 0.592)  // #F2D597
    #define COOL_GRAY vec3(0.396, 0.400, 0.451)

    // Hexagonal distance function from V15
    float hexDistance(vec2 p) {
      p = abs(p);
      return max(dot(p, normalize(vec2(1.0, 1.73))), p.x);
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy - u_resolution * 0.5) / max(u_resolution.x, u_resolution.y) * 2.0;
      
      float time = u_time * 0.5;
      
      // Mouse influence
      vec2 mouse = u_mouse * 2.0 - 1.0;
      mouse.x *= u_resolution.x / u_resolution.y;
      float mouseDistance = length(uv - mouse);
      float mouseInfluence = smoothstep(1.0, 0.0, mouseDistance) * 0.3;
      
      // V6 inspired flowing wave foundation
      float waveFlow = 0.0;
      for (float i = 3.0; i <= 12.0; i += 1.0) {
        float wavePhase = time + 0.15 * i * uv.y * cos(i/4.0 + time + uv.y * 2.2);
        waveFlow += 0.008 / abs((i/12.0) + sin(wavePhase) + 2.0 * uv.x);
      }
      
      // Create wave distortion field for patterns
      float waveDistortion = sin(time * 0.8 + uv.y * 4.0) * cos(time * 0.6 + uv.x * 3.0) * 0.15;
      vec2 distortedUV = uv + vec2(waveDistortion, waveDistortion * 0.5);
      
      // V15 inspired hexagonal pattern - influenced by wave flow
      vec2 hexUV = distortedUV * (3.0 + waveFlow * 2.0);
      vec2 hexGrid = vec2(hexUV.x, hexUV.y + sin(hexUV.x * 0.5 + time) * 0.3);
      float hexPattern = hexDistance(fract(hexGrid) - 0.5);
      hexPattern = smoothstep(0.25, 0.55, hexPattern) * (0.15 + waveFlow * 0.1);
      
      // Flowing architectural lines that bend with waves
      float archFlow1 = sin(distortedUV.x * 5.0 + time + waveFlow * 3.0) + 
                       sin(distortedUV.y * 4.0 + time * 0.7);
      float archFlow2 = cos(distortedUV.x * 4.5 - time * 0.8 + waveFlow * 2.0) + 
                       cos(distortedUV.y * 5.2 + time);
      float flowingArch = smoothstep(0.1, 0.9, abs(archFlow1 - archFlow2)) * 0.12;
      
      // Organic shapes that dance with the waves
      float organicDance = sin(length(distortedUV * 1.5) * 6.0 - time * 2.0 + waveFlow * 4.0) * 
                          cos(atan(distortedUV.y, distortedUV.x) * 8.0 + time * 1.2);
      organicDance = smoothstep(0.2, 0.8, organicDance) * (0.08 + waveFlow * 0.05);
      
      // Radial elements synchronized with wave rhythm
      float radialSync = sin(length(uv) * 10.0 + time * 1.5 + waveFlow * 6.0) * 
                        sin(atan(uv.y, uv.x) * 6.0 + time * 0.9);
      radialSync = smoothstep(0.3, 0.9, radialSync) * 0.06;
      
      // Diagonal grid that flows with waves
      vec2 diagUV = vec2(distortedUV.x + distortedUV.y, distortedUV.x - distortedUV.y) * 2.0;
      float diagGrid = max(
        abs(sin(diagUV.x * 2.0 + time * 0.6 + waveFlow * 2.0)),
        abs(sin(diagUV.y * 2.3 - time * 0.4))
      );
      diagGrid = smoothstep(0.6, 0.95, diagGrid) * 0.08;
      
      // Combine wave foundation with flowing patterns
      float combinedPattern = waveFlow * 0.6 + hexPattern + flowingArch + 
                             organicDance + radialSync + diagGrid + mouseInfluence;
      
      // Enhanced color blending inspired by both V6 and V15
      vec3 color;
      
      // Base wave glow (V6 style)
      vec3 waveGlow = vec3(waveFlow/1.8, waveFlow/2.2, waveFlow/5.0);
      
      // Pattern overlay (V15 style)
      vec3 patternColor;
      if (combinedPattern < 0.2) {
        patternColor = RAISIN_BLACK;
      } else if (combinedPattern < 0.4) {
        patternColor = mix(RAISIN_BLACK, TRUE_BLUE * 0.5, (combinedPattern - 0.2) * 5.0);
      } else if (combinedPattern < 0.65) {
        patternColor = mix(TRUE_BLUE * 0.5, COOL_GRAY * 0.7, (combinedPattern - 0.4) * 4.0);
      } else if (combinedPattern < 0.85) {
        patternColor = mix(COOL_GRAY * 0.7, PEACH_YELLOW * 0.6, (combinedPattern - 0.65) * 5.0);
      } else {
        patternColor = mix(PEACH_YELLOW * 0.6, PEACH_YELLOW * 0.9, (combinedPattern - 0.85) * 6.67);
      }
      
      // Artistic blend: wave glow forms the foundation, patterns dance on top
      color = mix(waveGlow, patternColor, 0.7);
      
      // Add subtle wave highlights
      color += waveGlow * 0.3;
      
      // Maintain professional darkness
      color = min(color, vec3(0.8, 0.8, 0.9));
      
      // Edge vignette
      float vignette = 1.0 - smoothstep(0.6, 1.4, length(uv));
      color *= 0.7 + vignette * 0.3;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;
</script>

<Scene {fragmentShader} />

<div class="hero-text text-white drop-shadow-2xl" style="text-shadow: 2px 2px 8px rgba(17,20,40,0.8);">
  <h1>
    Amara &<br class="mobile-break">Partners
  </h1>
</div>

<style>
  @import '$lib/styles/responsive.css';
</style> 