"use client";

import "@google/model-viewer";
import { Canvas, useThree } from "@react-three/fiber";
import { Loader2, X } from "lucide-react";
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
  onClose: () => void;
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
  onClose,
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

  // Prevent background scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="relative w-full h-full max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden flex flex-col shadow-2xl border border-neutral-200">
        <div className="flex justify-between items-center p-4 bg-neutral-50 border-b border-neutral-200">
          <h3 className="text-neutral-900 font-medium">AR View</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
          >
            <X className="size-6" />
          </Button>
        </div>

        <div className="flex-1 relative bg-neutral-100 flex items-center justify-center">
          {/* Hidden Canvas for Generation */}
          {!modelUrl && (
            <div className="absolute inset-0 z-0 opacity-0 pointer-events-none">
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
                  />
                  <Exporter onUrl={setModelUrl} />
                </Suspense>
              </Canvas>
            </div>
          )}

          {/* Loading State or Viewer */}
          {!modelUrl ? (
            <div className="flex flex-col items-center gap-4 text-neutral-500">
              <Loader2 className="animate-spin size-8" />
              <p>Generating AR Model...</p>
            </div>
          ) : (
            <ModelViewer
              src={modelUrl}
              ios-src=""
              poster=""
              alt="A 3D model of the painting"
              shadow-intensity="1"
              camera-controls
              auto-rotate
              interaction-prompt="auto"
              ar
              className="w-full h-full"
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#f5f5f5",
              }}
            >
              <div
                slot="ar-button"
                className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full font-bold shadow-lg cursor-pointer hover:scale-105 transition-transform"
              >
                View in your space
              </div>
            </ModelViewer>
          )}

          <div className="absolute top-4 left-4 p-4 bg-white/80 text-neutral-800 rounded max-w-sm pointer-events-none z-10 backdrop-blur shadow-sm border border-neutral-200">
            <p className="text-sm">
              Use touch gestures to rotate, pinch to zoom.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
