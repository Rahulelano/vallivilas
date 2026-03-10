import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { Star, ShoppingCart, ShieldCheck, Truck, RefreshCcw } from "lucide-react";
import { getImgUrl } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const ProductDetails = () => {
    const { slug } = useParams();
    const { addToCart } = useCart();
    const [mainImage, setMainImage] = useState<string | null>(null);
    const [selectedIdx, setSelectedIdx] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

    const { data: product, isLoading } = useQuery({
        queryKey: ["product", slug],
        queryFn: async () => {
            const response = await fetch(`/api/products/${slug}`);
            const data = await response.json();
            if (data && data.image) {
                setMainImage(data.image);
            }
            if (data && data.variants && data.variants.length > 0) {
                setSelectedVariant(data.variants[0]);
            }
            return data;
        }
    });

    if (isLoading) return <div className="p-20 text-center">Loading...</div>;
    if (!product) return <div className="p-20 text-center">Product not found</div>;

    const allImages = [product.image, ...(product.gallery || [])].filter(Boolean);

    const handleAddToCart = () => {
        if (product.variants?.length > 0 && !selectedVariant) {
            toast.error("Please select a size/weight");
            return;
        }
        addToCart(product, 1, selectedVariant || undefined);
        toast.success(`${product.name}${selectedVariant ? ` (${selectedVariant})` : ''} added to basket!`);
    };

    const handleBuyNow = () => {
        if (product.variants?.length > 0 && !selectedVariant) {
            toast.error("Please select a size/weight");
            return;
        }
        addToCart(product, 1, selectedVariant || undefined);
        toast.success(`Starting your purchase for ${product.name}`);
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-[4/5] bg-muted rounded-xl shadow-lg overflow-hidden border">
                            <img
                                src={getImgUrl(mainImage || product.image)}
                                alt={product.name}
                                className="w-full h-full object-cover transition-all duration-500"
                            />
                        </div>
                        {allImages.length > 1 && (
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setMainImage(img);
                                            setSelectedIdx(idx);
                                        }}
                                        className={`aspect-[4/5] bg-muted rounded-lg border-2 overflow-hidden transition-all ${(mainImage === img || (idx === 0 && !mainImage)) ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-70 hover:opacity-100"
                                            }`}
                                    >
                                        <img src={getImgUrl(img)} className="w-full h-full object-cover" alt="" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <h1 className="text-3xl font-display font-bold">{product.name}</h1>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center text-gold">
                                <Star size={18} fill="currentColor" />
                                <span className="ml-1 font-bold">{product.rating || 5.0}</span>
                            </div>
                            <span className="text-muted-foreground">({product.reviews || 0} reviews)</span>
                        </div>

                        <div className="flex items-center gap-4 text-2xl">
                            <span className="text-primary font-bold">₹ {product.salePrice}</span>
                            {product.regularPrice && (
                                <span className="text-muted-foreground line-through text-lg">₹ {product.regularPrice}</span>
                            )}
                            {product.discount && <span className="bg-green-100 text-green-700 text-sm px-2 py-1 rounded">{product.discount}</span>}
                        </div>

                        {/* Variants Selection */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="space-y-3">
                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Select Size / Weight</label>
                                <div className="flex flex-wrap gap-3">
                                    {product.variants.map((variant: string) => (
                                        <button
                                            key={variant}
                                            onClick={() => setSelectedVariant(variant)}
                                            className={`px-6 py-2 rounded-full border-2 transition-all font-medium ${selectedVariant === variant
                                                ? "border-primary bg-primary text-white"
                                                : "border-muted-foreground/20 hover:border-primary/50"
                                                }`}
                                        >
                                            {variant}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <p className="text-muted-foreground leading-relaxed">
                            {product.description || "Experience the divine essence with our premium, charcoal-free fragrances. Handcrafted with care using natural ingredients and recycled flowers."}
                        </p>

                        <div className="space-y-4 pt-4">
                            <button
                                onClick={handleAddToCart}
                                className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
                            >
                                <ShoppingCart /> Add to Basket
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="w-full border-2 border-primary text-primary py-4 rounded-full font-bold hover:bg-primary/5 transition-colors"
                            >
                                Buy It Now
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-8 border-t">
                            <div className="text-center space-y-2">
                                <Truck className="mx-auto text-primary" />
                                <p className="text-xs font-semibold">Fast Delivery</p>
                            </div>
                            <div className="text-center space-y-2">
                                <ShieldCheck className="mx-auto text-primary" />
                                <p className="text-xs font-semibold">100% Secure</p>
                            </div>
                            <div className="text-center space-y-2">
                                <RefreshCcw className="mx-auto text-primary" />
                                <p className="text-xs font-semibold">Easy Returns</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProductDetails;
