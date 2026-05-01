import axiosInstance from './axiosInstance';

export const AddCategory = async (data) => {
    try {
        const response = await axiosInstance.post("/categories/products", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetCategorys = async () => {
    try {
        const response = await axiosInstance.get("/categories/products");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const UpdateCategory = async ({id, data}) => {
    try {
        const response = await axiosInstance.patch(`/categories/products/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const DeleteCategory = async (id) => {
    try {
        const response = await axiosInstance.delete(`/categories/products/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
