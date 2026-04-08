"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";

// Floating geometric shape component
function FloatingShape({
  position,
  color,
  scale = 1,
  speed = 1,
  distort = 0.3,
  shape = "icosahedron",
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
  speed?: number;
  distort?: number;
  shape?: "icosahedron" | "octahedron" | "dodecahedron" | "torus" | "torusKnot";
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Rotate based on time
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.3;
    meshRef.current.rotation.y += 0.005 * speed;
    
    // Subtle mouse following
    meshRef.current.position.x = position[0] + mouse.x * 0.5;
    meshRef.current.position.y = position[1] + mouse.y * 0.3;
  });

  const geometry = useMemo(() => {
    switch (shape) {
      case "octahedron":
        return <octahedronGeometry args={[1, 0]} />;
      case "dodecahedron":
        return <dodecahedronGeometry args={[1, 0]} />;
      case "torus":
        return <torusGeometry args={[1, 0.4, 16, 32]} />;
      case "torusKnot":
        return <torusKnotGeometry args={[0.8, 0.3, 100, 16]} />;
      default:
        return <icosahedronGeometry args={[1, 1]} />;
    }
  }, [shape]);

  return (
    <Float
      speed={speed * 2}
      rotationIntensity={0.5}
      floatIntensity={1}
      floatingRange={[-0.2, 0.2]}
    >
      <mesh ref={meshRef} position={position} scale={scale}>
        {geometry}
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  );
}

// Animated particle field
function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 500;

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const colorPalette = [
      new THREE.Color("#0d9488"), // teal
      new THREE.Color("#f59e0b"), // amber
      new THREE.Color("#22d3ee"), // cyan
      new THREE.Color("#8b5cf6"), // purple
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Glowing orb in center
function GlowingOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    
    // Mouse influence
    meshRef.current.position.x = mouse.x * 0.3;
    meshRef.current.position.y = mouse.y * 0.2;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[0, 0, -2]} scale={1.5}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color="#0d9488"
          attach="material"
          distort={0.4}
          speed={3}
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.9}
          emissive="#0d9488"
          emissiveIntensity={0.3}
        />
      </mesh>
    </Float>
  );
}

// Main scene component
function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#f59e0b" />
      <pointLight position={[10, -10, 5]} intensity={0.5} color="#22d3ee" />
      
      {/* Main glowing orb */}
      <GlowingOrb />
      
      {/* Floating shapes */}
      <FloatingShape
        position={[-4, 2, -3]}
        color="#0d9488"
        scale={0.6}
        speed={1.2}
        shape="icosahedron"
      />
      <FloatingShape
        position={[4, -1.5, -4]}
        color="#f59e0b"
        scale={0.5}
        speed={0.8}
        distort={0.5}
        shape="octahedron"
      />
      <FloatingShape
        position={[-3, -2, -5]}
        color="#22d3ee"
        scale={0.4}
        speed={1.5}
        shape="dodecahedron"
      />
      <FloatingShape
        position={[5, 2, -6]}
        color="#8b5cf6"
        scale={0.35}
        speed={1}
        distort={0.2}
        shape="torusKnot"
      />
      <FloatingShape
        position={[-5, 0, -7]}
        color="#ec4899"
        scale={0.45}
        speed={0.9}
        shape="torus"
      />
      <FloatingShape
        position={[3, 3, -5]}
        color="#10b981"
        scale={0.3}
        speed={1.3}
        shape="icosahedron"
      />
      
      {/* Particle field */}
      <ParticleField />
      
      {/* Sparkles overlay */}
      <Sparkles
        count={100}
        scale={15}
        size={3}
        speed={0.5}
        opacity={0.5}
        color="#f59e0b"
      />
    </>
  );
}

// Export the main component
export function Hero3DScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A1628]/80 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628]/50 via-transparent to-[#0A1628]/50 pointer-events-none" />
    </div>
  );
}

export default Hero3DScene;