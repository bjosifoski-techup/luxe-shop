'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/supabase/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, ChevronLeft } from 'lucide-react';
import { addToCart } from '@/lib/cart';
import { useToast } from '@/hooks/use-toast';
import ProductGrid from '@/components/product-grid';
import { ProductImageGallery } from '@/components/product-image-gallery';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const images = Array.isArray(product.images) ? product.images : [];
  const productImages: string[] = images.length > 0
    ? (images as string[])
    : ['https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1200'];

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast({
        title: 'Out of Stock',
        description: 'This product is currently unavailable',
        variant: 'destructive',
      });
      return;
    }

    addToCart(product, quantity);
    window.dispatchEvent(new Event('cartUpdated'));

    toast({
      title: 'Added to cart',
      description: `${quantity} × ${product.name}`,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.back()}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <ProductImageGallery
          images={productImages}
          productName={product.name}
          isOutOfStock={product.stock === 0}
        />

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
          </div>

          {product.description && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold mb-2">Stock Status</h2>
            {product.stock > 0 ? (
              <Badge variant="default">{product.stock} in stock</Badge>
            ) : (
              <Badge variant="secondary">Out of stock</Badge>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="font-medium">Quantity:</label>
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2 border-x">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-2 hover:bg-gray-100"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="flex-1 gap-2"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                Buy Now
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="border-t pt-6 space-y-2 text-sm text-gray-600">
            <p>✓ Free shipping on orders over $500</p>
            <p>✓ 30-day return policy</p>
            <p>✓ 2-year warranty included</p>
            <p>✓ Secure payment processing</p>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold mb-8">You May Also Like</h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
}
