import "./ExpenseHistory.css";
import "./IncomeHistory.css";

import {
    FaTimes,
    FaPlus,
    FaMoneyBillWave,
    FaCalendarAlt
} from "react-icons/fa";

const IncomeHistory = ({
    open,
    onClose,
    onAddIncome,
    transactions
}) => {

    if (!open) {
        return null;
    }


    const incomes =
        transactions.filter(
            transaction =>
                transaction.transactionType ===
                "INCOME"
        );


    const totalIncome =
        incomes.reduce(
            (total, income) =>
                total +
                Number(income.amount),
            0
        );


    return (

        <div
            className="history-overlay"
            onClick={onClose}
        >

            <div
                className="history-panel"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >

                {/* Header */}

                <div className="history-header">

                    <div>

                        <h2>
                            Income History
                        </h2>

                        <p>
                            Track your income
                        </p>

                    </div>


                    <button
                        className="history-close-btn"
                        onClick={onClose}
                    >

                        <FaTimes />

                    </button>

                </div>


                {/* Summary */}

                <div className="history-summary income-summary">

                    <div>

                        <span>
                            Total Income
                        </span>

                        <h1>
                            ₹
                            {totalIncome.toLocaleString()}
                        </h1>

                    </div>


                    <div className="income-summary-icon">

                        <FaMoneyBillWave />

                    </div>

                </div>


                {/* Income List */}

                <div className="history-list">

                    {incomes.length === 0 ? (

                        <div className="empty-history">

                            <FaMoneyBillWave />

                            <p>
                                No income found
                            </p>

                        </div>

                    ) : (

                        incomes.map(
                            (income) => (

                                <div
                                    className="history-item"
                                    key={
                                        income.transactionId
                                    }
                                >

                                    <div className="income-item-icon">

                                        <FaMoneyBillWave />

                                    </div>


                                    <div className="history-item-details">

                                        <h3>
                                            {
                                                income.description ||
                                                income.category ||
                                                "Income"
                                            }
                                        </h3>


                                        <p>

                                            <FaCalendarAlt />

                                            {
                                                income.transactionDate
                                            }

                                        </p>

                                        <span className="transaction-payment-mode">
    Payment: {income.paymentMode || "Not specified"}
</span>

                                    </div>


                                    <div className="income-amount">

                                        + ₹
                                        {Number(
                                            income.amount
                                        ).toLocaleString()}

                                    </div>

                                </div>

                            )
                        )

                    )}

                </div>


                {/* Add Income */}

                <button
                    className="add-history-btn income-add-btn"
                    onClick={onAddIncome}
                >

                    <FaPlus />

                    Add Income

                </button>

            </div>

        </div>

    );
};

export default IncomeHistory;