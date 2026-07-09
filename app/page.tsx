import { Hero } from "./components/hero";
import { FeaturedProducts } from "./components/featured-products";
import { PromoBanners } from "./components/promo-banners";
import { Features } from "./components/features";
import { AsSeenIn } from "./components/as-seen-in";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <FeaturedProducts />
      <PromoBanners />
      <Features />
      <AsSeenIn />
    </main>
  );
}
