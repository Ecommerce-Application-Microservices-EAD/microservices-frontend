import axiosInstance from "@/lib/axiosConfig";

export const getAllOrders = async () => {
  try {
    // Check if we are in a browser environment
    const token =
      typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;

    const response = await axiosInstance.get("/orders", {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined, // Use undefined if token is not available
      },
    });

    console.log(response.data);
    return response.data;
  } catch (err) {
    throw err;
  }
};
