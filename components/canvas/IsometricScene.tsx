'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';
import DataNode, { NodeType } from './DataNode';
import GlowConnector from './GlowConnector';

function FloatingParticles() {
  const count = 50;
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 9,
          (Math.random() - 0.5) * 14,
        ] as [number, number, number],
        speed: 0.2 + Math.random() * 0.4,
        factor: Math.random() * 100,
      });
    }
    return temp;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    particles.forEach((particle, i) => {
      const { position, speed, factor } = particle;
      const y = position[1] + Math.sin(t * speed + factor) * 0.6;
      const x = position[0] + Math.cos(t * speed * 0.4 + factor) * 0.35;
      dummy.position.set(x, y, position[2]);
      const s = 0.045 + Math.sin(t * 2 + factor) * 0.02;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#818cf8" opacity={0.5} transparent />
    </instancedMesh>
  );
}

function SceneContent({ mouseRef }: { mouseRef: React.MutableRefObject<{ x: number; y: number }> }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, my * 0.1, 0.04);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mx * 0.14, 0.04);
  });

  // 5 Nodes across full 3D viewport (Left, Top, Center, Right, Bottom)
  const nodes = useMemo(() => [
    {
      id: 'webmail',
      position: [3.2, 0.2, -3.2] as [number, number, number], // Far Left in isometric view
      label: 'Webmail Engine',
      sublabel: 'mail.srijandev.in',
      color: '#818cf8',
      ledColor: '#22c55e',
      nodeType: 'webmail' as NodeType,
    },
    {
      id: 'web3d',
      position: [1.8, 1.8, -0.8] as [number, number, number], // Top Left
      label: '3D Web & WebGL',
      sublabel: 'Spatial UI',
      color: '#3b82f6',
      ledColor: '#22c55e',
      nodeType: 'web3d' as NodeType,
    },
    {
      id: 'core',
      position: [0, 0.4, 0] as [number, number, number], // Center Hub
      label: 'SrijanDev Core OS',
      sublabel: 'Cloudflare Hub',
      color: '#06b6d4',
      ledColor: '#22c55e',
      nodeType: 'core' as NodeType,
    },
    {
      id: 'mobile',
      position: [-3.2, 0.8, 3.2] as [number, number, number], // Far Right
      label: 'Android Apps',
      sublabel: 'Native Mobile',
      color: '#10b981',
      ledColor: '#22c55e',
      nodeType: 'mobile' as NodeType,
    },
    {
      id: 'enterprise',
      position: [-1.2, -1.8, 1.8] as [number, number, number], // Bottom
      label: 'Enterprise OS',
      sublabel: 'Operations & Guard',
      color: '#f59e0b',
      ledColor: '#22c55e',
      nodeType: 'enterprise' as NodeType,
    },
  ], []);

  // Full Star & Perimeter Ring Mesh Connectors
  const connections = useMemo(() => [
    // Hub Connections
    { from: [3.2, 0.2, -3.2] as [number, number, number], to: [0, 0.4, 0] as [number, number, number], color: '#818cf8' },
    { from: [1.8, 1.8, -0.8] as [number, number, number], to: [0, 0.4, 0] as [number, number, number], color: '#3b82f6' },
    { from: [-3.2, 0.8, 3.2] as [number, number, number], to: [0, 0.4, 0] as [number, number, number], color: '#10b981' },
    { from: [-1.2, -1.8, 1.8] as [number, number, number], to: [0, 0.4, 0] as [number, number, number], color: '#f59e0b' },
    // Perimeter Ring Connections
    { from: [3.2, 0.2, -3.2] as [number, number, number], to: [1.8, 1.8, -0.8] as [number, number, number], color: '#818cf8' },
    { from: [1.8, 1.8, -0.8] as [number, number, number], to: [-3.2, 0.8, 3.2] as [number, number, number], color: '#3b82f6' },
    { from: [-3.2, 0.8, 3.2] as [number, number, number], to: [-1.2, -1.8, 1.8] as [number, number, number], color: '#10b981' },
    { from: [-1.2, -1.8, 1.8] as [number, number, number], to: [3.2, 0.2, -3.2] as [number, number, number], color: '#f59e0b' },
  ], []);

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[10, 14, 10]} intensity={1.6} color="#ffffff" />
      <directionalLight position={[-10, -6, -10]} intensity={0.5} color="#818cf8" />
      <pointLight position={[6, 6, -6]} intensity={2} color="#818cf8" />
      <pointLight position={[-6, 6, 6]} intensity={2} color="#10b981" />
      <pointLight position={[0, 6, 0]} intensity={2.5} color="#06b6d4" />

      <FloatingParticles />

      {connections.map((conn, i) => (
        <GlowConnector key={i} from={conn.from} to={conn.to} color={conn.color} />
      ))}

      {nodes.map((node) => (
        <DataNode
          key={node.id}
          position={node.position}
          label={node.label}
          sublabel={node.sublabel}
          color={node.color}
          ledColor={node.ledColor}
          nodeType={node.nodeType}
        />
      ))}
    </group>
  );
}

export default function IsometricScene({ mouseRef }: { mouseRef: React.MutableRefObject<{ x: number; y: number }> }) {
  return (
    <Canvas
      style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <OrthographicCamera
        makeDefault
        position={[7, 6, 7]}
        zoom={52}
        near={0.1}
        far={100}
      />
      <SceneContent mouseRef={mouseRef} />
    </Canvas>
  );
}
