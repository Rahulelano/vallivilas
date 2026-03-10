import { motion } from "framer-motion";
import { Leaf, Shield, Heart, Recycle, Sparkles, FlaskConical } from "lucide-react";

const badges = [
  {
    icon: <Recycle className="w-10 h-10 text-primary" />,
    title: "Made From Recycled Temple Flowers",
    desc: "We reuse sacred flowers to create every product.",
  },
  {
    icon: <Shield className="w-10 h-10 text-primary" />,
    title: "CSIR Certified",
    desc: "Approved by trusted Indian scientists.",
  },
  {
    icon: <Sparkles className="w-10 h-10 text-primary" />,
    title: "Charcoal-Free & Safe",
    desc: "No harmful smoke — safe for everyday use.",
  },
  {
    icon: <Leaf className="w-10 h-10 text-primary" />,
    title: "Carbon Neutral",
    desc: "Everything we make is kind to the environment.",
  },
  {
    icon: <Heart className="w-10 h-10 text-primary" />,
    title: "Handcrafted by Women",
    desc: "Made with care by skilled women artisans.",
  },
  {
    icon: <FlaskConical className="w-10 h-10 text-primary" />,
    title: "Clean & Natural",
    desc: "No toxins. Only pure, plant-based ingredients.",
  },
];

const TrustBadges = () => {
  return (
    <section className="py-12 md:py-16 bg-cream trust-badges-section">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="trust-badge"
            >
              {badge.icon}
              <h3 className="font-body font-bold text-sm text-foreground">{badge.title}</h3>
              <p className="text-muted-foreground text-xs">{badge.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
