import { Star } from "lucide-react";
import { motion } from "framer-motion";

const reviews = [
  {
    name: "Haylie",
    image: "https://cdn.shopify.com/s/files/1/0610/1231/2230/files/IMG-20240627-WA0007.jpg?v=1719469674",
    text: "The fragrance is absolutely divine! It fills my entire home with a sense of peace and spirituality. Truly a premium quality product.",
  },
  {
    name: "Augusta",
    image: "https://cdn.shopify.com/s/files/1/0610/1231/2230/files/IMG-20240627-WA0005.jpg?v=1719469673",
    text: "I love that these products are made from recycled temple flowers. The incense sticks burn evenly and the aroma is so calming.",
  },
  {
    name: "Priya",
    image: "https://cdn.shopify.com/s/files/1/0610/1231/2230/files/IMG-20240627-WA0009.jpg?v=1719469674",
    text: "Best havan cups I've ever used! Charcoal-free and the sambrani fragrance is authentic. Will definitely order again.",
  },
  {
    name: "Rahul",
    image: "https://cdn.shopify.com/s/files/1/0610/1231/2230/files/IMG-20240627-WA0010.jpg?v=1719469674",
    text: "The gift box was perfect for Diwali. Beautiful packaging and amazing products inside. Everyone loved it!",
  },
  {
    name: "Sneha",
    image: "https://cdn.shopify.com/s/files/1/0610/1231/2230/files/IMG-20240627-WA0006.jpg?v=1719469673",
    text: "These essential oils are so pure and therapeutic. The sandalwood oil is my absolute favorite for meditation.",
  },
  {
    name: "Vikram",
    image: "https://cdn.shopify.com/s/files/1/0610/1231/2230/files/IMG-20240627-WA0008.jpg?v=1719469673",
    text: "Supporting a brand that empowers women artisans feels great. The dhoop sticks are of excellent quality.",
  },
];

const CustomerReviews = () => {
  return (
    <section className="py-12 md:py-16 bg-background reviews-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-primary font-body font-semibold text-sm uppercase tracking-widest">
            Kind words from Our Customers
          </span>
          <h2 className="section-heading mt-2">Customer Reviews</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name + i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="bg-cream rounded-xl p-6 space-y-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-body font-bold text-foreground">{review.name}</h3>
                  <div className="flex gap-0.5 text-gold">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={12} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{review.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
