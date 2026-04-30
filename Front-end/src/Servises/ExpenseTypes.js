import axiosInstance from './axiosInstance';

export const AddExpenseType = async (data) => {
    try {
        const response = await axiosInstance.post("/expense-types", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetExpenseTypes = async () => {
    try {
        const response = await axiosInstance.get("/expense-types");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const UpdateExpenseType = async (id, data) => {
    try {
        const response = await axiosInstance.patch(`/expense-types/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const DeleteExpenseType = async (id) => {
    try {
        const response = await axiosInstance.delete(`/expense-types/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
