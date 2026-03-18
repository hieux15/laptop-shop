'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { getCartAction, addToCartAction, updateCartAction, removeFromCartAction, clearCartAction } from '@/app/actions/cart';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasFetchedRef = useRef(false);
  const userId = session?.user?.id;

  // 1. Load localStorage lúc mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) setCartItems(JSON.parse(savedCart));
    } catch (e) {
      console.error('Error loading cart:', e);
    }
    setIsLoaded(true);
  }, []);

  // 2. Sync DB khi login/logout
  useEffect(() => {
    if (!isLoaded || status === 'loading') return;

    const fetchDBCart = async () => {
      if (status === 'authenticated' && userId && !hasFetchedRef.current) {
        hasFetchedRef.current = true;
        const result = await getCartAction();

        if (result.success) {
          const localCart = JSON.parse(localStorage.getItem('cart') || '[]');

          if (localCart.length === 0) {
            // Không có local → dùng DB
            setCartItems(result.items);
          } else {
            // Có local → xóa DB cũ, lưu local vào DB
            await clearCartAction();
            for (const item of localCart) {
              await addToCartAction(item.id, item.quantity);
            }
            setCartItems(localCart);
          }

          localStorage.removeItem('cart');
        } else {
          hasFetchedRef.current = false;
        }
      } else if (status === 'unauthenticated') {
        if (hasFetchedRef.current) {
          hasFetchedRef.current = false;
          setCartItems([]);
          localStorage.removeItem('cart');
        }
      }
    };

    fetchDBCart();
  }, [status, userId, isLoaded]);

  // 3. Save localStorage — CHỈ khi unauthenticated
  const isUnauthenticated = status === 'unauthenticated';
  useEffect(() => {
    if (!isLoaded || !isUnauthenticated) return;
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [cartItems, isLoaded, isUnauthenticated]);

  const addToCart = async (product, quantity = 1) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    setCartItems(prev => {
      const found = prev.find(item => item.id === product.id);
      if (found) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: found.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });

    if (status === 'authenticated') {
      await addToCartAction(product.id, quantity);
    }

    if (existingItem) {
      toast.success(`Đã cập nhật "${product.name}" (${existingItem.quantity + quantity} sản phẩm)`);
    } else {
      toast.success(`Đã thêm "${product.name}" vào giỏ hàng`);
    }
  };

  const updateQuantity = async (id, delta) => {
    let newQty = 1;
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
    if (status === 'authenticated') {
      await updateCartAction(id, newQty);
    }
  };

  const removeFromCart = async (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    if (status === 'authenticated') {
      await removeFromCartAction(id);
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    if (status === 'authenticated') {
      await clearCartAction();
    }
  };

  const getTotalItems = () => cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const getSubtotal = () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isInCart = (id) => cartItems.some(item => item.id === id);

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, updateQuantity, removeFromCart,
      clearCart, getTotalItems, getSubtotal, isInCart, isLoaded
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error('useCart must be used within a CartProvider');
  return context;
}