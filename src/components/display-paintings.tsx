'use client'
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { type Painting, paintings } from "@/data/paintings";
import { PaintingCard } from "./painting-card";

export default function DisplayPaintings() {
  const [items] = useState<Painting[]>(paintings);

  if (items.length === 0)
    return (
      <div className="text-center py-24 text-neutral-500">
        <AlertCircle className="size-12 mx-auto mb-4 opacity-20" />
        <p>No paintings available at the moment.</p>
      </div>
    );

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {items.map((painting) => (
            <PaintingCard key={painting.id} painting={painting} />
          ))}
        </div>
      </div>
    </section>
  );
}
