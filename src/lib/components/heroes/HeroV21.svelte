<script lang="ts">
  import Scene from '$lib/components/three/Scene.svelte';
  
  // Clean lines animated down the page with geometric pattern overlay
  const fragmentShader = `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;

    // Dark mode color palette inspired by screenshot and existing components
    #define DEEP_CHARCOAL vec3(0.06, 0.08, 0.12)    // Very dark base
    #define MIDNIGHT_NAVY vec3(0.08, 0.12, 0.18)    // Dark navy from existing
    #define STEEL_BLUE vec3(0.12, 0.16, 0.24)       // Medium blue-gray
    #define WARM_GRAY vec3(0.18, 0.20, 0.24)        // Lighter architectural gray
    #define PEACH_GOLD vec3(0.949, 0.835, 0.592)    // Existing gold accent
    #define SOFT_GOLD vec3(0.4, 0.35, 0.25)         // Muted gold for patterns

    // Hash function for procedural patterns
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    // Smooth noise
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    // Geometric pattern function
    float geometricPattern(vec2 uv, float time) {
      // Triangular grid pattern inspired by screenshot
      vec2 grid = uv * 8.0;
      vec2 gridId = floor(grid);
      vec2 gridUv = fract(grid) - 0.5;
      
      // Create triangular divisions
      float triangular = abs(gridUv.x) + abs(gridUv.y);
      triangular = smoothstep(0.4, 0.6, triangular);
      
      // Add hexagonal elements
      float hexPattern = length(gridUv) - 0.3;
      hexPattern = smoothstep(0.05, 0.15, abs(hexPattern));
      
      // Combine with subtle animation
      float timeOffset = hash(gridId) * 6.28;
      float pulsePattern = sin(time * 1.5 + timeOffset) * 0.5 + 0.5;
      
      return (triangular * hexPattern) * (0.7 + pulsePattern * 0.3);
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      uv = uv * 2.0 - 1.0;
      uv.x *= u_resolution.x / u_resolution.y;
      
      float time = u_time * 0.4;
      
      // Mouse influence - subtle interaction
      vec2 mouse = u_mouse * 2.0 - 1.0;
      mouse.x *= u_resolution.x / u_resolution.y;
      float mouseDistance = length(uv - mouse);
      float mouseInfluence = smoothstep(1.0, 0.0, mouseDistance) * 0.04;
      
      // Base dark background
      vec3 color = DEEP_CHARCOAL;
      
      // Animated lines flowing down - main feature
      float flowingLines = 0.0;
      
      // Primary vertical lines moving downward
      for (float i = 0.0; i < 15.0; i += 1.0) {
        float lineX = (i - 7.0) * 0.25 + sin(time * 0.6 + i * 0.4) * 0.08;
        float lineFlow = mod(uv.y + time * 0.8 + i * 0.3, 2.0) - 1.0;
        
        float lineDistance = abs(uv.x - lineX);
        float lineIntensity = smoothstep(0.012, 0.002, lineDistance);
        
        // Create flowing effect
        float flowMask = smoothstep(0.4, 0.0, abs(lineFlow)) * smoothstep(-0.4, 0.0, lineFlow);
        flowingLines += lineIntensity * flowMask * (0.8 + sin(time * 2.0 + i) * 0.2);
      }
      
      // Secondary diagonal lines for complexity
      for (float j = 0.0; j < 8.0; j += 1.0) {
        float angle = 0.3 + j * 0.1;
        vec2 direction = vec2(cos(angle), sin(angle));
        float diagonalPos = dot(uv, direction);
        float diagonalFlow = mod(diagonalPos + time * 0.5 + j * 0.4, 1.5) - 0.75;
        
        float diagonalDistance = abs(diagonalPos - (j - 4.0) * 0.4);
        float diagonalIntensity = smoothstep(0.06, 0.01, diagonalDistance);
        
        float diagonalMask = smoothstep(0.3, 0.0, abs(diagonalFlow));
        flowingLines += diagonalIntensity * diagonalMask * 0.4;
      }
      
      // Geometric pattern overlay
      float pattern = geometricPattern(uv, time);
      
      // Subtle atmospheric noise
      float atmosphere = noise(uv * 12.0 + time * 0.3) * 0.08;
      
      // Combine all elements
      float totalIntensity = flowingLines + pattern * 0.6 + atmosphere + mouseInfluence;
      
      // Color mapping for dark mode aesthetics
      if (totalIntensity < 0.1) {
        color = DEEP_CHARCOAL;
      } else if (totalIntensity < 0.25) {
        color = mix(DEEP_CHARCOAL, MIDNIGHT_NAVY, (totalIntensity - 0.1) * 6.67);
      } else if (totalIntensity < 0.45) {
        color = mix(MIDNIGHT_NAVY, STEEL_BLUE, (totalIntensity - 0.25) * 5.0);
      } else if (totalIntensity < 0.65) {
        color = mix(STEEL_BLUE, WARM_GRAY, (totalIntensity - 0.45) * 5.0);
      } else if (totalIntensity < 0.85) {
        color = mix(WARM_GRAY, SOFT_GOLD, (totalIntensity - 0.65) * 5.0);
      } else {
        color = mix(SOFT_GOLD, PEACH_GOLD * 0.7, min((totalIntensity - 0.85) * 6.67, 1.0));
      }
      
      // Vertical gradient for depth
      float verticalGradient = smoothstep(-1.2, 0.8, uv.y);
      color *= 0.6 + verticalGradient * 0.4;
      
      // Edge darkening to maintain dark mode aesthetic
      float edgeFade = 1.0 - smoothstep(0.7, 1.3, length(uv));
      color *= 0.75 + edgeFade * 0.25;
      
      // Ensure appropriate darkness for dark mode
      color = min(color, vec3(0.8, 0.75, 0.65));
      
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