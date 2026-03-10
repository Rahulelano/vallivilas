import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Package, Clock, Truck, CheckCircle, ChevronRight, LogOut, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

const CustomerDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("customer-user");
        const token = localStorage.getItem("customer-token");

        if (!storedUser || !token) {
            navigate("/login");
            return;
        }

        const userData = JSON.parse(storedUser);
        setUser(userData);

        // Fetch orders
        fetch(`/api/orders/user/${userData.id}`)
            .then(res => res.json())
            .then(data => {
                setOrders(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching orders:", err);
                setLoading(false);
            });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("customer-token");
        localStorage.removeItem("customer-user");
        toast.success("Logged out successfully");
        navigate("/");
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock size={16} className="text-yellow-600" />;
            case 'processing': return <Package size={16} className="text-blue-600" />;
            case 'shipped': return <Truck size={16} className="text-purple-600" />;
            case 'delivered': return <CheckCircle size={16} className="text-green-600" />;
            default: return <Clock size={16} />;
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                    <div>
                        <h1 className="text-4xl font-display font-bold">Namaste, {user?.name}</h1>
                        <p className="text-muted-foreground mt-1 text-lg">Welcome to your Valli Vilas sanctuary.</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors border p-2 px-4 rounded-lg"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Quick Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                            <h2 className="font-display font-bold text-xl mb-4">Your Account</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Email</span>
                                    <span className="font-semibold">{user?.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Total Orders</span>
                                    <span className="font-semibold">{orders.length}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-muted/30 p-6 rounded-2xl border border-border">
                            <h2 className="font-display font-bold text-xl mb-4">Support</h2>
                            <p className="text-xs text-muted-foreground mb-4">Need help with an order? Contact our divine support team.</p>
                            <a href="mailto:support@vallivilas.com" className="text-primary font-bold text-sm hover:underline">support@vallivilas.com</a>
                        </div>
                    </div>

                    {/* Orders List */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
                            <ShoppingBag className="text-primary" />
                            Recent Orders
                        </h2>

                        {loading ? (
                            <div className="p-12 text-center text-muted-foreground">Lighting the lamps... (Loading orders)</div>
                        ) : orders.length === 0 ? (
                            <div className="bg-muted/30 p-12 rounded-2xl text-center space-y-4">
                                <Package size={48} className="mx-auto text-muted/30" />
                                <p className="text-lg font-display font-semibold">No orders yet</p>
                                <p className="text-sm text-muted-foreground">Enhance your space with our divine fragrances.</p>
                                <button onClick={() => navigate("/")} className="btn-primary py-2 px-6 mt-4">Start Shopping</button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order: any) => {
                                    const isExpanded = expandedOrder === order._id;
                                    return (
                                        <div key={order._id} className="bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                                            <div 
                                                className="p-6 cursor-pointer"
                                                onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                                            >
                                                <div className="flex flex-wrap justify-between items-center gap-4 border-b border-border/50 pb-4 mb-4">
                                                    <div className="space-y-1">
                                                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Order ID</p>
                                                        <p className="font-mono text-sm">#{order._id.toString().slice(-6).toUpperCase()}</p>
                                                    </div>
                                                    <div className="text-right space-y-1">
                                                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Date</p>
                                                        <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 capitalize
                                                        ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                        {getStatusIcon(order.orderStatus)}
                                                        {order.orderStatus}
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <div className="flex -space-x-3">
                                                        {order.items.slice(0, 3).map((item: any, i: number) => (
                                                            <div key={i} className="w-12 h-12 rounded-lg border-2 border-background overflow-hidden bg-muted">
                                                                <img src={item.image.startsWith('http') ? item.image : `${item.image}`} alt="" className="w-full h-full object-cover" />
                                                            </div>
                                                        ))}
                                                        {order.items.length > 3 && (
                                                            <div className="w-12 h-12 rounded-lg border-2 border-background bg-muted flex items-center justify-center text-xs font-bold">
                                                                +{order.items.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold text-primary">₹ {order.totalAmount}</p>
                                                        <p className="text-[10px] text-muted-foreground flex items-center justify-end gap-1 mt-1">
                                                            {isExpanded ? "Hide Details" : "View Details"} <ChevronRight size={10} className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Expanded Details */}
                                            {isExpanded && (
                                                <div className="px-6 pb-6 pt-2 border-t border-border/50 bg-muted/10 animate-in slide-in-from-top duration-300">
                                                    <div className="grid md:grid-cols-2 gap-8 mt-4">
                                                        <div className="space-y-4">
                                                            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Shipping Address</h4>
                                                            <div className="text-sm space-y-1 text-muted-foreground">
                                                                <p className="font-bold text-foreground">{order.shippingAddress.name}</p>
                                                                <p>{order.shippingAddress.address}</p>
                                                                <p>{order.shippingAddress.city} - {order.shippingAddress.pincode}</p>
                                                                <p>Phone: {order.shippingAddress.phone}</p>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-4">
                                                            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Items Ordered</h4>
                                                            <div className="space-y-3">
                                                                {order.items.map((item: any, i: number) => (
                                                                    <div key={i} className="flex justify-between text-sm">
                                                                        <span>{item.name} × {item.quantity}</span>
                                                                        <span className="font-bold">₹ {item.price * item.quantity}</span>
                                                                    </div>
                                                                ))}
                                                                <div className="border-t pt-2 flex justify-between font-bold text-primary">
                                                                    <span>Grand Total</span>
                                                                    <span>₹ {order.totalAmount}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CustomerDashboard;
