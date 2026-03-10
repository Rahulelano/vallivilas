import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getImgUrl } from "@/lib/utils";

const PromoBanners = () => {
  const { data: banners, isLoading } = useQuery({
    queryKey: ["promo-banners"],
    queryFn: async () => {
      const response = await fetch("/api/promo-banners");
      return response.json();
    }
  });

  if (isLoading || !banners || banners.length === 0) return null;

  return (
    <section className="py-8 promo-banners-section">
      <div className="container mx-auto px-4 space-y-6">
        {banners.map((banner: any) => {
          if (banner.type === 'full-width' || banner.type === 'image-only') {
            return (
              <div key={banner._id} className="rounded-xl overflow-hidden cursor-pointer hover:opacity-95 transition-opacity">
                <Link to={banner.link}>
                  <img
                    src={getImgUrl(banner.image)}
                    alt={banner.title || "Valli Vilas Collection"}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </Link>
              </div>
            );
          }

          if (banner.type === 'split') {
            return (
              <div key={banner._id} className="grid md:grid-cols-2 gap-6 items-center bg-cream rounded-xl overflow-hidden">
                <div className="p-8 md:p-12">
                  <img
                    src={getImgUrl(banner.image)}
                    alt={banner.title}
                    className="w-full aspect-[4/5] object-cover rounded-lg"
                    loading="lazy"
                  />
                </div>
                <div className="p-8 md:p-12">
                  <h2 className="section-heading mb-4">{banner.title}</h2>
                  <p className="text-muted-foreground mb-6">{banner.subtitle}</p>
                  <Link to={banner.link} className="btn-primary inline-block">
                    {banner.cta || "Check Out"}
                  </Link>
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    </section>
  );
};

export default PromoBanners;
