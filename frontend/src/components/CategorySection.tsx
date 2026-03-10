import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getImgUrl } from "@/lib/utils";

const CategorySection = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      return response.json();
    }
  });

  if (isLoading || !categories) return null;
  return (
    <section className="py-12 md:py-16 bg-background categories-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="section-heading">Shop by category</h2>
          <p className="section-subtitle">
            Explore our premium range of divine charcoal-free fragrances
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat: any, i: number) => (
            <Link key={cat.name} to={`/category/${cat.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="relative rounded-xl overflow-hidden cursor-pointer group"
              >
                <div className="relative aspect-[4/5] bg-cream rounded-xl overflow-hidden">
                  <img
                    src={getImgUrl(cat.image)}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="badge-discount">{cat.discount}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-primary-foreground font-display text-lg md:text-xl font-semibold">
                      {cat.name}
                    </h3>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
