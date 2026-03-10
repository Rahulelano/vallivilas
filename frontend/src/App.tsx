import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Admin/Login";
import Dashboard from "./pages/Admin/Dashboard";
import SectionManager from "./pages/Admin/SectionManager";
import CategoryPage from "./pages/Store/CategoryPage";
import ProductDetails from "./pages/Store/ProductDetails";
import Checkout from "./pages/Store/Checkout";
import CustomerLogin from "./pages/Store/CustomerLogin";
import CustomerDashboard from "./pages/Store/CustomerDashboard";
import AdminOrders from "./pages/Admin/AdminOrders";
import RefundPolicy from "./pages/Store/RefundPolicy";
import PrivacyPolicy from "./pages/Store/PrivacyPolicy";
import TermsConditions from "./pages/Store/TermsConditions";
import Contact from "./pages/Store/Contact";
import TrackOrder from "./pages/Store/TrackOrder";
import ScrollToTop from "./components/ScrollToTop";
import { CartProvider } from "./context/CartContext";

const queryClient = new QueryClient();

const ProductSectionManager = () => {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/admin/categories", {
        headers: { "x-auth-token": localStorage.getItem("admin-token") || "" },
      });
      return response.json();
    },
  });

  const categoryOptions = categories?.map((cat: any) => ({
    label: cat.name,
    value: cat._id,
  })) || [];

  return (
    <SectionManager
      title="Products"
      endpoint="products"
      fields={[
        { name: "name", label: "Name", type: "text" },
        { name: "slug", label: "Slug", type: "text" },
        { name: "image", label: "Main Image", type: "image" },
        { name: "gallery", label: "Product Gallery", type: "multi-image" },
        { name: "variants", label: "Variants (e.g. 1kg, 500g, 100ml - Add comma separated)", type: "textarea" },
        {
          name: "category",
          label: "Category",
          type: "select",
          options: categoryOptions,
        },
        { name: "salePrice", label: "Sale Price", type: "number" },
        { name: "regularPrice", label: "Regular Price", type: "number" },
        { name: "discount", label: "Discount", type: "text" },
        { name: "rating", label: "Rating", type: "number" },
        { name: "hot", label: "Hot Selling", type: "boolean" },
        { name: "description", label: "Description", type: "textarea" },
      ]}
    />
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />

            <Route
              path="/admin/announcements"
              element={
                <SectionManager
                  title="Announcements"
                  endpoint="announcements"
                  fields={[
                    { name: "text", label: "Text", type: "text" },
                    { name: "order", label: "Order", type: "number" },
                    { name: "active", label: "Active", type: "boolean" }
                  ]}
                />
              }
            />

            <Route
              path="/admin/hero-slides"
              element={
                <SectionManager
                  title="Hero Slides"
                  endpoint="hero-slides"
                  fields={[
                    { name: "image", label: "Image", type: "image" },
                    { name: "title", label: "Title", type: "text" },
                    { name: "subtitle", label: "Subtitle", type: "text" },
                    { name: "hindi", label: "Hindi Text", type: "text" },
                    { name: "cta", label: "CTA Text", type: "text" },
                    { name: "order", label: "Order", type: "number" },
                    { name: "active", label: "Active", type: "boolean" }
                  ]}
                />
              }
            />

            <Route
              path="/admin/categories"
              element={
                <SectionManager
                  title="Categories"
                  endpoint="categories"
                  fields={[
                    { name: "name", label: "Name", type: "text" },
                    { name: "slug", label: "Slug", type: "text" },
                    { name: "image", label: "Image", type: "image" },
                    { name: "discount", label: "Discount Text", type: "text" },
                    { name: "order", label: "Order", type: "number" }
                  ]}
                />
              }
            />

            <Route
              path="/admin/products"
              element={<ProductSectionManager />}
            />

            <Route
              path="/admin/promo-banners"
              element={
                <SectionManager
                  title="Promo Banners"
                  endpoint="promo-banners"
                  fields={[
                    { name: "type", label: "Type", type: "select", options: [{ label: "Full Width", value: "full-width" }, { label: "Split", value: "split" }, { label: "Image Only", value: "image-only" }] },
                    { name: "image", label: "Image", type: "image" },
                    { name: "title", label: "Title", type: "text" },
                    { name: "subtitle", label: "Subtitle", type: "text" },
                    { name: "cta", label: "CTA Text", type: "text" },
                    { name: "link", label: "Link", type: "text" },
                    { name: "order", label: "Order", type: "number" },
                    { name: "active", label: "Active", type: "boolean" },
                  ]}
                />
              }
            />

            <Route
              path="/admin/instagram"
              element={
                <SectionManager
                  title="Instagram Feed"
                  endpoint="instagram-posts"
                  fields={[
                    { name: "image", label: "Media (Image/Video)", type: "image" },
                    { name: "type", label: "Media Type", type: "select", options: [{ label: "Image", value: "image" }, { label: "Video", value: "video" }] },
                    { name: "link", label: "Instagram Link", type: "text" },
                    { name: "order", label: "Order", type: "number" },
                    { name: "active", label: "Active", type: "boolean" },
                  ]}
                />
              }
            />

            <Route
              path="/admin/footer-assets"
              element={
                <SectionManager
                  title="Footer Assets"
                  endpoint="footer-assets"
                  fields={[
                    { name: "image", label: "Illustration Image", type: "image" },
                    { name: "order", label: "Order", type: "number" },
                    { name: "active", label: "Active", type: "boolean" },
                  ]}
                />
              }
            />

            <Route
              path="/admin/promo-popups"
              element={
                <SectionManager
                  title="Promo Popups"
                  endpoint="promo-popups"
                  fields={[
                    { name: "image", label: "Poster Image", type: "image" },
                    { name: "link", label: "Link (URL)", type: "text" },
                    { name: "isActive", label: "Active", type: "boolean" },
                    { name: "showAlways", label: "Show Every Time (vs Once per Session)", type: "boolean" },
                  ]}
                />
              }
            />

            <Route
              path="/admin/appearance"
              element={
                <SectionManager
                  title="Section Colors"
                  endpoint="appearance"
                  fields={[
                    { name: "section", label: "Section Name", type: "text" },
                    { name: "backgroundColor", label: "Background Color (Hex)", type: "text" },
                    { name: "textColor", label: "Text Color (Hex)", type: "text" },
                  ]}
                />
              }
            />

            <Route path="/admin/orders" element={<AdminOrders />} />

            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/product/:slug" element={<ProductDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<CustomerLogin />} />
            <Route path="/dashboard" element={<CustomerDashboard />} />
            
            {/* Standard Footer Pages */}
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/track-order" element={<TrackOrder />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
