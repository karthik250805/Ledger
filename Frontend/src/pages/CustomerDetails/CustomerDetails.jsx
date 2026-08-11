import "./CustomerDetails.css";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import CustomerHeader from "../../components/CustomerHeader/CustomerHeader";

import CustomerTransactionCard
    from "../../components/CustomerTransactionCard/CustomerTransactionCard";

import BottomActionBar
    from "../../components/BottomActionBar/BottomActionBar";

import CustomerSummary
    from "../../components/CustomerSummary/CustomerSummary";

import BalanceSummarySheet
    from "../../components/customer/BalanceSummarySheet";

import LoanListBottomSheet
    from "../../components/Customer/LoanListBottomSheet";

import GiveReceiveModal
    from "../../components/Customer/GiveReceiveModel";

import LoanActionModal
    from "../../components/Customer/LoanActionModel";

import EditCustomerModal
    from "../../components/Customer/EditCustomerModal";

import {
    getCustomer,
    updateCustomer,
    getCustomerSummary,
    getCustomerHistory,
    giveMoney,
    receiveMoney
} from "../../API/Cutsomerapi";

import {
    getCustomerLoans,
    createLoan
} from "../../API/loanapi";


const CustomerDetails = () => {

    const { id } = useParams();


    // =====================================================
    // CUSTOMER
    // =====================================================

    const [customer, setCustomer] = useState(null);

    const [customerSummary, setCustomerSummary] =
        useState(null);

    const [loans, setLoans] = useState([]);

    const [history, setHistory] = useState([]);

    const [historyLoading, setHistoryLoading] =
        useState(true);


    // =====================================================
    // LOADING / ERROR
    // =====================================================

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =====================================================
    // EDIT CUSTOMER
    // =====================================================

    const [editOpen, setEditOpen] =
        useState(false);


    // =====================================================
    // GIVE / RECEIVE
    // =====================================================

    const [actionType, setActionType] =
        useState(null);


    // =====================================================
    // LEND / BORROW
    // =====================================================

    const [loanActionType, setLoanActionType] =
        useState(null);


    // =====================================================
    // BALANCE SHEET
    // =====================================================

    const [showBalanceSheet, setShowBalanceSheet] =
        useState(false);


    // =====================================================
    // LOAN SHEET
    // =====================================================

    const [showLoanSheet, setShowLoanSheet] =
        useState(false);


    // =====================================================
    // LOAD CUSTOMER
    // =====================================================

    useEffect(() => {

        const loadCustomer = async () => {

            try {

                setLoading(true);
                setError("");

                console.log(
                    "Loading customer:",
                    id
                );

                const data =
                    await getCustomer(id);

                console.log(
                    "Customer Details:",
                    data
                );

                setCustomer(data);

            } catch (error) {

                console.error(
                    "Failed to load customer:",
                    error
                );

                setError(
                    error.message ||
                    "Failed to load customer"
                );

            } finally {

                setLoading(false);

            }

        };

        loadCustomer();

    }, [id]);


    // =====================================================
    // LOAD CUSTOMER SUMMARY
    // =====================================================

    useEffect(() => {

        const loadCustomerSummary = async () => {

            try {

                const data =
                    await getCustomerSummary(id);

                console.log(
                    "Customer Summary:",
                    data
                );

                setCustomerSummary(data);

            } catch (error) {

                console.error(
                    "Failed to load customer summary:",
                    error
                );

            }

        };

        if (id) {
            loadCustomerSummary();
        }

    }, [id]);


    // =====================================================
    // LOAD CUSTOMER LOANS
    // =====================================================

    useEffect(() => {

        const loadLoans = async () => {

            try {

                const data =
                    await getCustomerLoans(id);

                console.log(
                    "Customer Loans:",
                    data
                );

                setLoans(data);

            } catch (error) {

                console.error(
                    "Failed to load loans:",
                    error
                );

            }

        };

        if (id) {
            loadLoans();
        }

    }, [id]);


    // =====================================================
    // LOAD CUSTOMER TRANSACTION HISTORY
    // =====================================================

    useEffect(() => {

        const loadHistory = async () => {

            try {

                setHistoryLoading(true);

                console.log(
                    "Loading customer history:",
                    id
                );

                /*
                 * GET
                 * /api/customers/{customerId}/history
                 */

                const data =
                    await getCustomerHistory(id);

                console.log(
                    "Customer History:",
                    data
                );

                setHistory(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error) {

                console.error(
                    "Failed to load customer history:",
                    error
                );

                setHistory([]);

            } finally {

                setHistoryLoading(false);

            }

        };

        if (id) {
            loadHistory();
        }

    }, [id]);


    // =====================================================
    // UPDATE CUSTOMER
    // =====================================================

    const handleUpdateCustomer = async (
        updatedCustomer
    ) => {

        try {

            console.log(
                "Update Customer:",
                updatedCustomer
            );

            await updateCustomer(
                id,
                updatedCustomer
            );

            const latestCustomer =
                await getCustomer(id);

            setCustomer(
                latestCustomer
            );

            setEditOpen(false);

            alert(
                "Customer updated successfully"
            );

        } catch (error) {

            console.error(
                "Update customer error:",
                error
            );

            alert(
                error.message ||
                "Failed to update customer"
            );

        }

    };


    // =====================================================
    // GIVE / RECEIVE
    // =====================================================

    const handleGiveReceive = async (
        request
    ) => {

        try {

            console.log(
                "Give / Receive Request:",
                request
            );

            let response;

            if (actionType === "GIVE") {

                response =
                    await giveMoney(request);

            } else if (
                actionType === "RECEIVE"
            ) {

                response =
                    await receiveMoney(request);

            }

            console.log(
                "Transaction Created:",
                response
            );


            alert(
                actionType === "GIVE"
                    ? "Money given successfully"
                    : "Money received successfully"
            );


            // Close modal

            setActionType(null);


            // =================================================
            // REFRESH CUSTOMER SUMMARY
            // =================================================

            const updatedSummary =
                await getCustomerSummary(id);

            setCustomerSummary(
                updatedSummary
            );


            // =================================================
            // REFRESH CUSTOMER HISTORY
            // =================================================

            const updatedHistory =
                await getCustomerHistory(id);

            setHistory(
                Array.isArray(updatedHistory)
                    ? updatedHistory
                    : []
            );

        } catch (error) {

            console.error(
                "Give / Receive error:",
                error
            );

            alert(
                error.message ||
                "Transaction failed"
            );

        }

    };


    // =====================================================
    // CUSTOMER VALUES
    // =====================================================

    const customerBalance =
        Number(
            customerSummary?.overallBalance
        ) || 0;


    const customerBalanceStatus =
        customerSummary?.balanceStatus ||
        "SETTLED";


    // =====================================================
    // ACTIVE LOANS
    // =====================================================

    const activeLoans =
        loans.filter(
            (loan) =>
                loan.status === "ACTIVE"
        );


    const activeLoanAmount =
        activeLoans.reduce(
            (total, loan) =>
                total +
                Number(
                    loan.totalDue || 0
                ),
            0
        );


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="customer-details-loading">

                Loading customer...

            </div>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div className="customer-details-error">

                <p>
                    {error}
                </p>

                <button
                    onClick={() =>
                        window.history.back()
                    }
                >
                    Go Back
                </button>

            </div>

        );

    }


    // =====================================================
    // CUSTOMER NOT FOUND
    // =====================================================

    if (!customer) {

        return (

            <div className="customer-details-error">

                <p>
                    Customer not found
                </p>

                <button
                    onClick={() =>
                        window.history.back()
                    }
                >
                    Go Back
                </button>

            </div>

        );

    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="customer-details-page">


            {/* =================================================
                CUSTOMER HEADER
            ================================================= */}

            <CustomerHeader

                customer={customer}

                onEdit={() =>
                    setEditOpen(true)
                }

            />


            {/* =================================================
                CUSTOMER SUMMARY
            ================================================= */}

            <CustomerSummary

                balance={
                    customerBalance
                }

                balanceStatus={
                    customerBalanceStatus
                }

                activeLoans={
                    activeLoans.length
                }

                activeLoanAmount={
                    activeLoanAmount
                }

                onViewBalance={() =>
                    setShowBalanceSheet(true)
                }

                onViewLoans={() =>
                    setShowLoanSheet(true)
                }

            />


            {/* =================================================
                TRANSACTION HISTORY
            ================================================= */}

            <div className="history-section">

                <div className="history-header">

                    <h3>
                        Transaction History
                    </h3>

                </div>


                <div className="history-list">

                    {historyLoading ? (

                        <p>
                            Loading transactions...
                        </p>

                    ) : history.length === 0 ? (

                        <p>
                            No transactions yet.
                        </p>

                    ) : (

                        history.map(
                            (transaction) => (

                                <CustomerTransactionCard

                                    key={
                                        transaction.transactionId
                                    }

                                    transaction={
                                        transaction
                                    }

                                />

                            )
                        )

                    )}

                </div>

            </div>


            {/* =================================================
                BALANCE SUMMARY SHEET
            ================================================= */}

            <BalanceSummarySheet

                open={
                    showBalanceSheet
                }

                onClose={() =>
                    setShowBalanceSheet(false)
                }

                summary={
                    customerSummary
                }

            />


            {/* =================================================
                LOAN LIST
            ================================================= */}

            <LoanListBottomSheet

                open={
                    showLoanSheet
                }

                onClose={() =>
                    setShowLoanSheet(false)
                }

                loans={
                    activeLoans
                }

            />


            {/* =================================================
                BOTTOM ACTION BAR
            ================================================= */}

            <BottomActionBar

                onGive={() => {

                    setActionType(
                        "GIVE"
                    );

                }}

                onReceive={() => {

                    setActionType(
                        "RECEIVE"
                    );

                }}

                onLend={() => {

                    setLoanActionType(
                        "LEND"
                    );

                }}

                onBorrow={() => {

                    setLoanActionType(
                        "BORROW"
                    );

                }}

            />


            {/* =================================================
                GIVE / RECEIVE MODAL
            ================================================= */}

            <GiveReceiveModal

                open={
                    actionType === "GIVE" ||
                    actionType === "RECEIVE"
                }

                type={
                    actionType
                }

                customerId={
                    Number(id)
                }

                onClose={() => {

                    setActionType(null);

                }}

                onSubmit={
                    handleGiveReceive
                }

            />


            {/* =================================================
                LEND / BORROW MODAL
            ================================================= */}

            <LoanActionModal

                open={
                    loanActionType === "LEND" ||
                    loanActionType === "BORROW"
                }

                type={
                    loanActionType
                }

                customerId={
                    Number(id)
                }

                onClose={() => {

                    setLoanActionType(
                        null
                    );

                }}

                onSubmit={async (request) => {

                    try {

                        console.log(
                            "Loan Request:",
                            request
                        );

                        await createLoan(
                            request
                        );

                        alert(
                            request.loanDirection === "LEND"
                                ? "Loan created successfully"
                                : "Borrowing created successfully"
                        );


                        // Close modal

                        setLoanActionType(
                            null
                        );


                        // Reload loans

                        const updatedLoans =
                            await getCustomerLoans(id);

                        setLoans(
                            updatedLoans
                        );


                        // Reload summary

                        const updatedSummary =
                            await getCustomerSummary(id);

                        setCustomerSummary(
                            updatedSummary
                        );


                    } catch (error) {

                        console.error(
                            "Loan creation failed:",
                            error
                        );

                        alert(
                            error.message ||
                            "Failed to create loan"
                        );

                    }

                }}

            />


            {/* =================================================
                EDIT CUSTOMER MODAL
            ================================================= */}

            <EditCustomerModal

                open={
                    editOpen
                }

                customer={
                    customer
                }

                onClose={() =>
                    setEditOpen(false)
                }

                onSave={
                    handleUpdateCustomer
                }

            />

        </div>

    );

};


export default CustomerDetails;