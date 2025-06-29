<script lang="ts">
  import Scene from '$lib/components/three/Scene.svelte';
  
  // Flowing vertical curtains with wave interference patterns
  const fragmentShader = `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;

    // Color palette from user's image
    #define TRUE_BLUE vec3(0.286, 0.42, 0.702)      // #496BB3
    #define RAISIN_BLACK vec3(0.118, 0.141, 0.176)  // #1E242D  
    #define PEACH_YELLOW vec3(0.949, 0.835, 0.592)  // #F2D597

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      uv = uv * 2.0 - 1.0; // Center coordinates
      uv.x *= u_resolution.x / u_resolution.y; // Aspect ratio correction
      
      float time = u_time * 0.8;
      
      // Subtle mouse influence
      vec2 mouse = u_mouse * 2.0 - 1.0; // Normalize mouse to -1 to 1
      mouse.x *= u_resolution.x / u_resolution.y; // Aspect ratio correction
      float mouseDistance = length(uv - mouse);
      float mouseInfluence = smoothstep(1.0, 0.0, mouseDistance) * 0.15; // Very subtle
      
      // Create multiple vertical curtain streams
      float curtains = 0.0;
      
      // Stream 1: Main flowing curtain (with subtle mouse ripple)
      float stream1 = sin(uv.x * 8.0 + time * 2.0 + mouseInfluence * 3.0) * 
                     sin(uv.y * 12.0 - time * 3.0) * 
                     (0.4 + mouseInfluence * 0.1);
      
      // Stream 2: Secondary interference pattern
      float stream2 = sin(uv.x * 6.0 + time * 1.5 + 1.5) * 
                     cos(uv.y * 10.0 - time * 2.5 + mouseInfluence * 2.0) * 
                     0.3;
      
      // Stream 3: Finer detail waves
      float stream3 = sin(uv.x * 15.0 + time * 3.5 + 3.0) * 
                     sin(uv.y * 18.0 - time * 4.0) * 
                     0.2;
      
      // Stream 4: Large slow waves for depth
      float stream4 = cos(uv.x * 3.0 + time * 0.8) * 
                     sin(uv.y * 6.0 - time * 1.2) * 
                     0.5;
      
      // Stream 5: High frequency ripples (responsive to mouse)
      float stream5 = sin(uv.x * 25.0 + time * 5.0 + mouseInfluence * 5.0) * 
                     cos(uv.y * 30.0 - time * 6.0) * 
                     (0.15 + mouseInfluence * 0.05);
      
      // Combine streams with interference
      curtains = stream1 + stream2 + stream3 + stream4 + stream5;
      
      // Add some organic noise
      float noise = sin(uv.x * 20.0 + time) * cos(uv.y * 25.0 + time * 1.3) * 0.1;
      curtains += noise;
      
      // Create flowing vertical emphasis
      float verticalFlow = smoothstep(-0.8, 0.8, sin(uv.y * 4.0 - time * 2.0));
      curtains *= (0.7 + verticalFlow * 0.3);
      
      // Normalize and create intensity zones
      float intensity = smoothstep(-1.5, 1.5, curtains);
      
      // Add subtle mouse glow
      intensity += mouseInfluence * 0.2;
      
      // Create color mixing based on wave intensity
      vec3 color;
      
      if (intensity < 0.3) {
        // Dark base: mix of raisin black and true blue
        color = mix(RAISIN_BLACK, TRUE_BLUE, intensity * 3.33);
      } else if (intensity < 0.7) {
        // Mid tones: blue to peach transition
        color = mix(TRUE_BLUE, PEACH_YELLOW, (intensity - 0.3) * 2.5);
      } else {
        // Bright highlights: enhanced peach yellow
        color = mix(PEACH_YELLOW, vec3(1.0, 0.95, 0.8), (intensity - 0.7) * 3.33);
      }
      
      // Add some brightness variation for depth
      float brightness = 0.8 + sin(uv.x * 12.0 + time * 1.5) * 0.2;
      color *= brightness;
      
      // Subtle vignette effect
      float vignette = 1.0 - length(uv * 0.5);
      vignette = smoothstep(0.3, 1.0, vignette);
      color *= vignette;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;
</script>

<!-- Full-screen background -->
<Scene {fragmentShader} />

<div class="hero-text text-amber-100 drop-shadow-2xl" style="text-shadow: 2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(242,213,151,0.3);">
  <h1>
    Amara &<br class="mobile-break">Partners
  </h1>
</div>

<style>
  @import '$lib/styles/responsive.css';
</style> 