import axios from "axios";

export const axiosInstance=axios.create({
    baseURL:import.meta.env.VITE_BASE_URL,
})

// Attach token to outgoing requests
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const user = getUserFromCookies();
//     if (user?.token) {
//       config.headers.Authorization = `Bearer ${user.token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );


export default axiosInstance