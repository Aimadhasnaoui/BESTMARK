import axiosInstance from "./axiosInstance";

export const AddEmployee = async (data) => {
  try {
    const response = await axiosInstance.post("/employees", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetEmployees = async (mission) => {
  try {
    const response = await axiosInstance.get(
      "/employees",
      mission && { params: { mission } },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const UpdateEmployee = async (id, data) => {
  try {
    const response = await axiosInstance.patch(`/employees/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteEmployee = async (id) => {
  try {
    const response = await axiosInstance.delete(`/employees/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const PasswordUpdate = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/employees/password/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const DesactiverAccount = async (id) => {
  try {
    const response = await axiosInstance.put(`/employees/Desactiver/Account/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
