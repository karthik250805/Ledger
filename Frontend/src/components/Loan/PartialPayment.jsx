import "./PartialPayment.css";

import { useState } from "react";
import { FaTimes, FaCoins } from "react-icons/fa";

const PartialPaymentSheet = ({
    open,
    onClose,
    loanId,
    onSubmit
}) => {

    // Automatically use today's date
    const today = new Date()
        .toISOString()
        .split("T")[0];


    const [principalPayment, setPrincipalPayment] =
        useState("");

    const [interestPayment, setInterestPayment] =
        useState("");

    const [notes, setNotes] =
        useState("");


    if (!open) {
        return null;
    }


    const principal =
        Number(principalPayment) || 0;

    const interest =
        Number(interestPayment) || 0;

    const totalPayment =
        principal + interest;


    const handleSubmit = (e) => {

        e.preventDefault();


        if (
            principal <= 0 &&
            interest <= 0
        ) {

            alert(
                "Enter principal payment or interest payment"
            );

            return;
        }


        const request = {

            loanId: Number(loanId),

            principalPayment: principal,

            interestPayment: interest,

            paymentDate: today,

            notes: notes.trim() || null

        };


        console.log(
            "Partial Payment Request:",
            request
        );


        if (onSubmit) {

            onSubmit(request);

        }

    };


    return (

        <div
            className="partial-payment-overlay"
            onClick={onClose}
        >

            <div
                className="partial-payment-sheet"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >


                {/* Header */}

                <div className="partial-payment-header">

                    <div className="partial-payment-title">

                        <div className="partial-payment-icon">

                            <FaCoins />

                        </div>

                        <div>

                            <h2>
                                Partial Payment
                            </h2>

                            <p>
                                Record a payment for this loan
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        className="partial-close-btn"
                        onClick={onClose}
                    >

                        <FaTimes />

                    </button>

                </div>


                {/* Form */}

                <form
                    className="partial-payment-form"
                    onSubmit={handleSubmit}
                >


                    {/* Principal Payment */}

                    <div className="payment-field">

                        <label>
                            Principal Payment
                        </label>

                        <div className="amount-input">

                            <span>₹</span>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={principalPayment}
                                onChange={(e) =>
                                    setPrincipalPayment(
                                        e.target.value
                                    )
                                }
                                placeholder="0"
                            />

                        </div>

                        <small>
                            Amount paid towards principal
                        </small>

                    </div>


                    {/* Interest Payment */}

                    <div className="payment-field">

                        <label>
                            Interest Payment
                        </label>

                        <div className="amount-input">

                            <span>₹</span>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={interestPayment}
                                onChange={(e) =>
                                    setInterestPayment(
                                        e.target.value
                                    )
                                }
                                placeholder="0"
                            />

                        </div>

                        <small>
                            Amount paid towards interest
                        </small>

                    </div>


                    {/* Notes */}

                    <div className="payment-field">

                        <label>
                            Notes
                        </label>

                        <textarea
                            className="normal-input notes-input"
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


                    {/* Total */}

                    <div className="payment-total">

                        <span>
                            Total Payment
                        </span>

                        <strong>
                            ₹{totalPayment.toLocaleString()}
                        </strong>

                    </div>


                    {/* Buttons */}

                    <div className="partial-payment-actions">

                        <button
                            type="button"
                            className="payment-cancel-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="payment-submit-btn"
                        >
                            Make Payment
                        </button>

                    </div>


                </form>

            </div>

        </div>

    );

};

export default PartialPaymentSheet;