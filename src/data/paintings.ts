export type FrameStyle = "gold" | "silver" | "black" | "none";

export interface Frame {
  id: string;
  name: string;
  style: FrameStyle;
  priceMixin: number;
  textureUrl?: string;
  color?: string;
}

export interface Painting {
  id: string;
  title: string;
  artist: string;
  description: string;
  imageUrl: string;
  basePrice: number;
}

export const paintings: Painting[] = [
  {
    id: "p1",
    title: "Neon Fragmentations",
    artist: "A.I. Vangogh",
    description: "A digital exploration of chaos and color.",
    imageUrl: "/images/abstract.png",
    basePrice: 450,
  },
  {
    id: "p2",
    title: "Serenity Peaks",
    artist: "Bob Ross-bot",
    description: "Peaceful mountains reflecting in a calm lake.",
    imageUrl: "/images/landscape.png",
    basePrice: 600,
  },
  {
    id: "p3",
    title: "The Gilded Automaton",
    artist: "Da Vinci Code",
    description: "A classical portrait of a mechanical being.",
    imageUrl: "/images/portrait.png",
    basePrice: 1200,
  },
];

export const frames: Frame[] = [
  {
    id: "f1",
    name: "Royal Gold",
    style: "gold",
    priceMixin: 200,
    textureUrl: "/images/frame-gold.png",
    color: "#D4AF37",
  },
  {
    id: "f2",
    name: "Sleek Silver",
    style: "silver",
    priceMixin: 150,
    color: "#C0C0C0",
  },
  {
    id: "f3",
    name: "Modern Black",
    style: "black",
    priceMixin: 100,
    color: "#1a1a1a",
  },
  {
    id: "f4",
    name: "Canvas Only",
    style: "none",
    priceMixin: 0,
    color: "transparent",
  },
];
