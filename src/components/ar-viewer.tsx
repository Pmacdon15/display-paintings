"use client";

import "@google/model-viewer";
import { Canvas, useThree } from "@react-three/fiber";
import { Loader2 } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import type { FrameStyle } from "@/data/paintings";
import { PaintingScene } from "./painting-scene";
import { Button } from "./ui/button";

interface ARViewerProps {
  paintingUrl: string;
  frameStyle: FrameStyle;
  frameTextureUrl?: string;
  frameColor?: string;
  // onClose: () => void;
}

function Exporter({ onUrl }: { onUrl: (url: string) => void }) {
  const { scene } = useThree();
  const [exported, setExported] = useState(false);

  useEffect(() => {
    if (exported) return;

    // Small timeout to ensure everything is mounted/loaded
    const timer = setTimeout(() => {
      const exporter = new GLTFExporter();
      exporter.parse(
        scene,
        (gltf) => {
          const blob = new Blob([gltf as ArrayBuffer], {
            type: "application/octet-stream",
          });
          const url = URL.createObjectURL(blob);
          onUrl(url);
          setExported(true);
        },
        (error) => {
          console.error("An error happened during GLTF export", error);
          setExported(true); // Stop trying
        },
        { binary: true },
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [scene, onUrl, exported]);

  return null;
}

export function ARViewer({
  paintingUrl,
  frameStyle,
  frameTextureUrl,
  frameColor,
  // onClose,
}: ARViewerProps) {
  const [modelUrl, setModelUrl] = useState<string | null>(null);

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (modelUrl) URL.revokeObjectURL(modelUrl);
    };
  }, [modelUrl]);

  // Workaround for TypeScript error with custom element
  const ModelViewer = "model-viewer" as unknown as React.FC<any>;

  return (
    <div className="w-full h-full">
      {/* Hidden Canvas for Generation */}
      {!modelUrl && (
        <div className="opacity-0 pointer-events-none">
          <Canvas>
            <Suspense fallback={null}>
              {/* Provide lighting for the scene otherwise it might be dark, 
                       though GLTF export usually exports materials not lights unless specified.
                       We want unlit or standard materials to look right. 
                       Adding basic ambient light to be safe for texture visibility if baking? 
                       Actually GLTF export exports the scene graph. 
                   */}
              <ambientLight intensity={1} />
              <PaintingScene
                paintingUrl={paintingUrl}
                frameStyle={frameStyle}
                frameTextureUrl={frameTextureUrl}
                frameColor={frameColor}
                width={0.8}
              />
              <Exporter onUrl={setModelUrl} />
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* Loading State or Viewer */}
      {!modelUrl ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-neutral-500 bg-muted/30">
          <Loader2 className="animate-spin size-8" />
          <p className="text-xs">Generating 3D Model...</p>
        </div>
      ) : (
        <ModelViewer
          src={modelUrl}
          ar-placement="wall"
          poster=""
          alt="A 3D model of the painting"
          shadow-intensity="1"
          camera-controls
          interaction-prompt="auto"
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-scale="auto"
          className="w-full h-full"
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <Button
            slot="ar-button"
            className="absolute top-1 right-1 bg-black text-white py-3 px-1 rounded-full font-bold shadow-lg cursor-pointer hover:scale-105 transition-transform"
          >
            View in your space
          </>
        </ModelViewer>
      )}
    </div>
  );
}
