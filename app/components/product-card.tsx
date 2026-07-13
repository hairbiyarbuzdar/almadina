import Image from "next/image";
import Link from "next/link";
import type { Product } from "../lib/products";
import { StarIcon } from "./icons";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const onSale = product.badge?.startsWith("-");

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative mb-4 overflow-hidden bg-cream aspect-square">
        {product.badge && (
          <span
            className={`absolute top-3 left-3 z-10 text-[11px] font-medium px-2 py-1 rounded ${
              onSale ? "bg-sale text-white" : "bg-ink text-white"
            }`}
          >
            {product.badge}
          </span>
        )}
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* View product on hover */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <span className="block w-full text-center bg-ink/90 text-white text-xs uppercase tracking-widest py-3">
            View Product
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-sm">
        {product.wasPrice && (
          <span className="text-ink-soft line-through">{product.wasPrice}</span>
        )}
        <span className="text-ink font-medium">{product.price}</span>
      </div>
      <h3 className="text-sm text-ink-soft text-center mt-1.5 mb-2 px-2 group-hover:text-ink transition-colors">
        {product.name}
      </h3>
      <Stars value={product.rating} />
    </Link>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <div className="flex justify-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          className={`w-3.5 h-3.5 ${i < value ? "text-brand" : "text-black/15"}`}
        />
      ))}
    </div>
  );
}
