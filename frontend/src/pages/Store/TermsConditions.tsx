import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsConditions = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-display font-bold mb-8 text-center text-maroon">Terms & Conditions</h1>
        <div className="prose prose-sm sm:prose-base lg:prose-lg text-muted-foreground mx-auto">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-deep-maroon">1. Acceptance of Terms</h2>
          <p className="mb-4">By accessing and using the Valli Vilas website, you agree to comply with and be bound by these Terms and Conditions.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-deep-maroon">2. Intellectual Property</h2>
          <p className="mb-4">All content on this website, including text, images, logos, and designs, is the property of Valli Vilas and is protected by copyright laws. You may not use or reproduce any content without our prior written consent.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-deep-maroon">3. Product Information</h2>
          <p className="mb-4">While we strive for accuracy, Valli Vilas does not warrant that product descriptions or other content is error-free. The colors and textures of our natural incense may vary slightly due to their organic origin.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-deep-maroon">4. Limitation of Liability</h2>
          <p className="mb-4">Valli Vilas shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our products or services.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-deep-maroon">5. Governing Law</h2>
          <p className="mb-4">These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Trichy/Delhi.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsConditions;
