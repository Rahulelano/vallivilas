import { useState } from "react";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { CartDrawer } from "./CartDrawer";


const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cartCount } = useCart();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      return response.json();
    }
  });

  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: async () => {
      if (searchQuery.length < 2) return [];
      const response = await fetch(`/api/products?search=${searchQuery}&limit=5`);
      return response.json();
    },
    enabled: searchQuery.length >= 2,
  });

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 header-section">
      {/* Search Overlay */}
      {showSearch && (
        <div className="absolute inset-0 bg-background z-[60] flex items-center px-4 animate-in slide-in-from-top duration-300">
          <div className="container mx-auto flex items-center gap-4">
            <Search className="text-muted-foreground" size={24} />
            <input
              autoFocus
              type="text"
              placeholder="Find your favorite fragrance..."
              className="flex-1 bg-transparent border-none outline-none text-xl font-display py-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={() => { setShowSearch(false); setSearchQuery(""); }}>
              <X size={24} />
            </button>
          </div>

          {/* Search Results Dropdown */}
          {searchQuery.length >= 2 && (
            <div className="absolute top-full left-0 w-full bg-background border-b shadow-xl max-h-[70vh] overflow-y-auto">
              <div className="container mx-auto py-8 px-4">
                {searchLoading ? (
                  <p className="text-center text-muted-foreground py-4">Searching...</p>
                ) : searchResults && searchResults.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Products</h3>
                      <div className="space-y-4">
                        {searchResults.map((product: any) => (
                          <Link
                            key={product._id}
                            to={`/product/${product.slug}`}
                            onClick={() => setShowSearch(false)}
                            className="flex items-center gap-4 group"
                          >
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                              <img src={`${product.image}`} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                            </div>
                            <div>
                              <p className="font-bold group-hover:text-primary transition-colors">{product.name}</p>
                              <p className="text-sm text-primary font-bold">₹ {product.salePrice}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8 font-display italic text-lg">No fragrances found matching "{searchQuery}"</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Top Tier: Search, Centered Logo, Account & Cart */}
      <div className="container mx-auto px-4 py-4 grid grid-cols-3 items-center">
        {/* Left: Mobile Menu & Search */}
        <div className="flex items-center gap-4">
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <button
            className="text-foreground hover:text-primary transition-colors hidden md:block"
            aria-label="Search"
            onClick={() => setShowSearch(true)}
          >
            <Search size={22} />
          </button>
        </div>

        {/* Center: Logo */}
        <div className="flex justify-center text-center">
          <Link to="/" className="font-display leading-tight group">
            <span className="text-2xl md:text-4xl font-bold text-primary tracking-tighter transition-all">
              Valli Vilas
            </span>
            <span className="block text-[8px] md:text-[10px] font-body font-normal text-muted-foreground tracking-[0.4em] uppercase mt-1">
              Fragrance of God
            </span>
          </Link>
        </div>

        {/* Right: Icons (Mobile Search, Account, Cart) */}
        <div className="flex items-center justify-end gap-3 md:gap-6">
          <button
            className="text-foreground hover:text-primary transition-colors md:hidden"
            aria-label="Search"
            onClick={() => setShowSearch(true)}
          >
            <Search size={20} />
          </button>
          <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors" aria-label="Account">
            <User size={22} />
          </Link>
          <CartDrawer>
            <button className="text-foreground hover:text-primary transition-colors relative" aria-label="Cart">
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </button>
          </CartDrawer>
        </div>
      </div>

      {/* Bottom Tier: Desktop Categories Navigation */}
      <nav className="hidden md:flex flex-wrap justify-center items-center gap-10 py-3 border-t border-border/50">
        {categories?.map((item: any) => (
          <Link
            key={item._id}
            to={`/category/${item.slug}`}
            className="text-xs uppercase tracking-widest font-bold hover:text-primary transition-all relative overflow-hidden group pb-1"
          >
            {item.name}
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
          </Link>
        ))}
      </nav>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-border bg-background px-4 py-8 space-y-6 animate-in slide-in-from-top duration-300">
          {categories?.map((item: any) => (
            <Link
              key={item._id}
              to={`/category/${item.slug}`}
              className="block text-lg font-display font-medium border-b border-border/50 pb-2"
              onClick={() => setMobileOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
