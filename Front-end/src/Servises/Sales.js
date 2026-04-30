import axiosInstance from './axiosInstance';

export const AddSale = async (data) => {
    try {
        const response = await axiosInstance.post("/sales", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetSales = async () => {
    try {
        const response = await axiosInstance.get("/sales");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const UpdateSale = async (id, data) => {
    try {
        const response = await axiosInstance.patch(`/sales/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const DeleteSale = async (id) => {
    try {
        const response = await axiosInstance.delete(`/sales/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
