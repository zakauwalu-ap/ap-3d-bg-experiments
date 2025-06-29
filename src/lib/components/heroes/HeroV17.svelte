<script lang="ts">
  import Scene from '$lib/components/three/Scene.svelte';
  
  // Vertical flowing waves with embedded architectural patterns
  const fragmentShader = `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;

    // Professional dark color palette
    #define TRUE_BLUE vec3(0.286, 0.42, 0.702)      // #496BB3
    #define RAISIN_BLACK vec3(0.118, 0.141, 0.176)  // #1E242D  
    #define PEACH_YELLOW vec3(0.949, 0.835, 0.592)  // #F2D597
    #define COOL_GRAY vec3(0.396, 0.400, 0.451)     // Darker gray

    void main() {
      vec2 uv = (gl_FragCoord.xy - u_resolution * 0.5) / max(u_resolution.x, u_resolution.y) * 2.0;
      
      // Mouse coordinates for interaction
      vec2 mouseUV = (u_mouse * u_resolution - u_resolution * 0.5) / max(u_resolution.x, u_resolution.y) * 2.0;
      
      // Mouse repulsion system
      float mouseDistance = length(uv - mouseUV);
      float repulsionRadius = 1.2;
      float repulsionStrength = 0.4;
      float mouseInfluence = smoothstep(repulsionRadius, 0.0, mouseDistance) * repulsionStrength;
      
      vec2 modifiedUV = uv;
      if (mouseInfluence > 0.001) {
        vec2 repulsionDir = normalize(uv - mouseUV);
        modifiedUV = uv + repulsionDir * mouseInfluence;
      }
      
      float time = u_time * 0.5;
      float verticalWaves = 0.0;
      
      // Multiple vertical flowing waves (from V6/V7)
      for (float i = 5.0; i <= 20.0; i += 1.0) {
        float waveIntensity = 0.015 / abs((i/20.0) + sin((time/1.5) + 0.2*i*(modifiedUV.y) * 
                                     (cos(i/3.0 + (time/1.5) + modifiedUV.y*1.8))) + 2.8*modifiedUV.x);
        verticalWaves += waveIntensity;
      }
      
      // Sophisticated geometric patterns integrated into the waves
      
      // Hexagonal flow patterns within the wave field
      vec2 hexSpace = modifiedUV * 4.0;
      hexSpace.x += sin(modifiedUV.y * 3.0 + time * 0.8) * 0.3; // Flow with waves
      float hexPattern = max(abs(hexSpace.x), abs(hexSpace.y * 0.866 + hexSpace.x * 0.5));
      hexPattern = fract(hexPattern) - 0.5;
      float hexGrid = smoothstep(0.35, 0.45, abs(hexPattern)) * verticalWaves * 0.8;
      
      // Diagonal architectural streams
      vec2 diagFlow = vec2(modifiedUV.x + modifiedUV.y, modifiedUV.x - modifiedUV.y) * 3.0;
      diagFlow.y += sin(modifiedUV.y * 2.0 + time * 0.6) * 0.4; // Wave influence
      float diagStreams = max(
        abs(sin(diagFlow.x * 1.5 + time * 0.4)),
        abs(sin(diagFlow.y * 1.2 - time * 0.3))
      );
      diagStreams = smoothstep(0.7, 0.9, diagStreams) * verticalWaves * 0.6;
      
      // Organic interference patterns in wave field
      float organicFlow = sin(modifiedUV.x * 4.0 + time * 0.7) * 
                         cos(modifiedUV.y * 3.0 + time * 0.5) * 
                         sin(length(modifiedUV) * 6.0 - time * 1.0);
      organicFlow = smoothstep(0.3, 0.8, organicFlow) * verticalWaves * 0.5;
      
      // Radial wave intersections
      float radialPattern = sin(length(modifiedUV) * 8.0 + time * 0.6) * 
                           sin(atan(modifiedUV.y, modifiedUV.x) * 6.0 + time * 0.4);
      radialPattern = smoothstep(0.4, 0.8, radialPattern) * verticalWaves * 0.4;
      
      // Cross-wave interference (wave intersections)
      float crossWaves = 0.0;
      for (float j = 3.0; j <= 8.0; j += 1.0) {
        float crossIntensity = sin(modifiedUV.x * j + time * (0.3 + j * 0.1)) * 
                              sin(modifiedUV.y * (j * 0.7) - time * 0.8);
        crossWaves += smoothstep(0.5, 0.9, abs(crossIntensity)) * 0.1;
      }
      crossWaves *= verticalWaves;
      
      // Combine all elements - waves are the foundation
      float totalPattern = verticalWaves + hexGrid * 0.3 + diagStreams * 0.2 + 
                          organicFlow * 0.25 + radialPattern * 0.15 + crossWaves * 0.1;
      
      // Enhanced mouse glow effect
      float mouseGlow = 1.0 + mouseInfluence * 0.4;
      totalPattern *= mouseGlow;
      
      // Color mapping for flowing wave architecture
      vec3 color;
      
      if (totalPattern < 0.02) {
        color = RAISIN_BLACK;
      } else if (totalPattern < 0.05) {
        // Deep wave valleys
        color = mix(RAISIN_BLACK, TRUE_BLUE * 0.4, (totalPattern - 0.02) * 33.33);
      } else if (totalPattern < 0.1) {
        // Flowing wave body with patterns
        color = mix(TRUE_BLUE * 0.4, COOL_GRAY * 0.6, (totalPattern - 0.05) * 20.0);
      } else if (totalPattern < 0.15) {
        // Wave peaks with architectural highlights
        color = mix(COOL_GRAY * 0.6, PEACH_YELLOW * 0.5, (totalPattern - 0.1) * 20.0);
      } else {
        // Brilliant wave crests
        color = mix(PEACH_YELLOW * 0.5, PEACH_YELLOW * 0.8, min((totalPattern - 0.15) * 10.0, 1.0));
      }
      
      // Maintain dark background with flowing wave brilliance
      color = min(color, vec3(0.75, 0.75, 0.85));
      
      // Gentle edge darkening
      float edgeDarkening = 1.0 - smoothstep(0.8, 1.4, length(uv));
      color *= 0.8 + edgeDarkening * 0.2;
      
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