import axiosInstance from './axiosInstance';

export const AddProduct = async (data) => {
    try {
        const response = await axiosInstance.post("/products", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetProducts = async (filters) => {
    try {
        const response = await axiosInstance.get("/products", { params: filters });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const UpdateProduct = async (id, data) => {
    try {
        const response = await axiosInstance.patch(`/products/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const DeleteProduct = async (id) => {
    try {
        const response = await axiosInstance.delete(`/products/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
