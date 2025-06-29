<script lang="ts">
  import Scene from '$lib/components/three/Scene.svelte';
  
  // Curved vertical streaks with brighter gold color inspired by the screenshot
  const fragmentShader = `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;

    // Enhanced color palette with brighter gold
    #define DEEP_NAVY vec3(0.08, 0.12, 0.18)       // Very dark navy
    #define MIDNIGHT_BLUE vec3(0.05, 0.08, 0.15)   // Almost black blue
    #define BRIGHT_GOLD vec3(1.0, 0.9, 0.65)       // Brighter gold color
    #define WARM_GOLD vec3(0.3, 0.25, 0.18)        // Warmer subdued gold

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
      
      // Curved vertical streaks - main feature inspired by the screenshot
      float streakPattern = 0.0;
      
      // Primary curved vertical lines
      for (float i = 0.0; i < 12.0; i += 1.0) {
        // Add gentle curves using multiple sine waves
        float baseCurve = sin(uv.y * 2.0 + time * 0.4 + i * 0.5) * 0.08;
        float fineCurve = sin(uv.y * 6.0 + time * 0.6 + i * 0.3) * 0.03;
        float linePos = (i - 6.0) * 0.3 + baseCurve + fineCurve + sin(time * 0.5 + i * 0.2) * 0.05;
        
        float lineDistance = abs(uv.x - linePos);
        float lineIntensity = smoothstep(0.008, 0.001, lineDistance) * 0.18;
        streakPattern += lineIntensity;
      }
      
      // Secondary finer curved lines for texture
      for (float j = 0.0; j < 20.0; j += 1.0) {
        // More subtle curves for fine details
        float subtleCurve = sin(uv.y * 4.0 + time * 0.3 + j * 0.7) * 0.04;
        float microCurve = sin(uv.y * 12.0 + time * 0.8 + j * 0.2) * 0.015;
        float fineLinePos = (j - 10.0) * 0.15 + subtleCurve + microCurve + sin(time * 0.3 + j * 0.5) * 0.03;
        
        float fineDistance = abs(uv.x - fineLinePos);
        float fineIntensity = smoothstep(0.003, 0.001, fineDistance) * 0.1;
        streakPattern += fineIntensity;
      }
      
      // Vertical gradient to add depth like in the screenshot
      float verticalGradient = 1.0 - smoothstep(-0.8, 1.2, uv.y);
      verticalGradient = mix(0.7, 1.0, verticalGradient);
      
      // Very subtle horizontal noise for texture
      float noise = sin(uv.y * 150.0 + time * 2.0) * sin(uv.x * 80.0 + time * 1.5) * 0.005;
      
      // Combine elements
      float totalPattern = streakPattern + noise + mouseInfluence;
      
      // Enhanced color blending with brighter gold
      if (totalPattern < 0.05) {
        color = MIDNIGHT_BLUE;
      } else if (totalPattern < 0.15) {
        color = mix(MIDNIGHT_BLUE, DEEP_NAVY, (totalPattern - 0.05) * 10.0);
      } else if (totalPattern < 0.25) {
        color = mix(DEEP_NAVY, WARM_GOLD, (totalPattern - 0.15) * 10.0);
      } else if (totalPattern < 0.4) {
        color = mix(WARM_GOLD, BRIGHT_GOLD * 0.4, (totalPattern - 0.25) * 6.67);
      } else {
        color = mix(BRIGHT_GOLD * 0.4, BRIGHT_GOLD * 0.8, min((totalPattern - 0.4) * 5.0, 1.0));
      }
      
      // Apply vertical gradient
      color *= verticalGradient;
      
      // Subtle edge darkening to maintain the dramatic effect
      float edgeDarkening = 1.0 - smoothstep(0.8, 1.5, length(uv));
      color *= 0.85 + edgeDarkening * 0.15;
      
      // Maintain controlled brightness
      color = min(color, vec3(0.9, 0.8, 0.6));
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;
</script>

<Scene {fragmentShader} />

<div class="hero-text text-white drop-shadow-2xl" style="color: #FFE699; text-shadow: 2px 2px 8px rgba(0,0,0,0.9);">
  <h1>
    Amara &<br class="mobile-break">Partners
  </h1>
</div>

<style>
  @import '$lib/styles/responsive.css';
</style> 