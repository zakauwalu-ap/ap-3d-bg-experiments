<script lang="ts">
  import Scene from '$lib/components/three/Scene.svelte';
  
  // Sophisticated architectural patterns with hexagonal and flowing elements
  const fragmentShader = `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;

    // Professional dark color palette
    #define TRUE_BLUE vec3(0.286, 0.42, 0.702)      // #496BB3
    #define RAISIN_BLACK vec3(0.118, 0.141, 0.176)  // #1E242D  
    #define PEACH_YELLOW vec3(0.949, 0.835, 0.592)  // #F2D597
    #define COOL_GRAY vec3(0.396, 0.400, 0.451)     // Darker gray

    // Hexagonal distance function
    float hexDistance(vec2 p) {
      p = abs(p);
      return max(dot(p, normalize(vec2(1.0, 1.73))), p.x);
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      uv = uv * 2.0 - 1.0;
      uv.x *= u_resolution.x / u_resolution.y;
      
      float time = u_time * 0.12;
      
      // Subtle mouse influence
      vec2 mouse = u_mouse * 2.0 - 1.0;
      mouse.x *= u_resolution.x / u_resolution.y;
      float mouseDistance = length(uv - mouse);
      float mouseInfluence = smoothstep(1.2, 0.0, mouseDistance) * 0.04;
      
      // Hexagonal grid pattern
      vec2 hexUV = uv * 3.0;
      vec2 hexGrid = vec2(hexUV.x, hexUV.y + sin(hexUV.x * 0.5) * 0.2);
      float hexPattern = hexDistance(fract(hexGrid) - 0.5);
      hexPattern = smoothstep(0.35, 0.45, hexPattern) * 0.12;
      
      // Flowing intersecting lines
      float wave1 = sin(uv.x * 4.0 + time * 0.8) + sin(uv.y * 3.0 + time * 0.6);
      float wave2 = cos(uv.x * 3.5 - time * 0.7) + cos(uv.y * 4.2 + time * 0.9);
      float intersection = smoothstep(0.2, 0.8, abs(wave1 - wave2)) * 0.08;
      
      // Architectural diagonal grid
      vec2 diagUV = vec2(uv.x + uv.y, uv.x - uv.y) * 2.5;
      float diagGrid = max(
        abs(sin(diagUV.x * 1.5 + time * 0.4)),
        abs(sin(diagUV.y * 1.8 - time * 0.3))
      );
      diagGrid = smoothstep(0.7, 0.9, diagGrid) * 0.06;
      
      // Organic flowing shapes
      float organic = sin(length(uv * 1.2) * 8.0 - time * 1.5) * 
                      cos(atan(uv.y, uv.x) * 6.0 + time * 0.8);
      organic = smoothstep(0.3, 0.7, organic) * 0.05;
      
      // Subtle radial elements
      float radial = sin(length(uv) * 12.0 + time * 0.6) * 
                     sin(atan(uv.y, uv.x) * 4.0 + time * 0.4);
      radial = smoothstep(0.4, 0.8, radial) * 0.04;
      
      // Base gradient for depth
      float baseGradient = length(uv * 0.7);
      baseGradient = smoothstep(0.2, 1.1, baseGradient);
      
      // Combine all patterns
      float pattern = baseGradient + hexPattern + intersection + diagGrid + 
                     organic + radial + mouseInfluence;
      
      // Sophisticated color mapping
      vec3 color;
      
      if (pattern < 0.25) {
        color = RAISIN_BLACK;
      } else if (pattern < 0.5) {
        color = mix(RAISIN_BLACK, TRUE_BLUE * 0.4, (pattern - 0.25) * 4.0);
      } else if (pattern < 0.7) {
        color = mix(TRUE_BLUE * 0.4, COOL_GRAY * 0.6, (pattern - 0.5) * 5.0);
      } else if (pattern < 0.85) {
        color = mix(COOL_GRAY * 0.6, PEACH_YELLOW * 0.4, (pattern - 0.7) * 6.67);
      } else {
        // Subtle gold highlights for pattern intersections
        color = mix(PEACH_YELLOW * 0.4, PEACH_YELLOW * 0.6, (pattern - 0.85) * 6.67);
      }
      
      // Maintain darkness - clamp maximum brightness
      color = min(color, vec3(0.65, 0.65, 0.75));
      
      // Edge darkening to prevent white bleeding
      float edgeDarkening = 1.0 - smoothstep(0.7, 1.3, length(uv));
      color *= 0.75 + edgeDarkening * 0.25;
      
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