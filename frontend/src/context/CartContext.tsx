import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
    _id: string;
    name: string;
    slug: string;
    image: string;
    salePrice: number;
    quantity: number;
    variant?: string;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: any, quantity?: number, variant?: string) => void;
    updateQuantity: (productId: string, quantity: number, variant?: string) => void;
    removeFromCart: (productId: string, variant?: string) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    // Load cart from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('valli-vilas-cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart from localStorage", e);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('valli-vilas-cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: any, quantity: number = 1, variant?: string) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item =>
                item._id === product._id && item.variant === variant
            );
            if (existingItem) {
                return prevCart.map(item =>
                    (item._id === product._id && item.variant === variant)
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                ).filter(item => item.quantity > 0);
            }
            if (quantity <= 0) return prevCart;
            return [...prevCart, {
                _id: product._id,
                name: product.name,
                slug: product.slug,
                image: product.image,
                salePrice: Number(product.salePrice),
                quantity,
                variant
            }];
        });
    };

    const updateQuantity = (productId: string, delta: number, variant?: string) => {
        setCart(prevCart =>
            prevCart.map(item =>
                (item._id === productId && item.variant === variant)
                    ? { ...item, quantity: Math.max(0, item.quantity + delta) }
                    : item
            ).filter(item => item.quantity > 0)
        );
    };

    const removeFromCart = (productId: string, variant?: string) => {
        setCart(prevCart => prevCart.filter(item => !(item._id === productId && item.variant === variant)));
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => total + (item.salePrice * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, cartCount, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
