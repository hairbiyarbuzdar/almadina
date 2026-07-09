export type Product = {
  slug: string;
  name: string;
  category: Category;
  price: string;
  wasPrice?: string;
  badge?: string;
  rating: number;
  image: string;
  blurb: string;
};

export const CATEGORIES = [
  "Cleansers",
  "Moisturizers",
  "Serums & Oils",
  "Masks",
  "Sunscreen",
  "Toners",
  "Eye Care",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const PRODUCTS: Product[] = [
  {
    slug: "natural-coconut-cleansing-oil",
    name: "Natural Coconut Cleansing Oil",
    category: "Cleansers",
    price: "Rs 4,200",
    rating: 4,
    image: "/products/natural-coconut-cleansing-oil.jpg",
    blurb: "Melts away makeup and impurities without stripping the skin.",
  },
  {
    slug: "gentle-foaming-face-wash",
    name: "Gentle Foaming Face Wash",
    category: "Cleansers",
    price: "Rs 2,800",
    rating: 5,
    image: "/products/gentle-foaming-face-wash.jpg",
    blurb: "A soft, sulphate-free lather for a fresh, balanced complexion.",
  },
  {
    slug: "daily-hydrating-cream",
    name: "Daily Hydrating Cream",
    category: "Moisturizers",
    price: "Rs 3,600",
    rating: 4,
    image: "/products/daily-hydrating-cream.jpg",
    blurb: "Lightweight all-day moisture with ceramides and squalane.",
  },
  {
    slug: "rich-repair-night-cream",
    name: "Rich Repair Night Cream",
    category: "Moisturizers",
    price: "Rs 5,400",
    wasPrice: "Rs 6,800",
    badge: "-20%",
    rating: 5,
    image: "/products/rich-repair-night-cream.jpg",
    blurb: "Overnight nourishment to wake up to visibly plumper skin.",
  },
  {
    slug: "intensive-glow-c-serum",
    name: "Intensive Glow C+ Serum",
    category: "Serums & Oils",
    price: "Rs 6,900",
    badge: "Bestseller",
    rating: 5,
    image: "/products/intensive-glow-c-serum.jpg",
    blurb: "15% vitamin C to brighten, even tone and boost radiance.",
  },
  {
    slug: "hyaluronic-acid-serum",
    name: "Hyaluronic Acid Serum",
    category: "Serums & Oils",
    price: "Rs 5,200",
    rating: 4,
    image: "/products/hyaluronic-acid-serum.jpg",
    blurb: "Multi-weight hyaluronic acid for deep, lasting hydration.",
  },
  {
    slug: "perfecting-facial-oil",
    name: "Perfecting Facial Oil",
    category: "Serums & Oils",
    price: "Rs 4,800",
    rating: 5,
    image: "/products/perfecting-facial-oil.jpg",
    blurb: "A botanical blend that restores softness and a healthy glow.",
  },
  {
    slug: "purifying-clay-mask",
    name: "Purifying Clay Mask",
    category: "Masks",
    price: "Rs 3,200",
    rating: 4,
    image: "/products/purifying-clay-mask.jpg",
    blurb: "Kaolin and charcoal draw out impurities and refine pores.",
  },
  {
    slug: "overnight-sleeping-mask",
    name: "Overnight Sleeping Mask",
    category: "Masks",
    price: "Rs 3,900",
    rating: 4,
    image: "/products/overnight-sleeping-mask.jpg",
    blurb: "A cushiony gel mask that recharges skin while you sleep.",
  },
  {
    slug: "daily-shield-spf-50",
    name: "Daily Shield SPF 50",
    category: "Sunscreen",
    price: "Rs 3,400",
    rating: 5,
    image: "/products/daily-shield-spf-50.jpg",
    blurb: "Weightless broad-spectrum protection with no white cast.",
  },
  {
    slug: "rose-water-toner",
    name: "Rose Water Toner",
    category: "Toners",
    price: "Rs 2,600",
    rating: 4,
    image: "/products/rose-water-toner.jpg",
    blurb: "Alcohol-free rose water to soothe, refresh and rebalance.",
  },
  {
    slug: "under-eye-recovery-gel",
    name: "Under-Eye Recovery Gel",
    category: "Eye Care",
    price: "Rs 3,100",
    wasPrice: "Rs 3,900",
    badge: "-20%",
    rating: 4,
    image: "/products/under-eye-recovery-gel.jpg",
    blurb: "Cooling caffeine gel that de-puffs and brightens tired eyes.",
  },
];
