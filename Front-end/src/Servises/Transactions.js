import axiosInstance from './axiosInstance';

export const AddTransaction = async (data) => {
    try {
        const response = await axiosInstance.post(`/transactions`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetTransactions = async () => {
    try {
        const response = await axiosInstance.get(`/transactions`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const UpdateTransaction = async (id, data) => {
    try {
        const response = await axiosInstance.patch(`/transactions/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const DeleteTransaction = async (id) => {
    try {
        const response = await axiosInstance.delete(`/transactions/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
