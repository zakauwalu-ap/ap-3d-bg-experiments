<script lang="ts">
  import Scene from '$lib/components/three/Scene.svelte';
  
  // 3D Waves shader - recreating Vanta-style waves effect
  const fragmentShader = `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;

    // Hash function for pseudo-random numbers
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    // 3D noise function
    float noise3D(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      
      float a = hash(i.xy + vec2(0.0, 0.0));
      float b = hash(i.xy + vec2(1.0, 0.0));
      float c = hash(i.xy + vec2(0.0, 1.0));
      float d = hash(i.xy + vec2(1.0, 1.0));
      
      vec3 u = f * f * (3.0 - 2.0 * f);
      
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    // Generate wave height at a given position
    float waveHeight(vec2 pos, float time) {
      float height = 0.0;
      
      // Multiple wave layers for complexity
      height += sin(pos.x * 0.8 + time * 1.2) * cos(pos.y * 0.6 + time * 0.8) * 0.3;
      height += sin(pos.x * 1.5 - time * 0.9) * cos(pos.y * 1.2 - time * 1.1) * 0.2;
      height += sin(pos.x * 2.1 + pos.y * 1.8 + time * 1.5) * 0.15;
      height += sin(pos.x * 3.2 - pos.y * 2.4 - time * 2.1) * 0.1;
      
      // Add noise for organic variation
      height += noise3D(vec3(pos * 2.0, time * 0.5)) * 0.1;
      
      return height;
    }

    // Calculate wave normal for lighting
    vec3 calculateNormal(vec2 pos, float time) {
      float eps = 0.01;
      
      float hL = waveHeight(pos - vec2(eps, 0.0), time);
      float hR = waveHeight(pos + vec2(eps, 0.0), time);
      float hD = waveHeight(pos - vec2(0.0, eps), time);
      float hU = waveHeight(pos + vec2(0.0, eps), time);
      
      vec3 normal = normalize(vec3(hL - hR, 2.0 * eps, hD - hU));
      return normal;
    }

    void main() {
      vec2 st = gl_FragCoord.xy / u_resolution.xy;
      vec2 mouse = u_mouse.xy;
      
      // Create perspective projection for 3D wave surface
      float aspect = u_resolution.x / u_resolution.y;
      vec2 uv = (st - 0.5) * 2.0;
      uv.x *= aspect;
      
      // Create 3D perspective
      float perspective = 0.8 + uv.y * 0.3; // Further points appear smaller
      vec2 wavePos = uv / perspective;
      
      // Scale and animate the wave surface
      wavePos *= 3.0;
      wavePos += vec2(u_time * 0.1, u_time * 0.05);
      
      // Mouse interaction - create ripples
      vec2 mouseWorldPos = ((mouse - 0.5) * 2.0);
      mouseWorldPos.x *= aspect;
      mouseWorldPos = mouseWorldPos / (0.8 + mouseWorldPos.y * 0.3) * 3.0;
      mouseWorldPos += vec2(u_time * 0.1, u_time * 0.05);
      
      float mouseDistance = length(wavePos - mouseWorldPos);
      float mouseRipple = sin(mouseDistance * 8.0 - u_time * 12.0) * exp(-mouseDistance * 1.5) * 0.4;
      
      // Calculate wave height with mouse influence
      float height = waveHeight(wavePos, u_time) + mouseRipple;
      
      // Convert height to color intensity based on depth
      float depth = height * perspective;
      
      // Calculate normal for lighting effects
      vec3 normal = calculateNormal(wavePos, u_time);
      
      // Light direction (from top-left)
      vec3 lightDir = normalize(vec3(-0.5, 1.0, 0.5));
      float lighting = max(0.0, dot(normal, lightDir));
      
      // Create wave peaks and valleys coloring
      float waveIntensity = smoothstep(-0.2, 0.8, height);
      float waveHighlight = smoothstep(0.3, 0.7, height);
      
      // Color palette - deep ocean to bright wave peaks
      vec3 deepWater = vec3(0.05, 0.15, 0.25);      // Deep blue
      vec3 midWater = vec3(0.1, 0.3, 0.5);          // Medium blue
      vec3 waveColor = vec3(0.2, 0.6, 0.8);         // Bright blue
      vec3 foamColor = vec3(0.7, 0.9, 1.0);         // White foam
      
      // Mouse interaction color
      vec3 mouseColor = vec3(0.3, 0.8, 1.0);
      float mouseInfluence = exp(-mouseDistance * 2.0) * 0.3;
      
      // Build the final color
      vec3 waterColor = mix(deepWater, midWater, waveIntensity);
      waterColor = mix(waterColor, waveColor, waveHighlight);
      waterColor = mix(waterColor, foamColor, smoothstep(0.5, 0.8, height));
      
      // Apply lighting
      waterColor *= 0.6 + lighting * 0.4;
      
      // Add mouse interaction
      waterColor = mix(waterColor, mouseColor, mouseInfluence);
      
      // Add subtle shimmer on wave peaks
      float shimmer = sin(wavePos.x * 10.0 + u_time * 3.0) * 
                      sin(wavePos.y * 8.0 + u_time * 2.5) * 
                      waveHighlight * 0.1;
      waterColor += vec3(shimmer);
      
      // Perspective fade for distance
      float distanceFade = smoothstep(-0.5, 0.3, uv.y);
      waterColor *= mix(0.4, 1.0, distanceFade);
      
      // Add atmospheric perspective (far waves are hazier)
      vec3 atmosphereColor = vec3(0.4, 0.7, 0.9);
      waterColor = mix(waterColor, atmosphereColor, 1.0 - distanceFade);
      
      // Subtle noise for texture
      float noiseVal = noise3D(vec3(st * 100.0, u_time * 2.0)) * 0.02;
      waterColor += vec3(noiseVal);
      
      // Ensure proper color range
      waterColor = clamp(waterColor, vec3(0.0), vec3(1.0));
      
      gl_FragColor = vec4(waterColor, 1.0);
    }
  `;
</script>

<!-- Full-screen background -->
<Scene {fragmentShader} />

<div class="hero-text text-white drop-shadow-2xl">
  <h1>
    Amara &<br class="mobile-break">Partners
  </h1>
</div>

<style>
  @import '$lib/styles/responsive.css';
</style> 