import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('pizza_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('pizza_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (pizza) => {
    setCart((prevCart) => {
      // Check if exact same pizza configuration already exists in cart
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.base === pizza.base &&
          item.sauce === pizza.sauce &&
          item.cheese === pizza.cheese &&
          JSON.stringify(item.vegetables.sort()) === JSON.stringify(pizza.vegetables.sort())
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += pizza.quantity || 1;
        return newCart;
      }

      return [...prevCart, { ...pizza, quantity: pizza.quantity || 1 }];
    });
  };

  const removeFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, quantity) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart((prevCart) => {
      const newCart = [...prevCart];
      newCart[index].quantity = quantity;
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // Mathematical pricing calculations
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.05; // 5% GST
  const deliveryFee = subtotal > 500 || subtotal === 0 ? 0 : 50; // Free delivery over ₹500
  const totalAmount = subtotal + tax + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        tax,
        deliveryFee,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
