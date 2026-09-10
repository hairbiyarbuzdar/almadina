export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://almadinacosmetics.com";

export const SITE_NAME = "Al-Madina";

export const SITE_DESCRIPTION =
  "Clean, non-toxic skincare and cosmetics trusted by families for over 25 years. Cleansers, serums, moisturizers, masks and more — delivered across Pakistan.";

export const DEFAULT_OG_IMAGE = "/products/shop-hero.jpg";

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

type OgInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
};

/**
 * Next.js replaces (does not merge) a page's `openGraph` with the layout's,
 * so every page that sets `openGraph` must re-declare the shared fields.
 */
export function buildOpenGraph({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  imageWidth = 1200,
  imageHeight = 630,
  imageAlt = `${SITE_NAME} skincare`,
}: OgInput) {
  return {
    type: "website" as const,
    siteName: SITE_NAME,
    locale: "en_US",
    title,
    description,
    url: path,
    images: [{ url: image, width: imageWidth, height: imageHeight, alt: imageAlt }],
  };
}
