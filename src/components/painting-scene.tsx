"use client";

import { Center } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { TextureLoader } from "three";
import type { FrameStyle } from "@/data/paintings";

interface PaintingSceneProps {
  paintingUrl: string;
  frameStyle: FrameStyle;
  frameTextureUrl?: string;
  frameColor?: string;
}

// Separate component to handle Frame logic and texture loading
function FrameMesh({
  width,
  height,
  thickness,
  depth,
  materialParams,
  textureUrl,
}: {
  width: number;
  height: number;
  thickness: number;
  depth: number;
  materialParams: THREE.MeshStandardMaterialParameters;
  textureUrl?: string;
}) {
  const EMPTY_TEXTURE =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  const targetUrl = textureUrl || EMPTY_TEXTURE;
  const frameTx = useLoader(TextureLoader, targetUrl);

  // If we shouldn't have a texture (no textureUrl), we just won't use 'frameTx' in the material map if we want to be strict,
  // but since we render a standard material, using the 1x1 pixel might arguably affect color if we map it.
  // Actually, let's just use it only if real texture existed.
  const hasRealTexture = !!textureUrl;

  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial(materialParams);
    if (hasRealTexture) {
      mat.map = frameTx;
      frameTx.wrapS = frameTx.wrapT = THREE.RepeatWrapping;
      frameTx.repeat.set(4, 1);
    }
    return mat;
  }, [materialParams, frameTx, hasRealTexture]);

  return (
    <group>
      {/* Top */}
      <mesh
        position={[0, height / 2 + thickness / 2, 0.01]}
        material={material}
      >
        <boxGeometry args={[width + thickness * 2, thickness, depth]} />
      </mesh>
      {/* Bottom */}
      <mesh
        position={[0, -height / 2 - thickness / 2, 0.01]}
        material={material}
      >
        <boxGeometry args={[width + thickness * 2, thickness, depth]} />
      </mesh>
      {/* Left */}
      <mesh
        position={[-width / 2 - thickness / 2, 0, 0.01]}
        material={material}
      >
        <boxGeometry args={[thickness, height, depth]} />
      </mesh>
      {/* Right */}
      <mesh position={[width / 2 + thickness / 2, 0, 0.01]} material={material}>
        <boxGeometry args={[thickness, height, depth]} />
      </mesh>
      {/* Backing */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry
          args={[width + thickness * 1.8, height + thickness * 1.8, 0.05]}
        />
        <meshStandardMaterial color="#111" />
      </mesh>
    </group>
  );
}

export function PaintingScene({
  paintingUrl,
  frameStyle,
  frameTextureUrl,
  frameColor,
}: PaintingSceneProps) {
  const paintingTexture = useLoader(TextureLoader, paintingUrl);

  // Painting Aspect Ratio
  const aspect = paintingTexture.image
    ? paintingTexture.image.width / paintingTexture.image.height
    : 1;
  const width = 3;
  const height = width / aspect;

  // Frame parameters
  const frameThickness = 0.4;
  const frameDepth = 0.2;

  // Base material params
  const frameMaterialParams = useMemo(
    () => ({
      color: frameColor || "#ffffff",
      roughness: 0.3,
      metalness: frameStyle === "silver" ? 0.8 : 0.1,
    }),
    [frameColor, frameStyle],
  );

  return (
    <Center>
      {/* The Painting */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={paintingTexture} side={THREE.DoubleSide} />
      </mesh>

      {/* The Frame */}
      {frameStyle !== "none" && (
        <FrameMesh
          width={width}
          height={height}
          thickness={frameThickness}
          depth={frameDepth}
          materialParams={frameMaterialParams}
          textureUrl={frameTextureUrl}
        />
      )}
    </Center>
  );
}
