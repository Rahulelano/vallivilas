import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TrackOrder = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-4xl font-display font-bold mb-8 text-center text-maroon">Track Your Order</h1>
        
        <div className="bg-cream p-8 rounded-lg shadow-sm border border-stone-200">
          <p className="text-muted-foreground mb-6 text-center">
            Enter your order ID below to view the current status of your shipment.
          </p>
          
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order ID</label>
              <input 
                type="text" 
                placeholder="e.g. ORD-12345" 
                className="w-full p-3 border border-gray-300 rounded focus:border-deep-maroon focus:ring-1 focus:ring-deep-maroon outline-none"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-deep-maroon text-white font-bold py-3 px-4 rounded hover:bg-opacity-90 transition duration-300 uppercase tracking-wide"
            >
              Track Order
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TrackOrder;
