import axiosInstance from "./axiosInstance";

export const GetDashboard = async () => {
  try {
    const response = await axiosInstance.get("/dashboard");
    return response.data;
  } catch (error) {
    throw error;
  }
};
