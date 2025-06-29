<script lang="ts">
  import Scene from '$lib/components/three/Scene.svelte';
  
  // Flowing architectural wave-forms - conceptual fusion of waves and geometry
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
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      uv = uv * 2.0 - 1.0;
      uv.x *= u_resolution.x / u_resolution.y;
      
      float time = u_time * 0.15;
      
      // Core wave equation that shapes everything
      float primaryWave = sin(3.0 * uv.x - time * 2.0) * 0.3;
      float secondaryWave = cos(2.5 * uv.x + time * 1.5) * 0.2;
      float waveHeight = primaryWave + secondaryWave;
      
      // Distance from the flowing wave surface
      float waveDistance = abs(uv.y - waveHeight);
      
      // Mouse interaction - creates ripples in the wave field
      vec2 mouse = u_mouse * 2.0 - 1.0;
      mouse.x *= u_resolution.x / u_resolution.y;
      float mouseEffect = exp(-length(uv - mouse) * 2.0) * 0.15;
      waveDistance -= mouseEffect;
      
      // Flowing geometric channels - hexagonal flow paths
      float hexFlow = sin(uv.x * 6.0 + time * 0.8 + waveHeight * 3.0) * 
                      cos(uv.y * 4.0 - time * 0.6);
      float hexChannels = smoothstep(0.3, 0.7, abs(hexFlow)) * 
                         (1.0 - smoothstep(0.05, 0.25, waveDistance));
      
      // Architectural wave streams - diagonal flowing lines
      vec2 flowDir = vec2(cos(time * 0.4), sin(time * 0.3));
      float streamPattern = sin((uv.x * flowDir.x + uv.y * flowDir.y) * 8.0 + 
                               waveHeight * 5.0 + time * 1.2);
      float architecturalStreams = smoothstep(0.6, 0.9, abs(streamPattern)) * 
                                  exp(-waveDistance * 3.0);
      
      // Organic wave interference - where different wave systems meet
      float interference = sin(uv.x * 4.0 + waveHeight * 4.0) * 
                          sin(uv.y * 3.0 + time * 0.7) * 
                          cos(length(uv) * 5.0 - time * 1.0);
      float organicFlow = smoothstep(0.2, 0.8, interference) * 
                         (1.0 - smoothstep(0.1, 0.4, waveDistance));
      
      // Crystalline wave formations - geometric precision in fluid motion
      float crystal = max(
        abs(sin((uv.x + waveHeight) * 10.0 + time)),
        abs(cos((uv.y * 2.0 + waveHeight) * 8.0 - time * 0.8))
      );
      float crystallineFlow = smoothstep(0.8, 0.95, crystal) * 
                             exp(-waveDistance * 2.0);
      
      // Flowing depth field - wave creates the architectural space
      float depthField = 1.0 / (1.0 + waveDistance * 4.0);
      depthField *= (1.0 + sin(uv.x * 2.0 + time * 0.5) * 0.2);
      
      // Combine all flowing elements
      float flowPattern = depthField + hexChannels * 0.4 + architecturalStreams * 0.3 + 
                         organicFlow * 0.3 + crystallineFlow * 0.2;
      
      // Color the flowing architecture
      vec3 color;
      
      if (flowPattern < 0.3) {
        color = RAISIN_BLACK;
      } else if (flowPattern < 0.6) {
        // Deep wave valleys
        color = mix(RAISIN_BLACK, TRUE_BLUE * 0.6, (flowPattern - 0.3) * 3.33);
      } else if (flowPattern < 0.9) {
        // Flowing geometric structures
        color = mix(TRUE_BLUE * 0.6, COOL_GRAY * 0.8, (flowPattern - 0.6) * 3.33);
      } else if (flowPattern < 1.2) {
        // Wave peaks and architectural highlights
        color = mix(COOL_GRAY * 0.8, PEACH_YELLOW * 0.6, (flowPattern - 0.9) * 3.33);
      } else {
        // Crystalline wave crests
        color = mix(PEACH_YELLOW * 0.6, PEACH_YELLOW * 0.8, min((flowPattern - 1.2) * 2.0, 1.0));
      }
      
      // Wave-driven luminosity
      color *= 0.8 + abs(waveHeight) * 0.4;
      
      // Maintain darkness while allowing wave brilliance
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