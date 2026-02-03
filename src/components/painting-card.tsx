"use client";

import { Box, Cuboid, ImageIcon, ShoppingCart } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { frames, type Painting } from "@/data/paintings";
import { cn } from "@/lib/utils";
import { Painting3DView } from "./painting-3d-view";

const ARViewer = dynamic(
  () => import("./ar-viewer").then((mod) => mod.ARViewer),
  {
    ssr: false,
  },
);

interface PaintingCardProps {
  painting: Painting;
}

export function PaintingCard({ painting }: PaintingCardProps) {
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");
  const [selectedFrameId, setSelectedFrameId] = useState<string>("f1");
  const [showAR, setShowAR] = useState(false);

  const selectedFrame =
    frames.find((f) => f.id === selectedFrameId) || frames[0];
  const totalPrice = painting.basePrice + selectedFrame.priceMixin;

  const handleBuy = () => {
    // Mock Stripe Checkout
    console.log("Stripe Checkout Initiated", {
      painting: painting.title,
      frame: selectedFrame.name,
      total: totalPrice,
    });
    alert(
      `Redirecting to Stripe Checkout for ${painting.title} (${selectedFrame.name}) - $${totalPrice}`,
    );
  };

  return (
    <>
      <Card className="overflow-hidden border-border bg-card/50 backdrop-blur-sm text-card-foreground shadow-2xl transition-all hover:shadow-primary/10">
        <div className="relative aspect-square w-full bg-muted/20">
          {viewMode === "2d" ? (
             <Painting3DView
              mode="2d"
              paintingUrl={painting.imageUrl}
              frameStyle={selectedFrame.style}
              frameColor={selectedFrame.color}
              frameTextureUrl={selectedFrame.textureUrl}
            />
          ) : (
            <Painting3DView
              mode="3d"
              paintingUrl={painting.imageUrl}
              frameStyle={selectedFrame.style}
              frameColor={selectedFrame.color}
              frameTextureUrl={selectedFrame.textureUrl}
            />
          )}

          {/* View Toggles */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button
              size="icon"
              variant={viewMode === "2d" ? "default": "secondary" }
              onClick={() => setViewMode("2d")}
              title="2D View"
              className={cn(
                "rounded-full",
                viewMode === "2d"
                  ? "bg-white text-black hover:bg-neutral-200"
                  : "bg-black/50 text-white hover:bg-black/70",
              )}
            >
              <ImageIcon className="size-4" />
            </Button>
            <Button
              size="icon"
              variant={viewMode === "3d" ? "secondary": "default" }
              onClick={() => setViewMode("3d")}
              title="3D View"
              className={cn(
                "rounded-full",
                viewMode === "3d"
                  ? "bg-white text-black hover:bg-neutral-200"
                  : "bg-black/50 text-white hover:bg-black/70",
              )}
            >
              <Box className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={() => setShowAR(true)}
              title="AR View"
              className="rounded-full bg-black/5 text-black hover:bg-black/10 md:hidden"
            >
              <Cuboid className="size-4" />
            </Button>
          </div>
        </div>

        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-light tracking-wide text-foreground">
                {painting.title}
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                by {painting.artist}
              </CardDescription>
            </div>
            <div className="text-right">
              <span className="text-xl font-medium text-foreground block">
                ${totalPrice}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Select Frame
              </span>
              <div className="flex gap-2 bg-neutral-950/50 p-2 rounded-lg border border-neutral-800">
                {frames.map((frame) => (
                  <button
                    type="button"
                    key={frame.id}
                    onClick={() => setSelectedFrameId(frame.id)}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all relative",
                      selectedFrameId === frame.id
                        ? "border-white scale-110 ring-2 ring-white/20"
                        : "border-transparent opacity-70 hover:opacity-100 hover:scale-105",
                    )}
                    title={frame.name}
                    style={{
                      backgroundColor:
                        frame.color === "transparent" ? "#333" : frame.color,
                    }}
                  >
                    {frame.style === "none" && (
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white/50">
                        ∅
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-neutral-400 text-right h-4">
                {selectedFrame.name} (+${selectedFrame.priceMixin})
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            onClick={handleBuy}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <ShoppingCart className="mr-2 size-4" />
            Buy Now
          </Button>
        </CardFooter>
      </Card>

      {showAR && (
        <ARViewer
          paintingUrl={painting.imageUrl}
          frameStyle={selectedFrame.style}
          frameColor={selectedFrame.color}
          frameTextureUrl={selectedFrame.textureUrl}
          onClose={() => setShowAR(false)}
        />
      )}
    </>
  );
}
