import { useState } from "react";
import "./TransactionModal.css";

export default function TransactionModal({
    open,
    onClose,
    transactionType,
    onSave
}) {


    const getToday = () => {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
};
    const [transaction, setTransaction] = useState({
        transactionMode: "NORMAL",
        category: "",
        amount: "",
        paymentMode: "CASH",
        description: "",
        transactionDate: getToday(),
        frequency: "MONTHLY",
        approvalRequired: false,
        endDate: ""
    });

    if (!open) return null;

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setTransaction(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));

    };

    const handleSubmit = () => {

        if (transaction.category.trim() === "") {
            alert("Category is required");
            return;
        }

        if (!transaction.amount || Number(transaction.amount) <= 0) {
            alert("Enter valid amount");
            return;
        }

        if (
            transaction.transactionMode === "RECURRING" &&
            !transaction.endDate
        ) {
            alert("Please select End Date");
            return;
        }

        const request = {

            transactionType: transactionType,

            transactionMode: transaction.transactionMode,

            category: transaction.category,

            amount: Number(transaction.amount),

            paymentMode: transaction.paymentMode,

            description: transaction.description,

            transactionDate: transaction.transactionDate,

            frequency:
                transaction.transactionMode === "RECURRING"
                    ? transaction.frequency
                    : null,

            approvalRequired:
                transaction.transactionMode === "RECURRING"
                    ? transaction.approvalRequired
                    : false,

            endDate:
                transaction.transactionMode === "RECURRING"
                    ? transaction.endDate
                    : null

        };

        onSave(request);

        setTransaction({
            transactionMode: "NORMAL",
            category: "",
            amount: "",
            paymentMode: "CASH",
            description: "",
            transactionDate: getToday(),
            frequency: "MONTHLY",
            approvalRequired: false,
            endDate: ""
        });

        onClose();
    };

    return (

        <div className="modal-overlay">

            <div className="transaction-modal">

                <h2>
                    {transactionType === "EXPENSE"
                        ? "Add Expense"
                        : "Add Income"}
                </h2>

                <label>Transaction Mode</label>

                <select
                    name="transactionMode"
                    value={transaction.transactionMode}
                    onChange={handleChange}
                >
                    <option value="NORMAL">Normal</option>
                    <option value="RECURRING">Recurring</option>
                </select>

                <label>Category</label>

                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={transaction.category}
                    onChange={handleChange}
                />

                <label>Amount</label>

                <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={transaction.amount}
                    onChange={handleChange}
                />

                <label>Payment Mode</label>

                <select
                    name="paymentMode"
                    value={transaction.paymentMode}
                    onChange={handleChange}
                >
                    <option value="CASH">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="BANK">Bank</option>
                    <option value="CARD">Card</option>
                </select>

                <label>Description</label>

                <textarea
                    name="description"
                    placeholder="Description"
                    value={transaction.description}
                    onChange={handleChange}
                />

                <label>Transaction Date</label>

                <input
                    type="date"
                    name="transactionDate"
                    value={transaction.transactionDate}
                    onChange={handleChange}
                />

                {transaction.transactionMode === "RECURRING" && (

                    <>

                        <label>Frequency</label>

                        <select
                            name="frequency"
                            value={transaction.frequency}
                            onChange={handleChange}
                        >
                            <option value="DAILY">Daily</option>
                            <option value="WEEKLY">Weekly</option>
                            <option value="MONTHLY">Monthly</option>
                            <option value="YEARLY">Yearly</option>
                        </select>

                        <label>End Date</label>

                        <input
                            type="date"
                            name="endDate"
                            value={transaction.endDate}
                            onChange={handleChange}
                        />

                        <div className="checkbox-container">

                            <input
                                type="checkbox"
                                name="approvalRequired"
                                checked={transaction.approvalRequired}
                                onChange={handleChange}
                            />

                            <span>Approval Required</span>

                        </div>

                    </>

                )}

                <div className="modal-buttons">

                    <button
                        className="cancel-btn"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="save-btn"
                        onClick={handleSubmit}
                    >
                        Save
                    </button>

                </div>

            </div>

        </div>

    );

}