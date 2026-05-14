import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true, // Obligatoire pour envoyer automatiquement les cookies HttpOnly au serveur
});

// Intercepteur de RÉPONSE pour capturer les erreurs HTTP entrantes (ex: 401 Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log(error);
    if (error?.response?.status === 401 && window.location.pathname !== "/login") {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
