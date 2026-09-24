import axiosInstance from "./axiosInstance";

export const AddPayslip = async (data) => {
  try {
    const response = await axiosInstance.post("/payslips", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetEmployeePayslips = async (employeeId) => {
  try {
    const response = await axiosInstance.get(`/payslips/employee/${employeeId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const UpdatePayslip = async (id, data) => {
  try {
    const response = await axiosInstance.patch(`/payslips/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeletePayslip = async (id) => {
  try {
    const response = await axiosInstance.delete(`/payslips/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
