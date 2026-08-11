const API_BASE_URL = "http://localhost:8080/api/transaction";


const getToken = () => {

    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Please login again.");
    }

    return token;
};


/* =========================
   GET ALL TRANSACTIONS
========================= */

export const getTransactions = async () => {

    const token = getToken();

    const response = await fetch(
        API_BASE_URL,
        {
            method: "GET",

            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
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
            "Failed to load transactions."
        );
    }


    return await response.json();
};


/* =========================
   GET TRANSACTION SUMMARY
========================= */

export const getTransactionSummary = async () => {

    const token = getToken();

    const response = await fetch(
        `${API_BASE_URL}/summary`,
        {
            method: "GET",

            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }
    );


    if (!response.ok) {

        throw new Error(
            "Failed to load transaction summary."
        );
    }


    return await response.json();
};


/* =========================
   CREATE TRANSACTION
========================= */

export const createTransaction = async (
    transactionData
) => {

    const token = getToken();

    const response = await fetch(
        API_BASE_URL,
        {
            method: "POST",

            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },

            body: JSON.stringify(
                transactionData
            )
        }
    );


    if (!response.ok) {

        let message =
            "Failed to create transaction.";

        try {

            const errorData =
                await response.json();

            if (errorData.message) {
                message =
                    errorData.message;
            }

        } catch (error) {

            console.error(error);

        }

        throw new Error(message);
    }


    return await response.json();
};