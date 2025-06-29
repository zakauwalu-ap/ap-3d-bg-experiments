<script lang="ts">
  import Scene from '$lib/components/three/Scene.svelte';
  
  // Organic flowing ink streams - smooth, natural, creative
  const fragmentShader = `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;

    // User's sophisticated color palette
    #define TRUE_BLUE vec3(0.286, 0.42, 0.702)      // #496BB3
    #define RAISIN_BLACK vec3(0.118, 0.141, 0.176)  // #1E242D  
    #define PEACH_YELLOW vec3(0.949, 0.835, 0.592)  // #F2D597
    #define COOL_GRAY vec3(0.596, 0.600, 0.651)     // #9899A6
    #define SOFT_WHITE vec3(0.97, 0.98, 0.99)

    // Smooth noise for organic flow
    float smoothNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        
        float a = fract(sin(dot(i, vec2(12.9898, 78.233))) * 43758.5453);
        float b = fract(sin(dot(i + vec2(1.0, 0.0), vec2(12.9898, 78.233))) * 43758.5453);
        float c = fract(sin(dot(i + vec2(0.0, 1.0), vec2(12.9898, 78.233))) * 43758.5453);
        float d = fract(sin(dot(i + vec2(1.0, 1.0), vec2(12.9898, 78.233))) * 43758.5453);
        
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    // Fractal noise for organic complexity
    float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for(int i = 0; i < 4; i++) {
            value += amplitude * smoothNoise(p);
            p *= 2.0;
            amplitude *= 0.5;
        }
        return value;
    }

    // Create flowing stream path
    float flowingStream(vec2 uv, float offset, float width) {
        float time = u_time * 0.4 + offset;
        
        // Create organic flowing path
        float pathY = uv.y;
        float pathX = uv.x + sin(pathY * 2.0 + time) * 0.3 + 
                              sin(pathY * 4.0 + time * 1.5) * 0.15 +
                              fbm(vec2(pathY * 1.5, time * 0.3)) * 0.2;
        
        // Distance from the flowing path
        float dist = abs(pathX);
        
        // Create smooth flowing stream with variable width
        float streamWidth = width * (0.8 + sin(pathY * 3.0 + time * 2.0) * 0.2);
        float stream = smoothstep(streamWidth, streamWidth * 0.5, dist);
        
        // Add flowing intensity variation
        stream *= 0.7 + sin(pathY * 5.0 - time * 3.0) * 0.3;
        
        return stream;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      uv = uv * 2.0 - 1.0;
      uv.x *= u_resolution.x / u_resolution.y;
      
      float time = u_time * 0.5;
      
      // Mouse influence - creates gentle flow disturbance
      vec2 mouse = u_mouse * 2.0 - 1.0;
      mouse.x *= u_resolution.x / u_resolution.y;
      float mouseDistance = length(uv - mouse);
      float mouseInfluence = smoothstep(1.0, 0.0, mouseDistance) * 0.15;
      
      // Create multiple flowing streams at different positions and scales
      float stream1 = flowingStream(uv + vec2(-0.6, 0.0) + mouseInfluence * 0.1, 0.0, 0.15);
      float stream2 = flowingStream(uv + vec2(-0.2, 0.2) + mouseInfluence * 0.05, 2.1, 0.12);
      float stream3 = flowingStream(uv + vec2(0.2, -0.1) + mouseInfluence * 0.08, 4.2, 0.18);
      float stream4 = flowingStream(uv + vec2(0.6, 0.3) + mouseInfluence * 0.06, 6.3, 0.14);
      
      // Additional flowing ribbons for complexity
      float stream5 = flowingStream(uv + vec2(-0.4, -0.3) + mouseInfluence * 0.07, 8.4, 0.10);
      float stream6 = flowingStream(uv + vec2(0.4, -0.2) + mouseInfluence * 0.04, 10.5, 0.16);
      
      // Create background flow field
      vec2 flowField = uv + vec2(
          fbm(uv * 2.0 + time * 0.2) * 0.1,
          fbm(uv * 2.0 + time * 0.3 + 100.0) * 0.1
      );
      float backgroundFlow = fbm(flowField * 3.0 + time * 0.4) * 0.3;
      
      // Combine all streams
      float totalFlow = stream1 + stream2 + stream3 + stream4 + stream5 + stream6;
      totalFlow = smoothstep(0.1, 1.0, totalFlow);
      
      // Add background flow
      totalFlow += backgroundFlow;
      
      // Create smooth blending zones where streams intersect
      float blendingFactor = sin(totalFlow * 3.14159) * 0.5 + 0.5;
      totalFlow *= 0.8 + blendingFactor * 0.4;
      
      // Add mouse glow effect
      float mouseGlow = mouseInfluence * sin(time * 4.0) * 0.2;
      totalFlow += mouseGlow;
      
      // Normalize intensity
      float intensity = smoothstep(0.0, 1.2, totalFlow);
      
      // Create organic color transitions
      vec3 color;
      
      if (intensity < 0.15) {
        // Deep base - dark flowing areas
        color = mix(RAISIN_BLACK, TRUE_BLUE * 0.8, intensity * 6.67);
      } else if (intensity < 0.35) {
        // Flow transition - blue to gray
        color = mix(TRUE_BLUE * 0.8, TRUE_BLUE, (intensity - 0.15) * 5.0);
      } else if (intensity < 0.55) {
        // Mid-flow - blue to cool gray
        color = mix(TRUE_BLUE, COOL_GRAY, (intensity - 0.35) * 5.0);
      } else if (intensity < 0.75) {
        // Bright flow - gray to warm yellow
        color = mix(COOL_GRAY, PEACH_YELLOW, (intensity - 0.55) * 5.0);
      } else if (intensity < 0.9) {
        // Peak flow - yellow brightness
        color = mix(PEACH_YELLOW, PEACH_YELLOW * 1.2, (intensity - 0.75) * 6.67);
      } else {
        // Flow highlights - brightest areas
        color = mix(PEACH_YELLOW * 1.2, SOFT_WHITE, (intensity - 0.9) * 10.0);
      }
      
      // Add flowing brightness variations
      float brightness = 0.9 + fbm(uv * 4.0 + time * 0.6) * 0.2;
      color *= brightness;
      
      // Organic depth through flowing gradients
      float depth = 1.0 - length(uv * 0.3);
      depth = smoothstep(0.3, 1.0, depth);
      color *= 0.85 + depth * 0.3;
      
      // Add subtle color temperature flow
      float warmth = 0.98 + sin(totalFlow * 2.0 + time) * 0.04;
      color.r *= warmth;
      color.b *= (2.0 - warmth);
      
      // Final enhancement
      color *= 1.1;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;
</script>

<!-- Full-screen background -->
<Scene {fragmentShader} />

<div class="hero-text text-white drop-shadow-2xl flowing-text" style="text-shadow: 2px 2px 15px rgba(17,20,40,0.95), 0 0 35px rgba(73,107,179,0.4), 0 0 60px rgba(242,213,151,0.2);">
  <h1>
    Amara &<br class="mobile-break">Partners
  </h1>
</div>

<style>
  @import '$lib/styles/responsive.css';
  
  /* Flowing text effect */
  .flowing-text {
    background: linear-gradient(45deg, 
      rgba(255,255,255,1) 0%, 
      rgba(242,213,151,1) 30%, 
      rgba(255,255,255,0.9) 60%, 
      rgba(152,153,166,0.8) 80%, 
      rgba(255,255,255,1) 100%);
    background-size: 300% 300%;
    animation: flowingGradient 4s ease-in-out infinite;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  @keyframes flowingGradient {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .flowing-text {
      animation: none;
      background: white;
      -webkit-text-fill-color: white;
    }
  }
</style> 