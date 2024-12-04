"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductById } from "@/services/productService";
import { Product } from "@/app/types/Product";
import { AlertCircle } from "lucide-react";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
      <div className="container mx-auto p-4 space-y-6">
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
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-semibold text-center text-gray-900 dark:text-gray-100">Loading...</h1>
        <p className="text-center text-gray-500 dark:text-gray-400">
          Please wait while we load the product details.
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-4 space-y-6">
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
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-semibold text-center text-gray-900 dark:text-gray-100">
        Product Details
      </h1>
      <div className="flex flex-col md:flex-row items-start justify-center gap-8">
        
        <img
          src={getImageFromBase64(product.imageData)}
          alt={product.name}
          className="w-72 h-auto object-cover rounded-md shadow-md mb-6 md:mb-0"
        />
        <div className="flex flex-col items-center md:items-start w-full md:w-[60%]">
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            <strong>{product.name}</strong>
          </p>

          <p className="text-lg font-semibold text-green-600 dark:text-green-400 mt-4">
            ${product.price}
          </p>

          {product.category && (
            <p className="text-md bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300 mt-2 px-4 py-1 rounded-full inline-block">
              {product.category}
            </p>
          )}

          <p className="text-md text-gray-700 dark:text-gray-300 mt-2">{product.description}</p>

          <button
            className="mt-6 bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 transition dark:bg-blue-600 dark:hover:bg-blue-700"
            onClick={() => console.log("Add to Cart")}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
