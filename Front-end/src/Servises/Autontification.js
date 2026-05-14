import axiosInstance from "./axiosInstance";

export const Login = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const LogOutUser = async () => {
  try {
    const response = await axiosInstance.post("/employees/Logout");
     return response.data;
  } catch (err) {
    throw err;
  }
};
export const me = async () => {
  try {
    const response = await axiosInstance.get("/employees/me");
     return response.data;
  } catch (err) {
    throw err;
  }
};
