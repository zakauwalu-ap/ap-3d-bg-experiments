# 3D Shader Experiments

A Svelte + Three.js project for experimenting with 3D backgrounds and shader effects, perfect for creating stunning hero sections for law firm websites.

## 🎯 Project Overview

This project provides a modular framework for experimenting with GLSL shaders from Shadertoy and other sources, integrated seamlessly with Svelte components. It includes:

- **Reusable Scene Component**: Easy-to-use Three.js wrapper for shader rendering
- **Shader Utilities**: Helper functions for Shadertoy-to-Three.js conversion
- **Hero Section Templates**: Ready-to-use components for different visual effects
- **Live Demo Interface**: Switch between different shader effects in real-time

## 🛠 Features

- **GLSL Shader Support**: Direct integration with Shadertoy shaders
- **Mouse Interaction**: Responsive shader effects that react to cursor movement
- **Responsive Design**: Automatically adapts to different screen sizes
- **TypeScript**: Full type safety throughout the project
- **Hot Reloading**: Instant preview of changes during development

## 📁 Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── heroes/           # Different hero section experiments
│   │   │   ├── ShaderHero1.svelte (Gradient Waves)
│   │   │   └── ShaderHero2.svelte (Particle Field)
│   │   └── three/            # Reusable Three.js components
│   │       └── Scene.svelte
│   ├── shaders/              # GLSL shader files
│   │   ├── vertex/
│   │   └── fragment/
│   └── utils/
│       ├── three-utils.ts    # Three.js utilities
│       └── shader-loader.ts  # Shader loading utilities
├── routes/
│   ├── +page.svelte         # Main demo page
│   └── +layout.svelte       # App layout
└── app.css                  # Global styles with Tailwind
```

## 🎨 Current Shader Effects

1. **Gradient Waves**: Animated gradient with wave distortion and sparkle effects
2. **Particle Field**: Dynamic particle system with mouse interaction and ripple effects

## 🚀 Adding New Shaders

### From Shadertoy:

1. Copy the fragment shader code from Shadertoy
2. Create a new hero component in `src/lib/components/heroes/`
3. Use the `adaptShadertoyShader` utility to convert the code (optional)
4. Add the new hero to the demo page

### Example:

```typescript
// ShaderHero3.svelte
<script lang="ts">
  import Scene from '$lib/components/three/Scene.svelte';
  
  const fragmentShader = `
    // Your GLSL shader code here
    // Use u_time, u_resolution, u_mouse uniforms
  `;
</script>

<Scene {fragmentShader} />
```

## 🎯 For Law Firm Websites

This project is specifically designed for creating professional, trust-building backgrounds for law firm websites. The included shaders provide:

- **Professional Color Schemes**: Deep blues and purples that convey trust and authority
- **Subtle Animation**: Eye-catching but not distracting movement
- **Mouse Interaction**: Engaging user experience without being overwhelming
- **Performance Optimized**: Smooth rendering on various devices

## 🔧 Customization

- **Colors**: Modify the color values in the fragment shaders
- **Animation Speed**: Adjust time multipliers in the shader code
- **Mouse Sensitivity**: Change mouse interaction parameters
- **Resolution**: Shaders automatically adapt to screen size

## 📝 Next Steps

1. Install dependencies and run the project
2. Experiment with the existing shaders
3. Try importing shaders from Shadertoy
4. Create new hero section variations
5. Integrate your favorite effects into your law firm website 