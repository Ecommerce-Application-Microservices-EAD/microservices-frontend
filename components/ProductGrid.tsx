import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, AlertCircle } from "lucide-react";
import { Product } from "@/app/types/Product";
import { getAllProducts } from "@/services/productService";

export default function ProductGrid({ products }: { products: Product[] | null }) {
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (products) {
      setLocalProducts(products);
    } else {
      const fetchProducts = async () => {
        try {
          const data = await getAllProducts();
          setLocalProducts(data);
        } catch (err) {
          setError("Error fetching products. Please try again later.");
        }
      };
      fetchProducts();
    }
  }, [products]);

  const getImageFromBase64 = (base64String: string) => {
    return `data:image/png;base64,${base64String}`;
  };

  if (error) {
    return (
      <div className="text-center mt-8">
        <div className="text-red-600 flex items-center justify-center dark:text-red-400">
          <AlertCircle className="mr-2 h-6 w-6" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (localProducts.length === 0) {
    return (
      <div className="text-center mt-8">
        <p className="text-gray-500 dark:text-gray-400">No products available. Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {localProducts.map((product) => (
        <Card
          key={product.id}
          className="flex flex-col cursor-pointer"
          onClick={() => router.push(`/products/${product.id}`)}
        >
          <CardContent className="p-4">
            <img
              src={getImageFromBase64(product.imageData)}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{product.name}</h3>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">${product.price}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{product.category}</p>
            {product.stock === 0 && (
              <p className="text-sm text-red-600 dark:text-red-400 font-semibold mt-2">Out of Stock</p>
            )}
          </CardContent>
          <CardFooter className="mt-auto">
            <Button
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product.id);
              }}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
