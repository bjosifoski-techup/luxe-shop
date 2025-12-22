'use client';

import { useState, useEffect } from 'react';
import { X, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getCart, removeFromCart, getCartTotal } from '@/lib/cart';
import { CartItem as CartItemType } from '@/lib/supabase/types';
import Link from 'next/link';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const [cart, setCart] = useState<CartItemType[]>([]);

  useEffect(() => {
    updateCart();

    const handleCartUpdate = () => {
      updateCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const updateCart = () => {
    setCart(getCart());
  };

  const handleRemoveItem = (productId: string, variant?: Record<string, string>) => {
    removeFromCart(productId, variant);
    updateCart();
  };

  const subtotal = getCartTotal(cart);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
              <span className="text-sm text-gray-500">({cart.length})</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Add some items to get started
              </p>
              <Button onClick={onClose} asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <div
                      key={`${item.product.id}-${index}`}
                      className="flex gap-4 pb-4 border-b last:border-0"
                    >
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                        <img
                          src={
                            item.product.images && Array.isArray(item.product.images) && item.product.images.length > 0
                              ? (item.product.images[0] as string)
                              : '/placeholder-product.jpg'
                          }
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-sm font-medium line-clamp-1">
                              {item.product.name}
                            </h3>
                            {item.variant && Object.keys(item.variant).length > 0 && (
                              <p className="text-xs text-gray-500 mt-1">
                                {Object.entries(item.variant)
                                  .map(([key, value]) => `${key}: ${value}`)
                                  .join(', ')}
                              </p>
                            )}
                            <p className="text-sm text-gray-500 mt-1">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <p className="text-sm font-semibold">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 mt-2"
                              onClick={() => handleRemoveItem(item.product.id, item.variant)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="border-t p-4 space-y-4">
                <div className="flex justify-between text-base font-medium">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-500">
                  Shipping calculated at checkout
                </p>
                <div className="space-y-2">
                  <Button className="w-full" size="lg" asChild>
                    <Link href="/checkout" onClick={onClose}>
                      Checkout
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    asChild
                  >
                    <Link href="/cart" onClick={onClose}>
                      View Shopping Cart
                    </Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
