import axiosInstance from './axiosInstance';

export const AddPermissionModel = async (data) => {
    try {
        const response = await axiosInstance.post("/permission-models", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetPermissionModels = async () => {
    try {
        const response = await axiosInstance.get("/permission-models");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const UpdatePermissionModel = async (id, data) => {
    try {
        const response = await axiosInstance.patch(`/permission-models/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const DeletePermissionModel = async (id) => {
    try {
        const response = await axiosInstance.delete(`/permission-models/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
