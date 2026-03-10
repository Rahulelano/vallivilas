import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Image, List, ShoppingBag, Bell, LogOut, Instagram, Palette } from "lucide-react";

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("admin-token");
        navigate("/admin/login");
    };

    const menuItems = [
        { title: "Announcements", icon: Bell, path: "/admin/announcements" },
        { title: "Hero Slides", icon: Image, path: "/admin/hero-slides" },
        { title: "Categories", icon: List, path: "/admin/categories" },
        { title: "Promo Banners", icon: Image, path: "/admin/promo-banners" },
        { title: "Instagram Feed", icon: Instagram, path: "/admin/instagram" },
        { title: "Section Colors", icon: Palette, path: "/admin/appearance" },
        { title: "Footer Assets", icon: Image, path: "/admin/footer-assets" },
        { title: "Promo Popups", icon: Bell, path: "/admin/promo-popups" },
        { title: "Products", icon: ShoppingBag, path: "/admin/products" },
        { title: "Orders", icon: ShoppingBag, path: "/admin/orders" },
    ];

    return (
        <div className="flex min-h-screen bg-muted">
            {/* Sidebar */}
            <aside className="w-64 bg-background border-r p-6">
                <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                    <LayoutDashboard /> Admin Panel
                </h2>
                <nav className="space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.title}
                            onClick={() => navigate(item.path)}
                            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors text-left"
                        >
                            <item.icon size={20} />
                            {item.title}
                        </button>
                    ))}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors text-left mt-8"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {menuItems.map((item) => (
                        <button
                            key={item.title}
                            onClick={() => navigate(item.path)}
                            className="bg-background p-6 rounded-xl shadow-sm border hover:shadow-md hover:border-primary transition-all text-left group"
                        >
                            <item.icon size={32} className="text-primary mb-4 group-hover:scale-110 transition-transform" />
                            <h3 className="font-semibold text-lg">{item.title}</h3>
                            <p className="text-muted-foreground text-sm">Manage your site's {item.title.toLowerCase()}</p>
                        </button>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
