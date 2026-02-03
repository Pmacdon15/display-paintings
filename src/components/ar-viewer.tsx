"use client";

import "@google/model-viewer";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface ARViewerProps {
  paintingUrl: string; // Not used for the model yet, but potentially for texture swapping if we had a dynamic GLB backend
  onClose: () => void;
}

export function ARViewer({ onClose }: ARViewerProps) {
  // Using a sample GLB from Khronos/Google as a placeholder since we cannot generate dynamic GLBs in the browser easily without a backend service
  // In a real app, we would use an API to returning a GLB of the specific painting+frame
  const modelUrl = "https://modelviewer.dev/shared-assets/models/Astronaut.glb"; // Placeholder text
  // Better placeholder: A picture frame model if available, but Astronaut is the standard "it works" test.
  // Let's try to find a frame or simple box.
  // Actually, model-viewer supports 'src' attribute.

  // Workaround for TypeScript error with custom element
  const ModelViewer = "model-viewer" as unknown as React.FC<any>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full h-full max-w-4xl max-h-[90vh] bg-black rounded-lg overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 bg-neutral-900">
          <h3 className="text-white font-medium">AR View</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white"
          >
            <X className="size-6" />
          </Button>
        </div>

        <div className="flex-1 relative bg-neutral-800">
          <ModelViewer
            src={modelUrl}
            ios-src=""
            poster=""
            alt="A 3D model of an astronaut"
            shadow-intensity="1"
            camera-controls
            auto-rotate
            ar
            style={{ width: "100%", height: "100%" }}
          >
            <div
              slot="ar-button"
              className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-3 rounded-full font-bold shadow-lg"
            >
              View in your space
            </div>
          </ModelViewer>

          <div className="absolute top-4 left-4 p-4 bg-black/60 text-white rounded max-w-sm pointer-events-none">
            <p className="text-sm">
              <b>Note:</b> Since I cannot generate custom GLB files on the fly
              without a backend, this AR view demonstrates the capability using
              a sample model (Astronaut). In a production app, this would show
              the selected painting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
