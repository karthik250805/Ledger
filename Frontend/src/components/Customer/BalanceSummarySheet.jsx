import "./BalanceSummarySheet.css";
import { FaTimes } from "react-icons/fa";

const BalanceSummarySheet = ({ open, onClose, summary }) => {
  if (!open) {
    return null;
  }

  /*
   * Safely read values from backend response
   */

  const totalGiven = Number(summary?.totalGiven ?? 0);

  const totalReceived = Number(summary?.totalReceived ?? 0);

  const totalLendPrincipal = Number(summary?.totalLendPrincipal ?? 0);

  const totalLendOutstanding = Number(summary?.totalLendOutstanding ?? 0);

  const totalBorrowPrincipal = Number(summary?.totalBorrowPrincipal ?? 0);

  const totalBorrowOutstanding = Number(summary?.totalBorrowOutstanding ?? 0);

  const overallBalance = Number(summary?.overallBalance ?? 0);

  const balanceStatus = summary?.balanceStatus ?? "SETTLED";

  /*
   * Status text
   */

  let statusText = "Settled";

  if (balanceStatus === "RECEIVABLE") {
    statusText = "Need To Receive";
  } else if (balanceStatus === "PAYABLE") {
    statusText = "Need To Pay";
  }

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="balance-sheet" onClick={(e) => e.stopPropagation()}>
        {/* =========================
                    HEADER
                ========================= */}

        <div className="sheet-header">
          <h2>Balance Summary</h2>

          <button type="button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* =========================
                    CONTENT
                ========================= */}

        <div className="sheet-content">
          {/* TOTAL GIVEN */}

          <div className="sheet-row">
            <span>Total Given</span>

            <b>₹{totalGiven.toLocaleString()}</b>
          </div>

          {/* TOTAL RECEIVED */}

          <div className="sheet-row">
            <span>Total Received</span>

            <b>₹{totalReceived.toLocaleString()}</b>
          </div>

          <hr />

          {/* LEND PRINCIPAL */}

          <div className="sheet-row">
            <span>Lend Principal</span>

            <b>₹{totalLendPrincipal.toLocaleString()}</b>
          </div>

          {/* LEND OUTSTANDING */}

          <div className="sheet-row">
            <span>Lend Outstanding</span>

            <b>₹{totalLendOutstanding.toLocaleString()}</b>
          </div>

          {/* BORROW PRINCIPAL */}

          <div className="sheet-row">
            <span>Borrow Principal</span>

            <b>₹{totalBorrowPrincipal.toLocaleString()}</b>
          </div>

          {/* BORROW OUTSTANDING */}

          <div className="sheet-row">
            <span>Borrow Outstanding</span>

            <b>₹{totalBorrowOutstanding.toLocaleString()}</b>
          </div>

          <hr />

          {/* OVERALL BALANCE */}

          <div className="sheet-row total">
            <span>Overall Balance</span>

            <b>₹{overallBalance.toLocaleString()}</b>
          </div>

          {/* STATUS */}

          <div className="status">{statusText}</div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSummarySheet;
