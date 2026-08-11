import "./LoanTransactionTimeline.css";

import {
    FaUniversity,
    FaPercentage,
    FaCoins,
    FaArrowDown,
    FaArrowUp
} from "react-icons/fa";

const LoanTransactionTimeline = ({
    transactions = [],
    loading = false
}) => {

    const getTitle = (type) => {

        switch (type) {

            case "LEND":
                return "Loan Given";

            case "BORROW":
                return "Loan Taken";

            case "INTEREST_ACCRUAL":
                return "Interest Added";

            case "PRINCIPAL_PAYMENT":
                return "Principal Payment";

            case "INTEREST_PAYMENT":
                return "Interest Payment";

            default:
                return type || "Transaction";
        }
    };


    const getIcon = (type) => {

        switch (type) {

            case "LEND":
                return <FaArrowUp />;

            case "BORROW":
                return <FaArrowDown />;

            case "INTEREST_ACCRUAL":
                return <FaPercentage />;

            case "PRINCIPAL_PAYMENT":
                return <FaCoins />;

            case "INTEREST_PAYMENT":
                return <FaCoins />;

            default:
                return <FaUniversity />;
        }
    };


    const getClass = (type) => {

        switch (type) {

            case "LEND":
                return "loan-tx-lend";

            case "BORROW":
                return "loan-tx-borrow";

            case "INTEREST_ACCRUAL":
                return "loan-tx-interest";

            case "PRINCIPAL_PAYMENT":
            case "INTEREST_PAYMENT":
                return "loan-tx-payment";

            default:
                return "";
        }
    };


    const formatDate = (date) => {

        if (!date) return "No Date";

        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            return "Invalid Date";
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };


    const formatTime = (date) => {

        if (!date) return "";

        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            return "";
        }

        return parsedDate.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit"
        });
    };


    if (loading) {

        return (
            <section className="loan-transaction-section">

                <h3>Transaction History</h3>

                <div className="loan-transaction-loading">
                    Loading transactions...
                </div>

            </section>
        );
    }


    return (

        <section className="loan-transaction-section">

            <div className="loan-transaction-header">

                <h3>
                    Transaction History
                </h3>

                <span>
                    {transactions.length} Transactions
                </span>

            </div>


            {transactions.length === 0 ? (

                <div className="loan-no-transactions">

                    <FaUniversity />

                    <h4>
                        No Transactions
                    </h4>

                    <p>
                        No transactions found for this loan.
                    </p>

                </div>

            ) : (

                <div className="loan-timeline">

                    {transactions.map((transaction, index) => {

                        const amount =
                            Number(transaction.amount) || 0;

                        const outstanding =
                            Number(
                                transaction.outstandingAfterTransaction
                            ) || 0;

                        return (

                            <div
                                className="loan-timeline-item"
                                key={transaction.transactionId}
                            >

                                {/* Timeline line */}

                                {index < transactions.length - 1 && (
                                    <div className="timeline-line"></div>
                                )}


                                {/* Icon */}

                                <div
                                    className={`loan-timeline-icon ${getClass(
                                        transaction.transactionType
                                    )}`}
                                >
                                    {getIcon(
                                        transaction.transactionType
                                    )}
                                </div>


                                {/* Card */}

                                <div
                                    className={`loan-transaction-card ${getClass(
                                        transaction.transactionType
                                    )}`}
                                >

                                    <div className="loan-tx-top">

                                        <div>

                                            <h4>
                                                {getTitle(
                                                    transaction.transactionType
                                                )}
                                            </h4>

                                            <p>
                                                {transaction.description}
                                            </p>

                                        </div>

                                        <strong className="loan-tx-amount">

                                            ₹{amount.toLocaleString()}

                                        </strong>

                                    </div>


                                    <div className="loan-tx-date">

                                        <span>
                                            {formatDate(
                                                transaction.transactionDate
                                            )}
                                        </span>

                                        <span>
                                            {formatTime(
                                                transaction.transactionDate
                                            )}
                                        </span>

                                    </div>


                                    <div className="loan-tx-bottom">

                                        <span>
                                            Outstanding after transaction
                                        </span>

                                        <strong>
                                            ₹{outstanding.toLocaleString()}
                                        </strong>

                                    </div>

                                </div>

                            </div>

                        );

                    })}

                </div>

            )}

        </section>

    );
};

export default LoanTransactionTimeline;