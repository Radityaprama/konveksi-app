import { useState, useEffect } from 'react';
import CartContext from '../hooks/useCart';

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('konveksi-cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('konveksi-cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item =>
                (item._id && item._id === product._id) || (item.id && item.id === product.id)
            );
            if (existingItem) {
                return prevItems.map(item =>
                    ((item._id && item._id === product._id) || (item.id && item.id === product.id))
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });

        triggerCartAnimation();
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item =>
            item.id !== productId && item._id !== productId
        ));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCartItems(prevItems =>
            prevItems.map(item =>
                (item.id === productId || item._id === productId) ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getTotalItems = () => {
        return cartItems.reduce((sum, item) => sum + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const triggerCartAnimation = () => {
        const cartIcon = document.getElementById('cart-icon');
        if (cartIcon) {
            cartIcon.animate([
                { transform: 'scale(1)' },
                { transform: 'scale(1.3)' },
                { transform: 'scale(1)' }
            ], {
                duration: 300,
                easing: 'ease-in-out'
            });
        }
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getTotalItems,
            getTotalPrice
        }}>
            {children}
        </CartContext.Provider>
    );
};
