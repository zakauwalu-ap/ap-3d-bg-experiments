// Utility functions for loading shader files
export const loadShader = async (path: string): Promise<string> => {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load shader: ${path}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error loading shader from ${path}:`, error);
    throw error;
  }
};

export const loadShaderModule = async (modulePath: string): Promise<string> => {
  try {
    const module = await import(modulePath);
    return module.default;
  } catch (error) {
    console.error(`Error loading shader module from ${modulePath}:`, error);
    throw error;
  }
};

// Common vertex shader for fullscreen quad
export const defaultVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Basic fragment shader template
export const basicFragmentShader = `
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
varying vec2 vUv;

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  vec3 color = vec3(st.x, st.y, abs(sin(u_time)));
  gl_FragColor = vec4(color, 1.0);
}
`; 