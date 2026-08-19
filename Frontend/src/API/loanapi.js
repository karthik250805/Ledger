const API_BASE_URL = "http://localhost:8080/api";

export const getCustomerLoans = async (customerId) => {

    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Please login again.");
    }

    const response = await fetch(
        `${API_BASE_URL}/customer-loans/customer/${customerId}`,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Failed to load customer loans");
    }

    return await response.json();
};

export const createLoan = async (loanData) => {

    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Please login again.");
    }

    const response = await fetch(
        `${API_BASE_URL}/customer-loans`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify(loanData)
        }
    );

    if (!response.ok) {

        let message = "Failed to create loan";

        try {

            const errorData =
                await response.json();

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


// =====================================================
// GET SINGLE LOAN
// =====================================================

export const getLoan = async (loanId) => {

    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Please login again.");
    }

    const response = await fetch(
        `${API_BASE_URL}/customer-loans/${loanId}`,
        {
            method: "GET",

            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {

        let message = "Failed to load loan";

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


// =====================================================
// GET LOAN TRANSACTIONS
// =====================================================

export const getLoanTransactions = async (loanId) => {

    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Please login again.");
    }

    const response = await fetch(
        `${API_BASE_URL}/customer-loans/${loanId}/transactions`,
        {
            method: "GET",

            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {

        let message = "Failed to load loan transactions";

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

// =====================================================
// REFRESH INTEREST
// =====================================================

export const refreshInterest = async (request) => {

    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Please login again.");
    }

    const response = await fetch(
        `${API_BASE_URL}/customer-loans/refresh-interest`,
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

        let message = "Failed to refresh interest";

        try {

            const errorData =
                await response.json();

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

// ================================
// Refresh All
// ================================

export const refreshAllLoanInterest = async (
  customerId,
  refreshDate
) => {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/customer-loans/refresh-interest/customer`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },

      body: JSON.stringify({
        customerId,
        refreshDate
      })
    }
  );

  if (!response.ok) {

    const error = await response.text();

    throw new Error(
      error || "Failed to refresh interest"
    );
  }

  return response.json();
};
// =====================================================
// PARTIAL PAYMENT
// =====================================================

export const partialPayment = async (request) => {

    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Please login again.");
    }

    const response = await fetch(
        `${API_BASE_URL}/customer-loans/partial-payment`,
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

        let message = "Failed to make partial payment";

        try {

            const errorData =
                await response.json();

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


// =====================================================
// FULL PAYMENT
// =====================================================

export const fullPayment = async (request) => {

    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Please login again.");
    }

    const response = await fetch(
        `${API_BASE_URL}/customer-loans/full-payment`,
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

        let message = "Failed to make full payment";

        try {

            const errorData =
                await response.json();

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