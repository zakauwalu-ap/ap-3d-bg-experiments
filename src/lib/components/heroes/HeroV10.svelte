<script lang="ts">
  import Scene from '$lib/components/three/Scene.svelte';
  
  // Sophisticated vertical flow - calm, professional, visually impressive
  const fragmentShader = `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;

    // User's sophisticated color palette
    #define TRUE_BLUE vec3(0.286, 0.42, 0.702)      // #496BB3 - Trustworthy blue
    #define RAISIN_BLACK vec3(0.118, 0.141, 0.176)  // #1E242D - Deep professional base
    #define PEACH_YELLOW vec3(0.949, 0.835, 0.592)  // #F2D597 - Warm sophisticated accent
    #define COOL_GRAY vec3(0.596, 0.600, 0.651)     // #9899A6 - Professional mid-tone
    #define SOFT_WHITE vec3(0.97, 0.98, 0.99)       // Refined highlight

    // Smooth noise function for organic flow
    float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    float smoothNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        
        float a = noise(i);
        float b = noise(i + vec2(1.0, 0.0));
        float c = noise(i + vec2(0.0, 1.0));
        float d = noise(i + vec2(1.0, 1.0));
        
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      uv = uv * 2.0 - 1.0; // Center coordinates
      uv.x *= u_resolution.x / u_resolution.y; // Aspect ratio correction
      
      float time = u_time * 0.35; // Calm, professional movement
      
      // Sophisticated mouse interaction - subtle and elegant
      vec2 mouse = u_mouse * 2.0 - 1.0;
      mouse.x *= u_resolution.x / u_resolution.y;
      float mouseDistance = length(uv - mouse);
      float mouseInfluence = smoothstep(1.2, 0.0, mouseDistance) * 0.06; // Very refined
      
      // Create elegant vertical flow patterns
      float flow = 0.0;
      
      // Primary vertical streams - main architectural structure
      float stream1 = sin(uv.x * 6.0 + time * 1.8 + mouseInfluence * 4.0) * 
                     cos(uv.y * 8.0 - time * 1.2) * 
                     0.7;
      
      // Secondary harmonic waves - adds sophisticated depth
      float stream2 = sin(uv.x * 4.0 + time * 1.4 + 2.1) * 
                     sin(uv.y * 6.0 - time * 0.9 + mouseInfluence * 3.0) * 
                     0.5;
      
      // Tertiary detail flows - professional texture
      float stream3 = cos(uv.x * 12.0 + time * 2.2) * 
                     sin(uv.y * 14.0 - time * 1.6) * 
                     0.3;
      
      // Large architectural waves - overall movement
      float stream4 = sin(uv.x * 2.5 + time * 0.7) * 
                     cos(uv.y * 3.5 - time * 0.5) * 
                     0.8;
      
      // Fine vertical lines - clean professional detail
      float lines = sin(uv.x * 24.0 + time * 3.0 + mouseInfluence * 6.0) * 
                   cos(uv.y * 28.0 - time * 2.2) * 
                   0.2;
      
      // Organic noise for natural sophistication
      float organicNoise = smoothNoise(uv * 8.0 + time * 0.8) * 0.15;
      
      // Additional flowing streams for complexity
      float stream5 = sin(uv.x * 8.0 + time * 1.6 + 4.2) * 
                     cos(uv.y * 10.0 - time * 1.8 + mouseInfluence * 2.0) * 
                     0.4;
      
      float stream6 = cos(uv.x * 16.0 + time * 2.8 + organicNoise * 3.0) * 
                     sin(uv.y * 20.0 - time * 2.4) * 
                     0.25;
      
      // Combine all streams with sophisticated weighting
      flow = stream1 + stream2 + stream3 + stream4 + stream5 + stream6 + lines + organicNoise;
      
      // Create vertical emphasis with elegant gradient
      float verticalGradient = smoothstep(-1.0, 1.0, uv.y * 0.6);
      flow *= (0.75 + verticalGradient * 0.5);
      
      // Add subtle horizontal variation for organic feel
      float horizontalVariation = sin(uv.x * 3.0 + time * 0.6) * 0.1;
      flow += horizontalVariation;
      
      // Normalize and create sophisticated intensity mapping
      float intensity = (flow + 2.5) * 0.2; // Normalize to 0-1 range
      intensity = smoothstep(0.05, 0.95, intensity); // Smooth professional transitions
      
      // Add refined mouse highlight
      intensity += mouseInfluence * 0.12;
      
      // Create sophisticated layered lighting
      float lighting = 0.9 + sin(uv.x * 8.0 + time * 1.2) * 0.1;
      lighting *= 0.95 + cos(uv.y * 6.0 + time * 0.8) * 0.05;
      
      // Professional color mapping with sophisticated transitions
      vec3 color;
      
      if (intensity < 0.15) {
        // Deep sophisticated base
        color = mix(RAISIN_BLACK, TRUE_BLUE * 0.7, intensity * 6.67);
      } else if (intensity < 0.35) {
        // Professional blue tones
        color = mix(TRUE_BLUE * 0.7, TRUE_BLUE, (intensity - 0.15) * 5.0);
      } else if (intensity < 0.55) {
        // Mid-range sophisticated transition
        color = mix(TRUE_BLUE, COOL_GRAY, (intensity - 0.35) * 5.0);
      } else if (intensity < 0.75) {
        // Elegant light tones
        color = mix(COOL_GRAY, PEACH_YELLOW * 0.9, (intensity - 0.55) * 5.0);
      } else if (intensity < 0.9) {
        // Refined highlights
        color = mix(PEACH_YELLOW * 0.9, PEACH_YELLOW, (intensity - 0.75) * 6.67);
      } else {
        // Sophisticated bright accents
        float highlight = (intensity - 0.9) * 10.0;
        color = mix(PEACH_YELLOW, SOFT_WHITE, highlight * 0.8);
        // Add subtle warmth for luxury feel
        color = mix(color, PEACH_YELLOW * 1.1, highlight * 0.2);
      }
      
      // Apply sophisticated lighting
      color *= lighting;
      
      // Professional depth gradient - subtle top-to-bottom variation
      float depthGradient = 1.0 - (uv.y * 0.5 + 0.5) * 0.15;
      color *= depthGradient;
      
      // Refined vignette for elegant focus
      float vignette = 1.0 - length(uv * 0.4);
      vignette = smoothstep(0.4, 1.0, vignette);
      color *= (0.92 + vignette * 0.08);
      
      // Add subtle color temperature variation for sophistication
      float warmth = sin(uv.x * 5.0 + time * 0.9) * 0.02 + 0.98;
      color.r *= warmth * 1.01;
      color.b *= warmth * 0.99;
      
      // Final professional brightness adjustment
      color *= 1.05;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;
</script>

<!-- Full-screen background -->
<Scene {fragmentShader} />

<div class="hero-text text-white drop-shadow-2xl" style="text-shadow: 2px 2px 15px rgba(17,20,40,0.95), 0 0 35px rgba(73,107,179,0.4), 0 0 60px rgba(242,213,151,0.2);">
  <h1>
    Amara &<br class="mobile-break">Partners
  </h1>
</div>

<style>
  @import '$lib/styles/responsive.css';
</style> 