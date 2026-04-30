import axiosInstance from './axiosInstance';

export const AddEmployeeType = async (data) => {
    try {
        const response = await axiosInstance.post("/employee-types", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetEmployeeTypes = async () => {
    try {
        const response = await axiosInstance.get("/employee-types");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const UpdateEmployeeType = async (id, data) => {
    try {
        const response = await axiosInstance.patch(`/employee-types/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const DeleteEmployeeType = async (id) => {
    try {
        const response = await axiosInstance.delete(`/employee-types/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
