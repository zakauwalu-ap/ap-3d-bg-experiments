<script lang="ts">
  import Scene from '$lib/components/three/Scene.svelte';
  
  // Clean, minimal, professional background
  const fragmentShader = `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;

    // Professional color palette
    #define TRUE_BLUE vec3(0.286, 0.42, 0.702)      // #496BB3
    #define RAISIN_BLACK vec3(0.118, 0.141, 0.176)  // #1E242D  
    #define PEACH_YELLOW vec3(0.949, 0.835, 0.592)  // #F2D597
    #define COOL_GRAY vec3(0.596, 0.600, 0.651)     // #9899A6

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      uv = uv * 2.0 - 1.0;
      uv.x *= u_resolution.x / u_resolution.y;
      
      float time = u_time * 0.15; // Very slow, calm movement
      
      // Subtle mouse influence - very minimal
      vec2 mouse = u_mouse * 2.0 - 1.0;
      mouse.x *= u_resolution.x / u_resolution.y;
      float mouseDistance = length(uv - mouse);
      float mouseInfluence = smoothstep(1.5, 0.0, mouseDistance) * 0.03;
      
      // More interesting geometric base - soft diamond/hexagon shape
      float gradient = max(abs(uv.x * 0.7), abs(uv.y * 0.9));
      gradient = smoothstep(0.2, 1.0, gradient);
      
      // Add subtle angular elements
      float anglePattern = sin(atan(uv.y, uv.x) * 6.0 + time * 0.3) * 0.03;
      gradient += anglePattern;
      
      // Professional vertical lines with slight angle
      float lines = sin((uv.x + uv.y * 0.1) * 15.0 + time) * 0.025;
      
      // Gentle flowing elements - like slow ink diffusion
      float flow1 = sin(uv.x * 2.5 + time * 0.7) * sin(uv.y * 1.8 + time * 0.5) * 0.04;
      float flow2 = cos(uv.x * 3.2 - time * 0.6) * cos(uv.y * 2.1 - time * 0.8) * 0.03;
      
      // Combine elements very subtly
      float pattern = gradient + lines + flow1 + flow2 + mouseInfluence;
      
      // Professional color mapping with subtle gold accents
      vec3 color;
      
      if (pattern < 0.25) {
        color = RAISIN_BLACK;
      } else if (pattern < 0.5) {
        color = mix(RAISIN_BLACK, TRUE_BLUE * 0.7, (pattern - 0.25) * 4.0);
      } else if (pattern < 0.7) {
        color = mix(TRUE_BLUE * 0.7, COOL_GRAY * 0.6, (pattern - 0.5) * 5.0);
      } else if (pattern < 0.85) {
        // Introduce subtle peach yellow in mid-high areas
        color = mix(COOL_GRAY * 0.6, PEACH_YELLOW * 0.3, (pattern - 0.7) * 6.67);
      } else {
        // Gentle gold highlights in the brightest areas
        color = mix(PEACH_YELLOW * 0.3, PEACH_YELLOW * 0.5, (pattern - 0.85) * 6.67);
      }
      
      // Very subtle brightness variation
      float brightness = 0.95 + sin(time * 0.5) * 0.05;
      color *= brightness;
      
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