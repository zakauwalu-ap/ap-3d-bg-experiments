<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { createShaderUniforms, updateShaderUniforms, resizeRenderer } from '$lib/utils/three-utils';
  import type { ShaderUniforms } from '$lib/utils/three-utils';

  export let fragmentShader: string;
  export let vertexShader: string = `
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  export let additionalUniforms: Record<string, { value: any }> = {};

  let canvas: HTMLCanvasElement;
  let scene: THREE.Scene;
  let camera: THREE.OrthographicCamera;
  let renderer: THREE.WebGLRenderer;
  let material: THREE.ShaderMaterial;
  let uniforms: ShaderUniforms;
  let animationId: number;
  let mouseX = 0.5;
  let mouseY = 0.5;

  const clock = new THREE.Clock();

  onMount(() => {
    if (!canvas) return;

    // Initialize Three.js scene
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    renderer = new THREE.WebGLRenderer({ 
      canvas, 
      antialias: true,
      alpha: true 
    });
    
    // Create shader uniforms with actual render buffer size
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    uniforms = createShaderUniforms(
      window.innerWidth * pixelRatio, 
      window.innerHeight * pixelRatio, 
      additionalUniforms
    );

    // Create shader material
    material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide
    });

    // Create fullscreen quad
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      resizeRenderer(renderer, camera, width, height);
      
      // Set u_resolution to match actual render buffer size, not window size
      const actualWidth = width * renderer.getPixelRatio();
      const actualHeight = height * renderer.getPixelRatio();
      uniforms.u_resolution.value.set(actualWidth, actualHeight);
    };

    // Handle mouse move
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (event.clientX - rect.left) / rect.width;
      mouseY = 1.0 - ((event.clientY - rect.top) / rect.height);
    };

    // Animation loop
    const animate = () => {
      const deltaTime = clock.getDelta();
      
      updateShaderUniforms(uniforms, deltaTime, mouseX, mouseY);
      
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    // Initialize
    handleResize();
    animate();

    // Event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  });

  onDestroy(() => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    
    if (renderer) {
      renderer.dispose();
    }
    
    if (material) {
      material.dispose();
    }
  });
</script>

<canvas 
  bind:this={canvas} 
  class="hero-background"
  style="width: 100vw; height: 100vh; position: absolute; top: 0; left: 0; z-index: 0;"
></canvas> 