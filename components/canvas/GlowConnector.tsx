'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GlowConnectorProps {
  from: [number, number, number];
  to: [number, number, number];
  color?: string;
}

export default function GlowConnector({ from, to, color = '#3b82f6' }: GlowConnectorProps) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const progressRef = useRef(Math.random());

  const points = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const mid = start.clone().lerp(end, 0.5);
    mid.y += 0.6;
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    return curve.getPoints(50);
  }, [from, to]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  useFrame((_, delta) => {
    progressRef.current = (progressRef.current + delta * 0.35) % 1;
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
      {/* Curved Glowing Connector Line */}
      <line geometry={geometry}>
        <lineBasicMaterial color={color} linewidth={2} opacity={0.4} transparent />
      </line>

      {/* Traveling Data Pulse Orb */}
      <mesh ref={pulseRef} position={[points[0].x, points[0].y, points[0].z]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={6} roughness={0} />
      </mesh>

      {/* Point Light Following Pulse */}
      <pointLight
        ref={lightRef}
        position={[points[0].x, points[0].y, points[0].z]}
        color={color}
        intensity={2.5}
        distance={2.5}
      />
    </group>
  );
}
