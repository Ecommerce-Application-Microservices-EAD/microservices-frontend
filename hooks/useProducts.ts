import { useState, useEffect } from "react";
import { getAllProducts, addProduct, updateProductF, deleteProduct } from "@/services/productService";
import { Product } from "@/app/types/Product";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[] | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  const addProductHandler = async (formData: Product) => {
    const newProduct = await addProduct(formData);
    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProductHandler = async (updatedProduct: Product) => {
    const updatedData = await updateProductF(updatedProduct.id, updatedProduct);
    setProducts((prev) =>
      prev.map((product) =>
        product.id === updatedProduct.id ? updatedData : product
      )
    );
  };

  const deleteProductHandler = async (id: number) => {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  return {
    products,
    searchResults,
    addProduct: addProductHandler,
    updateProduct: updateProductHandler,
    deleteProduct: deleteProductHandler,
    handleSearchResults: setSearchResults,
  };
};
