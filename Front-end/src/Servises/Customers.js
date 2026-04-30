import axiosInstance from './axiosInstance';

export const AddCustomer = async (data) => {
    try {
        const response = await axiosInstance.post("/customers", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetCustomers = async () => {
    try {
        const response = await axiosInstance.get("/customers");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const UpdateCustomer = async (id, data) => {
    try {
        const response = await axiosInstance.patch(`/customers/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const DeleteCustomer = async (id) => {
    try {
        const response = await axiosInstance.delete(`/customers/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
