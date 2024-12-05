import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, AlertCircle, Plus, Minus } from "lucide-react";
import { Product } from "@/app/types/Product";
import { getAllProducts } from "@/services/productService";
import { addToCart } from "@/services/cartService";
import { useAuth } from "@/context/AuthProvider";

export default function ProductGrid({ products }: { products: Product[] | null }) {
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.userId;
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});


  useEffect(() => {
    if (products) {
      setLocalProducts(products);
      setQuantities(
        products.reduce((acc, product) => {
          acc[product.id.toString()] = 1;
          return acc;
        }, {} as { [key: string]: number })
      );
    } else {
      const fetchProducts = async () => {
        try {
          const data = await getAllProducts();
          setLocalProducts(data);
          setQuantities(
            data.reduce((acc: { [key: string]: number }, product: Product) => {
              acc[product.id.toString()] = 1; 
              return acc;
            }, {} as { [key: string]: number })
          );
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

  const handleAddToCart = async (product: Product) => {
    const quantity = quantities[product.id.toString()];
    if (quantity < 1) return;

    setIsLoading(true);
    try {
      const response = await addToCart(userId, product, quantity);
      console.log("Product added to cart:", response);
      alert(`${quantity} ${product.name}(s) have been added to your cart.`);
    } catch (err) {
      console.error(err);
      alert("Failed to add product to cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = (productId: string, amount: number) => {
    setQuantities((prev) => {
      const newQuantity = Math.max(1, (prev[productId] || 1) + amount);
      return { ...prev, [productId]: newQuantity };
    });
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

        {product.stock === 0 ? (
          <p className="text-sm text-red-600 dark:text-red-400 font-semibold mt-2 px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900">
            Out of Stock
          </p>
        ) : (
          <div className="flex items-center mt-4">
            <div
              className={`flex items-center space-x-2 px-2 py-1 rounded-full ${'border border-gray-300 dark:border-gray-700'}`}
            >
              <Button
                variant="ghost"
                size="sm"
                disabled={quantities[product.id.toString()] <= 1}
                onClick={(e) => {
                  e.stopPropagation();
                  updateQuantity(product.id.toString(), -1);
                }}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="px-4 text-sm">{quantities[product.id.toString()]}</span>
              <Button
                variant="ghost"
                size="sm"
                disabled={quantities[product.id.toString()] >= product.stock}
                onClick={(e) => {
                  e.stopPropagation();
                  updateQuantity(product.id.toString(), 1);
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          className="w-full"
          disabled={product.stock === 0 || isLoading}
          onClick={(e) => {
            e.stopPropagation(); 
            handleAddToCart(product);
          }}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isLoading ? "Adding..." : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  ))}
</div>


  );
}
