// services/productService.ts
import axiosInstance from '@/lib/axiosConfig';
import { Product } from '@/app/types/Product';

//using hardcoded jwt token for now
const token = ""

// Fetch all products
export const getAllProducts = async () => {
  try {
    const response = await axiosInstance.get("/products");
    return response.data;
  } catch (err) {
    throw err;
  }
};

// Fetch product by ID
export const getProductById = async (id: string): Promise<Product> => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
};

export const addProduct = async (product: any) => {
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

// Update a product
export const updateProductF = async (id: number, updatedProduct: any) => {
    const formData = new FormData();
  
    // Include product details in FormData
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
  
    // Append the new image or retain existing image data
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
  

// Delete a product
export const deleteProduct = async (id: number) => {
    await axiosInstance.delete(`/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  // Search for products by keyword
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