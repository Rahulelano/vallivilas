import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, ChevronRight, Truck, ShieldCheck, CreditCard } from "lucide-react";
import { getImgUrl } from "@/lib/utils";

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
    });

    useEffect(() => {
        if (cart.length === 0) {
            navigate("/");
            toast.error("Your basket is empty!");
        }
    }, [cart, navigate]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await loadRazorpay();
        if (!res) {
            toast.error("Razorpay SDK failed to load. Are you online?");
            setLoading(false);
            return;
        }

        try {
            // 1. Create Order on Backend
            const orderRes = await fetch("/api/payment/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: cartTotal,
                    currency: "INR",
                    receipt: `receipt_${Date.now()}`
                })
            });
            const orderData = await orderRes.json();

            // 2. Open Razorpay Modal
            const options = {
                key: "rzp_live_SKf7AMP1YVCk96", // Using live key from .env
                amount: orderData.amount,
                currency: "INR",
                name: "Valli Vilas",
                description: "Transaction for Fragrance of God",
                order_id: orderData.id,
                handler: async (response: any) => {
                    // 3. Verify Payment and Save Order
                    try {
                        const verifyRes = await fetch("/api/payment/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(response)
                        });
                        const verifyData = await verifyRes.json();

                        if (verifyData.status === "success") {
                            // Save Order to DB (using a guest user ID for now or placeholder)
                            await fetch("/api/orders", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    user: "65e8a1b2c3d4e5f6a7b8c9d0", // Guest placeholder
                                    items: cart.map(item => ({
                                        product: item._id,
                                        quantity: item.quantity,
                                        price: item.salePrice,
                                        name: item.name,
                                        image: item.image,
                                        variant: item.variant
                                    })),
                                    totalAmount: cartTotal,
                                    shippingAddress: formData,
                                    razorpayOrderId: response.razorpay_order_id,
                                    razorpayPaymentId: response.razorpay_payment_id,
                                    razorpaySignature: response.razorpay_signature
                                })
                            });

                            clearCart();
                            toast.success("Order placed successfully!");
                            navigate("/");
                        }
                    } catch (error) {
                        console.error("Verification error:", error);
                        toast.error("Payment verification failed.");
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: { color: "#8B4513" }
            };

            const rzp = (window as any).Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Payment error:", error);
            toast.error("Could not initiate payment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-12 max-w-6xl">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                    <span>Basket</span>
                    <ChevronRight size={14} />
                    <span className="text-foreground font-semibold">Checkout</span>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Shipping Form */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-display font-bold mb-6">Shipping Details</h1>
                            <form id="checkout-form" onSubmit={handlePayment} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Full Name</label>
                                        <input required name="name" value={formData.name} onChange={handleInput} className="w-full p-3 bg-muted/30 border rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Email Address</label>
                                        <input required name="email" type="email" value={formData.email} onChange={handleInput} className="w-full p-3 bg-muted/30 border rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="john@example.com" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Phone Number</label>
                                    <input required name="phone" value={formData.phone} onChange={handleInput} className="w-full p-3 bg-muted/30 border rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="+91 99999 99999" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Street Address</label>
                                    <input required name="street" value={formData.street} onChange={handleInput} className="w-full p-3 bg-muted/30 border rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="123 Temple Street" />
                                </div>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">City</label>
                                        <input required name="city" value={formData.city} onChange={handleInput} className="w-full p-3 bg-muted/30 border rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="Chennai" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">State</label>
                                        <input required name="state" value={formData.state} onChange={handleInput} className="w-full p-3 bg-muted/30 border rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="Tamil Nadu" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Zip Code</label>
                                        <input required name="zipCode" value={formData.zipCode} onChange={handleInput} className="w-full p-3 bg-muted/30 border rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="600001" />
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 border rounded-xl flex items-center gap-3">
                                <Truck className="text-primary" />
                                <div>
                                    <p className="text-xs font-bold">Standard Delivery</p>
                                    <p className="text-[10px] text-muted-foreground">Arrives in 3-5 days</p>
                                </div>
                            </div>
                            <div className="p-4 border rounded-xl flex items-center gap-3">
                                <ShieldCheck className="text-primary" />
                                <div>
                                    <p className="text-xs font-bold">Secure Payment</p>
                                    <p className="text-[10px] text-muted-foreground">SSL Encrypted</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-muted/30 p-8 rounded-2xl h-fit sticky top-24">
                        <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                            <ShoppingBag size={20} className="text-primary" />
                            Order Summary
                        </h2>

                        <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
                            {cart.map((item) => (
                                <div key={item._id} className="flex justify-between items-center gap-4">
                                    <div className="flex items-center gap-3">
                                        <img src={getImgUrl(item.image)} className="w-12 h-12 object-cover rounded-md" alt={item.name} />
                                        <div>
                                            <p className="text-sm font-semibold line-clamp-1">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Qty: {item.quantity} {item.variant && <span className="font-medium">• {item.variant}</span>}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-bold">₹ {item.salePrice * item.quantity}</p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span>₹ {cartTotal}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Shipping</span>
                                <span className="text-green-600 font-semibold">Free</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold pt-2 border-t mt-4">
                                <span>Total</span>
                                <span className="text-primary">₹ {cartTotal}</span>
                            </div>
                        </div>

                        <button
                            form="checkout-form"
                            disabled={loading}
                            className="w-full btn-primary py-4 mt-8 flex items-center justify-center gap-2 text-lg disabled:opacity-50"
                        >
                            {loading ? "Processing..." : (
                                <>
                                    <CreditCard size={20} /> Pay Now
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Checkout;
