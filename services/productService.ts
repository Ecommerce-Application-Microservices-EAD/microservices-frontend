import axiosInstance from "@/lib/axiosConfig";
import { Product } from "@/app/types/Product";

// Helper function to get token safely
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("jwtToken");
  }
  return null;
};

export const getAllProducts = async () => {
  try {
    const response = await axiosInstance.get("/products");
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
};

export const addProduct = async (product: any) => {
  const token = getToken(); // Get token safely
  if (!token) throw new Error("User is not authenticated");

  const formData = new FormData();
  formData.append(
    "product",
    JSON.stringify({
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      stock: parseInt(product.stock),
      category: product.category,
    })
  );

  if (product.image) {
    formData.append("image", product.image);
  }

  const response = await axiosInstance.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateProductF = async (id: number, updatedProduct: any) => {
  const token = getToken(); // Get token safely
  if (!token) throw new Error("User is not authenticated");

  const formData = new FormData();
  formData.append(
    "product",
    JSON.stringify({
      name: updatedProduct.name,
      description: updatedProduct.description,
      price: parseFloat(updatedProduct.price),
      stock: parseInt(updatedProduct.stock),
      category: updatedProduct.category,
    })
  );

  if (updatedProduct.image) {
    formData.append("image", updatedProduct.image);
  } else if (updatedProduct.imageData) {
    formData.append("imageData", updatedProduct.imageData);
  }

  const response = await axiosInstance.put(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteProduct = async (id: number) => {
  const token = getToken(); // Get token safely
  if (!token) throw new Error("User is not authenticated");

  await axiosInstance.delete(`/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const searchProducts = async (keyword: string): Promise<Product[]> => {
  try {
    const response = await axiosInstance.get(`/products/search`, {
      params: { keyword },
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};
