import api from "../API/api.js";


export const signupUser = (userData) => {
    return api.post("/auth/signup", userData);
};

export const loginUser = (loginData) => {
    return api.post("/auth/login", loginData);
};