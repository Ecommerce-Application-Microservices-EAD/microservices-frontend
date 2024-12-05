"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductById } from "@/services/productService";
import { Product } from "@/app/types/Product";
import { useCart } from "@/lib/CartContext";
import { AlertCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const fetchedProduct = await getProductById(id as string);
        setProduct(fetchedProduct);
        setError(null);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const getImageFromBase64 = (base64String: string) => {
    return `data:image/png;base64,${base64String}`;
  };

  if (error) {
    return (
      <div className="container mx-auto px-6 space-y-6">
        <h1 className="text-3xl font-semibold text-center text-red-600 dark:text-red-400">
          <AlertCircle className="inline-block mr-2 h-6 w-6" />
          Error
        </h1>
        <p className="text-center text-lg text-red-500 dark:text-red-300">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-6 space-y-6">
        <h1 className="text-3xl font-semibold text-center text-gray-900 dark:text-gray-100">Loading...</h1>
        <p className="text-center text-gray-500 dark:text-gray-400">
          Please wait while we load the product details.
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-6 space-y-6">
        <h1 className="text-3xl font-semibold text-center text-gray-900 dark:text-gray-100">
          Product Not Found
        </h1>
        <p className="text-center text-lg text-gray-500 dark:text-gray-400">
          The product you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden mt-6 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start p-6 space-y-6 md:space-y-0 md:space-x-8">
          <img
            src={getImageFromBase64(product.imageData)}
            alt={product.name}
            className="w-full md:w-1/3 h-auto object-contain rounded-md"
          />
  
          <div className="flex flex-col w-full md:w-2/3 space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{product.name}</h1>
            {product.category && (
              <span className="self-start text-sm bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300 px-4 py-1 rounded-full">
                {product.category}
              </span>
            )}
            <p className="text-md text-gray-700 dark:text-gray-300">{product.description}</p>
            {product.stock === 0 ? (
              <div className="px-4 py-3 bg-red-50 dark:bg-red-900/50 text-sm text-red-700 dark:text-red-300 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                <strong>Out of Stock:</strong> This product is currently unavailable. Check back later!
              </div>
            ) : (
              <div className="px-4 py-3 bg-green-100 dark:bg-green-900 text-sm text-green-700 dark:text-green-400 rounded-lg flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-green-600 dark:text-green-400" />
                <strong>In Stock:</strong> This product is ready to ship. Get one now!
              </div>
            )}
            <div className="flex items-center">
              <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                ${product.price}
              </p>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product.id);
                }}
                disabled={product.stock === 0}
                className="flex items-center ml-10"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default ProductPage;
