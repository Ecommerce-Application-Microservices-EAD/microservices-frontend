import axiosInstance from "@/lib/axiosConfig";

const token = localStorage.getItem("jwtToken");

export const getAllOrders = async () => {
    try {
      const response = await axiosInstance.get("/orders",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (err) {
      throw err;
    }
  };
