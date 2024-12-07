import axiosInstance from "@/lib/axiosConfig";


export const getAllOrders = async () => {
    try {
      const response = await axiosInstance.get("/orders");
      console.log(response.data);
      return response.data;
    } catch (err) {
      throw err;
    }
  };
