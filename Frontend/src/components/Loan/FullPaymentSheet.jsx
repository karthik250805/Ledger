import "./FullPaymentSheet.css";

import { useState } from "react";
import {
    FaTimes,
    FaCheckCircle
} from "react-icons/fa";

const FullPaymentSheet = ({
    open,
    onClose,
    loanId,
    outstandingAmount,
    onSubmit
}) => {

    const [discountAmount, setDiscountAmount] =
        useState("0");

    const [notes, setNotes] =
        useState("");


    if (!open) {
        return null;
    }


    const outstanding =
        Number(outstandingAmount) || 0;

    const discount =
        Number(discountAmount) || 0;


    const amountToPay =
        Math.max(
            outstanding - discount,
            0
        );


    const handleDiscountChange = (e) => {

        let value = e.target.value;

        if (value === "") {
            setDiscountAmount("");
            return;
        }

        const numericValue =
            Number(value);

        if (numericValue < 0) {
            return;
        }

        if (numericValue > outstanding) {

            setDiscountAmount(
                outstanding.toString()
            );

            return;
        }

        setDiscountAmount(value);
    };


    const handleSubmit = (e) => {

        e.preventDefault();


        const request = {

            loanId: Number(loanId),

            discountAmount:
                discount,

            paymentDate:
                new Date()
                    .toISOString()
                    .split("T")[0],

            notes:
                notes.trim() || null

        };


        console.log(
            "Full Payment Request:",
            request
        );


        if (onSubmit) {
            onSubmit(request);
        }

    };


    return (

        <div
            className="full-payment-overlay"
            onClick={onClose}
        >

            <div
                className="full-payment-sheet"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >

                {/* Header */}

                <div className="full-payment-header">

                    <div className="full-payment-title">

                        <div className="full-payment-icon">

                            <FaCheckCircle />

                        </div>

                        <div>

                            <h2>
                                Full Payment
                            </h2>

                            <p>
                                Settle this loan completely
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        className="full-close-btn"
                        onClick={onClose}
                    >

                        <FaTimes />

                    </button>

                </div>


                <form
                    className="full-payment-form"
                    onSubmit={handleSubmit}
                >

                    {/* Outstanding */}

                    <div className="full-outstanding-card">

                        <span>
                            Current Outstanding
                        </span>

                        <strong>
                            ₹{outstanding.toLocaleString()}
                        </strong>

                    </div>


                    {/* Discount */}

                    <div className="full-payment-field">

                        <label>
                            Discount Offered
                        </label>

                        <div className="full-amount-input">

                            <span>
                                ₹
                            </span>

                            <input
                                type="number"
                                min="0"
                                max={outstanding}
                                step="0.01"
                                value={discountAmount}
                                onChange={
                                    handleDiscountChange
                                }
                            />

                        </div>

                        <small>
                            Discount given to the customer
                        </small>

                    </div>


                    {/* Calculation */}

                    <div className="full-calculation">

                        <div className="calculation-row">

                            <span>
                                Outstanding
                            </span>

                            <strong>
                                ₹{outstanding.toLocaleString()}
                            </strong>

                        </div>


                        <div className="calculation-row discount-row">

                            <span>
                                Discount
                            </span>

                            <strong>
                                - ₹{discount.toLocaleString()}
                            </strong>

                        </div>


                        <div className="calculation-divider" />


                        <div className="calculation-total">

                            <span>
                                Customer Pays
                            </span>

                            <strong>
                                ₹{amountToPay.toLocaleString()}
                            </strong>

                        </div>

                    </div>


                    {/* Notes */}

                    <div className="full-payment-field">

                        <label>
                            Notes
                        </label>

                        <textarea
                            className="full-normal-input"
                            value={notes}
                            onChange={(e) =>
                                setNotes(
                                    e.target.value
                                )
                            }
                            placeholder="Add a note..."
                            rows="3"
                        />

                    </div>


                    {/* Buttons */}

                    <div className="full-payment-actions">

                        <button
                            type="button"
                            className="full-cancel-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="full-submit-btn"
                        >
                            Settle Loan
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default FullPaymentSheet;