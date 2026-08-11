const API_BASE_URL =
    "http://localhost:8080/";


export const getUserSummary = async () => {

    const token =
        localStorage.getItem("token");


    if (!token) {

        throw new Error(
            "Please login again."
        );

    }


    const response = await fetch(
        `${API_BASE_URL}dashboard`,
        {
            method: "GET",

            headers: {
                "Authorization":
                    `Bearer ${token}`,

                "Content-Type":
                    "application/json"
            }
        }
    );


    if (!response.ok) {

        if (response.status === 401) {

            throw new Error(
                "Session expired. Please login again."
            );

        }

        throw new Error(
            "Failed to load user summary."
        );
    }


    return await response.json();
};