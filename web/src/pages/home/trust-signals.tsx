
import { Zap, ShieldCheck, Users, Headphones } from "lucide-react";

const trustItems = [
  {
    icon: Zap,
    title: "30-Min Express Delivery",
    description: "Free delivery on orders over $50",
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Users,
    title: "50,000+ Happy Shoppers",
    description: "4.9/5 overall rating across 10k reviews",
    color: "text-emerald-600 bg-emerald-600/10 border-emerald-600/20",
  },
  {
    icon: ShieldCheck,
    title: "Encrypted Payments",
    description: "Stripe & CartMind Wallet protected",
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Headphones,
    title: "24/7 AI Assistance",
    description: "Instant resolution for orders & support",
    color: "text-teal-500 bg-teal-500/10 border-teal-500/20",
  },
];

const TrustSignals = () => {
  return (
    <section className="my-6 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {trustItems.map((item, idx) => {
        const IconComponent = item.icon;
        return (
          <div
            key={idx}
            className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card shadow-xs hover:border-emerald-500/30 transition-all duration-200"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.color} flex-shrink-0`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default TrustSignals;
