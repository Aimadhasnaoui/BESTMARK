import axiosInstance from './axiosInstance';

// The back-end returns the notifications of the logged-in employee (from the JWT cookie)
export const GetNotifications = async () => {
    try {
        const response = await axiosInstance.get("/notifications");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const MarkNotificationRead = async (id) => {
    try {
        const response = await axiosInstance.patch(`/notifications/${id}/read`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const MarkAllNotificationsRead = async () => {
    try {
        const response = await axiosInstance.patch("/notifications/read-all");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const DeleteNotification = async (id) => {
    try {
        const response = await axiosInstance.delete(`/notifications/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
