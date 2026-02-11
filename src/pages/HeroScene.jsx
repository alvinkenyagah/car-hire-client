import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, MeshWobbleMaterial, PerspectiveCamera } from "@react-three/drei";

function SceneContent() {
  const meshRef = useRef();
  
  // Make the object rotate slowly
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.cos(t / 4) / 8;
    meshRef.current.rotation.y = Math.sin(t / 4) / 8;
    meshRef.current.position.y = (1 + Math.sin(t / 1.5)) / 10;
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* Abstract Automotive Shape (Low poly car feel) */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          <boxGeometry args={[3, 0.8, 1.5]} />
          <MeshDistortMaterial
            color="#3b82f6"
            speed={2}
            distort={0.3}
            radius={1}
          />
        </mesh>
      </Float>

      {/* Ground Grid for "Road" feel */}
      <gridHelper args={[100, 50, "#3b82f6", "#1e293b"]} position={[0, -2, 0]} />
    </>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <SceneContent />
      </Canvas>
    </div>
  );
}