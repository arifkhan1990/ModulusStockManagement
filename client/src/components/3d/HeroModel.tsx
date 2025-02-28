
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
import React, { useRef, useEffect } from 'react';
import { useTheme } from '../../hooks/use-theme';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function HeroModel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    const backgroundColor = theme === 'dark' ? '#1a1a2e' : '#f5f5f7';
    scene.background = new THREE.Color(backgroundColor);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 2, 5);
    scene.add(directionalLight);
    
    // Create geometry - a cluster of animated cubes
    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);
    
    const primaryColor = theme === 'dark' ? 0x6366f1 : 0x4f46e5; // Indigo
    const accentColor = theme === 'dark' ? 0xec4899 : 0xdb2777; // Pink
    
    // Create multiple cubes with varying sizes and positions
    for (let i = 0; i < 15; i++) {
      const size = Math.random() * 0.5 + 0.3;
      const geometry = new THREE.BoxGeometry(size, size, size);
      
      // Alternate between materials
      const material = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? primaryColor : accentColor,
        metalness: 0.3,
        roughness: 0.4,
      });
      
      const cube = new THREE.Mesh(geometry, material);
      
      // Position cubes in an interesting pattern
      const radius = 2;
      const angle = (i / 15) * Math.PI * 2;
      cube.position.x = Math.cos(angle) * radius * (0.8 + Math.random() * 0.4);
      cube.position.y = Math.sin(angle) * radius * (0.8 + Math.random() * 0.4);
      cube.position.z = (Math.random() - 0.5) * 2;
      
      // Random rotation
      cube.rotation.x = Math.random() * Math.PI;
      cube.rotation.y = Math.random() * Math.PI;
      
      cubeGroup.add(cube);
    }
    
    // Animation function
    const clock = new THREE.Clock();
    
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      // Animate cubes
      cubeGroup.children.forEach((cube, i) => {
        const speed = 0.2 + (i % 3) * 0.1;
        cube.rotation.x += 0.01 * speed;
        cube.rotation.y += 0.01 * speed;
        
        // Add subtle vertical oscillation
        cube.position.y += Math.sin(elapsedTime * speed + i) * 0.003;
      });
      
      // Rotate the entire group
      cubeGroup.rotation.y = elapsedTime * 0.2;
      
      // Update controls
      controls.update();
      
      // Render
      renderer.render(scene, camera);
      
      // Call animate again on the next frame
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      // Dispose of resources
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          } else if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          }
        }
      });
    };
  }, [theme]);
  
  return <div ref={containerRef} className="w-full h-full absolute inset-0 pointer-events-none" />;
}
