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

  const isOutgoing = [
    "GIVE",
    "LEND",
    "INTEREST_ACCRUAL",
  ].includes(transaction.transactionType);

  const isLoanTransaction = transaction.loanId !== null;

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

  const outstanding = Number(transaction.outstandingAfterTransaction);

  const balanceText =
    outstanding > 0
      ? "To Receive"
      : outstanding < 0
      ? "To Pay"
      : "Settled";

  const balanceClass =
    outstanding > 0
      ? "positive"
      : outstanding < 0
      ? "negative"
      : "neutral";

  return (
    <div
      className={`transaction-row ${
        isOutgoing ? "right-align" : "left-align"
      }`}
    >
      <div
        className={`transaction-card ${getCardClass()}`}
        onClick={() => {
          if (isLoanTransaction) {
            navigate(`/loan/${transaction.loanId}`);
          }
        }}
      >
        <div className="transaction-top">

          <div className="transaction-icon">
            {getIcon()}
          </div>

          <div className="transaction-title-section">

            <h4>{getTitle()}</h4>

            {transaction.description && (
              <p>{transaction.description}</p>
            )}

          </div>

          <div className="transaction-amount-section">

            <h2>
              ₹{Number(transaction.amount).toLocaleString()}
            </h2>

            <span>
              {new Date(transaction.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>

          </div>

        </div>

        <div className="transaction-bottom">

          <div className={`outstanding-badge ${balanceClass}`}>

            <span className="label">
              Outstanding
            </span>

            <span className="value">
              ₹
              {Math.abs(
                Number(transaction.outstandingAfterTransaction)
              ).toLocaleString()}
            </span>

            <span className="status">
              {balanceText}
            </span>

          </div>

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