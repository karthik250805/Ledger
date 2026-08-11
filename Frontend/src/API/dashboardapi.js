const API_BASE_URL = "http://localhost:8080";

export const getDashboard = async () => {

    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Please login again.");
    }

    const response = await fetch(
        `${API_BASE_URL}/dashboard`,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }
    );

    if (!response.ok) {

        let message = "Failed to load dashboard";

        try {

            const errorData = await response.json();

            if (errorData.message) {
                message = errorData.message;
            }

        } catch (error) {
            console.error(error);
        }

        throw new Error(message);
    }

    return await response.json();
};