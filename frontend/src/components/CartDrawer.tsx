import { ShoppingBag, Trash, Plus, Minus, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from "@/components/ui/sheet";
import { getImgUrl } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const CartDrawer = ({ children }: { children: React.ReactNode }) => {
    const { cart, cartCount, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
    const navigate = useNavigate();

    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-background">
                <SheetHeader className="pb-4 border-b">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-2xl font-display flex items-center gap-2">
                            <ShoppingBag className="text-primary" />
                            Your Basket ({cartCount})
                        </SheetTitle>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-6">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                            <ShoppingBag size={64} className="text-muted/30" />
                            <div className="space-y-2">
                                <p className="text-xl font-display font-semibold">Your basket is empty</p>
                                <p className="text-muted-foreground text-sm">Add some Fragrance of God to your life!</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {cart.map((item) => (
                                <div key={item._id} className="flex gap-4 group animate-in slide-in-from-right duration-300">
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-muted bg-muted">
                                        <img
                                            src={getImgUrl(item.image)}
                                            alt={item.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between text-base font-semibold">
                                                <h3 className="line-clamp-1">{item.name}</h3>
                                                <p className="ml-4 text-primary">₹ {item.salePrice * item.quantity}</p>
                                            </div>
                                            <p className="mt-0.5 text-sm text-muted-foreground">
                                                ₹ {item.salePrice} each {item.variant && <span className="text-primary/70 font-medium whitespace-nowrap"> • {item.variant}</span>}
                                            </p>
                                        </div>
                                        <div className="flex flex-1 items-end justify-between text-sm">
                                            <div className="flex items-center border rounded-md">
                                                <button
                                                    onClick={() => updateQuantity(item._id, -1, item.variant)}
                                                    className="p-1 hover:text-primary transition-colors"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="px-3 font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, 1, item.variant)}
                                                    className="p-1 hover:text-primary transition-colors"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    removeFromCart(item._id, item.variant);
                                                    toast.error(`${item.name}${item.variant ? ` (${item.variant})` : ''} removed from basket`);
                                                }}
                                                className="text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                                            >
                                                <Trash size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cart.length > 0 && (
                    <SheetFooter className="border-t pt-6 space-y-4">
                        <div className="flex justify-between text-xl font-bold w-full">
                            <span>Total Address</span>
                            <span className="text-primary">₹ {cartTotal}</span>
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                            Shipping and taxes calculated at checkout.
                        </p>
                        <div className="grid grid-cols-2 gap-4 w-full">
                            <button
                                onClick={() => {
                                    clearCart();
                                    toast.success("Basket cleared");
                                }}
                                className="btn-outline-primary py-3 flex items-center justify-center gap-2"
                            >
                                Clear
                            </button>
                            <button
                                className="btn-primary py-3 flex items-center justify-center gap-2"
                                onClick={() => navigate("/checkout")}
                            >
                                Checkout
                            </button>
                        </div>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
};
