import axiosInstance from './axiosInstance';

export const AddDelivery = async (data) => {
    try {
        const response = await axiosInstance.post("/delivery", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetDeliverys = async () => {
    try {
        const response = await axiosInstance.get("/delivery");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const UpdateDelivery = async (id, data) => {
    try {
        const response = await axiosInstance.patch(`/delivery/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const DeleteDelivery = async (id) => {
    try {
        const response = await axiosInstance.delete(`/delivery/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
