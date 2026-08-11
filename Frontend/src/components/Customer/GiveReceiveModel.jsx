import "./GiveReceiveModel.css";

import { useEffect, useState } from "react";
import {
    FaTimes,
    FaArrowUp,
    FaArrowDown
} from "react-icons/fa";

const GiveReceiveModal = ({
    open,
    type,
    customerId,
    onClose,
    onSubmit
}) => {

    const [amount, setAmount] = useState("");

    const [description, setDescription] =
        useState("");


    // Clear old values whenever modal opens

    useEffect(() => {

        if (open) {

            setAmount("");

            setDescription("");

        }

    }, [open]);


    if (!open) {
        return null;
    }


    const isGive = type === "GIVE";


    const handleSubmit = (e) => {

        e.preventDefault();


        const numericAmount =
            Number(amount);


        if (
            !numericAmount ||
            numericAmount <= 0
        ) {

            alert(
                "Please enter a valid amount"
            );

            return;
        }


        const request = {

    customerId:
        Number(customerId),

    amount:
        numericAmount,

    description:
        description.trim() || null,

    transactionDate:
        new Date()
            .toISOString()
            .split("T")[0],

    type: type
};


        console.log(
            `${type} Request:`,
            request
        );


        if (onSubmit) {

            onSubmit(request);

        }

    };


    return (

        <div
            className="give-receive-overlay"
            onClick={onClose}
        >

            <div
                className="give-receive-modal"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >


                {/* Header */}

                <div className="give-receive-header">

                    <div className="give-receive-title">


                        <div
                            className={`give-receive-icon ${
                                isGive
                                    ? "give-modal-icon"
                                    : "receive-modal-icon"
                            }`}
                        >

                            {isGive
                                ? <FaArrowUp />
                                : <FaArrowDown />
                            }

                        </div>


                        <div>

                            <h2>

                                {isGive
                                    ? "Give Money"
                                    : "Receive Money"
                                }

                            </h2>

                            <p>

                                {isGive
                                    ? "Record money given to this customer"
                                    : "Record money received from this customer"
                                }

                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        className="give-receive-close"
                        onClick={onClose}
                    >

                        <FaTimes />

                    </button>

                </div>


                {/* Form */}

                <form
                    className="give-receive-form"
                    onSubmit={handleSubmit}
                >


                    {/* Amount */}

                    <div className="give-receive-field">

                        <label>
                            Amount
                        </label>


                        <div className="give-receive-amount">

                            <span>
                                ₹
                            </span>


                            <input
                                type="number"
                                min="0"
                                step="100"
                                value={amount}
                                onChange={(e) =>
                                    setAmount(
                                        e.target.value
                                    )
                                }
                                placeholder="0"
                                autoFocus
                            />

                        </div>

                    </div>


                    {/* Description */}

                    <div className="give-receive-field">

                        <label>
                            Description
                        </label>


                        <textarea
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                            placeholder={
                                isGive
                                    ? "Why are you giving this money?"
                                    : "Why are you receiving this money?"
                            }
                            rows="3"
                        />

                    </div>


                    {/* Buttons */}

                    <div className="give-receive-actions">

                        <button
                            type="button"
                            className="give-receive-cancel"
                            onClick={onClose}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className={`give-receive-submit ${
                                isGive
                                    ? "give-submit"
                                    : "receive-submit"
                            }`}
                        >

                            {isGive
                                ? "Give Money"
                                : "Receive Money"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default GiveReceiveModal;