import axios from "axios";
import API_URL from "./congif";

const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        "Content-Type": "application/json"
    }
});

export const askChatbot = (message) => {
    return api.post("/chat", {
        message: message
    });
};


// Add JWT token to every request
api.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

export default api;