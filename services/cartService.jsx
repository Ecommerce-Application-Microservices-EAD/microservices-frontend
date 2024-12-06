import axiosInstance from "@/lib/axiosConfig";

export const addToCart = async (userId, product, quantity) => {
  try {
    const response = await axiosInstance.post(`/cart/${userId}`, {
      productId: product.id,
      name: product.name,
      quantity,
      price: parseFloat(product.price),
    });
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error.message);
    throw new Error("Failed to add product to the cart. Please try again.");
  }
};


const token = localStorage.getItem("jwtToken");
export const fetchCartItems = async (userId) => {
  try {
    const response = await axiosInstance.get(`/cart/${userId}`, {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    });
    return response.data.items || [];
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  }
};

export const removeItemFromCart = async (userId, productId) => {
  try {
    await axiosInstance.delete(`/cart/${userId}/${productId}`, {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    });
  } catch (error) {
    console.error('Error removing item from cart:', error.response?.data || error);
    throw error;
  }
};