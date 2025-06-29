<script lang="ts">
  import Scene from '$lib/components/three/Scene.svelte';
  
  // Minimalist dramatic background with subtle vertical streaks inspired by the attached image
  const fragmentShader = `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;

    // Very dark color palette inspired by the image
    #define DEEP_NAVY vec3(0.08, 0.12, 0.18)       // Very dark navy
    #define MIDNIGHT_BLUE vec3(0.05, 0.08, 0.15)   // Almost black blue
    #define PEACH_YELLOW vec3(0.949, 0.835, 0.592) // Gold color from other components
    #define FAINT_GOLD vec3(0.2, 0.17, 0.12)       // Subdued gold for subtle areas

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      uv = uv * 2.0 - 1.0;
      uv.x *= u_resolution.x / u_resolution.y;
      
      float time = u_time * 0.3;
      
      // Mouse influence - very subtle
      vec2 mouse = u_mouse * 2.0 - 1.0;
      mouse.x *= u_resolution.x / u_resolution.y;
      float mouseDistance = length(uv - mouse);
      float mouseInfluence = smoothstep(1.5, 0.0, mouseDistance) * 0.02;
      
      // Base dark background
      vec3 color = MIDNIGHT_BLUE;
      
      // Subtle vertical streaks - main feature from the image
      float streakPattern = 0.0;
      
      // Primary vertical lines
      for (float i = 0.0; i < 12.0; i += 1.0) {
        float linePos = (i - 6.0) * 0.3 + sin(time * 0.5 + i * 0.2) * 0.1;
        float lineDistance = abs(uv.x - linePos);
        float lineIntensity = smoothstep(0.008, 0.001, lineDistance) * (0.15 + sin(time * 0.8 + i) * 0.05);
        streakPattern += lineIntensity;
      }
      
      // Secondary finer lines for texture
      for (float j = 0.0; j < 20.0; j += 1.0) {
        float fineLinePos = (j - 10.0) * 0.15 + sin(time * 0.3 + j * 0.5) * 0.05;
        float fineDistance = abs(uv.x - fineLinePos);
        float fineIntensity = smoothstep(0.003, 0.001, fineDistance) * (0.08 + sin(time * 1.2 + j * 0.3) * 0.02);
        streakPattern += fineIntensity;
      }
      
      // Vertical gradient to add depth like in the image
      float verticalGradient = 1.0 - smoothstep(-0.8, 1.2, uv.y);
      verticalGradient = mix(0.7, 1.0, verticalGradient);
      
      // Very subtle horizontal noise for texture
      float noise = sin(uv.y * 150.0 + time * 2.0) * sin(uv.x * 80.0 + time * 1.5) * 0.005;
      
      // Combine elements
      float totalPattern = streakPattern + noise + mouseInfluence;
      
      // Color blending - using gold/peach yellow for the streaks
      if (totalPattern < 0.05) {
        color = MIDNIGHT_BLUE;
      } else if (totalPattern < 0.15) {
        color = mix(MIDNIGHT_BLUE, DEEP_NAVY, (totalPattern - 0.05) * 10.0);
      } else if (totalPattern < 0.25) {
        color = mix(DEEP_NAVY, FAINT_GOLD, (totalPattern - 0.15) * 10.0);
      } else if (totalPattern < 0.4) {
        color = mix(FAINT_GOLD, PEACH_YELLOW * 0.3, (totalPattern - 0.25) * 6.67);
      } else {
        color = mix(PEACH_YELLOW * 0.3, PEACH_YELLOW * 0.6, min((totalPattern - 0.4) * 5.0, 1.0));
      }
      
      // Apply vertical gradient
      color *= verticalGradient;
      
      // Subtle edge darkening to maintain the dramatic effect
      float edgeDarkening = 1.0 - smoothstep(0.8, 1.5, length(uv));
      color *= 0.85 + edgeDarkening * 0.15;
      
      // Ensure we maintain the very dark aesthetic
      color = min(color, vec3(0.3, 0.35, 0.4));
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;
</script>

<Scene {fragmentShader} />

<div class="hero-text text-white drop-shadow-2xl" style="text-shadow: 2px 2px 8px rgba(0,0,0,0.9);">
  <h1>
    Amara &<br class="mobile-break">Partners
  </h1>
</div>

<style>
  @import '$lib/styles/responsive.css';
</style> 