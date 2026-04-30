import axiosInstance from './axiosInstance';

export const AddPurchase = async (data) => {
    try {
        const response = await axiosInstance.post("/purchases", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetPurchases = async () => {
    try {
        const response = await axiosInstance.get("/purchases");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const UpdatePurchase = async (id, data) => {
    try {
        const response = await axiosInstance.patch(`/purchases/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const DeletePurchase = async (id) => {
    try {
        const response = await axiosInstance.delete(`/purchases/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
