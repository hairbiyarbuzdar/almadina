import { TruckIcon, RefreshIcon, ChatIcon, CardIcon } from "./icons";

const FEATURES = [
  {
    Icon: TruckIcon,
    title: "Free Shipping",
    copy: "Free Shipping for orders over Rs 36,000",
  },
  {
    Icon: RefreshIcon,
    title: "Returns",
    copy: "Within 30 days for an exchange",
  },
  {
    Icon: ChatIcon,
    title: "Online Support",
    copy: "24 hours a day, 7 days a week",
  },
  {
    Icon: CardIcon,
    title: "Flexible Payment",
    copy: "Pay with Multiple Credit Cards",
  },
];

export function Features() {
  return (
    <section className="border-t border-black/5 pb-20 lg:pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6">
          {FEATURES.map(({ Icon, title, copy }) => (
            <div key={title} className="text-center px-2">
              <Icon className="w-8 h-8 mx-auto text-ink mb-4" />
              <h4 className="text-sm font-medium text-ink mb-1.5">{title}</h4>
              <p className="text-xs text-ink-soft leading-relaxed max-w-[12rem] mx-auto">
                {copy}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
