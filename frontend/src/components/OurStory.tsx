import { motion } from "framer-motion";

const OurStory = () => {
  return (
    <section className="py-12 md:py-16 bg-background our-story-section">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="https://nirmalaya.com/cdn/shop/files/Frame_427320683_1.png?v=1718189199&width=1920"
              alt="Valli Vilas BTS"
              className="w-full aspect-[16/10] object-cover rounded-xl"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <span className="text-primary font-body font-semibold text-sm uppercase tracking-widest">
              Our Story
            </span>
            <h2 className="section-heading">Valli Vilas's Journey</h2>
            <p className="text-muted-foreground leading-relaxed">
              Valli Vilas is synonymous with all-natural, charcoal-free incense, destressing essential oils, and soulful attars. It started with a simple dream: crafting fragrances from recycled flowers that infuse peace and joy into your everyday rituals.
            </p>
            <a href="#" className="btn-outline-primary inline-block">
              About Us
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
