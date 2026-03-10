import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { useQuery } from "@tanstack/react-query";

const TopSellers = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ["top-sellers"],
    queryFn: async () => {
      const response = await fetch("/api/products?hot=true&limit=6");
      return response.json();
    }
  });

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 md:py-16 top-sellers-section bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="section-heading">Our Top Sellers</h2>
          <p className="section-subtitle">Must-See Selections</p>
          <p className="text-muted-foreground text-sm mt-3 max-w-xl mx-auto">
            Delve into our bestselling, natural luxury incense. Uplift your senses with premium, toxin-free fragrances.
          </p>
        </div>
        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute -left-2 md:left-0 top-1/2 -translate-y-1/2 z-10 bg-background shadow-lg rounded-full p-2 hover:bg-muted transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide px-8 pb-4" style={{ scrollbarWidth: "none" }}>
            {products?.map((product: any) => (
              <ProductCard key={product._id} product={{
                ...product,
                salePrice: product.salePrice.toString(),
                regularPrice: product.regularPrice?.toString()
              }} />
            ))}
          </div>
          <button
            onClick={() => scroll("right")}
            className="absolute -right-2 md:right-0 top-1/2 -translate-y-1/2 z-10 bg-background shadow-lg rounded-full p-2 hover:bg-muted transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopSellers;
