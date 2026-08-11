import "./ExpenseHistory.css";

import {
    FaTimes,
    FaPlus,
    FaReceipt,
    FaCalendarAlt
} from "react-icons/fa";

const ExpenseHistory = ({
    open,
    onClose,
    onAddExpense,
    transactions
}) => {

    if (!open) {
        return null;
    }


    const expenses =
        transactions.filter(
            transaction =>
                transaction.transactionType ===
                "EXPENSE"
        );


    const totalExpense =
        expenses.reduce(
            (total, expense) =>
                total +
                Number(expense.amount),
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
                            Expense History
                        </h2>

                        <p>
                            Track your expenses
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

                <div className="history-summary expense-summary">

                    <div>

                        <span>
                            Total Expenses
                        </span>

                        <h1>
                            ₹
                            {totalExpense.toLocaleString()}
                        </h1>

                    </div>


                    <div className="history-summary-icon">

                        <FaReceipt />

                    </div>

                </div>


                {/* Expense List */}

                <div className="history-list">

                    {expenses.length === 0 ? (

                        <div className="empty-history">

                            <FaReceipt />

                            <p>
                                No expenses found
                            </p>

                        </div>

                    ) : (

                        expenses.map(
                            (expense) => (

                                <div
                                    className="history-item"
                                    key={
                                        expense.transactionId
                                    }
                                >

                                    <div className="history-item-icon">

                                        <FaReceipt />

                                    </div>


                                    <div className="history-item-details">

                                        <h3>
                                            {
                                                expense.description ||
                                                expense.category ||
                                                "Expense"
                                            }
                                        </h3>


                                        <p>

                                            <FaCalendarAlt />

                                            {
                                                expense.transactionDate
                                            }

                                        </p>

                                        <span className="transaction-payment-mode">
    Payment: {expense.paymentMode || "Not specified"}
</span>

                                    </div>


                                    <div className="expense-amount">

                                        - ₹
                                        {Number(
                                            expense.amount
                                        ).toLocaleString()}

                                    </div>

                                </div>

                            )
                        )

                    )}

                </div>


                {/* Add Expense */}

                <button
                    className="add-history-btn expense-add-btn"
                    onClick={onAddExpense}
                >

                    <FaPlus />

                    Add Expense

                </button>

            </div>

        </div>

    );
};

export default ExpenseHistory;