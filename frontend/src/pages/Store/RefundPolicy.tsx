import Header from "@/components/Header";
import Footer from "@/components/Footer";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-display font-bold mb-8 text-center text-maroon">Refund & Return Policy</h1>
        <div className="prose prose-sm sm:prose-base lg:prose-lg text-muted-foreground mx-auto">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-deep-maroon">Commitment to Quality</h2>

          <h3 className="text-xl font-bold mt-6 mb-3 text-foreground">Overview</h3>
          <p className="mb-4">Due to the personal and sacred nature of our incense and wellness products, we generally do not accept returns once the packaging has been opened. This ensures the integrity and purity of the products for all our customers.</p>

          <h3 className="text-xl font-bold mt-6 mb-3 text-foreground">Eligibility for Return</h3>
          <p className="mb-4">Returns are only accepted for unopened and unused products in their original packaging within 7 days of delivery.</p>

          <h3 className="text-xl font-bold mt-6 mb-3 text-foreground">Return Shipping</h3>
          <p className="mb-4">The cost of return shipping is the responsibility of the customer, unless the return is due to an error on our part (incorrect item sent).</p>

          <h3 className="text-xl font-bold mt-6 mb-3 text-foreground">How to Initiate a Return</h3>
          <p className="mb-4">To start a return, please contact us at info@vallivilas.com. Once accepted, we will provide instructions on where to send your package.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RefundPolicy;
