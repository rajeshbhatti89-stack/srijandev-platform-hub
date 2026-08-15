'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export type NodeType = 'webmail' | 'web3d' | 'mobile' | 'enterprise' | 'core';

interface DataNodeProps {
  position: [number, number, number];
  label: string;
  sublabel?: string;
  color: string;
  ledColor: string;
  nodeType: NodeType;
}

function FloatingMesh({ nodeType, color }: { nodeType: NodeType; color: string }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.8;
    if (nodeType === 'web3d' || nodeType === 'core') {
      meshRef.current.rotation.x += delta * 0.4;
    }
  });

  if (nodeType === 'webmail') {
    // 3D Mail / Envelope Object
    return (
      <group ref={meshRef} position={[0, 0.45, 0]}>
        <mesh>
          <boxGeometry args={[0.7, 0.45, 0.08]} />
          <meshStandardMaterial color="#1e1b4b" emissive={color} emissiveIntensity={0.6} roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.08, 0.05]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.32, 0.32, 0.02]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} roughness={0.1} />
        </mesh>
        <pointLight color={color} intensity={2.5} distance={1.5} />
      </group>
    );
  }

  if (nodeType === 'web3d') {
    // 3D Octahedron Wireframe Gem
    return (
      <group ref={meshRef} position={[0, 0.45, 0]}>
        <mesh>
          <octahedronGeometry args={[0.35]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8} wireframe roughness={0.1} />
        </mesh>
        <mesh>
          <octahedronGeometry args={[0.18]} />
          <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={3.5} roughness={0} />
        </mesh>
        <pointLight color={color} intensity={2.5} distance={1.5} />
      </group>
    );
  }

  if (nodeType === 'mobile') {
    // 3D Smartphone Frame
    return (
      <group ref={meshRef} position={[0, 0.45, 0]}>
        <mesh>
          <boxGeometry args={[0.38, 0.65, 0.06]} />
          <meshStandardMaterial color="#064e3b" emissive={color} emissiveIntensity={0.5} roughness={0.2} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.04]}>
          <planeGeometry args={[0.32, 0.55]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.8} roughness={0.1} />
        </mesh>
        <pointLight color={color} intensity={2.5} distance={1.5} />
      </group>
    );
  }

  if (nodeType === 'enterprise') {
    // 3D Server Blades / Operations Stack
    return (
      <group ref={meshRef} position={[0, 0.45, 0]}>
        {[-0.14, 0.04, 0.22].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <boxGeometry args={[0.65, 0.11, 0.42]} />
            <meshStandardMaterial color="#1e293b" emissive={color} emissiveIntensity={i === 1 ? 1.5 : 0.5} metalness={0.8} />
          </mesh>
        ))}
        <pointLight color={color} intensity={2.5} distance={1.5} />
      </group>
    );
  }

  // Central Core OS (nodeType === 'core')
  return (
    <group ref={meshRef} position={[0, 0.55, 0]}>
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.55, 0.04, 16, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={4} roughness={0} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.2, 0.2, 0.6, 16]} />
        <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={3.5} roughness={0} />
      </mesh>
      <pointLight color={color} intensity={4} distance={2.5} />
    </group>
  );
}

export default function DataNode({ position, label, sublabel, color, ledColor, nodeType }: DataNodeProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const targetY = useRef(position[1]);
  const floatTime = useRef(Math.random() * 100);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    floatTime.current += delta * 1.6;
    const hoverOffset = hovered ? 0.35 : 0;
    const bob = Math.sin(floatTime.current) * 0.09;
    targetY.current = THREE.MathUtils.lerp(targetY.current, position[1] + hoverOffset + bob, 0.08);
    meshRef.current.position.y = targetY.current;
  });

  const isCore = nodeType === 'core';
  const tileSize: [number, number, number] = isCore ? [2.2, 0.26, 2.2] : [1.8, 0.22, 1.8];

  return (
    <group position={[position[0], 0, position[2]]}>
      {/* Floating node group */}
      <group ref={meshRef} position={[0, position[1], 0]}>
        {/* Main Base Tile */}
        <mesh
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          castShadow
          receiveShadow
        >
          <boxGeometry args={tileSize} />
          <meshStandardMaterial
            color={hovered ? '#1e293b' : '#0f172a'}
            roughness={0.15}
            metalness={0.85}
            emissive={color}
            emissiveIntensity={hovered ? 0.8 : isCore ? 0.5 : 0.25}
          />
        </mesh>

        {/* 3D Floating Mesh Object */}
        <FloatingMesh nodeType={nodeType} color={color} />

        {/* LED Indicator Light */}
        <mesh position={[tileSize[0] / 2 - 0.2, 0.16, tileSize[2] / 2 - 0.2]}>
          <sphereGeometry args={[0.065, 12, 12]} />
          <meshStandardMaterial color={ledColor} emissive={ledColor} emissiveIntensity={4} roughness={0} />
        </mesh>
        <pointLight
          position={[tileSize[0] / 2 - 0.2, 0.3, tileSize[2] / 2 - 0.2]}
          color={ledColor}
          intensity={hovered ? 3 : 1.2}
          distance={1.8}
        />

        {/* Floating 3D HTML Badge Label */}
        <Html position={[0, isCore ? 1.3 : 1.15, 0]} center distanceFactor={15} zIndexRange={[100, 0]}>
          <div
            className={`px-3 py-1.5 rounded-xl border backdrop-blur-md text-xs font-semibold whitespace-nowrap transition-all duration-300 pointer-events-none select-none flex items-center gap-2 ${
              hovered || isCore
                ? 'scale-110 shadow-lg border-white/30 bg-gray-900/90 text-white'
                : 'border-white/10 bg-gray-950/80 text-gray-200'
            }`}
            style={{
              borderColor: hovered || isCore ? color : undefined,
              boxShadow: hovered || isCore ? `0 0 22px ${color}66` : '0 4px 12px rgba(0,0,0,0.5)',
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: ledColor, boxShadow: `0 0 8px ${ledColor}` }}
            />
            <span className="font-bold tracking-wide">{label}</span>
            {sublabel && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300 font-mono">
                {sublabel}
              </span>
            )}
          </div>
        </Html>
      </group>

      {/* Ground Projection Ring */}
      <mesh position={[0, -0.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[isCore ? 1.0 : 0.7, isCore ? 1.5 : 1.1, 32]} />
        <meshBasicMaterial color={color} opacity={hovered ? 0.4 : 0.18} transparent />
      </mesh>
    </group>
  );
}
