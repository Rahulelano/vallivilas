import { Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { getImgUrl } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface Product {
  _id: string;
  name: string;
  slug: string;
  image: string;
  salePrice: string;
  regularPrice?: string;
  discount?: string;
  rating?: string;
  reviews?: string;
  hot?: boolean;
}

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} blessed your basket!`);
  };

  return (
    <Link to={`/product/${product.slug}`} className="block">
      <div className="product-card group flex-shrink-0 w-[260px] md:w-[280px]">
        <div className="relative overflow-hidden">
          <img
            src={getImgUrl(product.image)}
            alt={product.name}
            className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.discount && <span className="badge-discount">{product.discount}</span>}
            {product.hot && <span className="badge-hot">Hot Selling</span>}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-body font-semibold text-sm text-foreground line-clamp-2 mb-2 min-h-[40px]">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-primary font-bold">₹ {product.salePrice}</span>
            {product.regularPrice && (
              <span className="text-muted-foreground line-through text-sm">₹ {product.regularPrice}</span>
            )}
          </div>
          {product.rating && (
            <div className="flex items-center gap-1 mb-3 text-gold">
              <Star size={14} fill="currentColor" />
              <span className="text-xs font-medium">{product.rating}</span>
              {product.reviews && (
                <span className="text-muted-foreground text-xs">({product.reviews} reviews)</span>
              )}
            </div>
          )}
          <p className="text-muted-foreground text-xs mb-3">(Inclusive of all taxes)</p>
          <button
            onClick={handleAddToCart}
            className="w-full btn-primary flex items-center justify-center gap-2 text-sm py-2.5"
          >
            <ShoppingCart size={16} />
            Bless Your Basket
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
