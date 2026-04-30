import axiosInstance from './axiosInstance';

export const AddExpense = async (data) => {
    try {
        const response = await axiosInstance.post("/expenses", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetExpenses = async () => {
    try {
        const response = await axiosInstance.get("/expenses");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const UpdateExpense = async (id, data) => {
    try {
        const response = await axiosInstance.patch(`/expenses/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const DeleteExpense = async (id) => {
    try {
        const response = await axiosInstance.delete(`/expenses/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
