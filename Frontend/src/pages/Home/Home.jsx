import { useState, useEffect } from "react";

import "./Home.css";

import Header from "../../components/Header/Header";
import UserSummary from "../../components/UserSummary/UserSummary";
import SearchBar from "../../components/SearchBar/SearchBar";
import CustomerList from "../../components/CustomerList/CustomerList";
// import BottomNavigation from "../../components/BottomNavigation/BottomNavigation";
import AddCustomerModal from "../../components/AddCustomerModel/AddCustomerModel";
import TransactionModal from "../../components/TransactionModal/TransactionModal";
import { addCustomer, getCustomers} from "../../API/Cutsomerapi";
import { getUserSummary } from "../../API/UserApi";
import IncomeHistory from "../../components/ExpenseandEarning/IncomeHistory";
import ExpenseHistory from "../../components/ExpenseandEarning/ExpenseHistory";
import {
    getTransactions,
    createTransaction
} from "../../API/transactionapi";
import { getCache,setCache  } from "../../utils/cache";


export default function Home() {

    /* =========================
       HISTORY OPEN/CLOSE
    ========================= */

    const [expenseOpen, setExpenseOpen] =
        useState(false);

    const [incomeOpen, setIncomeOpen] =
        useState(false);


    /* =========================
       TRANSACTION FORM
    ========================= */

    const [expenseFormOpen, setExpenseFormOpen] =
        useState(false);

    const [incomeFormOpen, setIncomeFormOpen] =
        useState(false);


    /* =========================
       SEARCH
    ========================= */

    const [searchTerm, setSearchTerm] =
        useState("");


    /* =========================
       ADD CUSTOMER
    ========================= */

    const [openCustomerModal, setOpenCustomerModal] =
        useState(false);


    const saveCustomer = async (customer) => {

    try {

        console.log(
            "Customer Request:",
            customer
        );


        const response =
            await addCustomer(customer);


        console.log(
            "Customer Added:",
            response
        );


        // Get latest customers
        const data =
            await getCustomers();


        const updatedCustomers =
            Array.isArray(data)
                ? data
                : [];

        setCustomers(
            updatedCustomers
        );

        setCache(
            "customersData",
            updatedCustomers
        );


        alert(
            "Customer added successfully"
        );


        setOpenCustomerModal(false);


    } catch (error) {

        console.error(
            "Add customer error:",
            error
        );


        alert(
            error.message ||
            "Failed to add customer"
        );

    }

};  


    /* =========================
       TRANSACTIONS
    ========================= */

    const [transactions, setTransactions] =
        useState([]);


    /* =========================
       LOAD TRANSACTIONS
    ========================= */

    useEffect(() => {

        const loadTransactions = async () => {

            try {

                const cachedTransactions =
                    getCache("transactionsData");

                if (cachedTransactions) {

                    console.log(
                        "Transactions loaded from cache:",
                        cachedTransactions
                    );

                    setTransactions(
                        Array.isArray(cachedTransactions)
                            ? cachedTransactions
                            : []
                    );

                    return;
                }

                const data =
                    await getTransactions();


                console.log(
                    "Transactions:",
                    data
                );

                const transactionList =
                    Array.isArray(data)
                        ? data
                        : [];

                setTransactions(
                    transactionList
                );

                setCache(
                    "transactionsData",
                    transactionList
                );


            } catch (error) {

                console.error(
                    "Failed to load transactions:",
                    error
                );

            }

        };


        loadTransactions();

    }, []);


    /* =========================
       SAVE TRANSACTION
    ========================= */

const saveTransaction = async (request) => {

    try {

        console.log("Transaction Request:", request);

        // 1. Save transaction
        await createTransaction(request);

        // 2. Get latest transactions
        const transactionData = await getTransactions();

        const updatedTransactions =
            Array.isArray(transactionData)
                ? transactionData
                : [];

        setTransactions(
            updatedTransactions
        );

        setCache(
            "transactionsData",
            updatedTransactions
        );

        // 3. Get latest user summary
        const summaryData = await getUserSummary();

        console.log("Updated User Summary:", summaryData);

        setSummary({
            cashBalance:
                Number(summaryData.cashBalance) || 0,

            moneyToReceive:
                Number(summaryData.moneyToReceive) || 0,

            moneyToPay:
                Number(summaryData.moneyToPay) || 0,

            netPosition:
                Number(summaryData.netPosition) || 0
        });

        setCache(
            "userSummaryData",
            {
                cashBalance:
                    Number(summaryData.cashBalance) || 0,

                moneyToReceive:
                    Number(summaryData.moneyToReceive) || 0,

                moneyToPay:
                    Number(summaryData.moneyToPay) || 0,

                netPosition:
                    Number(summaryData.netPosition) || 0
            }
        );

        // 4. Close the transaction form
        setExpenseFormOpen(false);
        setIncomeFormOpen(false);

        // 5. Open updated history
        if (request.transactionType === "EXPENSE") {

            setExpenseOpen(true);

        } else {

            setIncomeOpen(true);

        }

        alert(
            request.transactionType === "EXPENSE"
                ? "Expense added successfully"
                : "Income added successfully"
        );

    } catch (error) {

        console.error(
            "Transaction error:",
            error
        );

        alert(
            error.message ||
            "Failed to create transaction"
        );

    }
};


    /* =========================
       USER SUMMARY
    ========================= */

    const [summary, setSummary] =
        useState({

            cashBalance: 0,

            moneyToReceive: 0,

            moneyToPay: 0,

            netPosition: 0

        });


    /* =========================
       LOAD USER SUMMARY
    ========================= */

    useEffect(() => {

        const loadSummary = async () => {

            try {

                const cachedSummary =
                    getCache("userSummaryData");

                if (cachedSummary) {

                    console.log(
                        "User Summary loaded from cache:",
                        cachedSummary
                    );

                    setSummary(cachedSummary);

                    return;
                }

                const data =
                    await getUserSummary();


                console.log(
                    "User Summary:",
                    data
                );

                const summaryData = {

                    cashBalance:
                        Number(
                            data.cashBalance
                        ) || 0,


                    moneyToReceive:
                        Number(
                            data.moneyToReceive
                        ) || 0,


                    moneyToPay:
                        Number(
                            data.moneyToPay
                        ) || 0,


                    netPosition:
                        Number(
                            data.netPosition
                        ) || 0

                };

                setSummary(
                    summaryData
                );

                setCache(
                    "userSummaryData",
                    summaryData
                );


            } catch (error) {

                console.error(
                    "Failed to load summary:",
                    error
                );

            }

        };


        loadSummary();

    }, []);


    /* =========================
       TEMPORARY CUSTOMERS
    ========================= */

 const [customers, setCustomers] =
    useState([]);
    useEffect(() => {

    const loadCustomers = async () => {

        try {

            const cachedCustomers =
                getCache("customersData");

            if (cachedCustomers) {

                console.log(
                    "Customers loaded from cache:",
                    cachedCustomers
                );

                setCustomers(
                    Array.isArray(cachedCustomers)
                        ? cachedCustomers
                        : []
                );

                return;
            }

            const data =
                await getCustomers();


            console.log(
                "Customers:",
                data
            );

            const customerList =
                Array.isArray(data)
                    ? data
                    : [];

            setCustomers(
                customerList
            );

            setCache(
                "customersData",
                customerList
            );


        } catch (error) {

            console.error(
                "Failed to load customers:",
                error
            );

        }

    };


    loadCustomers();

}, []);


    /* =========================
       UI
    ========================= */
    const loadHomeData = async () => {

    try {

        console.log("REFRESH CLICKED - FETCHING FROM SERVER");

        // Remove old cache first
        localStorage.removeItem("transactionsData");
        localStorage.removeItem("userSummaryData");
        localStorage.removeItem("customersData");

        // Fetch fresh data directly from API
        const [
            transactionData,
            summaryResponse,
            customerData
        ] = await Promise.all([
            getTransactions(),
            getUserSummary(),
            getCustomers()
        ]);

        const transactionList =
            Array.isArray(transactionData)
                ? transactionData
                : [];

        const summaryData = {
            cashBalance:
                Number(summaryResponse.cashBalance) || 0,

            moneyToReceive:
                Number(summaryResponse.moneyToReceive) || 0,

            moneyToPay:
                Number(summaryResponse.moneyToPay) || 0,

            netPosition:
                Number(summaryResponse.netPosition) || 0
        };

        const customerList =
            Array.isArray(customerData)
                ? customerData
                : [];

        // Update UI
        setTransactions(transactionList);
        setSummary(summaryData);
        setCustomers(customerList);

        // Store fresh data in cache
        setCache(
            "transactionsData",
            transactionList
        );

        setCache(
            "userSummaryData",
            summaryData
        );

        setCache(
            "customersData",
            customerList
        );

        console.log(
            "REFRESH COMPLETED - FRESH DATA:",
            {
                transactions: transactionList,
                summary: summaryData,
                customers: customerList
            }
        );

    } catch (error) {

        console.error(
            "REFRESH FAILED:",
            error
        );
    }
};


    return (

        <>

            <Header
                onAddCustomer={() =>
                    setOpenCustomerModal(true)
                }
                onRefresh={() => {loadHomeData(true);
}}
            />


            <div className="home-content">

                {/* User Summary */}

                <UserSummary
                    summary={summary}
                />


                {/* Expense / Income */}

                <div className="action-buttons">

                    <button
                        className="expense-btn"
                        onClick={() =>
                            setExpenseOpen(true)
                        }
                    >
                        Expense
                    </button>


                    <button
                        className="income-btn"
                        onClick={() =>
                            setIncomeOpen(true)
                        }
                    >
                        Income
                    </button>

                </div>


                {/* Search */}

                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />


                {/* Customers */}

                <CustomerList
                    customers={customers}
                    searchTerm={searchTerm}
                />

            </div>


            {/* Bottom Navigation */}

            {/* <BottomNavigation /> */}


            {/* Add Customer */}

            <AddCustomerModal

                open={openCustomerModal}

                onClose={() =>
                    setOpenCustomerModal(false)
                }

                onSave={saveCustomer}

            />


            {/* =========================
                EXPENSE HISTORY
            ========================= */}

            <ExpenseHistory

                open={expenseOpen}

                onClose={() =>
                    setExpenseOpen(false)
                }

                /*
                 * IMPORTANT:
                 * Pass transactions here
                 */

                transactions={transactions}

                onAddExpense={() => {

                    setExpenseOpen(false);

                    setExpenseFormOpen(true);

                }}

            />


            {/* =========================
                INCOME HISTORY
            ========================= */}

            <IncomeHistory

                open={incomeOpen}

                onClose={() =>
                    setIncomeOpen(false)
                }

                /*
                 * IMPORTANT:
                 * Pass transactions here
                 */

                transactions={transactions}

                onAddIncome={() => {

                    setIncomeOpen(false);

                    setIncomeFormOpen(true);

                }}

            />


            {/* =========================
                ADD EXPENSE
            ========================= */}

            <TransactionModal

                open={expenseFormOpen}

                transactionType="EXPENSE"

                onClose={() =>
                    setExpenseFormOpen(false)
                }

                onSave={saveTransaction}

            />


            {/* =========================
                ADD INCOME
            ========================= */}

            <TransactionModal

                open={incomeFormOpen}

                transactionType="INCOME"

                onClose={() =>
                    setIncomeFormOpen(false)
                }

                onSave={saveTransaction}

            />

        </>

    );

}