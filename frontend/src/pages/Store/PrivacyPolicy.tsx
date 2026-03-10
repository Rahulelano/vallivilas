import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-display font-bold mb-8 text-center text-maroon">Privacy Policy</h1>
        <div className="prose prose-sm sm:prose-base lg:prose-lg text-muted-foreground mx-auto">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-deep-maroon">Security</h2>

          <h3 className="text-xl font-bold mt-6 mb-3 text-foreground">Information We Collect</h3>
          <p className="mb-4">We collect information you provide directly to us when you create an account, make a purchase, or communicate with us. This includes your name, email address, postal address, phone number, and payment information.</p>

          <h3 className="text-xl font-bold mt-6 mb-3 text-foreground">How We Use Your Information</h3>
          <p className="mb-4">We use your information to process your orders, provide customer support, and send you updates about our products and traditional offerings if you have opted in to our newsletter.</p>

          <h3 className="text-xl font-bold mt-6 mb-3 text-foreground">Data Security</h3>
          <p className="mb-4">We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights.</p>

          <h3 className="text-xl font-bold mt-6 mb-3 text-foreground">Cookies</h3>
          <p className="mb-4">Our website uses cookies to enhance your browsing experience and understand how you interact with our platform. You can choose to disable cookies through your browser settings.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
