import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";

const CategoryPage = () => {
    const { slug } = useParams();

    const { data: category } = useQuery({
        queryKey: ["category", slug],
        queryFn: async () => {
            const response = await fetch(`/api/categories/${slug}`);
            return response.json();
        }
    });

    const { data: products, isLoading } = useQuery({
        queryKey: ["products", slug],
        queryFn: async () => {
            const response = await fetch(`/api/products?category=${slug}`);
            return response.json();
        }
    });

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <div className="relative h-[35vh] min-h-[300px] w-full overflow-hidden">
                    <img
                        src={category?.image?.startsWith('http') ? category.image : `${category?.image}`}
                        alt={category?.name}
                        className="w-full h-full object-cover animate-in fade-in zoom-in duration-1000"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="text-center text-white space-y-4 px-4 animate-in slide-in-from-bottom duration-700">
                            <p className="text-sm uppercase tracking-[0.3em] font-semibold opacity-90">Collection</p>
                            <h1 className="text-5xl md:text-7xl font-display font-bold capitalize">{category?.name || slug?.replace("-", " ")}</h1>
                            {category?.discount && (
                                <p className="text-xl font-display italic text-primary-foreground/90">{category.discount}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-16">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-display font-bold">Divine Fragrances</h2>
                            <p className="text-muted-foreground mt-2">Explore our premium selection of {category?.name || slug?.replace("-", " ")}</p>
                        </div>
                        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">{products?.length || 0} Products</p>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-pulse text-muted-foreground">Lighting the incense...</div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
                            {products?.map((product: any) => (
                                <ProductCard key={product._id} product={{
                                    ...product,
                                    salePrice: product.salePrice.toString(),
                                    regularPrice: product.regularPrice?.toString()
                                }} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CategoryPage;
