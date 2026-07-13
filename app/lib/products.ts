export type Ingredient = { name: string; note: string };

export type Product = {
  slug: string;
  name: string;
  category: string;
  price: string;
  wasPrice?: string;
  badge?: string;
  rating: number;
  image: string;
  blurb: string;
  size: string;
  description: string;
  benefits: string[];
  ingredients: Ingredient[];
  howToUse: string;
  stock?: number;
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
    size: "150 ml",
    description:
      "A silky first-cleanse oil that melts away sunscreen, makeup and the day's build-up while keeping your skin barrier soft and intact. Perfect as step one of a double cleanse.",
    benefits: [
      "Dissolves makeup, SPF and daily impurities",
      "Cleanses without stripping natural oils",
      "Leaves skin soft, calm and comfortable",
      "Gentle enough for everyday use",
    ],
    ingredients: [
      { name: "Virgin Coconut Oil", note: "melts away impurities and nourishes" },
      { name: "Jojoba Oil", note: "balances without clogging pores" },
      { name: "Vitamin E", note: "antioxidant that conditions skin" },
    ],
    howToUse:
      "Massage a few pumps onto dry skin, then add water to emulsify into a milk and rinse. Follow with your usual cleanser for a full double cleanse.",
  },
  {
    slug: "gentle-foaming-face-wash",
    name: "Gentle Foaming Face Wash",
    category: "Cleansers",
    price: "Rs 2,800",
    rating: 5,
    image: "/products/gentle-foaming-face-wash.jpg",
    blurb: "A soft, sulphate-free lather for a fresh, balanced complexion.",
    size: "150 ml",
    description:
      "A soft, sulphate-free foam that lifts away dirt, oil and pollution for a fresh, balanced complexion — clean, never tight.",
    benefits: [
      "Removes dirt, oil and pollution",
      "Sulphate-free, non-drying lather",
      "Maintains a healthy skin pH",
      "Ideal for daily morning and night use",
    ],
    ingredients: [
      { name: "Aloe Vera", note: "soothes and hydrates" },
      { name: "Glycerin", note: "draws in and holds moisture" },
      { name: "Green Tea Extract", note: "antioxidant that calms skin" },
    ],
    howToUse:
      "Massage a small amount over damp skin in circular motions, then rinse with lukewarm water. Use morning and evening.",
  },
  {
    slug: "daily-hydrating-cream",
    name: "Daily Hydrating Cream",
    category: "Moisturizers",
    price: "Rs 3,600",
    rating: 4,
    image: "/products/daily-hydrating-cream.jpg",
    blurb: "Lightweight all-day moisture with ceramides and squalane.",
    size: "50 ml",
    description:
      "A lightweight everyday moisturiser with ceramides and squalane that keeps skin hydrated, comfortable and protected from morning to night.",
    benefits: [
      "All-day lightweight hydration",
      "Strengthens the skin's moisture barrier",
      "Absorbs quickly with no greasy finish",
      "Layers well under makeup and SPF",
    ],
    ingredients: [
      { name: "Ceramides", note: "restore and protect the barrier" },
      { name: "Squalane", note: "lightweight, long-lasting moisture" },
      { name: "Hyaluronic Acid", note: "plumps and hydrates" },
    ],
    howToUse:
      "Apply to clean skin morning and evening after your serums. Always follow with SPF in the daytime.",
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
    size: "50 ml",
    description:
      "A deeply nourishing overnight cream that repairs and replenishes while you sleep, so you wake up to softer, plumper, more rested-looking skin.",
    benefits: [
      "Intense overnight nourishment",
      "Reduces dryness and dullness",
      "Supports natural overnight renewal",
      "Wake up to visibly plumper skin",
    ],
    ingredients: [
      { name: "Shea Butter", note: "rich, lasting nourishment" },
      { name: "Peptides", note: "support firmness and renewal" },
      { name: "Niacinamide", note: "evens tone and refines texture" },
    ],
    howToUse:
      "Warm a small amount between fingertips and press over face and neck as the final step of your evening routine.",
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
    size: "30 ml",
    description:
      "Our bestselling high-performance serum with 15% vitamin C to brighten, even skin tone and boost radiance for a healthy, lit-from-within glow.",
    benefits: [
      "Brightens dull, uneven skin",
      "Helps fade dark spots over time",
      "Boosts radiance and clarity",
      "Antioxidant defence against daily stressors",
    ],
    ingredients: [
      { name: "15% Vitamin C", note: "brightens and evens skin tone" },
      { name: "Ferulic Acid", note: "stabilises and strengthens the formula" },
      { name: "Vitamin E", note: "boosts antioxidant protection" },
    ],
    howToUse:
      "Apply 3–4 drops to clean skin each morning before moisturiser, then follow with SPF. Introduce gradually if you're new to vitamin C.",
  },
  {
    slug: "hyaluronic-acid-serum",
    name: "Hyaluronic Acid Serum",
    category: "Serums & Oils",
    price: "Rs 5,200",
    rating: 4,
    image: "/products/hyaluronic-acid-serum.jpg",
    blurb: "Multi-weight hyaluronic acid for deep, lasting hydration.",
    size: "30 ml",
    description:
      "A featherlight hydrating serum with multiple molecular weights of hyaluronic acid that quench skin at every level for deep, lasting moisture.",
    benefits: [
      "Deep, multi-layer hydration",
      "Plumps fine lines caused by dryness",
      "Lightweight and fast-absorbing",
      "Suits every skin type",
    ],
    ingredients: [
      {
        name: "Multi-weight Hyaluronic Acid",
        note: "hydrates surface and deeper layers",
      },
      { name: "Vitamin B5", note: "soothes and repairs" },
      { name: "Glycerin", note: "locks in moisture" },
    ],
    howToUse:
      "Apply to slightly damp skin morning and night, then seal with a moisturiser to lock in hydration.",
  },
  {
    slug: "perfecting-facial-oil",
    name: "Perfecting Facial Oil",
    category: "Serums & Oils",
    price: "Rs 4,800",
    rating: 5,
    image: "/products/perfecting-facial-oil.jpg",
    blurb: "A botanical blend that restores softness and a healthy glow.",
    size: "30 ml",
    description:
      "A fast-absorbing botanical oil blend that restores softness, comfort and a healthy natural glow to dry or tired-looking skin.",
    benefits: [
      "Restores softness and suppleness",
      "Nourishes dry, tired skin",
      "Non-greasy, dry-touch finish",
      "Adds a healthy, natural glow",
    ],
    ingredients: [
      { name: "Rosehip Oil", note: "rich in vitamins A and C" },
      { name: "Jojoba Oil", note: "balancing and barrier-friendly" },
      { name: "Squalane", note: "lightweight nourishment" },
    ],
    howToUse:
      "Press 2–3 drops over face as the last step of your routine, or mix a drop into your moisturiser for a glow.",
  },
  {
    slug: "purifying-clay-mask",
    name: "Purifying Clay Mask",
    category: "Masks",
    price: "Rs 3,200",
    rating: 4,
    image: "/products/purifying-clay-mask.jpg",
    blurb: "Kaolin and charcoal draw out impurities and refine pores.",
    size: "75 ml",
    description:
      "A weekly deep-cleansing mask with kaolin clay and activated charcoal that draws out impurities and refines the look of pores — without over-drying.",
    benefits: [
      "Draws out excess oil and impurities",
      "Refines the look of pores",
      "Detoxifies without over-drying",
      "Leaves skin clear and smooth",
    ],
    ingredients: [
      { name: "Kaolin Clay", note: "absorbs excess oil" },
      { name: "Activated Charcoal", note: "purifies and detoxifies" },
      { name: "Aloe Vera", note: "keeps skin calm and soothed" },
    ],
    howToUse:
      "Apply an even layer to clean skin, avoiding the eye area. Leave for 10 minutes, then rinse with warm water. Use 1–2 times a week.",
  },
  {
    slug: "overnight-sleeping-mask",
    name: "Overnight Sleeping Mask",
    category: "Masks",
    price: "Rs 3,900",
    rating: 4,
    image: "/products/overnight-sleeping-mask.jpg",
    blurb: "A cushiony gel mask that recharges skin while you sleep.",
    size: "75 ml",
    description:
      "A cushiony gel mask that works overnight to recharge, hydrate and revive tired, dehydrated skin — no rinsing required.",
    benefits: [
      "Recharges skin overnight",
      "Boosts hydration and bounce",
      "Soothes stressed, dull skin",
      "Leave-on, no rinsing needed",
    ],
    ingredients: [
      { name: "Hyaluronic Acid", note: "deep overnight hydration" },
      { name: "Panthenol", note: "soothes and repairs" },
      { name: "Green Tea", note: "antioxidant recovery" },
    ],
    howToUse:
      "Apply a generous layer as the final step at night. Leave on while you sleep and rinse in the morning. Use 2–3 times a week.",
  },
  {
    slug: "daily-shield-spf-50",
    name: "Daily Shield SPF 50",
    category: "Sunscreen",
    price: "Rs 3,400",
    rating: 5,
    image: "/products/daily-shield-spf-50.jpg",
    blurb: "Weightless broad-spectrum protection with no white cast.",
    size: "50 ml",
    description:
      "A weightless broad-spectrum SPF 50 that shields skin from UVA and UVB rays with no greasy feel or white cast — the perfect finish to any morning routine.",
    benefits: [
      "Broad-spectrum SPF 50 protection",
      "No greasy feel or white cast",
      "Sits beautifully under makeup",
      "Helps prevent premature ageing",
    ],
    ingredients: [
      { name: "Broad-spectrum UV Filters", note: "UVA and UVB defence" },
      { name: "Niacinamide", note: "supports the skin barrier" },
      { name: "Vitamin E", note: "adds antioxidant protection" },
    ],
    howToUse:
      "Apply generously as the last step of your morning routine, 15 minutes before sun exposure. Reapply every 2 hours when outdoors.",
  },
  {
    slug: "rose-water-toner",
    name: "Rose Water Toner",
    category: "Toners",
    price: "Rs 2,600",
    rating: 4,
    image: "/products/rose-water-toner.jpg",
    blurb: "Alcohol-free rose water to soothe, refresh and rebalance.",
    size: "200 ml",
    description:
      "An alcohol-free rose water toner that refreshes, soothes and rebalances the skin after cleansing, prepping it to drink in the rest of your routine.",
    benefits: [
      "Refreshes and rebalances skin",
      "Soothes redness and irritation",
      "Preps skin to absorb serums",
      "Alcohol-free and gentle for daily use",
    ],
    ingredients: [
      { name: "Rose Water", note: "soothes and refreshes" },
      { name: "Witch Hazel (alcohol-free)", note: "gently tones" },
      { name: "Glycerin", note: "adds light hydration" },
    ],
    howToUse:
      "Sweep over clean skin with a cotton pad, or press in with your hands, morning and night before serums.",
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
    size: "15 ml",
    description:
      "A cooling caffeine eye gel that de-puffs, brightens and refreshes the delicate under-eye area — your go-to for tired, early mornings.",
    benefits: [
      "De-puffs tired, morning eyes",
      "Helps brighten dark circles over time",
      "Cooling, refreshing feel",
      "Lightweight and non-greasy",
    ],
    ingredients: [
      { name: "Caffeine", note: "de-puffs and energises" },
      { name: "Hyaluronic Acid", note: "hydrates fine lines" },
      { name: "Vitamin C", note: "brightens dark circles" },
    ],
    howToUse:
      "Gently dab a small amount around the orbital bone morning and night. Store in the fridge for an extra cooling effect.",
  },
];

/** "Rs 6,900" -> 6900 */
export function priceToNumber(price: string): number {
  return Number(price.replace(/[^\d]/g, "")) || 0;
}

/** "Serums & Oils" -> "serums-and-oils" */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** 6900 -> "Rs 6,900" */
export function formatPrice(value: number): string {
  return `Rs ${value.toLocaleString("en-US")}`;
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getRelated(slug: string, limit = 4): Product[] {
  const current = getProduct(slug);
  if (!current) return PRODUCTS.slice(0, limit);
  const sameCategory = PRODUCTS.filter(
    (p) => p.slug !== slug && p.category === current.category,
  );
  const others = PRODUCTS.filter(
    (p) => p.slug !== slug && p.category !== current.category,
  );
  return [...sameCategory, ...others].slice(0, limit);
}
