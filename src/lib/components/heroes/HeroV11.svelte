<script lang="ts">
  import Scene from '$lib/components/three/Scene.svelte';
  
  // REVOLUTIONARY LIQUID METAL CRYSTALLINE FORMATIONS - BUCK WILD!
  const fragmentShader = `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;

    // User's sophisticated color palette - now used for prismatic effects
    #define TRUE_BLUE vec3(0.286, 0.42, 0.702)      // #496BB3
    #define RAISIN_BLACK vec3(0.118, 0.141, 0.176)  // #1E242D  
    #define PEACH_YELLOW vec3(0.949, 0.835, 0.592)  // #F2D597
    #define COOL_GRAY vec3(0.596, 0.600, 0.651)     // #9899A6
    #define CRYSTAL_WHITE vec3(0.98, 0.99, 1.0)     // Pure crystal highlight

    // Advanced noise functions for crystalline structures
    vec2 hash22(vec2 p) {
        p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
        return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
    }

    float noise(vec2 p) {
        const float K1 = 0.366025404; // (sqrt(3)-1)/2;
        const float K2 = 0.211324865; // (3-sqrt(3))/6;
        
        vec2 i = floor(p + (p.x + p.y) * K1);
        vec2 a = p - i + (i.x + i.y) * K2;
        vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec2 b = a - o + K2;
        vec2 c = a - 1.0 + 2.0 * K2;
        
        vec3 h = max(0.5 - vec3(dot(a,a), dot(b,b), dot(c,c)), 0.0);
        vec3 n = h * h * h * h * vec3(dot(a, hash22(i + 0.0)), dot(b, hash22(i + o)), dot(c, hash22(i + 1.0)));
        
        return dot(n, vec3(70.0));
    }

    // Voronoi cell generation for crystalline facets
    vec3 voronoi(vec2 p) {
        vec2 n = floor(p);
        vec2 f = fract(p);
        
        vec3 res = vec3(8.0);
        for(int j = -1; j <= 1; j++) {
            for(int i = -1; i <= 1; i++) {
                vec2 g = vec2(float(i), float(j));
                vec2 o = hash22(n + g);
                o = 0.5 + 0.5 * sin(u_time * 0.5 + 6.2831 * o);
                vec2 r = g + o - f;
                float d = dot(r, r);
                
                if(d < res.x) {
                    res.z = res.y;
                    res.y = res.x;
                    res.x = d;
                } else if(d < res.y) {
                    res.z = res.y;
                    res.y = d;
                } else if(d < res.z) {
                    res.z = d;
                }
            }
        }
        return sqrt(res);
    }

    // Advanced fractal function for geometric complexity
    float fractal(vec2 p) {
        float f = 0.0;
        float scale = 0.5;
        for(int i = 0; i < 6; i++) {
            f += scale * noise(p);
            p *= 2.03;
            scale *= 0.5;
        }
        return f;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      uv = uv * 2.0 - 1.0;
      uv.x *= u_resolution.x / u_resolution.y;
      
      float time = u_time * 0.8; // More dynamic than previous versions
      
      // Revolutionary mouse interaction - creates crystalline disruption fields
      vec2 mouse = u_mouse * 2.0 - 1.0;
      mouse.x *= u_resolution.x / u_resolution.y;
      float mouseDistance = length(uv - mouse);
      float mouseField = 1.0 / (1.0 + mouseDistance * 3.0);
      float mousePulse = sin(time * 4.0 - mouseDistance * 8.0) * mouseField * 0.3;
      
      // Create multiple crystalline layers with different scales
      vec2 crystallineUV1 = uv * 6.0 + time * 0.3 + mousePulse;
      vec2 crystallineUV2 = uv * 12.0 - time * 0.2 + mousePulse * 0.5;
      vec2 crystallineUV3 = uv * 18.0 + time * 0.1 + mousePulse * 0.8;
      
      // Generate Voronoi cells for faceted crystal structure
      vec3 crystal1 = voronoi(crystallineUV1);
      vec3 crystal2 = voronoi(crystallineUV2);
      vec3 crystal3 = voronoi(crystallineUV3);
      
      // Create sharp faceted edges
      float facets1 = smoothstep(0.0, 0.1, crystal1.y - crystal1.x);
      float facets2 = smoothstep(0.0, 0.05, crystal2.y - crystal2.x);
      float facets3 = smoothstep(0.0, 0.03, crystal3.y - crystal3.x);
      
      // Generate liquid metal flow patterns
      vec2 flowUV = uv + vec2(sin(time * 0.4 + uv.y * 4.0), cos(time * 0.3 + uv.x * 3.0)) * 0.1;
      float metalFlow = fractal(flowUV * 8.0 + time * 0.5);
      metalFlow = smoothstep(-0.2, 0.8, metalFlow);
      
      // Create prismatic light refraction effects
      float prism1 = sin(crystal1.x * 20.0 + time * 2.0) * 0.5 + 0.5;
      float prism2 = sin(crystal2.x * 30.0 + time * 3.0) * 0.5 + 0.5;
      float prism3 = sin(crystal3.x * 40.0 + time * 4.0) * 0.5 + 0.5;
      
      // Combine crystalline structures with liquid metal
      float structure = (facets1 * 0.6 + facets2 * 0.3 + facets3 * 0.1) * metalFlow;
      
      // Add geometric interference patterns
      float interference = sin(uv.x * 15.0 + time) * sin(uv.y * 15.0 + time * 1.3) * 0.1;
      structure += interference;
      
      // Create depth through layered crystalline formations
      float depth1 = crystal1.x * 0.4;
      float depth2 = crystal2.x * 0.3;
      float depth3 = crystal3.x * 0.3;
      float totalDepth = 1.0 - (depth1 + depth2 + depth3);
      
      // Revolutionary lighting system - prismatic and metallic
      float lighting = 0.8 + prism1 * 0.2;
      lighting *= 0.9 + sin(totalDepth * 10.0 + time * 2.0) * 0.1;
      
      // Advanced color mapping - prismatic crystal effects
      vec3 color;
      
      // Base crystal structure
      if (structure < 0.2) {
        // Deep liquid metal base
        color = mix(RAISIN_BLACK, TRUE_BLUE * 0.6, structure * 5.0);
        color = mix(color, vec3(0.1, 0.1, 0.15), metalFlow * 0.3); // Metallic tint
      } else if (structure < 0.4) {
        // Crystalline mid-tones with metallic sheen
        float metallic = sin(totalDepth * 15.0 + time * 3.0) * 0.5 + 0.5;
        color = mix(TRUE_BLUE, COOL_GRAY, (structure - 0.2) * 5.0);
        color = mix(color, vec3(0.4, 0.45, 0.5), metallic * 0.2); // Metallic reflection
      } else if (structure < 0.6) {
        // Prismatic transition zone
        color = mix(COOL_GRAY, PEACH_YELLOW, (structure - 0.4) * 5.0);
        // Add prismatic color separation
        color.r += prism1 * 0.1;
        color.g += prism2 * 0.1;
        color.b += prism3 * 0.1;
      } else if (structure < 0.8) {
        // Bright crystalline facets
        color = mix(PEACH_YELLOW, CRYSTAL_WHITE, (structure - 0.6) * 5.0);
        // Enhanced prismatic effects
        color.r += prism1 * 0.15;
        color.g += prism2 * 0.1;
        color.b += prism3 * 0.2;
      } else {
        // Ultra-bright crystal peaks with rainbow dispersion
        float rainbow = (structure - 0.8) * 5.0;
        color = CRYSTAL_WHITE;
        // Rainbow prismatic dispersion
        color.r += sin(rainbow * 3.14159 + 0.0) * 0.2;
        color.g += sin(rainbow * 3.14159 + 2.094) * 0.2;
        color.b += sin(rainbow * 3.14159 + 4.188) * 0.2;
      }
      
      // Apply revolutionary lighting effects
      color *= lighting;
      
      // Add metallic reflections based on viewing angle
      float reflection = pow(1.0 - totalDepth, 3.0);
      color = mix(color, CRYSTAL_WHITE, reflection * 0.1);
      
      // Dynamic mouse-influenced highlighting
      float mouseHighlight = mouseField * sin(time * 6.0) * 0.1;
      color += vec3(mouseHighlight * 0.5, mouseHighlight * 0.3, mouseHighlight * 0.8);
      
      // Advanced depth-based atmospheric perspective
      float atmosphere = pow(totalDepth, 0.8);
      color = mix(color * 0.7, color, atmosphere);
      
      // Crystalline edge enhancement
      float edges = (facets1 + facets2 + facets3) * 0.33;
      color = mix(color, CRYSTAL_WHITE, edges * 0.15);
      
      // Final prismatic enhancement
      color *= 1.1;
      color = max(color, vec3(0.0)); // Prevent negative values
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;
</script>

<!-- Full-screen background -->
<Scene {fragmentShader} />

<div class="hero-text text-white drop-shadow-2xl crystalline-text" style="text-shadow: 
    2px 2px 15px rgba(17,20,40,0.95), 
    0 0 35px rgba(73,107,179,0.6), 
    0 0 60px rgba(242,213,151,0.3),
    0 0 100px rgba(152,153,166,0.2),
    4px 4px 20px rgba(0,0,0,0.8);">
  <h1>
    Amara &<br class="mobile-break">Partners
  </h1>
</div>

<style>
  @import '$lib/styles/responsive.css';
  
  /* Revolutionary crystalline text effect */
  .crystalline-text {
    background: linear-gradient(135deg, 
      rgba(255,255,255,1) 0%, 
      rgba(242,213,151,0.9) 25%, 
      rgba(152,153,166,0.8) 50%, 
      rgba(73,107,179,0.7) 75%, 
      rgba(255,255,255,1) 100%);
    background-size: 200% 200%;
    animation: crystallineShimmer 3s ease-in-out infinite;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(2px 2px 15px rgba(17,20,40,0.95)) 
            drop-shadow(0 0 35px rgba(73,107,179,0.4)) 
            drop-shadow(0 0 60px rgba(242,213,151,0.2));
  }
  
  @keyframes crystallineShimmer {
    0%, 100% { background-position: 0% 0%; }
    50% { background-position: 100% 100%; }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .crystalline-text {
      animation: none;
      background: white;
      -webkit-text-fill-color: white;
    }
  }
</style> 