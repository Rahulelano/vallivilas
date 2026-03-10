import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

const CustomerLogin = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1); // 1: Email, 2: OTP
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch("/api/customer/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            if (response.ok) {
                setStep(2);
                toast.success("OTP sent to your email!");
            } else {
                const data = await response.json();
                toast.error(data.msg || "Failed to send OTP");
            }
        } catch (err) {
            toast.error("Error connecting to server");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch("/api/customer/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("customer-token", data.token);
                localStorage.setItem("customer-user", JSON.stringify(data.user));
                toast.success(`Welcome back, ${data.user.name}!`);
                navigate("/dashboard");
            } else {
                toast.error(data.msg || "Invalid OTP");
            }
        } catch (err) {
            toast.error("Error connecting to server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-card border rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
                    <div className="bg-primary p-8 text-primary-foreground text-center">
                        <h1 className="text-3xl font-display font-bold">Valli Vilas</h1>
                        <p className="text-sm opacity-90 uppercase tracking-widest mt-1">Fragrance of God</p>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold">
                                {step === 1 ? "Customer Login" : "Verify OTP"}
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                {step === 1
                                    ? "Enter your email to receive a login code"
                                    : `Enter the 6-digit code sent to ${email}`}
                            </p>
                        </div>

                        {step === 1 ? (
                            <form onSubmit={handleSendOtp} className="space-y-4">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-muted-foreground" size={20} />
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-10 p-3 bg-muted/30 border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <button
                                    disabled={loading}
                                    className="w-full btn-primary py-3 flex items-center justify-center gap-2 group"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : (
                                        <>
                                            Send OTP <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOtp} className="space-y-4">
                                <div className="relative">
                                    <ShieldCheck className="absolute left-3 top-3 text-muted-foreground" size={20} />
                                    <input
                                        type="text"
                                        required
                                        maxLength={6}
                                        className="w-full pl-10 p-3 bg-muted/30 border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all tracking-[0.5em] font-bold text-center text-xl"
                                        placeholder="123456"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </div>
                                <button
                                    disabled={loading}
                                    className="w-full btn-primary py-3 flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : "Verify & Login"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Wrong email? Go back
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CustomerLogin;
