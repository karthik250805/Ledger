import "./LoanDetails.css";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { FaArrowLeft, FaEdit } from "react-icons/fa";

import LoanQuickActions from "../../components/Loan/LoanQuickAction";
import LoanTransactionTimeline from "../../components/Loan/LoanTrsanctionTimeline";
import PartialPaymentSheet from "../../components/Loan/PartialPayment";
import FullPaymentSheet from "../../components/Loan/FullPaymentSheet";

import {
    getLoan,
    getLoanTransactions,
    refreshInterest,
    partialPayment,
    fullPayment
} from "../../API/loanapi";


const LoanDetails = () => {

    const { loanId } = useParams();

    const navigate = useNavigate();


    // =====================================================
    // LOAN DATA
    // =====================================================

    const [loan, setLoan] = useState(null);

    const [transactions, setTransactions] = useState([]);


    // =====================================================
    // LOADING / ERROR
    // =====================================================

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================================
    // PAYMENT SHEETS
    // =====================================================

    const [showFullPayment, setShowFullPayment] =
        useState(false);

    const [showPartialPayment, setShowPartialPayment] =
        useState(false);


    // =====================================================
    // LOAD LOAN + TRANSACTIONS
    // =====================================================

    const loadLoanData = async () => {

        try {

            setError("");

            // Get loan details
            const loanData =
                await getLoan(loanId);

            setLoan(loanData);


            // Get loan transactions
            const transactionData =
                await getLoanTransactions(loanId);

            setTransactions(transactionData);


        } catch (error) {

            console.error(
                "Failed to load loan:",
                error
            );

            setError(
                error.message ||
                "Failed to load loan details"
            );

        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        const loadInitialData = async () => {

            try {

                setLoading(true);

                setError("");

                await loadLoanData();

            } catch (error) {

                console.error(
                    "Failed to load loan details:",
                    error
                );

                setError(
                    error.message ||
                    "Failed to load loan details"
                );

            } finally {

                setLoading(false);

            }

        };


        loadInitialData();

    }, [loanId]);



    const formatDate = (date) => {
    if (!date) return "-";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
};
    // =====================================================
    // REFRESH INTEREST
    // =====================================================

    const handleRefreshInterest = async () => {

        try {

            const request = {

                loanId: Number(loan.loanId),

                refreshDate:
                    new Date()
                        .toISOString()
                        .split("T")[0]

            };


            console.log(
                "Refresh Interest Request:",
                request
            );


            const response =
                await refreshInterest(request);


            console.log(
                "Refresh Interest Response:",
                response
            );


            alert(
                response.message ||
                "Interest refreshed successfully"
            );


            // Reload loan details
            // and transaction history

            await loadLoanData();


        } catch (error) {

            console.error(
                "Refresh interest failed:",
                error
            );


            alert(
                error.message ||
                "Failed to refresh interest"
            );

        }

    };


    // =====================================================
    // LOADING SCREEN
    // =====================================================

    if (loading) {

        return (

            <div className="loan-details-loading">

                Loading loan details...

            </div>

        );

    }


    // =====================================================
    // ERROR SCREEN
    // =====================================================

    if (error) {

        return (

            <div className="loan-details-error">

                <p>
                    {error}
                </p>


                <button
                    onClick={() => navigate(-1)}
                >
                    Go Back
                </button>

            </div>

        );

    }


    // =====================================================
    // LOAN NOT FOUND
    // =====================================================

    if (!loan) {

        return (

            <div className="loan-details-error">

                <p>
                    Loan not found
                </p>


                <button
                    onClick={() => navigate(-1)}
                >
                    Go Back
                </button>

            </div>

        );

    }


    // =====================================================
    // CALCULATIONS
    // =====================================================

    const outstandingPrincipal =
        Number(
            loan.outstandingPrincipal || 0
        );


    const interestDue =
        Number(
            loan.interestDue || 0
        );


    const totalDue =
        outstandingPrincipal +
        interestDue;


    const isLend =
        loan.loanDirection === "LEND";


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="loan-details-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="loan-details-header">


                {/* BACK BUTTON */}

                <button
                    className="loan-back-btn"
                    onClick={() => navigate(-1)}
                >

                    <FaArrowLeft />

                </button>


                {/* HEADER INFORMATION */}

                <div className="loan-header-info">

                    <h2>

                        {
                            isLend
                                ? "Money Lent"
                                : "Money Borrowed"
                        }

                    </h2>


                    <span className="loan-customer-name">

                        {loan.customerName}

                    </span>


                    {
                        loan.notes && (

                            <p className="loan-header-notes">

                                {loan.notes}

                            </p>

                        )
                    }

                </div>


                {/* EDIT BUTTON */}

                <button
                    className="loan-edit-btn"
                >

                    <FaEdit />

                </button>


            </div>


            {/* =================================================
                LOAN SUMMARY
            ================================================= */}

            <div
                className={
                    `loan-summary-card ${
                        isLend
                            ? "loan-lend"
                            : "loan-borrow"
                    }`
                }
            >

                <span className="loan-summary-label">

                    Total Due

                </span>


                <h1>

                    ₹
                    {totalDue.toLocaleString()}

                </h1>


                <div className="loan-summary-bottom">


                    {/* INTEREST DUE */}

                    <div>

                        <span>
                            Interest Due
                        </span>


                        <strong>

                            ₹
                            {interestDue.toLocaleString()}

                        </strong>

                    </div>


                    {/* TOTAL DUE */}

                    <div>

                        <span>
                            Outstanding Principle
                        </span>


                        <strong>

                            ₹
                            {outstandingPrincipal.toLocaleString()}

                        </strong>

                    </div>


                </div>


                {/* STATUS */}

                <div
                    className={
                        `loan-status ${
                            String(
                                loan.status
                            ).toLowerCase()
                        }`
                    }
                >

                    {loan.status}

                </div>


            </div>


            {/* =================================================
                LOAN INFORMATION
            ================================================= */}

            <div className="loan-information">


                <h3>
                    Loan Details
                </h3>


                <div className="loan-info-grid">


                    {/* PRINCIPAL */}

                    <div className="loan-info-item">

                        <span>
                            Principal Amount
                        </span>


                        <strong>

                            ₹
                            {Number(
                                loan.principalAmount || 0
                            ).toLocaleString()}

                        </strong>

                    </div>


                    {/* INTEREST RATE */}

                    <div className="loan-info-item">

                        <span>
                            Interest Rate
                        </span>


                        <strong>

                            {loan.interestRate}%

                        </strong>

                    </div>


                    {/* INTEREST TYPE */}

                    <div className="loan-info-item">

                        <span>
                            Interest Type
                        </span>


                        <strong>

                            {loan.interestType || "-"}

                        </strong>

                    </div>


                    {/* INTEREST FREQUENCY */}

                    <div className="loan-info-item">

                        <span>
                            Interest Frequency
                        </span>


                        <strong>

                            {loan.interestFrequency || "-"}

                        </strong>

                    </div>


                    {/* LOAN DATE */}

                    <div className="loan-info-item">

                        <span>
                            Loan Date
                        </span>


                        <strong>
    {formatDate(loan.loanDate)}
</strong>

                    </div>


                    {/* LAST INTEREST */}

                    <div className="loan-info-item">

                        <span>
                            Last Interest
                        </span>


                        <strong>
    {formatDate(loan.lastInterestCalculatedDate)}
</strong>

                    </div>


                    {/* NEXT INTEREST */}

                    <div className="loan-info-item">

                        <span>
                            Next Interest
                        </span>


                        <strong>
    {formatDate(loan.nextInterestDate)}
</strong>

                    </div>


                </div>


            </div>


            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <LoanQuickActions

                onRefreshInterest={
                    handleRefreshInterest
                }


                onPartialPayment={() => {

                    setShowPartialPayment(true);

                }}


                onFullPayment={() => {

                    setShowFullPayment(true);

                }}

            />


            {/* =================================================
                TRANSACTION HISTORY
            ================================================= */}

            <LoanTransactionTimeline

                transactions={
                    transactions
                }

                loading={false}

            />


            {/* =================================================
                FULL PAYMENT SHEET
            ================================================= */}

            <FullPaymentSheet

                open={
                    showFullPayment
                }


                onClose={() => {

                    setShowFullPayment(false);

                }}


                loanId={
                    loan.loanId
                }


                outstandingAmount={
                    totalDue
                }


                onSubmit={async (request) => {

                    try {

                        console.log(
                            "Full Payment Request:",
                            request
                        );


                        const response =
                            await fullPayment(request);


                        console.log(
                            "Full Payment Response:",
                            response
                        );


                        alert(
                            response.message ||
                            "Loan closed successfully"
                        );


                        setShowFullPayment(false);


                        // Reload loan and history

                        await loadLoanData();


                    } catch (error) {

                        console.error(
                            "Full payment failed:",
                            error
                        );


                        alert(
                            error.message ||
                            "Failed to make full payment"
                        );

                    }

                }}

            />


            {/* =================================================
                PARTIAL PAYMENT SHEET
            ================================================= */}

            <PartialPaymentSheet

                open={
                    showPartialPayment
                }


                onClose={() => {

                    setShowPartialPayment(false);

                }}


                loanId={
                    loan.loanId
                }


                onSubmit={async (request) => {

                    try {

                        console.log(
                            "Partial Payment Request:",
                            request
                        );


                        const response =
                            await partialPayment(request);


                        console.log(
                            "Partial Payment Response:",
                            response
                        );


                        alert(
                            response.message ||
                            "Partial payment successful"
                        );


                        setShowPartialPayment(false);


                        // Reload loan and history

                        await loadLoanData();


                    } catch (error) {

                        console.error(
                            "Partial payment failed:",
                            error
                        );


                        alert(
                            error.message ||
                            "Failed to make partial payment"
                        );

                    }

                }}

            />


        </div>

    );

};


export default LoanDetails;