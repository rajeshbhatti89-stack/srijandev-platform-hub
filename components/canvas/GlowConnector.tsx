'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GlowConnectorProps {
  from: [number, number, number];
  to: [number, number, number];
}

export default function GlowConnector({ from, to }: GlowConnectorProps) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const progressRef = useRef(0);

  const points = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const mid = start.clone().lerp(end, 0.5);
    mid.y += 0.5;
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    return curve.getPoints(40);
  }, [from, to]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  useFrame((_, delta) => {
    progressRef.current = (progressRef.current + delta * 0.4) % 1;
    const idx = Math.floor(progressRef.current * (points.length - 1));
    const p = points[idx];
    if (pulseRef.current) {
      pulseRef.current.position.set(p.x, p.y, p.z);
    }
    if (lightRef.current) {
      lightRef.current.position.set(p.x, p.y, p.z);
    }
  });

  return (
    <group>
      {/* Static glowing line */}
      <line>
        <bufferGeometry attach="geometry" ref={(g) => { if (g) g.copy(geometry); }} />
        <lineBasicMaterial attach="material" color="#3b82f6" linewidth={1} opacity={0.4} transparent />
      </line>

      {/* Animated pulse orb */}
      <mesh ref={pulseRef} position={[points[0].x, points[0].y, points[0].z]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={4} roughness={0} />
      </mesh>

      {/* Traveling point light */}
      <pointLight
        ref={lightRef}
        position={[points[0].x, points[0].y, points[0].z]}
        color="#3b82f6"
        intensity={1.5}
        distance={1.2}
      />
    </group>
  );
}
