<script lang="ts">
  import Scene from '$lib/components/three/Scene.svelte';
  
  // Enhanced sand ripples shader with more visual interest - sunlight, shadows, and shimmer
  const fragmentShader = `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;

    void main() {
      vec2 st = gl_FragCoord.xy / u_resolution.xy;
      vec2 mouse = u_mouse.xy; // u_mouse is already normalized 0-1
      
      // Subtle mouse interaction zone with smooth falloff
      float mouseDistance = length(st - mouse);
      
      // Create smooth falloff that eliminates visible boundaries
      float mouseFalloff = exp(-mouseDistance * 5.0); // Smooth exponential falloff
      
      // Create subtle distortion field around mouse
      vec2 mouseDistortion = vec2(0.0);
      float mouseRipple = 0.0;
      float mouseBlur = 0.0;
      
      // Create gentle concentric ripples with smooth falloff
      float ripple1 = sin(mouseDistance * 20.0 - u_time * 2.5) * exp(-mouseDistance * 4.0) * mouseFalloff;
      float ripple2 = sin(mouseDistance * 12.0 - u_time * 1.8) * exp(-mouseDistance * 3.5) * mouseFalloff;
      float ripple3 = sin(mouseDistance * 28.0 - u_time * 3.2) * exp(-mouseDistance * 5.0) * mouseFalloff;
      
      mouseRipple = (ripple1 * 0.06 + ripple2 * 0.04 + ripple3 * 0.03);
      
      // Create subtle radial distortion with smooth falloff
      vec2 mouseDirection = normalize(st - mouse);
      float distortionStrength = exp(-mouseDistance * 3.5) * mouseFalloff * 0.008;
      mouseDistortion = mouseDirection * sin(mouseDistance * 15.0 - u_time * 2.0) * distortionStrength;
      
      // Add gentle blur-like effect with smooth falloff
      mouseBlur = exp(-mouseDistance * 4.0) * mouseFalloff * 0.08;
      
      // Apply mouse distortion to the sampling position
      vec2 distortedSt = st + mouseDistortion;
      
      // Create multiple layers of gentle waves at different scales and speeds
      float wave1 = sin(distortedSt.x * 8.0 + u_time * 0.3) * 0.08;
      float wave2 = sin(distortedSt.y * 6.0 + u_time * 0.2) * 0.06;
      float wave3 = sin((distortedSt.x + distortedSt.y) * 4.0 + u_time * 0.15) * 0.04;
      float wave4 = sin((distortedSt.x - distortedSt.y) * 12.0 + u_time * 0.25) * 0.03;
      
      // Create cross-directional ripples for more organic feel
      float crossWave1 = sin(distortedSt.x * 5.0 - distortedSt.y * 3.0 + u_time * 0.18) * 0.05;
      float crossWave2 = sin(distortedSt.x * 7.0 + distortedSt.y * 2.0 + u_time * 0.12) * 0.04;
      
      // Add some finer detail waves for more texture
      float detailWave1 = sin(distortedSt.x * 20.0 + u_time * 0.1) * 0.015;
      float detailWave2 = sin(distortedSt.y * 15.0 + u_time * 0.08) * 0.012;
      
      // Combine all waves with mouse influence
      vec2 distortion = vec2(
        wave1 + wave3 + crossWave1 + detailWave1,
        wave2 + wave4 + crossWave2 + detailWave2
      );
      
      vec2 distortedPos = distortedSt + distortion;
      
      // Create depth-based coloring (lighter ridges, darker valleys) with mouse ripples
      float depth = (wave1 + wave2 + wave3 + wave4 + crossWave1 + crossWave2) * 2.0 + mouseRipple;
      
      // Enhanced sand color palette with more variation
      vec3 sandLight = vec3(0.92, 0.85, 0.75);   // Bright sand in sunlight
      vec3 sandMid = vec3(0.75, 0.65, 0.50);     // Medium sand
      vec3 sandDark = vec3(0.40, 0.30, 0.22);    // Deep shadow sand
      vec3 sandWarm = vec3(0.85, 0.70, 0.45);    // Warm golden sand
      vec3 mouseHighlight = vec3(0.95, 0.88, 0.70); // Special highlight color for mouse area
      
      // Add subtle shimmer effect with mouse interaction
      float shimmer = sin(distortedPos.x * 20.0 + u_time * 0.3) * 
                     sin(distortedPos.y * 25.0 + u_time * 0.25) * 0.04; // Reduced from 0.08
      shimmer *= smoothstep(0.02, 0.08, abs(depth));
      
      // Subtle mouse interaction effects with smooth falloff
      // Add gentle shimmer around mouse
      float mouseShimmer = sin(mouseDistance * 30.0 - u_time * 3.0) * exp(-mouseDistance * 3.0) * mouseFalloff * 0.08;
      shimmer += mouseShimmer;
      
      // Create gentle pulsing glow effect around mouse
      float mousePulse = sin(u_time * 2.0) * 0.3 + 0.7;
      float mouseGlow = exp(-mouseDistance * 5.0) * mousePulse * mouseFalloff * 0.04;
      shimmer += mouseGlow;
      
      // Apply depth-based color mixing with enhanced mouse influence
      vec3 finalColor;
      if (depth > 0.08) {
        // High ridges - bright sand with warm tones
        float ridgeIntensity = smoothstep(0.08, 0.20, depth);
        finalColor = mix(sandMid, mix(sandLight, sandWarm, ridgeIntensity * 0.6), ridgeIntensity);
      } else if (depth < -0.08) {
        // Deep valleys - darker sand with cooler tones
        float valleyIntensity = smoothstep(-0.08, -0.20, -depth);
        finalColor = mix(sandMid, sandDark, valleyIntensity);
      } else {
        // Middle areas - base sand color with subtle variation
        float variation = sin(distortedPos.x * 40.0) * sin(distortedPos.y * 35.0) * 0.05;
        finalColor = sandMid + vec3(variation);
      }
      
      // Apply subtle mouse color influence with smooth falloff
      float mouseColorInfluence = exp(-mouseDistance * 4.0) * mouseFalloff * 0.12;
      finalColor = mix(finalColor, mouseHighlight, mouseColorInfluence);
      
      // Add gentle color shifting effect around mouse
      float hueShift = sin(u_time * 1.5 + mouseDistance * 8.0) * mouseFalloff * 0.04;
      finalColor.rgb += vec3(hueShift * 0.05, hueShift * 0.03, -hueShift * 0.02);
      
      // Add subtle shimmer highlights
      finalColor += vec3(shimmer * 0.4, shimmer * 0.25, shimmer * 0.15); // Reduced
      
      // Apply blur-like effect near mouse (sample multiple points)
      if (mouseBlur > 0.01) {
        vec3 blurSample1 = finalColor * 0.4;
        vec3 blurSample2 = finalColor * 0.3; // Simplified for performance
        vec3 blurSample3 = finalColor * 0.3;
        
        vec3 blurredColor = blurSample1 + blurSample2 + blurSample3;
        finalColor = mix(finalColor, blurredColor, mouseBlur);
      }
      
      // Add subtle color gradient across the screen (like changing light conditions)
      vec2 gradientCenter = vec2(0.3, 0.7); // Off-center for more natural look
      float distanceFromCenter = length(st - gradientCenter);
      float colorShift = smoothstep(0.0, 1.2, distanceFromCenter) * 0.08;
      finalColor = mix(finalColor, finalColor * vec3(0.95, 0.90, 0.85), colorShift);
      
      // Add more sophisticated noise for sand grain texture
      float noise1 = fract(sin(dot(distortedPos * 80.0, vec2(12.9898, 78.233))) * 43758.5453) * 0.02;
      float noise2 = fract(sin(dot(distortedPos * 120.0, vec2(23.423, 56.234))) * 23421.6342) * 0.015;
      finalColor += vec3(noise1 + noise2);
      
      // Subtle vignette for more professional look
      float vignette = smoothstep(0.0, 0.4, 1.0 - length(st - vec2(0.5)));
      vignette = mix(0.85, 1.0, vignette);
      finalColor *= vignette;
      
      // Ensure colors stay within enhanced sand range
      finalColor = clamp(finalColor, vec3(0.15, 0.10, 0.08), vec3(1.0, 0.95, 0.85));
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;
</script>

<!-- Full-screen background -->
<Scene {fragmentShader} />

<div class="hero-text text-gray-800 drop-shadow-2xl">
  <h1>
    Amara &<br class="mobile-break">Partners
  </h1>
</div>

<style>
  @import '$lib/styles/responsive.css';
</style> 