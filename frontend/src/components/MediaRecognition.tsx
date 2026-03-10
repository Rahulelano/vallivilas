const logos = [
  { src: "https://nirmalaya.com/cdn/shop/files/yourstory-logo-7B331BB0BF-seeklogo.png?v=1718189863&width=135", alt: "YourStory" },
  { src: "https://nirmalaya.com/cdn/shop/files/Livemint_Logo_Vector.png?v=1718189863&width=226", alt: "Livemint" },
  { src: "https://nirmalaya.com/cdn/shop/files/Entrepreneur-India.png?v=1718189864&width=200", alt: "Entrepreneur India" },
  { src: "https://nirmalaya.com/cdn/shop/files/The_Indian_Express_logo.png?v=1718189782&width=296", alt: "The Indian Express" },
  { src: "https://nirmalaya.com/cdn/shop/files/pngegg_2.png?v=1718189782&width=354", alt: "News18" },
  { src: "https://nirmalaya.com/cdn/shop/files/the-morning-standard-logo.png?v=1718189782&width=77", alt: "The Morning Standard" },
  { src: "https://nirmalaya.com/cdn/shop/files/new-logo.png?v=1718189782&width=148", alt: "News" },
  { src: "https://nirmalaya.com/cdn/shop/files/TBI-English.png?v=1718189782&width=75", alt: "The Better India" },
  { src: "https://nirmalaya.com/cdn/shop/files/pngwing.png?v=1718189783&width=161", alt: "pngwing" },
  { src: "https://nirmalaya.com/cdn/shop/files/Hindustan_Times_logo.png?v=1718189783&width=349", alt: "Hindustan Times" },
];

const MediaRecognition = () => {
  return (
    <section className="py-12 bg-cream overflow-hidden media-section">
      <div className="container mx-auto px-4 mb-8">
        <div className="text-center">
          <span className="text-primary font-body font-semibold text-sm uppercase tracking-widest">
            Media Recognition
          </span>
          <h2 className="section-heading mt-2">Valli Vilas's Journey</h2>
        </div>
      </div>
      <div className="relative overflow-hidden">
        <div className="flex animate-scroll-left items-center gap-12 whitespace-nowrap">
          {[...logos, ...logos].map((logo, i) => (
            <img
              key={i}
              src={logo.src}
              alt={logo.alt}
              className="h-8 md:h-10 object-contain opacity-60 hover:opacity-100 transition-opacity flex-shrink-0 grayscale hover:grayscale-0"
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MediaRecognition;
