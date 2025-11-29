// ABOUTME: WebGL canvas with procedural aurora gradient shader effect
// ABOUTME: Sunset warm colors (orange/pink/purple) with mouse-reactive distortion

'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useHeroCanvas } from '../hooks/useHeroCanvas';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { vertexShader, fragmentShader, defaultUniforms } from '../shaders/auroraGradient';
import { AURORA_CONFIG } from '../config/animations';

interface AuroraPlaneProps {
  mousePosition: { x: number; y: number };
}

/**
 * Inner plane mesh with aurora gradient shader
 */
function AuroraPlane({ mousePosition }: AuroraPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const shouldReduceMotion = useReducedMotion();

  // Create uniforms with aurora config
  const uniforms = useMemo(
    () => ({
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 },
      uDistortionStrength: {
        value: shouldReduceMotion ? 0 : AURORA_CONFIG.distortionStrength,
      },
      uMouseRadius: { value: AURORA_CONFIG.mouseRadius },
      uFlowSpeed: {
        value: shouldReduceMotion ? 0.02 : AURORA_CONFIG.flowSpeed,
      },
      uNoiseScale: { value: AURORA_CONFIG.noiseScale },
    }),
    [shouldReduceMotion]
  );

  // Animation loop
  useFrame((state) => {
    if (!materialRef.current) return;

    // Update time for flowing animation
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

    // Smoothly interpolate mouse position
    const currentMouse = materialRef.current.uniforms.uMouse.value;
    currentMouse.x += (mousePosition.x - currentMouse.x) * 0.08;
    currentMouse.y += (mousePosition.y - currentMouse.y) * 0.08;
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

interface HeroCanvasProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Hero canvas with aurora gradient effect
 *
 * - Procedural flowing gradient (no external image)
 * - Sunset warm color palette (orange/pink/purple)
 * - Mouse-reactive liquid distortion
 * - Falls back to CSS gradient for reduced motion or WebGL errors
 */
export function HeroCanvas({ className = '' }: HeroCanvasProps) {
  const { mousePosition, containerRef } = useHeroCanvas();
  const shouldReduceMotion = useReducedMotion();
  const [hasWebGLError, setHasWebGLError] = useState(false);

  // CSS gradient fallback for reduced motion or WebGL errors
  if (shouldReduceMotion || hasWebGLError) {
    return (
      <div
        ref={containerRef}
        className={`relative h-full w-full overflow-hidden ${className}`}
        style={{
          background: 'linear-gradient(135deg, #261440 0%, #7326A6 35%, #D9408C 65%, #F25926 100%)',
        }}
      />
    );
  }

  return (
    <div ref={containerRef} className={`relative h-full w-full overflow-hidden ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
        style={{ background: '#261440' }}
        onCreated={({ gl }) => {
          if (!gl.capabilities.isWebGL2) {
            console.warn('WebGL2 not supported, falling back to CSS gradient');
          }
        }}
        onError={() => {
          setHasWebGLError(true);
        }}
      >
        <AuroraPlane mousePosition={mousePosition} />
      </Canvas>

      {/* Subtle gradient overlay for depth */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 30% 50%, transparent 0%, rgba(38, 20, 64, 0.3) 100%)',
        }}
      />
    </div>
  );
}
