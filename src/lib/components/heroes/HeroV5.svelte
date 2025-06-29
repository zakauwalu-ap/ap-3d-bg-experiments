<script lang="ts">
  import Scene from '$lib/components/three/Scene.svelte';
  
  // Glow waves shader - adapted from provided code
  const fragmentShader = `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;

    void main() {
      vec2 uv = (gl_FragCoord.xy - u_resolution * 0.7) / max(u_resolution.x, u_resolution.y) * 3.0;
      uv *= 1.0;
      
      float e = 0.0;
      for (float i = 3.0; i <= 15.0; i += 1.0) {
        e += 0.007 / abs((i/15.0) + sin((u_time/2.0) + 0.15*i*(uv.x) * (cos(i/4.0 + (u_time/2.0) + uv.x*2.2))) + 2.5*uv.y);
      }
      
      // Golden/peach yellow glow color (inspired by F2D597)
      gl_FragColor = vec4(vec3(e/1.6, e/1.9, e/4.2), 1.0);
    }
  `;
</script>

<!-- Full-screen background -->
<Scene {fragmentShader} />

<div class="hero-text text-white drop-shadow-2xl" style="text-shadow: 2px 2px 8px rgba(0,0,0,0.9);">
  <h1>
    Amara &<br class="mobile-break">Partners
  </h1>
</div>

<style>
  @import '$lib/styles/responsive.css';
</style> 