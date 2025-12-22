import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Product } from '@/lib/supabase/types';
import ProductDetailClient from './product-detail-client';

async function getProduct(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as Product;
}

async function getRelatedProducts(categoryId: string | null, currentProductId: string): Promise<Product[]> {
  if (!categoryId) return [];

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', categoryId)
    .neq('id', currentProductId)
    .limit(4);

  if (error || !data) {
    return [];
  }

  return data;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} - Luxe Furniture`,
    description: product.description || `Buy ${product.name} at Luxe Furniture`,
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.category_id, product.id);

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
