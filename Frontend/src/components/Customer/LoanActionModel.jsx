import "./LoanActionModal.css";

import { useEffect, useState } from "react";

import {
  FaTimes,
  FaUniversity,
  FaHandHoldingUsd,
} from "react-icons/fa";

const LoanActionModal = ({
  open,
  type,
  customerId,
  onClose,
  onSubmit,
}) => {

  const isLend = type === "LEND";


  const [principalAmount, setPrincipalAmount] =
    useState("");

  const [interestType, setInterestType] =
    useState("SIMPLE");

  const [interestRate, setInterestRate] =
    useState("");

  const [interestFrequency, setInterestFrequency] =
    useState("MONTHLY");

  const [loanDate, setLoanDate] =
    useState("");

  const [notes, setNotes] =
    useState("");


  // ------------------------------------------
  // Calculate next interest date automatically
  // ------------------------------------------

  const calculateNextInterestDate = (
    date,
    frequency
  ) => {

    if (!date) {
      return "";
    }

    const result =
      new Date(`${date}T00:00:00`);


    switch (frequency) {

      case "DAILY":

        result.setDate(
          result.getDate() + 1
        );

        break;


      case "WEEKLY":

        result.setDate(
          result.getDate() + 7
        );

        break;


      case "MONTHLY":

        result.setMonth(
          result.getMonth() + 1
        );

        break;


      case "YEARLY":

        result.setFullYear(
          result.getFullYear() + 1
        );

        break;


      default:

        return "";
    }


    return result
      .toISOString()
      .split("T")[0];
  };


  // ------------------------------------------
  // Reset form when opened
  // ------------------------------------------

  useEffect(() => {

    if (open) {

      const today =
        new Date()
          .toISOString()
          .split("T")[0];


      setPrincipalAmount("");

      setInterestType("SIMPLE");

      setInterestRate("");

      setInterestFrequency("MONTHLY");

      setLoanDate(today);

      setNotes("");
    }

  }, [open]);


  if (!open) {
    return null;
  }


  // ------------------------------------------
  // Submit
  // ------------------------------------------

  const handleSubmit = (e) => {

    e.preventDefault();


    const principal =
      Number(principalAmount);

    const rate =
      Number(interestRate);


    // Principal validation

    if (
      !principal ||
      principal <= 0
    ) {

      alert(
        "Please enter a valid principal amount."
      );

      return;
    }


    // Interest validation

    if (rate < 0) {

      alert(
        "Interest rate cannot be negative."
      );

      return;
    }


    // Loan date validation

    if (!loanDate) {

      alert(
        "Please select loan date."
      );

      return;
    }


    // Calculate next interest date

    const nextInterestDate =
      calculateNextInterestDate(
        loanDate,
        interestFrequency
      );


    // ------------------------------------------
    // Create request
    // ------------------------------------------

    const request = {

      customerId:
        Number(customerId),

      loanDirection:
        isLend
          ? "LEND"
          : "BORROW",

      principalAmount:
        principal,

      interestType:
        interestType,

      interestRate:
        rate,

      interestFrequency:
        interestFrequency,

      nextInterestDate:
        nextInterestDate,

      loanDate:
        loanDate,

      notes:
        notes.trim() || null,
    };


    console.log(
      "Loan Request:",
      request
    );


    if (onSubmit) {

      onSubmit(request);

    }
  };


  return (

    <div
      className="loan-action-overlay"
      onClick={onClose}
    >

      <div
        className="loan-action-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* Header */}

        <div className="loan-action-header">

          <div className="loan-action-title">

            <div
              className={`loan-action-icon ${
                isLend
                  ? "lend-modal-icon"
                  : "borrow-modal-icon"
              }`}
            >

              {isLend
                ? <FaUniversity />
                : <FaHandHoldingUsd />
              }

            </div>


            <div>

              <h2>
                {isLend
                  ? "Lend Money"
                  : "Borrow Money"
                }
              </h2>


              <p>

                {isLend
                  ? "Create a new loan for this customer"
                  : "Record money borrowed from this customer"
                }

              </p>

            </div>

          </div>


          <button
            type="button"
            className="loan-action-close"
            onClick={onClose}
          >

            <FaTimes />

          </button>

        </div>


        {/* Form */}

        <form
          className="loan-action-form"
          onSubmit={handleSubmit}
        >

          {/* Principal */}

          <div className="loan-field">

            <label>
              Principal Amount
            </label>


            <div className="loan-amount-input">

              <span>
                ₹
              </span>


              <input
                type="number"
                min="0"
                step="100"
                value={principalAmount}
                onChange={(e) =>
                  setPrincipalAmount(
                    e.target.value
                  )
                }
                placeholder="0"
                autoFocus
              />

            </div>

          </div>


          {/* Interest Type */}

          <div className="loan-field">

            <label>
              Interest Type
            </label>


            <select
              value={interestType}
              onChange={(e) =>
                setInterestType(
                  e.target.value
                )
              }
            >

              <option value="SIMPLE">
                Simple
              </option>

            </select>

          </div>


          {/* Interest Rate */}

          <div className="loan-field">

            <label>
              Interest Rate
            </label>


            <div className="loan-rate-input">

              <input
                type="number"
                min="0"
                step="0.1"
                value={interestRate}
                onChange={(e) =>
                  setInterestRate(
                    e.target.value
                  )
                }
                placeholder="0"
              />


              <span>
                %
              </span>

            </div>

          </div>


          {/* Interest Frequency */}

          <div className="loan-field">

            <label>
              Interest Frequency
            </label>


            <select
              value={interestFrequency}
              onChange={(e) =>
                setInterestFrequency(
                  e.target.value
                )
              }
            >

              <option value="DAILY">
                Daily
              </option>

              <option value="WEEKLY">
                Weekly
              </option>

              <option value="MONTHLY">
                Monthly
              </option>

              <option value="YEARLY">
                Yearly
              </option>

            </select>

          </div>


          {/* Dates */}

          <div className="loan-date-grid">


            {/* Loan Date */}

            <div className="loan-field">

              <label>
                Loan Date
              </label>


              <input
                type="date"
                value={loanDate}
                onChange={(e) =>
                  setLoanDate(
                    e.target.value
                  )
                }
              />

            </div>


            {/* Next Interest Date */}

            <div className="loan-field">

              <label>
                Next Interest Date
              </label>


              <div className="calculated-date">

                {calculateNextInterestDate(
                  loanDate,
                  interestFrequency
                )}

              </div>

            </div>

          </div>


          {/* Notes */}

          <div className="loan-field">

            <label>
              Notes
            </label>


            <textarea
              value={notes}
              onChange={(e) =>
                setNotes(
                  e.target.value
                )
              }
              placeholder="Add loan notes..."
              rows="3"
            />

          </div>


          {/* Buttons */}

          <div className="loan-action-buttons">

            <button
              type="button"
              className="loan-cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>


            <button
              type="submit"
              className={`loan-submit-btn ${
                isLend
                  ? "lend-submit"
                  : "borrow-submit"
              }`}
            >

              {isLend
                ? "Create Loan"
                : "Create Borrowing"
              }

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default LoanActionModal;