import spray from "@/assets/products/insecticide-spray (1).jpeg";
import powder from "@/assets/products/insecticidal-powder (1).jpeg";
import snake from "@/assets/products/snake-repellent.jpeg";
import led from "@/assets/products/led-light-100w.jpeg";
import hex from "@/assets/products/hexazinone.jpeg";
import fly from "@/assets/products/fly-catcher.jpeg";
import wrist from "@/assets/products/mosquito-wristband.jpeg";
import solar200w from "@/assets/products/200w solar 2k.jpeg";
import magneticWindow from "@/assets/products/magnetic-window.jpeg";
import kit4in1 from "@/assets/products/4-1-image.jpeg";
import kitComplete from "@/assets/products/complete-home-kit.jpeg";
import kitBeforeAfter from "@/assets/products/be-after-4-1.jpeg";

export type Category = "pest-control" | "lighting" | "home-protection" | "farm-protection";

export interface Product {
  slug: string;
  name: string;
  price: number | null;
  originalPrice?: number;
  category: Category;
  image: string;
  images?: string[];
  tagline: string;
  description: string;
  usage: string[];
  safety: string[];
  specs: { label: string; value: string }[];
  badge?: string;
}

export const categories: { id: Category; name: string; description: string }[] = [
  { id: "pest-control", name: "Pest Control", description: "Sprays, powders & traps for a pest-free home." },
  { id: "lighting", name: "Lighting", description: "Bright, durable lights for vendors and homes." },
  { id: "home-protection", name: "Home Protection", description: "Snake repellents, nets, wristbands and more." },
  { id: "farm-protection", name: "Farm Protection", description: "Trusted herbicides for productive farms." },
];

export const products: Product[] = [
  {
    slug: "insecticidal-spray",
    name: "Insecticidal Spray 500ml",
    price: 999,
    originalPrice: 1499,
    category: "pest-control",
    image: spray,
    tagline: "Fast knockdown for cockroaches, bed bugs, ants & fleas.",
    description:
      "A powerful 500ml ready-to-use insecticide spray engineered for quick action against household pests. Low odor formula, surface-safe, and effective for weeks.",
    usage: [
      "Shake well before use.",
      "Spray 20–30cm from infested surfaces.",
      "Ventilate the area for 15 minutes after application.",
    ],
    safety: [
      "Keep out of reach of children and pets.",
      "Avoid contact with eyes and food surfaces.",
      "Do not inhale directly.",
    ],
    specs: [
      { label: "Volume", value: "500 ml" },
      { label: "Targets", value: "Cockroach, bed bug, ant, flea" },
      { label: "Format", value: "Trigger spray" },
    ],
    badge: "Best Seller",
  },
  {
    slug: "insecticidal-powder",
    name: "Insecticidal Powder Sachet",
    price: 80,
    originalPrice: 149,
    category: "pest-control",
    image: powder,
    tagline: "Fipronil 0.3% — affordable, effective, single-use sachet.",
    description: "Pocket-sized 8g sachet of insecticidal powder. Place near pest hotspots for long-lasting effect.",
    usage: ["Sprinkle along cracks, corners, and entry points.", "Reapply every 2 weeks for best results."],
    safety: ["Wash hands after use.", "Keep away from food and children."],
    specs: [
      { label: "Net content", value: "8 g" },
      { label: "Active ingredient", value: "Fipronil 0.3%" },
    ],
  },
  {
    slug: "snake-repellent-powder",
    name: "Snake Repellent Powder 500g",
    price: 1980,
    originalPrice: 3999,
    category: "home-protection",
    image: snake,
    tagline: "Long-lasting perimeter protection against snakes.",
    description:
      "Outdoor-use granular powder that creates a stable barrier around your home compound or farm. Weather-resistant.",
    usage: ["Apply a continuous 5cm-wide line around the perimeter.", "Reapply after heavy rain."],
    safety: ["For outdoor use only.", "Wear gloves when applying."],
    specs: [
      { label: "Net weight", value: "500 g" },
      { label: "Use", value: "Outdoor / Perimeter" },
    ],
  },
  {
    slug: "led-light-100w",
    name: "100W High Brightness LED Light",
    price: 1280,
    category: "lighting",
    image: led,
    tagline: "Rechargeable, USB, IP65 — built for night markets & vendors.",
    description:
      "A premium portable 100W LED bulb with built-in lithium battery, hook, USB charging, and waterproof construction.",
    usage: ["Charge via USB-C cable (included).", "Hang or place on flat surface."],
    safety: ["Do not submerge.", "Charge in a dry area."],
    specs: [
      { label: "Power", value: "100 W" },
      { label: "Battery", value: "Lithium-ion" },
      { label: "Rating", value: "IP65 Waterproof" },
    ],
    badge: "Top Rated",
  },
  {
    slug: "hexazinone-herbicide",
    name: "Hexazinone Herbicide 1kg",
    price: 2999,
    originalPrice: 3999,
    category: "farm-protection",
    image: hex,
    tagline: "Granule formulation, 5% Hexazinone — for weed-free fields.",
    description:
      "Reliable selective herbicide trusted by Kenyan farmers. Targets stubborn weeds with long residual control.",
    usage: ["Apply pre-emergence at recommended dose.", "Avoid application before heavy rain."],
    safety: ["Slightly toxic — wear PPE.", "Do not contaminate water sources."],
    specs: [
      { label: "Active ingredient", value: "Hexazinone 5%" },
      { label: "Formulation", value: "Granule" },
    ],
  },
  {
    slug: "automatic-fly-catcher",
    name: "Automatic Fly Catcher (4 Units)",
    price: 169,
    originalPrice: 200,
    category: "pest-control",
    image: fly,
    tagline: "No baiting, no poisons, no mess — just results.",
    description:
      "Pack of 4 sticky fly catcher rolls with super lure. Ideal for kitchens, shops, and farms.",
    usage: ["Twist open and hang in fly-prone areas.", "Replace when fully covered."],
    safety: ["Keep away from hair and pets."],
    specs: [
      { label: "Pack", value: "4 units" },
      { label: "Type", value: "Sticky lure roll" },
    ],
  },
  {
    slug: "mosquito-window-net",
    name: "Mosquito Window Net",
    price: 599,
    originalPrice: 999,
    category: "home-protection",
    image: magneticWindow,
    tagline: "Breathable barrier — keep mosquitoes out, fresh air in.",
    description: "Adhesive-mounted mosquito net for windows. Cuttable to size.",
    usage: ["Clean window frame, attach adhesive strips, press net firmly."],
    safety: ["Indoor use."],
    specs: [{ label: "Size", value: "150 × 130 cm" }],
  },
  {
    slug: "solar-ceiling-light-200w",
    name: "200W Solar Ceiling Light",
    price: 2000,
    category: "lighting",
    image: solar200w,
    tagline: "Bright, reliable, eco-friendly — power from the sun.",
    description: "200W solar-powered ceiling light with 12000mAh battery, motion sensor, and remote control. Perfect for homes, farms, and off-grid areas.",
    usage: ["Mount on ceiling with included brackets.", "Charge in direct sunlight for 6-8 hours.", "Use remote control to adjust brightness."],
    safety: ["Do not submerge in water.", "Install in dry location."],
    specs: [
      { label: "Power", value: "200 W" },
      { label: "Battery", value: "12000 mAh" },
      { label: "Lighting time", value: "Up to 12 hours" },
      { label: "Features", value: "Motion sensor, remote control" },
    ],
    badge: "Eco-Friendly",
  },
  {
    slug: "mosquito-repellent-wristband",
    name: "Mosquito Repellent Wristband",
    price: 199,
    originalPrice: 299,
    category: "home-protection",
    image: wrist,
    tagline: "DEET-free wearable protection — great for kids and travel.",
    description: "Comfortable silicone wristband infused with natural repellents. Up to 240 hours per band.",
    usage: ["Wear on wrist or ankle.", "Store in sealed pouch when not in use."],
    safety: ["Skin-safe; remove if irritation occurs."],
    specs: [{ label: "Duration", value: "Up to 240 h" }],
  },
  {
    slug: "snake-repellent-1000g",
    name: "Snake Repellent Powder 1000g",
    price: 3599,
    originalPrice: 7998,
    category: "home-protection",
    image: snake,
    tagline: "Extended perimeter protection for larger compounds.",
    description:
      "Outdoor-use granular powder that creates a stable barrier around your home compound or farm. Weather-resistant. Larger 1000g pack for bigger areas.",
    usage: ["Apply a continuous 5cm-wide line around the perimeter.", "Reapply after heavy rain."],
    safety: ["For outdoor use only.", "Wear gloves when applying."],
    specs: [
      { label: "Net weight", value: "1000 g" },
      { label: "Use", value: "Outdoor / Perimeter" },
    ],
  },
  {
    slug: "snake-repellent-1500g",
    name: "Snake Repellent Powder 1500g",
    price: 5299,
    originalPrice: 11997,
    category: "home-protection",
    image: snake,
    tagline: "Maximum coverage for farms and large properties.",
    description:
      "Outdoor-use granular powder that creates a stable barrier around your home compound or farm. Weather-resistant. Largest 1500g pack for extensive coverage.",
    usage: ["Apply a continuous 5cm-wide line around the perimeter.", "Reapply after heavy rain."],
    safety: ["For outdoor use only.", "Wear gloves when applying."],
    specs: [
      { label: "Net weight", value: "1500 g" },
      { label: "Use", value: "Outdoor / Perimeter" },
    ],
  },
  {
    slug: "4-in-1-home-pest-control-kit",
    name: "4-in-1 Home Pest Control Kit",
    price: 3599,
    originalPrice: 6232,
    category: "pest-control",
    image: kit4in1,
    images: [kit4in1, kitComplete, kitBeforeAfter],
    tagline: "Complete home protection — spray, powder, repellent & traps.",
    description: "Comprehensive pest control kit with insecticidal spray, powder, snake repellent, and fly catchers. Everything you need for a pest-free home.",
    usage: [
      "Use spray for immediate knockdown.",
      "Apply powder in cracks and corners.",
      "Sprinkle repellent around perimeter.",
      "Hang fly catchers in problem areas.",
    ],
    safety: [
      "Keep out of reach of children and pets.",
      "Wear gloves when applying powders.",
      "Ventilate areas after spraying.",
    ],
    specs: [
      { label: "Includes", value: "Spray, powder, repellent, fly catchers" },
      { label: "Coverage", value: "Average 3-bedroom home" },
      { label: "Duration", value: "Up to 3 months" },
    ],
    badge: "Complete Solution",
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const formatKES = (n: number) => `KES ${n.toLocaleString("en-KE")}`;
