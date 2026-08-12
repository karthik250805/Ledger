import "./CustomerTransactionCard.css";

import {
  FaArrowRight,
  FaArrowDown,
  FaArrowUp,
  FaMoneyBillWave,
  FaCoins,
  FaUniversity,
  FaPercentage,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";


const CustomerTransactionCard = ({ transaction }) => {

  const navigate = useNavigate();


  // =====================================================
  // TRANSACTION DIRECTION
  // =====================================================

  const isOutgoing = [
    "GIVE",
    "LEND",
    "INTEREST_ACCRUAL",
  ].includes(transaction.transactionType);


  // =====================================================
  // LOAN TRANSACTION
  // =====================================================

  const isLoanTransaction =
    transaction.loanId !== null &&
    transaction.loanId !== undefined;


  // =====================================================
  // TITLE
  // =====================================================

  const getTitle = () => {

    switch (transaction.transactionType) {

      case "GIVE":
        return "Normal Give";

      case "RECEIVE":
        return "Normal Receive";

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
        return transaction.transactionType;
    }
  };


  // =====================================================
  // ICON
  // =====================================================

  const getIcon = () => {

    switch (transaction.transactionType) {

      case "GIVE":
        return <FaArrowUp />;

      case "RECEIVE":
        return <FaArrowDown />;

      case "LEND":
        return <FaUniversity />;

      case "BORROW":
        return <FaMoneyBillWave />;

      case "INTEREST_ACCRUAL":
        return <FaPercentage />;

      case "PRINCIPAL_PAYMENT":
        return <FaCoins />;

      case "INTEREST_PAYMENT":
        return <FaCoins />;

      default:
        return <FaMoneyBillWave />;
    }
  };


  // =====================================================
  // CARD CLASS
  // =====================================================

  const getCardClass = () => {

    switch (transaction.transactionType) {

      case "GIVE":
        return "give";

      case "RECEIVE":
        return "receive";

      case "LEND":
        return "lend";

      case "BORROW":
        return "borrow";

      case "INTEREST_ACCRUAL":
        return "interest";

      case "PRINCIPAL_PAYMENT":
        return "payment";

      case "INTEREST_PAYMENT":
        return "payment";

      default:
        return "";
    }
  };


  // =====================================================
  // OUTSTANDING AMOUNT
  // =====================================================

  const outstanding =
    Number(
      transaction.outstandingAfterTransaction
    ) || 0;


  // =====================================================
  // BALANCE STATUS
  // =====================================================

  /*
   * IMPORTANT:
   *
   * Customer Summary returns:
   *
   * PAYABLE     -> customer has to pay us
   * RECEIVABLE  -> customer has to receive from us
   * SETTLED     -> nothing outstanding
   *
   * The amount itself may always be positive,
   * therefore we must NOT determine the status
   * only from the amount.
   */

  let balanceText;

  let balanceClass;


  if (
    transaction.balanceStatus === "PAYABLE"
  ) {

    balanceText = "To Pay";

    balanceClass = "negative";

  } else if (
    transaction.balanceStatus === "RECEIVABLE"
  ) {

    balanceText = "To Receive";

    balanceClass = "positive";

  } else if (
    transaction.balanceStatus === "SETTLED"
  ) {

    balanceText = "Settled";

    balanceClass = "neutral";

  } else {

    // =================================================
    // FALLBACK
    // =================================================
    // Used for older transactions where
    // balanceStatus isn't available.
    // =================================================

    if (outstanding > 0) {

      balanceText = "To Receive";

      balanceClass = "positive";

    } else if (outstanding < 0) {

      balanceText = "To Pay";

      balanceClass = "negative";

    } else {

      balanceText = "Settled";

      balanceClass = "neutral";
    }
  }


  // =====================================================
  // DISPLAY OUTSTANDING
  // =====================================================

  const displayOutstanding =
    Math.abs(
      outstanding
    ).toLocaleString();


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div
      className={`transaction-row ${
        isOutgoing
          ? "right-align"
          : "left-align"
      }`}
    >

      <div
        className={`transaction-card ${getCardClass()}`}

        onClick={() => {

          if (isLoanTransaction) {

            navigate(
              `/loan/${transaction.loanId}`
            );

          }

        }}
      >

        {/* =================================================
            TOP
        ================================================= */}

        <div className="transaction-top">


          {/* ICON */}

          <div className="transaction-icon">

            {getIcon()}

          </div>


          {/* TITLE */}

          <div className="transaction-title-section">

            <h4>
              {getTitle()}
            </h4>


            {transaction.description && (

              <p>
                {transaction.description}
              </p>

            )}

          </div>


          {/* AMOUNT */}

          <div className="transaction-amount-section">

            <h2>

              ₹
              {Number(
                transaction.amount
              ).toLocaleString()}

            </h2>


            {transaction.createdAt && (

              <span>

                {new Date(
                  transaction.createdAt
                ).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}

              </span>

            )}

          </div>

        </div>


        {/* =================================================
            BOTTOM
        ================================================= */}

        <div className="transaction-bottom">


          {/* OUTSTANDING */}

          <div
            className={`outstanding-badge ${balanceClass}`}
          >

            <span className="label">

              Outstanding

            </span>


            <span className="value">

              ₹
              {displayOutstanding}

            </span>


            <span className="status">

              {balanceText}

            </span>

          </div>


          {/* LOAN ARROW */}

          {isLoanTransaction && (

            <div className="loan-arrow">

              <FaArrowRight />

            </div>

          )}

        </div>

      </div>

    </div>

  );

};


export default CustomerTransactionCard;