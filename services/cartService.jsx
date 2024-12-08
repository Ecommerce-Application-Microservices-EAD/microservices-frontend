import axiosInstance from "@/lib/axiosConfig";

// Function to add an item to the cart
export const addToCart = async (userId, product, quantity) => {
  try {
    // Check if we are in a browser environment
    const token =
      typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;

    console.log("userId cartService/addToCart", userId);

    const response = await axiosInstance.post(
      `/cart/${userId}`,
      {
        productId: product.id,
        name: product.name,
        quantity,
        price: parseFloat(product.price),
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined, // Use undefined if token is not available
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error.message);
    throw new Error("Failed to add product to the cart. Please try again.");
  }
};

// Function to fetch items from the cart
export const fetchCartItems = async (userId) => {
  try {
    // Check if we are in a browser environment
    const token =
      typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;

    const response = await axiosInstance.get(`/cart/${userId}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined, // Use undefined if token is not available
      },
    });
    return response.data.items || [];
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
};

// Function to remove an item from the cart
export const removeItemFromCart = async (userId, productId) => {
  try {
    // Check if we are in a browser environment
    const token =
      typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;

    await axiosInstance.delete(`/cart/${userId}/${productId}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined, // Use undefined if token is not available
      },
    });
  } catch (error) {
    console.error(
      "Error removing item from cart:",
      error.response?.data || error
    );
    throw error;
  }
};
