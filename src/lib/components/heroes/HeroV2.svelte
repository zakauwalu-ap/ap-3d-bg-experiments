<script lang="ts">
  import Scene from '$lib/components/three/Scene.svelte';
  
  // Enhanced sand ripples shader V2 - darker background with peach yellow waves
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
      
      // V2 Color Palette - Dark background with peach yellow waves
      vec3 backgroundDark = vec3(0.12, 0.14, 0.18);    // Raisin black base
      vec3 backgroundMid = vec3(0.18, 0.25, 0.35);     // Dark blue-gray
      vec3 backgroundDeep = vec3(0.08, 0.10, 0.12);    // Very deep background
      vec3 waveLight = vec3(0.95, 0.84, 0.59);         // Bright peach yellow
      vec3 waveMid = vec3(0.88, 0.75, 0.45);           // Medium peach
      vec3 waveWarm = vec3(0.92, 0.80, 0.52);          // Warm peach yellow
      vec3 mouseHighlight = vec3(1.0, 0.90, 0.65);     // Bright peach highlight
      
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
      
      // Apply depth-based color mixing with V2 color scheme
      vec3 finalColor;
      if (depth > 0.08) {
        // High ridges/waves - bright peach yellow tones
        float ridgeIntensity = smoothstep(0.08, 0.20, depth);
        finalColor = mix(backgroundMid, mix(waveLight, waveWarm, ridgeIntensity * 0.8), ridgeIntensity * 0.9);
      } else if (depth < -0.08) {
        // Deep valleys - very dark background
        float valleyIntensity = smoothstep(-0.08, -0.20, -depth);
        finalColor = mix(backgroundDark, backgroundDeep, valleyIntensity);
      } else {
        // Middle areas - base dark background with subtle peach hints
        float variation = sin(distortedPos.x * 40.0) * sin(distortedPos.y * 35.0) * 0.05;
        finalColor = backgroundDark + vec3(variation * 0.3, variation * 0.2, variation * 0.1);
      }
      
      // Apply subtle mouse color influence with peach highlights and smooth falloff
      float mouseColorInfluence = exp(-mouseDistance * 4.0) * mouseFalloff * 0.15;
      finalColor = mix(finalColor, mouseHighlight, mouseColorInfluence);
      
      // Add gentle warm color shifting effect around mouse
      float hueShift = sin(u_time * 1.5 + mouseDistance * 8.0) * mouseFalloff * 0.04;
      finalColor.rgb += vec3(hueShift * 0.08, hueShift * 0.06, hueShift * 0.03);
      
      // Add subtle shimmer highlights with peach tones
      finalColor += vec3(shimmer * 0.5, shimmer * 0.35, shimmer * 0.2); // Reduced
      
      // Apply blur-like effect near mouse (sample multiple points)
      if (mouseBlur > 0.01) {
        vec3 blurSample1 = finalColor * 0.4;
        vec3 blurSample2 = finalColor * 0.3; // Simplified for performance
        vec3 blurSample3 = finalColor * 0.3;
        
        vec3 blurredColor = blurSample1 + blurSample2 + blurSample3;
        finalColor = mix(finalColor, blurredColor, mouseBlur);
      }
      
      // Add subtle blue gradient across the screen for depth
      vec2 gradientCenter = vec2(0.3, 0.7); // Off-center for more natural look
      float distanceFromCenter = length(st - gradientCenter);
      float colorShift = smoothstep(0.0, 1.2, distanceFromCenter) * 0.06;
      vec3 blueShift = vec3(0.15, 0.20, 0.30); // Subtle blue tint
      finalColor = mix(finalColor, finalColor * blueShift, colorShift);
      
      // Add noise texture for depth
      float noise1 = fract(sin(dot(distortedPos * 80.0, vec2(12.9898, 78.233))) * 43758.5453) * 0.02;
      float noise2 = fract(sin(dot(distortedPos * 120.0, vec2(23.423, 56.234))) * 23421.6342) * 0.015;
      finalColor += vec3(noise1 + noise2) * 0.5;
      
      // Subtle vignette for more professional look
      float vignette = smoothstep(0.0, 0.4, 1.0 - length(st - vec2(0.5)));
      vignette = mix(0.75, 1.0, vignette);
      finalColor *= vignette;
      
      // Ensure colors stay within the new V2 range
      finalColor = clamp(finalColor, vec3(0.05, 0.06, 0.08), vec3(1.0, 0.95, 0.70));
      
      gl_FragColor = vec4(finalColor, 1.0);
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