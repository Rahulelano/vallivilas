import { Instagram } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getImgUrl } from "@/lib/utils";

const InstagramSection = () => {
  const { data: posts, isLoading, isError } = useQuery({
    queryKey: ["instagram-posts"],
    queryFn: async () => {
      const response = await fetch("/api/instagram-posts");
      if (!response.ok) throw new Error("Failed to fetch posts");
      return response.json();
    }
  });

  if (isLoading) return (
    <div className="py-12 text-center text-muted-foreground italic">
      Loading feed...
    </div>
  );

  if (isError || !Array.isArray(posts)) return null;

  return (
    <section className="py-12 md:py-16 bg-cream instagram-section">
      <div className="container mx-auto px-4 text-center mb-8">
        <h2 className="section-heading">Check Out Our Instagram</h2>
        <p className="section-subtitle">A glimpse of our feed</p>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-1">
        {posts && posts.map((post: any) => (
          <a key={post._id} href={post.link} target="_blank" rel="noopener noreferrer" className="relative group aspect-square overflow-hidden bg-black/5">
            {post.type === "video" ? (
              <video
                src={getImgUrl(post.image)}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                muted
                loop
                onMouseOver={(e) => e.currentTarget.play()}
                onMouseOut={(e) => e.currentTarget.pause()}
              />
            ) : (
              <img
                src={getImgUrl(post.image)}
                alt="Instagram post"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
            )}
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-colors flex items-center justify-center">
              <Instagram className="text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity" size={28} />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default InstagramSection;
