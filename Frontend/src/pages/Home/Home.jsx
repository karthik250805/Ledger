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


        setCustomers(
            Array.isArray(data)
                ? data
                : []
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

                const data =
                    await getTransactions();


                console.log(
                    "Transactions:",
                    data
                );


                setTransactions(
                    Array.isArray(data)
                        ? data
                        : []
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

        setTransactions(
            Array.isArray(transactionData)
                ? transactionData
                : []
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

                const data =
                    await getUserSummary();


                console.log(
                    "User Summary:",
                    data
                );


                setSummary({

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

                });


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

            const data =
                await getCustomers();


            console.log(
                "Customers:",
                data
            );


            setCustomers(
                Array.isArray(data)
                    ? data
                    : []
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

    return (

        <>

            <Header
                onAddCustomer={() =>
                    setOpenCustomerModal(true)
                }
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