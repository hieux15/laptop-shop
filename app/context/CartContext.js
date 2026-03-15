'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('cart', JSON.stringify(cartItems));
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    }
  }, [cartItems, isLoaded]);

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    // Compute toast message outside of the state updater to avoid
    // causing component updates during render.
    const existingItem = cartItems.find(item => item.id === product.id);

    setCartItems(prev => {
      const found = prev.find(item => item.id === product.id);

      if (found) {
        const newQty = found.quantity + quantity;
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: newQty }
            : item
        );
      } else {
        return [...prev, { ...product, quantity }];
      }
    });

    // Call toast after scheduling the state update.
    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      toast.success(`Đã cập nhật "${product.name}" (${newQty} sản phẩm) vào giỏ hàng`);
    } else {
      toast.success(`Đã thêm "${product.name}" vào giỏ hàng`);
    }
  };

  // Update item quantity
  const updateQuantity = (id, delta) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Get total items count
  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Get subtotal
  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // Check if item is in cart
  const isInCart = (id) => {
    return cartItems.some(item => item.id === id);
  };

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalItems,
    getSubtotal,
    isInCart,
    isLoaded
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
