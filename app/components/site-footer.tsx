import Link from "next/link";

const COLUMNS = [
  {
    title: "Shop",
    links: ["Skincare", "Body", "Hair", "Sets & Kits", "Gift Cards"],
  },
  {
    title: "About",
    links: ["Our Story", "Ingredients", "Sustainability", "Journal", "Careers"],
  },
  {
    title: "Support",
    links: ["Contact", "Shipping", "Returns", "FAQ", "Track Order"],
  },
];

function hrefFor(col: string, link: string): string {
  if (link === "Our Story") return "/our-story";
  if (col === "Shop") return "/shop";
  return "#";
}

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand + newsletter */}
          <div className="lg:col-span-2">
            <div className="font-display text-2xl tracking-[0.2em] text-white mb-4">
              AL-MADINA
            </div>
            <p className="text-sm text-white/60 max-w-xs mb-6">
              Clean, non-toxic skincare designed for real life. Join us for 10%
              off your first order.
            </p>
            <form className="flex max-w-sm" action="#">
              <input
                type="email"
                required
                placeholder="Email address"
                className="flex-1 bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/40"
              />
              <button
                type="submit"
                className="bg-brand text-white text-xs uppercase tracking-widest px-5 hover:bg-brand-dark transition-colors"
              >
                Join
              </button>
            </form>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-white text-xs uppercase tracking-widest mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href={hrefFor(col.title, link)}
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>© {new Date().getFullYear()} Al-Madina. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
