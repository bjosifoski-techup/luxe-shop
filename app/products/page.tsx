import { Suspense } from 'react';
import ProductsContent from './products-content';
import { ProductGridSkeleton } from '@/components/loading-skeleton';

export const metadata = {
  title: 'Products - Luxe Furniture',
  description: 'Browse our collection of premium furniture for every room',
};

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">All Products</h1>
      <Suspense fallback={<ProductGridSkeleton count={12} />}>
        <ProductsContent />
      </Suspense>
    </div>
  );
}
