import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Package, Truck, CheckCircle, Clock, Search, ChevronRight, User, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

const AdminOrders = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const queryClient = useQueryClient();
    const token = localStorage.getItem("admin-token");

    const { data: orders, isLoading } = useQuery({
        queryKey: ["admin-orders"],
        queryFn: async () => {
            const response = await fetch("/api/admin/orders", {
                headers: { "x-auth-token": token || "" },
            });
            return response.json();
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const response = await fetch(`/api/admin/orders/${id}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": token || "",
                },
                body: JSON.stringify({ status }),
            });
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
            toast.success("Order status updated");
        },
    });

    const filteredOrders = orders?.filter((order: any) => 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <div className="p-12 text-center">Loading orders...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold font-display">Manage Orders</h1>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by ID, Name or Email..."
                        className="w-full pl-10 pr-4 py-2 border rounded-xl bg-background"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-6">
                {filteredOrders?.map((order: any) => (
                    <div key={order._id} className="bg-background border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        {/* Order Header */}
                        <div className="p-6 bg-muted/30 border-b flex flex-wrap justify-between items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                    <Package size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Order ID</p>
                                    <p className="font-mono font-bold">#{order._id.toString().slice(-8).toUpperCase()}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Amount</p>
                                    <p className="text-xl font-bold text-primary">₹ {order.totalAmount}</p>
                                </div>
                                <select 
                                    className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-colors cursor-pointer
                                        ${order.orderStatus === 'delivered' ? 'bg-green-50 border-green-200 text-green-700' : 
                                          order.orderStatus === 'shipped' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                          'bg-yellow-50 border-yellow-200 text-yellow-700'}`}
                                    value={order.orderStatus}
                                    onChange={(e) => updateStatusMutation.mutate({ id: order._id, status: e.target.value })}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        {/* Order Content */}
                        <div className="p-6 grid md:grid-cols-3 gap-8">
                            {/* Customer Details */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b pb-2">Customer</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm">
                                        <User size={16} className="text-primary" />
                                        <span className="font-medium">{order.user?.name || 'Guest User'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm italic">
                                        <Truck size={16} className="text-primary" />
                                        <span>{order.user?.email || 'No Email'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone size={16} className="text-primary" />
                                        <span>{order.shippingAddress.phone}</span>
                                    </div>
                                    <div className="flex items-start gap-3 text-sm">
                                        <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                                        <p>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.pincode}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="md:col-span-2 space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b pb-2">Ordered Items</h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {order.items.map((item: any, i: number) => (
                                        <div key={i} className="flex gap-4 p-3 bg-muted/20 rounded-xl border">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                                                <img src={`${item.image}`} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-sm truncate">{item.name}</p>
                                                <p className="text-xs text-muted-foreground">{item.quantity} x ₹ {item.price}</p>
                                                <p className="text-xs font-bold text-primary mt-1">Total: ₹ {item.quantity * item.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="px-6 py-3 bg-muted/10 border-t flex justify-between items-center">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                                Payment ID: <span className="font-mono select-all">{order.razorpayPaymentId || 'N/A'}</span>
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                                Ordered on: <span className="font-bold">{new Date(order.createdAt).toLocaleString()}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            
            {!filteredOrders?.length && (
                <div className="text-center py-20 bg-background border border-dashed rounded-3xl">
                    <p className="text-muted-foreground font-display text-lg italic">No orders found matching your search.</p>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
