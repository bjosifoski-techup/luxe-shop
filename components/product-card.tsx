import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/supabase/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const images = Array.isArray(product.images) ? product.images : [];
  const mainImage = images[0] || 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800';

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <Image
              src={mainImage as string}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {product.stock === 0 && (
              <Badge className="absolute top-2 right-2" variant="secondary">
                Out of Stock
              </Badge>
            )}
            {product.featured && (
              <Badge className="absolute top-2 left-2" variant="default">
                Featured
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2 p-4">
          <h3 className="font-semibold text-lg line-clamp-1 w-full">{product.name}</h3>
          {product.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
          )}
          <div className="flex items-center justify-between w-full mt-2">
            <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
            <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              View Details
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
