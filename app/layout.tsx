import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "./lib/cart-context";
import { ConditionalChrome } from "./components/conditional-chrome";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  absoluteUrl,
} from "./lib/seo";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Beauty Inspired by Real Life`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "skincare Pakistan",
    "clean beauty",
    "non-toxic skincare",
    "cruelty-free cosmetics",
    "serums",
    "moisturizers",
    "sunscreen",
    "Al-Madina",
    "Quetta beauty store",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  verification: {
    google: "Hg34MWjLnBQ04LKadEvivFkpQZfl1ov3O9h_kIWHoA8",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Beauty Inspired by Real Life`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} skincare`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Beauty Inspired by Real Life`,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: absoluteUrl(DEFAULT_OG_IMAGE),
  description: SITE_DESCRIPTION,
  foundingDate: "1998",
  address: [
    {
      "@type": "PostalAddress",
      streetAddress: "Churi Gali",
      addressLocality: "Quetta",
      addressCountry: "PK",
    },
    {
      "@type": "PostalAddress",
      streetAddress: "Lasi Road",
      addressLocality: "Hub Chowki",
      addressCountry: "PK",
    },
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+92-319-0189227",
    contactType: "customer service",
    areaServed: "PK",
    availableLanguage: ["English", "Urdu"],
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/shop?category={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <CartProvider>
          <ConditionalChrome>{children}</ConditionalChrome>
        </CartProvider>
        <Script
          async
          src="https://static.klaviyo.com/onsite/js/RfdaMS/klaviyo.js?company_id=RfdaMS"
          strategy="afterInteractive"
        />
        <Script id="klaviyo-init" strategy="afterInteractive">
          {`
          !function(){if(!window.klaviyo){window._klOnsite=window._klOnsite||[];try{window.klaviyo=new Proxy({},{get:function(n,i){return"push"===i?function(){var n;(n=window._klOnsite).push.apply(n,arguments)}:function(){for(var n=arguments.length,o=new Array(n),w=0;w<n;w++)o[w]=arguments[w];var t="function"==typeof o[o.length-1]?o.pop():void 0,e=new Promise((function(n){window._klOnsite.push([i].concat(o,[function(i){t&&t(i),n(i)}]))}));return e}}})}catch(n){window.klaviyo=window.klaviyo||[],window.klaviyo.push=function(){var n;(n=window._klOnsite).push.apply(n,arguments)}}}}();
          `}
        </Script>
        <Script id="omnisend-init" strategy="afterInteractive">
          {`
          window.omnisend = window.omnisend || [];
          omnisend.push(["brandID", "6a99da197cd5c356b9b56969"]);
          omnisend.push(["track", "$pageViewed"]);
          !function(){var e=document.createElement("script");
          e.type="text/javascript",e.async=!0,
          e.src="https://omnisnippet1.com/inshop/launcher-v2.js";
          var t=document.getElementsByTagName("script")[0];
          t.parentNode.insertBefore(e,t)}();
          `}
        </Script>
      </body>
    </html>
  );
}
