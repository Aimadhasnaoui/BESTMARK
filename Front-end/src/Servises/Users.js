import axiosInstance from './axiosInstance';

export const AddUser = async (data) => {
    try {
        const response = await axiosInstance.post(`/users`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetUsers = async () => {
    try {
        const response = await axiosInstance.get(`/users`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const UpdateUser = async (id, data) => {
    try {
        const response = await axiosInstance.patch(`/users/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const DeleteUser = async (id) => {
    try {
        const response = await axiosInstance.delete(`/users/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
