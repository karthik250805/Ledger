import "./CustomerDetails.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CustomerHeader from "../../components/CustomerHeader/CustomerHeader";
import CustomerTransactionCard from "../../components/CustomerTransactionCard/CustomerTransactionCard";
import BottomActionBar from "../../components/BottomActionBar/BottomActionBar";
import CustomerSummary from "../../components/CustomerSummary/CustomerSummary";
import BalanceSummarySheet from "../../components/Customer/BalanceSummarySheet";
import LoanListBottomSheet from "../../components/Customer/LoanListBottomSheet";
import GiveReceiveModal from "../../components/Customer/GiveReceiveModel";
import LoanActionModal from "../../components/Customer/LoanActionModel";
import EditCustomerModal from "../../components/Customer/EditCustomerModal";
import {
    getCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerSummary,
    getCustomerHistory,
    giveMoney,
    receiveMoney
} from "../../API/Cutsomerapi";
import {
    getCustomerLoans,
    createLoan
} from "../../API/loanapi";

const applyCurrentBalanceStatus = (historyData, summary) => {
    if (!Array.isArray(historyData) || historyData.length === 0 || !summary) {
        return historyData;
    }
    return historyData.map((transaction, index) => {
        if (index === 0) {
            return {
                ...transaction,
                balanceStatus: summary.balanceStatus,
                outstandingAfterTransaction: summary.overallBalance
            };
        }
        return transaction;
    });

};

const CustomerDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState(null);
    const [customerSummary, setCustomerSummary] = useState(null);
    const [loans, setLoans] = useState([]);
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editOpen, setEditOpen] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [loanActionType, setLoanActionType] = useState(null);
    const [showBalanceSheet, setShowBalanceSheet] = useState(false);
    const [showLoanSheet, setShowLoanSheet] = useState(false);

    useEffect(() => {
        const loadCustomer = async () => {
            try {
                setLoading(true);
                setError("");
                const data = await getCustomer(id);
                setCustomer(data);
            } catch (error) {
                console.error("Failed to load customer:", error);
                setError(error.message || "Failed to load customer");
            } finally {
                setLoading(false);
            }
        };
        loadCustomer();
    }, [id]);

    useEffect(() => {
        const loadCustomerSummary = async () => {
            try {
                const data = await getCustomerSummary(id);
                setCustomerSummary(data);
            } catch (error) {
                console.error("Failed to load customer summary:", error);
            }
        };
        if (id) {
            loadCustomerSummary();
        }
    }, [id]);

    useEffect(() => {
        const loadLoans = async () => {
            try {
                const data = await getCustomerLoans(id);
                setLoans(data);
            } catch (error) {
                console.error("Failed to load loans:", error);
            }
        };
        if (id) {
            loadLoans();
        }
    }, [id]);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                setHistoryLoading(true);
                const data = await getCustomerHistory(id);
                const summary = await getCustomerSummary(id);
                const updatedHistory = applyCurrentBalanceStatus(
                    Array.isArray(data) ? data : [],
                    summary
                );
                setHistory(updatedHistory);
                setCustomerSummary(summary);
            } catch (error) {
                console.error("Failed to load customer history:", error);
                setHistory([]);
            } finally {
                setHistoryLoading(false);
            }
        };
        if (id) {
            loadHistory();
        }
    }, [id]);

    const handleUpdateCustomer = async (updatedCustomer) => {
        try {
            await updateCustomer(id, updatedCustomer);
            const latestCustomer = await getCustomer(id);
            setCustomer(latestCustomer);
            setEditOpen(false);
            alert("Customer updated successfully");
        } catch (error) {
            console.error("Update customer error:", error);
            alert(error.message || "Failed to update customer");
        }
    };

    const handleDeleteCustomer = async () => {
        const balance = Number(customerSummary?.overallBalance) || 0;
        const balanceStatus = customerSummary?.balanceStatus || "SETTLED";
        const hasActiveLoans = loans.some(
            (loan) => loan.status === "ACTIVE"
        );

        if (balance !== 0 || balanceStatus !== "SETTLED") {
            alert(
                "Customer cannot be deleted.\n\nPlease settle the customer balance first."
            );
            return;
        }

        if (hasActiveLoans) {
            alert(
                "Customer cannot be deleted.\n\nPlease settle all active loans first."
            );
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete ${customer.name}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteCustomer(id);
            alert("Customer deleted successfully.");
            navigate(-1);
        } catch (error) {
            console.error("Delete customer error:", error);
            alert(error.message || "Failed to delete customer");
        }
    };

    const handleGiveReceive = async (request) => {
        try {
            let response;

            if (actionType === "GIVE") {
                response = await giveMoney(request);
            } else if (actionType === "RECEIVE") {
                response = await receiveMoney(request);
            }

            console.log("Transaction Created:", response);

            alert(
                actionType === "GIVE"
                    ? "Money given successfully"
                    : "Money received successfully"
            );

            setActionType(null);

            const updatedSummary = await getCustomerSummary(id);
            setCustomerSummary(updatedSummary);

            const updatedHistory = await getCustomerHistory(id);

            const historyWithCurrentStatus =
                applyCurrentBalanceStatus(
                    Array.isArray(updatedHistory)
                        ? updatedHistory
                        : [],
                    updatedSummary
                );

            setHistory(historyWithCurrentStatus);
        } catch (error) {
            console.error("Give / Receive error:", error);
            alert(error.message || "Transaction failed");
        }
    };

    const customerBalance =
        Number(customerSummary?.overallBalance) || 0;

    const customerBalanceStatus =
        customerSummary?.balanceStatus || "SETTLED";

    const activeLoans = loans.filter(
        (loan) => loan.status === "ACTIVE"
    );

    const activeLoanAmount = activeLoans.reduce(
        (total, loan) =>
            total + Number(loan.totalDue || 0),
        0
    );

    if (loading) {
        return (
            <div className="customer-details-loading">
                Loading customer...
            </div>
        );
    }

    if (error) {
        return (
            <div className="customer-details-error">
                <p>{error}</p>
                <button onClick={() => window.history.back()}>
                    Go Back
                </button>
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="customer-details-error">
                <p>Customer not found</p>
                <button onClick={() => window.history.back()}>
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="customer-details-page">
            <CustomerHeader
                customer={customer}
                onEdit={() => setEditOpen(true)}
                onDelete={handleDeleteCustomer}
            />

            <CustomerSummary
                balance={customerBalance}
                balanceStatus={customerBalanceStatus}
                activeLoans={activeLoans.length}
                activeLoanAmount={activeLoanAmount}
                onViewBalance={() => setShowBalanceSheet(true)}
                onViewLoans={() => setShowLoanSheet(true)}
            />

            <div className="history-section">

    <div className="history-header">
        <h3>Transaction History</h3>
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

            history.map((transaction, index) => {

                const currentDate =
                    transaction.transactionDate;

                const previousDate =
                    index > 0
                        ? history[index - 1].transactionDate
                        : null;

                const isNewDate =
                    currentDate !== previousDate;

                const formatDate = (date) => {

                    if (!date) {
                        return "";
                    }

                    const transactionDate =
                        new Date(`${date}T00:00:00`);

                    const today = new Date();

                    today.setHours(
                        0,
                        0,
                        0,
                        0
                    );

                    const yesterday =
                        new Date(today);

                    yesterday.setDate(
                        yesterday.getDate() - 1
                    );

                    if (
                        transactionDate.getTime() ===
                        today.getTime()
                    ) {
                        return "Today";
                    }

                    if (
                        transactionDate.getTime() ===
                        yesterday.getTime()
                    ) {
                        return "Yesterday";
                    }

                    return transactionDate.toLocaleDateString(
                        "en-IN",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        }
                    );
                };

                return (
                    <div
                        key={
                            transaction.transactionId
                        }
                    >

                        {isNewDate && (
                            <div className="transaction-date-heading">
                                {formatDate(currentDate)}
                            </div>
                        )}

                        <CustomerTransactionCard
                            transaction={transaction}
                        />

                    </div>
                );

            })

        )}

    </div>

</div>

            <BalanceSummarySheet
                open={showBalanceSheet}
                onClose={() => setShowBalanceSheet(false)}
                summary={customerSummary}
            />

            <LoanListBottomSheet
                open={showLoanSheet}
                onClose={() => setShowLoanSheet(false)}
                loans={activeLoans}
                customerId={Number(id)}
                onRefreshSuccess={async () => {

        const updatedLoans =
            await getCustomerLoans(id);

        setLoans(updatedLoans);

        const updatedSummary =
            await getCustomerSummary(id);

        setCustomerSummary(updatedSummary);

    }}
            />

            <BottomActionBar
                onGive={() => setActionType("GIVE")}
                onReceive={() => setActionType("RECEIVE")}
                onLend={() => setLoanActionType("LEND")}
                onBorrow={() => setLoanActionType("BORROW")}
            />

            <GiveReceiveModal
                open={
                    actionType === "GIVE" ||
                    actionType === "RECEIVE"
                }
                type={actionType}
                customerId={Number(id)}
                onClose={() => setActionType(null)}
                onSubmit={handleGiveReceive}
            />

            <LoanActionModal
                open={
                    loanActionType === "LEND" ||
                    loanActionType === "BORROW"
                }
                type={loanActionType}
                customerId={Number(id)}
                onClose={() => setLoanActionType(null)}
                onSubmit={async (request) => {
                    try {
                        await createLoan(request);

                        alert(
                            request.loanDirection === "LEND"
                                ? "Loan created successfully"
                                : "Borrowing created successfully"
                        );

                        setLoanActionType(null);

                        const updatedLoans =
                            await getCustomerLoans(id);

                        setLoans(updatedLoans);

                        const updatedSummary =
                            await getCustomerSummary(id);

                        setCustomerSummary(updatedSummary);

                        const updatedHistory =
                            await getCustomerHistory(id);

                        setHistory(
                            applyCurrentBalanceStatus(
                                Array.isArray(updatedHistory)
                                    ? updatedHistory
                                    : [],
                                updatedSummary
                            )
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

            <EditCustomerModal
                open={editOpen}
                customer={customer}
                onClose={() => setEditOpen(false)}
                onSave={handleUpdateCustomer}
            />
        </div>
    );
};

export default CustomerDetails;
