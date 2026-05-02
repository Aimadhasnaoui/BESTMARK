import axiosInstance from './axiosInstance';

export const AddSupplier = async (data) => {
    try {
        const response = await axiosInstance.post("/suppliers", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetSuppliers = async ({ queryKey }) => {
    console.log(queryKey);
    const filter = queryKey[1]?.filter || {};
    try {
        const response = await axiosInstance.get("/suppliers", { params: filter });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const UpdateSupplier = async (id, data) => {
    try {
        const response = await axiosInstance.patch(`/suppliers/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const DeleteSupplier = async (id) => {
    try {
        const response = await axiosInstance.delete(`/suppliers/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
