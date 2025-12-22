import { CartItem, Product } from './supabase/types';

const CART_KEY = 'furniture_cart';

export const getCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart: CartItem[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const addToCart = (product: Product, quantity: number = 1, variant?: Record<string, string>): CartItem[] => {
  const cart = getCart();
  const existingItemIndex = cart.findIndex(
    item => item.product.id === product.id && JSON.stringify(item.variant) === JSON.stringify(variant)
  );

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({ product, quantity, variant });
  }

  saveCart(cart);
  return cart;
};

export const removeFromCart = (productId: string, variant?: Record<string, string>): CartItem[] => {
  const cart = getCart();
  const filteredCart = cart.filter(
    item => !(item.product.id === productId && JSON.stringify(item.variant) === JSON.stringify(variant))
  );
  saveCart(filteredCart);
  return filteredCart;
};

export const updateCartItemQuantity = (productId: string, quantity: number, variant?: Record<string, string>): CartItem[] => {
  const cart = getCart();
  const itemIndex = cart.findIndex(
    item => item.product.id === productId && JSON.stringify(item.variant) === JSON.stringify(variant)
  );

  if (itemIndex > -1) {
    if (quantity <= 0) {
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = quantity;
    }
  }

  saveCart(cart);
  return cart;
};

export const clearCart = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CART_KEY);
};

export const getCartTotal = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
};

export const getCartItemCount = (cart: CartItem[]): number => {
  return cart.reduce((count, item) => count + item.quantity, 0);
};
