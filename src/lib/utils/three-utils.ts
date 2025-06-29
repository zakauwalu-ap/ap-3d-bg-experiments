import * as THREE from 'three';

export interface ShaderUniforms {
  u_time: { value: number };
  u_resolution: { value: THREE.Vector2 };
  u_mouse: { value: THREE.Vector2 };
  [key: string]: { value: any };
}

export const createShaderUniforms = (
  width: number,
  height: number,
  additionalUniforms: Record<string, { value: any }> = {}
): ShaderUniforms => ({
  u_time: { value: 0.0 },
  u_resolution: { value: new THREE.Vector2(width, height) },
  u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
  ...additionalUniforms
});

export const updateShaderUniforms = (
  uniforms: ShaderUniforms,
  deltaTime: number,
  mouseX?: number,
  mouseY?: number
): void => {
  uniforms.u_time.value += deltaTime;
  
  if (mouseX !== undefined && mouseY !== undefined) {
    uniforms.u_mouse.value.set(mouseX, mouseY);
  }
};

export const createFullscreenGeometry = (): THREE.PlaneGeometry => {
  return new THREE.PlaneGeometry(2, 2);
};

export const createOrthographicCamera = (): THREE.OrthographicCamera => {
  return new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
};

export const resizeRenderer = (
  renderer: THREE.WebGLRenderer,
  camera: THREE.Camera,
  width: number,
  height: number
): void => {
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  if (camera instanceof THREE.PerspectiveCamera) {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
};

// Utility to convert Shadertoy-style shaders to Three.js format
export const adaptShadertoyShader = (shadertoyFragmentShader: string): string => {
  return shadertoyFragmentShader
    .replace(/void\s+mainImage\s*\(\s*out\s+vec4\s+fragColor\s*,\s*in\s+vec2\s+fragCoord\s*\)/g, 'void main()')
    .replace(/fragColor\s*=/g, 'gl_FragColor =')
    .replace(/fragCoord/g, 'gl_FragCoord.xy')
    .replace(/iResolution/g, 'u_resolution')
    .replace(/iTime/g, 'u_time')
    .replace(/iMouse/g, 'u_mouse');
};

export const createShaderMaterial = (
  vertexShader: string,
  fragmentShader: string,
  uniforms: ShaderUniforms
): THREE.ShaderMaterial => {
  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide
  });
}; 