"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById } from "@/services/productService";
import { Product } from "@/app/types/Product";
import { AlertCircle, ShoppingCart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/services/cartService";
import { useAuth } from "@/context/AuthProvider";
import { Modal } from "@/components/modal";

const ProductPage = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const userId = user?.userId;

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

  const handleAddToCart = async () => {
    if (!userId) {
      setIsModalOpen(true);
      return;
    }

    if (quantity < 1) return;

    setIsLoading(true);
    try {
      const response = await addToCart(userId, product!, quantity);
      console.log("Product added to cart:", response);
      alert(`${quantity} ${product!.name}(s) have been added to your cart.`);
    } catch (err) {
      console.error(err);
      alert("Failed to add product to cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = (amount: number) => {
    setQuantity((prev) => Math.max(1, prev + amount));
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
    <>
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

              <div className="flex items-center mt-4">
                <div
                  className={`flex items-center space-x-4 px-2 py-1 rounded-full ${'border border-gray-300 dark:border-gray-700'
                    }`}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={product.stock === 0 || quantity <= 1}
                    onClick={() => updateQuantity(-1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={product.stock === 0 || quantity >= product.stock}
                    onClick={() => updateQuantity(1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center mt-6">
                <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  ${product.price}
                </p>
                <Button
                  className="flex items-center ml-10"
                  disabled={product.stock === 0 || isLoading}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {isLoading ? "Adding..." : "Add to Cart"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-lg font-semibold">Not Logged In</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          You need to be logged in to add items to your cart. Please log in to continue.
        </p>
        <div className="flex space-x-4 mt-4">
          <Button
            className="mt-4"
            onClick={() => router.push("/auth/login")}
          >
            Go to Login
          </Button>
          <Button
            variant="ghost"
            className="mt-4"
            onClick={() => setIsModalOpen(false)}
          >
            Go Back
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ProductPage;
