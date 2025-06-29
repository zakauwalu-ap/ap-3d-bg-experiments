<script lang="ts">
  import Scene from '$lib/components/three/Scene.svelte';
  
  // Professional vertical waves - calm, subtle, trustworthy
  const fragmentShader = `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;

    // Professional color palette for trust and sophistication
    #define DEEP_NAVY vec3(0.08, 0.12, 0.25)        // #14203F - Deep professional blue
    #define TRUST_BLUE vec3(0.15, 0.25, 0.45)       // #264073 - Trustworthy blue
    #define SOFT_BLUE vec3(0.35, 0.45, 0.65)        // #5973A6 - Softer blue
    #define LIGHT_GRAY vec3(0.85, 0.87, 0.90)       // #D9DDE6 - Clean light gray
    #define WARM_WHITE vec3(0.95, 0.96, 0.97)       // #F2F5F7 - Warm white
    #define ACCENT_GOLD vec3(0.949, 0.835, 0.592)   // #F2D597 - Subtle gold accent

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      uv = uv * 2.0 - 1.0; // Center coordinates
      uv.x *= u_resolution.x / u_resolution.y; // Aspect ratio correction
      
      float time = u_time * 0.4; // Slow, calm movement
      
      // Very subtle mouse influence - professional and non-distracting
      vec2 mouse = u_mouse * 2.0 - 1.0;
      mouse.x *= u_resolution.x / u_resolution.y;
      float mouseDistance = length(uv - mouse);
      float mouseInfluence = smoothstep(0.8, 0.0, mouseDistance) * 0.08; // Very minimal
      
      // Create clean vertical wave patterns
      float waves = 0.0;
      
      // Primary vertical flow - main structure
      float wave1 = sin(uv.x * 4.0 + time * 1.2) * 
                   cos(uv.y * 6.0 - time * 0.8 + mouseInfluence) * 
                   0.6;
      
      // Secondary harmonic - adds depth
      float wave2 = sin(uv.x * 2.5 + time * 0.9 + 1.57) * 
                   sin(uv.y * 4.0 - time * 0.6) * 
                   0.4;
      
      // Tertiary detail waves - subtle texture
      float wave3 = cos(uv.x * 8.0 + time * 1.5) * 
                   sin(uv.y * 10.0 - time * 1.0) * 
                   0.25;
      
      // Large slow waves for overall movement
      float wave4 = sin(uv.x * 1.5 + time * 0.5) * 
                   cos(uv.y * 2.5 - time * 0.3) * 
                   0.8;
      
      // Fine vertical lines for professional texture
      float lines = sin(uv.x * 20.0 + time * 2.0 + mouseInfluence * 2.0) * 
                   cos(uv.y * 25.0 - time * 1.5) * 
                   0.15;
      
      // Combine waves with professional weighting
      waves = wave1 + wave2 + wave3 + wave4 + lines;
      
      // Create vertical flow emphasis
      float verticalGradient = smoothstep(-1.0, 1.0, uv.y * 0.5);
      waves *= (0.8 + verticalGradient * 0.4);
      
      // Normalize wave intensity
      float intensity = (waves + 2.0) * 0.25; // Normalize to 0-1 range
      intensity = smoothstep(0.1, 0.9, intensity); // Smooth transitions
      
      // Add subtle mouse highlight
      intensity += mouseInfluence * 0.15;
      
      // Professional color mapping
      vec3 color;
      
      if (intensity < 0.2) {
        // Deep base tones
        color = mix(DEEP_NAVY, TRUST_BLUE, intensity * 5.0);
      } else if (intensity < 0.5) {
        // Mid-range professional blues
        color = mix(TRUST_BLUE, SOFT_BLUE, (intensity - 0.2) * 3.33);
      } else if (intensity < 0.8) {
        // Lighter professional tones
        color = mix(SOFT_BLUE, LIGHT_GRAY, (intensity - 0.5) * 3.33);
      } else {
        // Subtle highlights with warm touch
        float warmth = (intensity - 0.8) * 5.0;
        color = mix(LIGHT_GRAY, WARM_WHITE, warmth * 0.8);
        // Add tiny amount of gold warmth for sophistication
        color = mix(color, ACCENT_GOLD, warmth * 0.1);
      }
      
      // Professional brightness modulation - very subtle
      float brightness = 0.9 + sin(uv.x * 6.0 + time * 0.8) * 0.1;
      color *= brightness;
      
      // Subtle depth gradient from top to bottom
      float depthGradient = 1.0 - (uv.y * 0.5 + 0.5) * 0.2;
      color *= depthGradient;
      
      // Very subtle vignette for focus
      float vignette = 1.0 - length(uv * 0.3);
      vignette = smoothstep(0.5, 1.0, vignette);
      color *= (0.9 + vignette * 0.1);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;
</script>

<!-- Full-screen background -->
<Scene {fragmentShader} />

<div class="hero-text text-white drop-shadow-2xl" style="text-shadow: 2px 2px 12px rgba(0,0,0,0.9), 0 0 30px rgba(20,32,63,0.6);">
  <h1>
    Amara &<br class="mobile-break">Partners
  </h1>
</div>

<style>
  @import '$lib/styles/responsive.css';
</style> 