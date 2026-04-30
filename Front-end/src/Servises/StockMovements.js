import axiosInstance from './axiosInstance';

export const AddStockMovement = async (data) => {
    try {
        const response = await axiosInstance.post(`/stock-movements`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetStockMovements = async () => {
    try {
        const response = await axiosInstance.get(`/stock-movements`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const UpdateStockMovement = async (id, data) => {
    try {
        const response = await axiosInstance.patch(`/stock-movements/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const DeleteStockMovement = async (id) => {
    try {
        const response = await axiosInstance.delete(`/stock-movements/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
