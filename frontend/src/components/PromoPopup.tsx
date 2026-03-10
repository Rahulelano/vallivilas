import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getImgUrl } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

const PromoPopup = () => {
    const [isOpen, setIsOpen] = useState(false);

    const { data: popup, isLoading } = useQuery({
        queryKey: ["promo-popup"],
        queryFn: async () => {
            const response = await fetch("/api/promo-popup");
            return response.json();
        }
    });

    useEffect(() => {
        if (popup && popup.image) {
            const hasSeenPopup = sessionStorage.getItem("hasSeenPromoPopup");
            
            if (popup.showAlways || !hasSeenPopup) {
                const timer = setTimeout(() => {
                    setIsOpen(true);
                }, 2000); // Show after 2 seconds
                return () => clearTimeout(timer);
            }
        }
    }, [popup]);

    const handleClose = () => {
        setIsOpen(false);
        sessionStorage.setItem("hasSeenPromoPopup", "true");
    };

    if (isLoading || !popup || !popup.image) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative max-w-lg w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                        
                        <a href={popup.link || "#"} onClick={handleClose}>
                            <img
                                src={getImgUrl(popup.image)}
                                alt="Special Offer"
                                className="w-full h-auto object-cover"
                            />
                        </a>
                        
                        <div className="p-6 text-center">
                            <button
                                onClick={handleClose}
                                className="w-full btn-primary py-3 rounded-xl font-bold uppercase tracking-wider"
                            >
                                Shop Now
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PromoPopup;
