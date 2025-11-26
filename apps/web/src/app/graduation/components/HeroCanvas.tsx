// ABOUTME: WebGL canvas component with liquid distortion shader effect
// ABOUTME: Uses React Three Fiber for 3D rendering with custom shader material

'use client';

import { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useHeroCanvas } from '../hooks/useHeroCanvas';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { vertexShader, fragmentShader } from '../shaders/liquidDistortion';
import { CANVAS_CONFIG } from '../config/animations';

interface DistortionPlaneProps {
  texture: THREE.Texture;
  mousePosition: { x: number; y: number };
}

/**
 * Inner plane mesh with custom shader material
 */
function DistortionPlane({ texture, mousePosition }: DistortionPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const shouldReduceMotion = useReducedMotion();

  // Create uniforms
  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 },
      uDistortionStrength: { value: shouldReduceMotion ? 0 : CANVAS_CONFIG.distortionStrength },
      uNoiseAmplitude: { value: shouldReduceMotion ? 0 : CANVAS_CONFIG.noiseAmplitude },
      uNoiseSpeed: { value: CANVAS_CONFIG.noiseSpeed },
      uMouseRadius: { value: CANVAS_CONFIG.mouseRadius },
    }),
    [texture, shouldReduceMotion]
  );

  // Animation loop
  useFrame((state) => {
    if (!materialRef.current) return;

    // Update time
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

    // Smoothly interpolate mouse position
    const currentMouse = materialRef.current.uniforms.uMouse.value;
    currentMouse.x += (mousePosition.x - currentMouse.x) * 0.1;
    currentMouse.y += (mousePosition.y - currentMouse.y) * 0.1;
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

/**
 * Fallback placeholder while loading
 */
function PlaceholderPlane() {
  const { viewport } = useThree();

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="#1a1a1a" />
    </mesh>
  );
}

/**
 * Scene component that handles texture loading inside Canvas
 */
function Scene({ imageUrl, mousePosition }: { imageUrl: string; mousePosition: { x: number; y: number } }) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';

    loader.load(
      imageUrl,
      (loadedTexture) => {
        loadedTexture.minFilter = THREE.LinearFilter;
        loadedTexture.magFilter = THREE.LinearFilter;
        setTexture(loadedTexture);
      },
      undefined,
      () => {
        console.warn('Failed to load texture, using fallback');
        setError(true);
      }
    );

    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, [imageUrl]);

  if (error) {
    return <PlaceholderPlane />;
  }

  if (!texture) {
    return <PlaceholderPlane />;
  }

  return <DistortionPlane texture={texture} mousePosition={mousePosition} />;
}

interface HeroCanvasProps {
  /** Hero image URL */
  imageUrl?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Hero canvas with liquid distortion effect
 *
 * - Full container coverage
 * - Mouse-reactive distortion
 * - Ambient noise movement
 * - Falls back to static image for reduced motion or errors
 */
export function HeroCanvas({
  imageUrl = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=800&fit=crop&q=80',
  className = '',
}: HeroCanvasProps) {
  const { mousePosition, containerRef } = useHeroCanvas();
  const shouldReduceMotion = useReducedMotion();
  const [hasWebGLError, setHasWebGLError] = useState(false);

  // For reduced motion or WebGL errors, show static image
  if (shouldReduceMotion || hasWebGLError) {
    return (
      <div
        ref={containerRef}
        className={`relative h-full w-full overflow-hidden ${className}`}
      >
        <img
          src={imageUrl}
          alt=""
          className="h-full w-full object-cover"
          loading="eager"
          crossOrigin="anonymous"
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden ${className}`}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
        style={{ background: '#0a0a0a' }}
        onCreated={({ gl }) => {
          // Check WebGL support
          if (!gl.capabilities.isWebGL2) {
            console.warn('WebGL2 not supported, falling back to static image');
          }
        }}
        onError={() => {
          setHasWebGLError(true);
        }}
      >
        <Suspense fallback={<PlaceholderPlane />}>
          <Scene imageUrl={imageUrl} mousePosition={mousePosition} />
        </Suspense>
      </Canvas>

      {/* Gradient overlay for text contrast */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, rgba(10, 10, 10, 0.3) 0%, transparent 50%)',
        }}
      />
    </div>
  );
}
