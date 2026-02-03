"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { FrameStyle } from "@/data/paintings";

interface Painting3DProps {
  paintingUrl: string;
  frameStyle: FrameStyle;
  frameTextureUrl?: string;
  frameColor?: string;
}

import { PaintingScene } from "./painting-scene";

export function Painting3DView(props: Painting3DProps) {
  return (
    <div className="w-full h-full min-h-100 rounded-lg overflow-hidden relative grayscale-0">
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1}
          castShadow
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <PaintingScene {...props} />

        <OrbitControls
          makeDefault
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
      <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-md pointer-events-none">
        Drag to Rotate
      </div>
    </div>
  );
}
