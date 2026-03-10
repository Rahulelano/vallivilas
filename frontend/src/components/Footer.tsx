import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getImgUrl } from "@/lib/utils";

const Footer = () => {
  const { data: assets } = useQuery({
    queryKey: ["footer-assets"],
    queryFn: async () => {
      const response = await fetch("/api/footer-assets");
      return response.json();
    }
  });

  return (
    <footer className="footer-section">
      {/* Main Footer Content */}
      <div className="bg-cream py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Column 1: Brand & Desc */}
            <div className="space-y-6">
              <h3 className="font-display text-4xl font-bold tracking-tight">Valli Vilas</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                A home-grown fragrance brand that recycles temple flowers turning them into eco-friendly incense products, essential oils, & pure attars.
              </p>

              {/* Newsletter */}
              <div className="pt-4">
                <form className="flex max-w-sm border-b border-muted-foreground/30">
                  <input
                    type="email"
                    placeholder="E-mail"
                    className="bg-transparent border-none outline-none py-3 flex-1 text-sm font-body"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-deep-maroon text-white px-6 py-2 text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-opacity"
                  >
                    Subscribe
                  </button>
                </form>
              </div>

              {/* Social Icons */}
              <div className="flex gap-6 pt-4">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Facebook size={20} /></a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Twitter size={20} /></a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Instagram size={20} /></a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Youtube size={20} /></a>
              </div>
            </div>

            {/* Column 2: Policies */}
            <div>
              <ul className="space-y-4 pt-2">
                <li>
                  <Link to="/refund-policy" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Refund Policy</Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/terms-conditions" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Terms & Conditions</Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Support */}
            <div>
              <ul className="space-y-4 pt-2">
                <li>
                  <Link to="/contact" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Contact</Link>
                </li>
                <li>
                  <Link to="/track-order" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Track Order</Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Address/Contact */}
            <div className="space-y-4 pt-2 text-muted-foreground text-sm">
              <p>Email: vallivilasgroup@gmail.com</p>
              <p>Ph: 0431-2730021 / +91 99624 10251</p>
              <p>(Timings: 9 a.m.- 6 p.m.)</p>
              <p>No.14, MRV Nagar, Cauvery Road,<br />Trichy - 620 002. TN. (India)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Row */}
      <div className="bg-cream overflow-hidden border-t border-muted-foreground/10 py-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-end gap-4 md:gap-12 flex-wrap">
            {assets?.map((asset: any) => (
              <div key={asset._id} className="max-w-[120px] md:max-w-[180px]">
                <img
                  src={getImgUrl(asset.image)}
                  className="w-full h-auto grayscale transition-all hover:grayscale-0"
                  alt="Decorative footer asset"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-deep-maroon text-primary-foreground py-3 text-center text-[10px] md:text-sm tracking-widest font-body opacity-90">
        <div className="container mx-auto px-4">
          © {new Date().getFullYear()} - Valli Vilas Wellness Pvt. Ltd. | All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
