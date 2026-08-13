'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DataNodeProps {
  position: [number, number, number];
  label: string;
  color: string;
  ledColor: string;
}

export default function DataNode({ position, label, color, ledColor }: DataNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const targetY = useRef(position[1]);

  useFrame(() => {
    if (!meshRef.current) return;
    const targetPos = hovered ? position[1] + 0.3 : position[1];
    targetY.current = THREE.MathUtils.lerp(targetY.current, targetPos, 0.08);
    meshRef.current.position.y = targetY.current;
    meshRef.current.rotation.y += 0.003;
  });

  return (
    <group position={position}>
      {/* Main platform tile */}
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        castShadow
      >
        <boxGeometry args={[1.6, 0.18, 1.6]} />
        <meshStandardMaterial
          color={hovered ? '#ffffff' : '#f0f4ff'}
          roughness={0.3}
          metalness={0.1}
          emissive={color}
          emissiveIntensity={hovered ? 0.4 : 0.1}
        />
      </mesh>

      {/* Top accent bar */}
      <mesh position={[0, 0.14, 0]}>
        <boxGeometry args={[1.5, 0.05, 0.3]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.6} emissive={color} emissiveIntensity={0.8} />
      </mesh>

      {/* LED indicator */}
      <mesh position={[0.6, 0.18, 0.6]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color={ledColor} emissive={ledColor} emissiveIntensity={3} roughness={0} metalness={0} />
      </mesh>

      {/* Glow point light around LED */}
      <pointLight position={[0.6, 0.3, 0.6]} color={ledColor} intensity={hovered ? 2 : 0.8} distance={1.5} />

      {/* Connection port dots on edges */}
      {[-0.7, 0.7].map((x, i) => (
        <mesh key={i} position={[x, 0.09, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.06, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
        </mesh>
      ))}
    </group>
  );
}
