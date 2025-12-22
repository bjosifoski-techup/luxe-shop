'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/lib/supabase/types';
import { Button } from '@/components/ui/button';
import { updateCartItemQuantity, removeFromCart } from '@/lib/cart';
import { useState } from 'react';

interface CartItemProps {
  item: CartItemType;
  onUpdate: () => void;
}

export default function CartItem({ item, onUpdate }: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const images = Array.isArray(item.product.images) ? item.product.images : [];
  const mainImage = images[0] || 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400';

  const handleUpdateQuantity = (newQuantity: number) => {
    setIsUpdating(true);
    updateCartItemQuantity(item.product.id, newQuantity, item.variant);
    window.dispatchEvent(new Event('cartUpdated'));
    onUpdate();
    setIsUpdating(false);
  };

  const handleRemove = () => {
    setIsUpdating(true);
    removeFromCart(item.product.id, item.variant);
    window.dispatchEvent(new Event('cartUpdated'));
    onUpdate();
    setIsUpdating(false);
  };

  return (
    <div className="flex gap-4 py-4 border-b">
      <Link href={`/products/${item.product.slug}`} className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
        <Image
          src={mainImage as string}
          alt={item.product.name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </Link>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/products/${item.product.slug}`}>
            <h3 className="font-semibold hover:underline">{item.product.name}</h3>
          </Link>
          {item.variant && Object.keys(item.variant).length > 0 && (
            <p className="text-sm text-gray-600">
              {Object.entries(item.variant).map(([key, value]) => (
                <span key={key} className="capitalize">
                  {key}: {value}
                </span>
              ))}
            </p>
          )}
          <p className="text-lg font-bold mt-1">${item.product.price.toFixed(2)}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleUpdateQuantity(item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleUpdateQuantity(item.quantity + 1)}
              disabled={isUpdating || item.quantity >= item.product.stock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            disabled={isUpdating}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="text-right">
        <p className="font-bold text-lg">
          ${(item.product.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
