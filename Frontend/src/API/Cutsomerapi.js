const API_BASE_URL = "http://localhost:8080/api";


/* =========================
   ADD CUSTOMER
========================= */

export const addCustomer = async (customerData) => {

    const token =
        localStorage.getItem("token");


    if (!token) {
        throw new Error(
            "Please login again."
        );
    }


    const response = await fetch(
        `${API_BASE_URL}/customers`,
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json",

                "Authorization":
                    `Bearer ${token}`
            },

            body: JSON.stringify(
                customerData
            )
        }
    );


    if (!response.ok) {

        let message =
            "Failed to add customer";

        try {

            const errorData =
                await response.json();

            if (errorData.message) {
                message =
                    errorData.message;
            }

        } catch (error) {

            console.log(error);

        }

        throw new Error(message);
    }


    return await response.json();
};


/* =========================
   GET ALL CUSTOMERS
========================= */

export const getCustomers = async () => {

    const token =
        localStorage.getItem("token");


    if (!token) {
        throw new Error(
            "Please login again."
        );
    }


    const response = await fetch(
        `${API_BASE_URL}/customers`,
        {
            method: "GET",

            headers: {
                "Content-Type":
                    "application/json",

                "Authorization":
                    `Bearer ${token}`
            }
        }
    );


    if (!response.ok) {

        if (response.status === 401) {

            throw new Error(
                "Session expired. Please login again."
            );

        }


        let message =
            "Failed to load customers";

        try {

            const errorData =
                await response.json();

            if (errorData.message) {
                message =
                    errorData.message;
            }

        } catch (error) {

            console.log(error);

        }

        throw new Error(message);
    }


    return await response.json();
};

// =========================
// GET SINGLE CUSTOMER
// =========================

export const getCustomer = async (customerId) => {

    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Please login again.");
    }

    const response = await fetch(
        `${API_BASE_URL}/customers/${customerId}`,
        {
            method: "GET",

            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {

        let message = "Failed to load customer";

        try {
            const errorData = await response.json();

            if (errorData.message) {
                message = errorData.message;
            }

        } catch (error) {
            console.log(error);
        }

        throw new Error(message);
    }

    return await response.json();
};


// =========================
// UPDATE CUSTOMER
// =========================

export const updateCustomer = async (
    customerId,
    customerData
) => {

    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Please login again.");
    }

    const response = await fetch(
        `${API_BASE_URL}/customers/${customerId}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify(customerData)
        }
    );

    if (!response.ok) {

        let message = "Failed to update customer";

        try {
            const errorData = await response.json();

            if (errorData.message) {
                message = errorData.message;
            }

        } catch (error) {
            console.log(error);
        }

        throw new Error(message);
    }

    return await response.json();
};

// =========================
// GET CUSTOMER SUMMARY
// =========================

export const getCustomerSummary = async (customerId) => {

    const token =
        localStorage.getItem("token");

    if (!token) {
        throw new Error(
            "Please login again."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/customers/${customerId}/summary`,
        {
            method: "GET",

            headers: {
                "Authorization":
                    `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {

        if (response.status === 401) {

            throw new Error(
                "Session expired. Please login again."
            );

        }

        let message =
            "Failed to load customer summary";

        try {

            const errorData =
                await response.json();

            if (errorData.message) {
                message =
                    errorData.message;
            }

        } catch (error) {

            console.log(error);

        }

        throw new Error(message);
    }

    return await response.json();
};

    // =========================
// GIVE MONEY
// =========================

export const giveMoney = async (request) => {

    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Please login again.");
    }

    const response = await fetch(
        `${API_BASE_URL}/customer-transactions/give`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify(request)
        }
    );

    if (!response.ok) {

        let message = "Failed to give money";

        try {

            const errorData = await response.json();

            if (errorData.message) {
                message = errorData.message;
            }

        } catch (error) {

            console.error(
                "Error reading give response:",
                error
            );

        }

        throw new Error(message);
    }

    return await response.json();
};


// =========================
// RECEIVE MONEY
// =========================

export const receiveMoney = async (request) => {

    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Please login again.");
    }

    const response = await fetch(
        `${API_BASE_URL}/customer-transactions/receive`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify(request)
        }
    );

    if (!response.ok) {

        let message = "Failed to receive money";

        try {

            const errorData = await response.json();

            if (errorData.message) {
                message = errorData.message;
            }

        } catch (error) {

            console.error(
                "Error reading receive response:",
                error
            );

        }

        throw new Error(message);
    }

    return await response.json();
};

// =========================
// GET CUSTOMER TRANSACTION HISTORY
// =========================

export const getCustomerHistory = async (customerId) => {

    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Please login again.");
    }

    const response = await fetch(
        `${API_BASE_URL}/customers/${customerId}/history`,
        {
            method: "GET",

            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {

        let message = "Failed to load customer history";

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
