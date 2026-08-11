import "./CustomerSummary.css";
import { FaWallet, FaUniversity, FaArrowRight } from "react-icons/fa";

const CustomerSummary = ({
  balance,
  balanceStatus,
  activeLoans,
  activeLoanAmount,
  onViewLoans,
  onViewBalance,
}) => {
  return (
    <div className="customer-summary">
      {/* Overall Balance */}

      <div className="summary-card balance-summary">
        <div className="summary-header">
          <div className="summary-circle green">
            <FaWallet />
          </div>

          <span className="summary-title">Overall Balance</span>
        </div>

        <h2 className="summary-amount">₹{Number(balance).toLocaleString()}</h2>

        <p
          className={
            balanceStatus === "RECEIVABLE"
              ? "receive"
              : balanceStatus === "PAYABLE"
                ? "pay"
                : "settled"
          }
        >
          {balanceStatus === "RECEIVABLE"
            ? "Need To Receive"
            : balanceStatus === "PAYABLE"
              ? "Need To Pay"
              : "Settled"}
        </p>

        <button className="balance-details-btn" onClick={onViewBalance}>
          View Balance Details
        </button>
      </div>

      {/* Active Loans */}

      {/* Active Loans */}

      <div className="summary-card loan-summary">
        <div className="summary-header">
          <div className="summary-circle purple">
            <FaUniversity />
          </div>

          <span className="summary-title">Active Loans</span>
        </div>

        <h2 className="summary-amount">{activeLoans}</h2>

        <small>₹{Number(activeLoanAmount).toLocaleString()} Outstanding</small>

        <button className="loan-details-btn" onClick={onViewLoans}>
          View Active Loans
        </button>
      </div>
    </div>
  );
};

export default CustomerSummary;
