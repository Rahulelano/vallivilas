import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-display font-bold mb-8 text-center text-maroon">Contact Us</h1>
        
        <div className="grid md:grid-cols-2 gap-12 bg-cream p-8 rounded-lg shadow-sm border border-stone-200">
          <div>
            <h2 className="text-2xl font-display font-bold mb-6 text-deep-maroon">Get in Touch</h2>
            <p className="text-muted-foreground mb-8">We'd love to hear from you. Please fill out the form or reach out using the contact details below.</p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="text-deep-maroon mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-foreground">Address</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mt-1">
                    No.14, MRV Nagar, Cauvery Road,<br />
                    Trichy - 620 002. TN. (India)
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Phone className="text-deep-maroon flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-foreground">Phone</h3>
                  <p className="text-muted-foreground text-sm mt-1 whitespace-pre-line">
                    0431-2730021<br/>
                    +91 99624 10251<br/>
                    +91 93447 82654<br/>
                    (Timings: 9 a.m.- 6 p.m.)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Mail className="text-deep-maroon flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-foreground">Email</h3>
                  <p className="text-muted-foreground text-sm mt-1">vallivilasgroup@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" className="w-full p-3 border border-gray-300 rounded focus:border-deep-maroon focus:ring-1 focus:ring-deep-maroon outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" className="w-full p-3 border border-gray-300 rounded focus:border-deep-maroon focus:ring-1 focus:ring-deep-maroon outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea rows={4} className="w-full p-3 border border-gray-300 rounded focus:border-deep-maroon focus:ring-1 focus:ring-deep-maroon outline-none" required></textarea>
              </div>
              <button type="submit" className="w-full bg-deep-maroon text-white font-bold py-3 px-4 rounded hover:bg-opacity-90 transition duration-300 uppercase tracking-wide">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
