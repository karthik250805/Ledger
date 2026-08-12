import api from "../API/api.js";

export const signupUser = (userData) => {
    return api.post("/auth/signup", userData);
};

export const loginUser = (loginData) => {
    return api.post("/auth/login", loginData);
};

export const sendOtp = (email) => {
    return api.post("/auth/send-otp", {
        email: email
    });
};

export const verifyOtp = (email, otp) => {
    return api.post("/auth/verify-otp", {
        email: email,
        otp: otp
    });
};

export const getProfile = () => {
    return api.get("/auth/profile");
};

export const updateProfile = (profileData) => {
    return api.put(
        "/auth/profile",
        profileData
    );
};

export const changePassword = (passwordData) => {
    return api.put(
        "/auth/change-password",
        passwordData
    );
};