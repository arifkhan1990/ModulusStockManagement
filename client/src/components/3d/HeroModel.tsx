
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Float, Html } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import { Mesh } from 'three';

export default function HeroModel() {
  const groupRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t / 4) / 8;
      groupRef.current.position.y = Math.sin(t / 2) / 10;
    }
  });

  return (
    <Float 
      speed={2} 
      rotationIntensity={0.4} 
      floatIntensity={0.6}
    >
      <motion.group
        ref={groupRef}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 50, 
          damping: 10,
          delay: 0.3
        }}
      >
        <Box position={[-0.8, 0, 0]} scale={[0.6, 1.2, 0.6]} color="#4F46E5" />
        <Box position={[0.8, 0, 0]} scale={[0.6, 0.8, 0.6]} color="#4338CA" />
        <Box position={[0, -0.8, 0]} scale={[1.8, 0.6, 0.6]} color="#3730A3" />
        
        <DataPoints />
      </motion.group>
    </Float>
  );
}

function Box({ position, scale, color }: { position: [number, number, number], scale: [number, number, number], color: string }) {
  return (
    <mesh position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function DataPoints() {
  const points = [
    { position: [1.5, 0.8, 0], label: "Stock", value: "+24%" },
    { position: [-1.5, 0.5, 0], label: "Orders", value: "186" },
    { position: [0, 1.5, 0], label: "Revenue", value: "$12.4K" },
  ];
  
  return (
    <>
      {points.map((point, index) => (
        <group key={index} position={point.position as [number, number, number]}>
          <mesh>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#6366F1" />
          </mesh>
          <Html distanceFactor={8} position={[0, 0.3, 0]} center>
            <div className="bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-lg w-20">
              <p className="text-xs font-medium text-center">{point.label}</p>
              <p className="text-center font-bold text-primary">{point.value}</p>
            </div>
          </Html>
        </group>
      ))}
    </>
  );
}
