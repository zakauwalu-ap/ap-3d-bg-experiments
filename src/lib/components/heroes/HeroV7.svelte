<script lang="ts">
  import Scene from '$lib/components/three/Scene.svelte';
  
  // Optimized glow waves shader with efficient mouse repulsion
  const fragmentShader = `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;

    void main() {
      vec2 uv = (gl_FragCoord.xy - u_resolution * 0.7) / max(u_resolution.x, u_resolution.y) * 3.0;
      
      // Normalize mouse coordinates to match our UV space
      vec2 mouseUV = (u_mouse * u_resolution - u_resolution * 0.7) / max(u_resolution.x, u_resolution.y) * 3.0;
      
      // Early exit optimization: only calculate mouse effects if reasonably close
      float roughDistance = abs(uv.x - mouseUV.x) + abs(uv.y - mouseUV.y); // Manhattan distance (faster)
      
      vec2 modifiedUV = uv;
      float mouseGlow = 1.0;
      
      if (roughDistance < 2.0) { // Only do expensive calculations if mouse is nearby
        float mouseDistance = length(uv - mouseUV);
        float repulsionRadius = 1.2;
        float repulsionStrength = 0.3;
        float mouseInfluence = smoothstep(repulsionRadius, 0.0, mouseDistance) * repulsionStrength;
        
        if (mouseInfluence > 0.001) { // Only apply if influence is meaningful
          vec2 repulsionDir = normalize(uv - mouseUV);
          modifiedUV = uv + repulsionDir * mouseInfluence;
          mouseGlow = 1.0 + mouseInfluence * 0.2;
        }
      }
      
      float e = 0.0;
      for (float i = 3.0; i <= 15.0; i += 1.0) {
        e += 0.007 / abs((i/15.0) + sin((u_time/2.0) + 0.15*i*(modifiedUV.y) * (cos(i/4.0 + (u_time/2.0) + modifiedUV.y*2.2))) + 2.5*modifiedUV.x);
      }
      
      e *= mouseGlow;
      
      // Golden/peach yellow glow color (inspired by F2D597)
      gl_FragColor = vec4(vec3(e/1.6, e/1.9, e/4.2), 1.0);
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