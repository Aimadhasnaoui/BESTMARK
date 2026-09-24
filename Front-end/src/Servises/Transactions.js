import axiosInstance from './axiosInstance';

export const AddTransaction = async (data) => {
    try {
        const response = await axiosInstance.post(`/transactions`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetTransactions = async ({ page = 1, limit = 50 } = {}) => {
    try {
        const response = await axiosInstance.get(`/transactions?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const GetTransactionsbyid = async (id) => {
    try {
        const response = await axiosInstance.get(`/transactions/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const GetTransactionsbyref = async (ref) => {
    try {
        const response = await axiosInstance.get(`/transactions/reference/${ref}`);
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
