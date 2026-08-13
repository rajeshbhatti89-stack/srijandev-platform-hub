'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';
import DataNode from './DataNode';
import GlowConnector from './GlowConnector';

function SceneContent({ mouseRef }: { mouseRef: React.MutableRefObject<{ x: number; y: number }> }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, my * 0.12, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mx * 0.12, 0.05);
  });

  const nodes = useMemo(() => [
    { id: 'web3d', position: [-2.8, 1.2, 0] as [number, number, number], label: '3D Web Design', color: '#3b82f6', ledColor: '#22c55e' },
    { id: 'mobile', position: [2.8, 1.2, 0] as [number, number, number], label: 'Mobile Engine', color: '#8b5cf6', ledColor: '#22c55e' },
    { id: 'enterprise', position: [0, -1.8, 0] as [number, number, number], label: 'Enterprise Suite', color: '#06b6d4', ledColor: '#22c55e' },
  ], []);

  const connections = useMemo(() => [
    { from: [-2.8, 1.2, 0] as [number, number, number], to: [2.8, 1.2, 0] as [number, number, number] },
    { from: [-2.8, 1.2, 0] as [number, number, number], to: [0, -1.8, 0] as [number, number, number] },
    { from: [2.8, 1.2, 0] as [number, number, number], to: [0, -1.8, 0] as [number, number, number] },
  ], []);

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-5, 5, -5]} intensity={0.8} color="#3b82f6" />
      <pointLight position={[5, 5, -5]} intensity={0.8} color="#8b5cf6" />

      {connections.map((conn, i) => (
        <GlowConnector key={i} from={conn.from} to={conn.to} />
      ))}

      {nodes.map((node) => (
        <DataNode
          key={node.id}
          position={node.position}
          label={node.label}
          color={node.color}
          ledColor={node.ledColor}
        />
      ))}
    </group>
  );
}

export default function IsometricScene({ mouseRef }: { mouseRef: React.MutableRefObject<{ x: number; y: number }> }) {
  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
    >
      <OrthographicCamera
        makeDefault
        position={[5, 5, 5]}
        zoom={80}
        near={0.1}
        far={100}
      />
      <SceneContent mouseRef={mouseRef} />
    </Canvas>
  );
}
