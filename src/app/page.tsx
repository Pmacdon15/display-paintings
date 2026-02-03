"use client";

import { useState } from "react";
import DisplayPaintings from "@/components/display-paintings";
import { type Painting, paintings } from "@/data/paintings";

export default function Home() {
  const [items] = useState<Painting[]>(paintings);

  return <DisplayPaintings />;
}
