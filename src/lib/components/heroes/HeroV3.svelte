<script lang="ts">
  import Scene from '$lib/components/three/Scene.svelte';
  
  // Flowing wave lines shader - darker background with golden wave lines
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
      float mouseFalloff = exp(-mouseDistance * 6.0); // Smooth exponential falloff
      
      // Create dynamic distortion field around mouse
      vec2 mouseDistortion = vec2(0.0);
      float mouseRipple = 0.0;
      float mouseIntensity = 0.0;
      
      // Create subtle concentric ripples around mouse with smooth falloff
      float ripple1 = sin(mouseDistance * 25.0 - u_time * 3.0) * exp(-mouseDistance * 5.0) * mouseFalloff;
      float ripple2 = sin(mouseDistance * 15.0 - u_time * 2.0) * exp(-mouseDistance * 4.0) * mouseFalloff;
      float ripple3 = sin(mouseDistance * 35.0 - u_time * 4.0) * exp(-mouseDistance * 6.0) * mouseFalloff;
      
      mouseRipple = (ripple1 * 0.08 + ripple2 * 0.06 + ripple3 * 0.04);
      
      // Create subtle directional distortion with smooth falloff
      vec2 mouseDirection = normalize(st - mouse);
      float distortionStrength = exp(-mouseDistance * 4.0) * mouseFalloff * 0.015;
      mouseDistortion = mouseDirection * sin(mouseDistance * 12.0 - u_time * 2.5) * distortionStrength;
      
      // Subtle mouse intensity for color mixing with smooth falloff
      mouseIntensity = exp(-mouseDistance * 4.0) * mouseFalloff * 0.3;
      
      // Apply mouse distortion to the sampling position
      vec2 distortedSt = st + mouseDistortion;
      
      // Create subtle flowing horizontal wave lines
      float horizontalWave1 = sin(distortedSt.y * 10.0 + distortedSt.x * 1.5 + u_time * 0.5) * 0.08; // Reduced
      float horizontalWave2 = sin(distortedSt.y * 6.0 - distortedSt.x * 1.0 + u_time * 0.4) * 0.06; // Reduced
      float horizontalWave3 = sin(distortedSt.y * 14.0 + distortedSt.x * 2.0 + u_time * 0.7) * 0.04; // Reduced
      
      // Create subtle diagonal lines
      float diagonalWave1 = sin((distortedSt.x + distortedSt.y) * 8.0 + u_time * 0.4) * 0.05; // Reduced
      float diagonalWave2 = sin((distortedSt.x - distortedSt.y) * 12.0 + u_time * 0.6) * 0.04; // Reduced
      
      // Add subtle vertical elements
      float verticalWave1 = sin(distortedSt.x * 5.0 + distortedSt.y * 0.3 + u_time * 0.3) * 0.03; // Reduced
      float verticalWave2 = sin(distortedSt.x * 8.0 - distortedSt.y * 0.5 + u_time * 0.35) * 0.02; // Reduced
      
      // Create subtle detail lines
      float detailLine1 = sin(distortedSt.y * 20.0 + distortedSt.x * 3.0 + u_time * 0.2) * 0.015; // Reduced
      float detailLine2 = sin(distortedSt.y * 25.0 - distortedSt.x * 2.0 + u_time * 0.15) * 0.012; // Reduced
      
      // Combine all wave lines with mouse influence
      float combinedWaves = horizontalWave1 + horizontalWave2 + horizontalWave3 + 
                           diagonalWave1 + diagonalWave2 + 
                           verticalWave1 + verticalWave2 + 
                           detailLine1 + detailLine2 + mouseRipple;
      
      // Create line intensity based on wave patterns
      float lineIntensity = abs(combinedWaves);
      
      // Subtle line definition
      float lineSharpness = smoothstep(0.06, 0.20, lineIntensity); // Made more sensitive
      float lineCore = smoothstep(0.12, 0.28, lineIntensity);
      
      // Color Palette - Dark background with golden wave lines
      vec3 backgroundDark = vec3(0.08, 0.09, 0.12);        // Very dark blue-black
      vec3 backgroundMid = vec3(0.12, 0.14, 0.18);         // Dark gray-blue
      vec3 lineGold = vec3(0.85, 0.74, 0.40);             // Softer gold
      vec3 lineWarm = vec3(0.78, 0.68, 0.32);             // Softer medium gold
      vec3 lineDeep = vec3(0.65, 0.58, 0.22);             // Softer deep gold
      vec3 mouseHighlight = vec3(0.90, 0.80, 0.50);        // Softer golden highlight
      
      // Create subtle shimmer effect along lines
      float shimmer = sin(distortedSt.x * 12.0 + distortedSt.y * 15.0 + u_time * 1.2) * 
                     sin(distortedSt.y * 20.0 + u_time * 1.0) * 0.04; // Reduced from 0.1
      shimmer *= lineSharpness;
      
      // Subtle mouse interaction effects with smooth falloff
      // Add gentle shimmer near mouse
      float mouseShimmer = sin(mouseDistance * 25.0 - u_time * 3.0) * exp(-mouseDistance * 3.0) * mouseFalloff * 0.08;
      shimmer += mouseShimmer * lineSharpness;
      
      // Create gentle pulsing effect around mouse
      float mousePulse = sin(u_time * 2.5) * 0.3 + 0.7;
      float mouseGlow = exp(-mouseDistance * 6.0) * mousePulse * mouseFalloff * 0.05;
      shimmer += mouseGlow;
      
      // Build final color based on line intensity
      vec3 finalColor;
      if (lineCore > 0.1) {
        // Core of lines - bright gold
        finalColor = mix(lineWarm, lineGold, lineCore);
      } else if (lineSharpness > 0.05) {
        // Edge of lines - medium gold blending to dark
        finalColor = mix(backgroundMid, lineWarm, lineSharpness * 2.0);
      } else {
        // Background areas - dark with subtle variation
        float bgVariation = sin(distortedSt.x * 50.0) * sin(distortedSt.y * 40.0) * 0.02;
        finalColor = backgroundDark + vec3(bgVariation * 0.5, bgVariation * 0.3, bgVariation * 0.2);
      }
      
      // Apply subtle mouse color influence with smooth falloff
      finalColor = mix(finalColor, mouseHighlight, mouseIntensity * 0.4);
      
      // Add gentle warm color variation around mouse
      float colorPulse = sin(u_time * 2.0 + mouseDistance * 5.0) * mouseFalloff * 0.04;
      finalColor.rgb += vec3(colorPulse * 0.1, colorPulse * 0.08, colorPulse * 0.03);
      
      // Add subtle shimmer highlights
      finalColor += vec3(shimmer * 0.6, shimmer * 0.5, shimmer * 0.3); // Reduced
      
      // Create gentle energy streaks along lines
      float energyStreak = sin(distortedSt.y * 6.0 + u_time * 1.2) * 
                          sin(distortedSt.x * 2.5 + u_time * 0.6) * 0.04; // Reduced from 0.08
      energyStreak *= lineSharpness;
      finalColor += vec3(energyStreak * 0.3, energyStreak * 0.25, energyStreak * 0.1); // Reduced
      
      // Add depth gradient for more visual interest
      vec2 gradientCenter = vec2(0.4, 0.6);
      float distanceFromCenter = length(st - gradientCenter);
      float depthShift = smoothstep(0.0, 1.0, distanceFromCenter) * 0.08;
      vec3 depthColor = vec3(0.18, 0.22, 0.28); // Subtle blue-gray tint
      finalColor = mix(finalColor, finalColor * depthColor, depthShift);
      
      // Add fine noise texture for more organic feel
      float noise1 = fract(sin(dot(distortedSt * 90.0, vec2(12.9898, 78.233))) * 43758.5453) * 0.015;
      float noise2 = fract(sin(dot(distortedSt * 140.0, vec2(23.423, 56.234))) * 23421.6342) * 0.01;
      finalColor += vec3(noise1 + noise2) * 0.4;
      
      // Subtle vignette for professional look
      float vignette = smoothstep(0.0, 0.5, 1.0 - length(st - vec2(0.5)));
      vignette = mix(0.8, 1.0, vignette);
      finalColor *= vignette;
      
      // Ensure colors stay within desired range
      finalColor = clamp(finalColor, vec3(0.04, 0.05, 0.08), vec3(1.0, 0.95, 0.65));
      
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