<script lang="ts">
  import Scene from '$lib/components/three/Scene.svelte';
  
  // Enhanced geometric patterns - more architectural and layered
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
      
      float time = u_time * 0.1; // Slower, calmer
      
      // Subtle mouse influence
      vec2 mouse = u_mouse * 2.0 - 1.0;
      mouse.x *= u_resolution.x / u_resolution.y;
      float mouseDistance = length(uv - mouse);
      float mouseInfluence = smoothstep(1.2, 0.0, mouseDistance) * 0.03;
      
      // Simplified base gradient - soft from center
      float baseGradient = length(uv * 0.6);
      baseGradient = smoothstep(0.1, 1.2, baseGradient);
      
      // Subtle geometric layer - simple diamond pattern
      float diamond = max(abs(uv.x * 0.8), abs(uv.y * 0.7));
      diamond = smoothstep(0.3, 0.9, diamond) * 0.15;
      
      // Gentle flowing pattern
      float flow = sin(uv.x * 2.0 + time * 0.6) * sin(uv.y * 1.8 + time * 0.4) * 0.08;
      
      // Minimal architectural lines
      float lines = sin((uv.x + uv.y * 0.2) * 8.0 + time * 0.8) * 0.04;
      
      // Combine patterns - much simpler
      float pattern = baseGradient + diamond + flow + lines + mouseInfluence;
      
      // Ensure dark background with controlled highlights
      vec3 color;
      
      if (pattern < 0.3) {
        color = RAISIN_BLACK;
      } else if (pattern < 0.6) {
        color = mix(RAISIN_BLACK, TRUE_BLUE * 0.4, (pattern - 0.3) * 3.33);
      } else if (pattern < 0.8) {
        color = mix(TRUE_BLUE * 0.4, COOL_GRAY * 0.5, (pattern - 0.6) * 5.0);
      } else {
        // Subtle gold accents only in highest areas
        color = mix(COOL_GRAY * 0.5, PEACH_YELLOW * 0.3, (pattern - 0.8) * 5.0);
      }
      
      // Ensure overall darkness - clamp maximum brightness
      color = min(color, vec3(0.6, 0.6, 0.7));
      
      // Gentle center-to-edge darkening to eliminate white edges
      float edgeDarkening = 1.0 - smoothstep(0.8, 1.4, length(uv));
      color *= 0.7 + edgeDarkening * 0.3;
      
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