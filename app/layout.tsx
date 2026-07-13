import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./lib/cart-context";
import { ConditionalChrome } from "./components/conditional-chrome";

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
  title: "Al-Madina — Beauty Inspired by Real Life",
  description:
    "Clean, non-toxic skincare and beauty products designed for everyone.",
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
      <body className="min-h-full flex flex-col bg-white text-ink">
        <CartProvider>
          <ConditionalChrome>{children}</ConditionalChrome>
        </CartProvider>
      </body>
    </html>
  );
}
