import "./LoanListBottomSheet.css";
import {
  FaTimes,
  FaUniversity,
  FaArrowRight
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const LoanListBottomSheet = ({
  open,
  onClose,
  loans = []
}) => {

  const navigate = useNavigate();

  if (!open) return null;

  return (

    <div
      className="loan-sheet-overlay"
      onClick={onClose}
    >

      <div
        className="loan-sheet"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="loan-sheet-header">

          <h2>Active Loans</h2>

          <button onClick={onClose}>
            <FaTimes />
          </button>

        </div>

        <div className="loan-list">

          {
            loans.length === 0 ? (

              <div className="no-loans">

                <FaUniversity />

                <h3>No Active Loans</h3>

                <p>No active loans found.</p>

              </div>

            ) : (

              loans.map((loan) => (

                <div
                  className={`loan-card ${
                    loan.loanDirection === "LEND"
                      ? "lend"
                      : "borrow"
                  }`}
                  key={loan.loanId}
                >

                  <div className="loan-card-top">

                    <div className="loan-icon">
                      <FaUniversity />
                    </div>

                    <div className="loan-info">

                      <h3>
                        {loan.loanDirection === "LEND"
                          ? "Money Lent (You Get)"
                          : "Money Borrowed (You Pay)"}
                      </h3>

                      <span>
                        {loan.loanDate}
                      </span>

                    </div>

                  </div>

                  <div className="loan-details">

                    <div>

                      <label>Outstanding</label>

                      <h2>
                        ₹
                        {Number(
                          loan.outstandingPrincipal
                        ).toLocaleString()}
                      </h2>

                    </div>

                    <div>

                      <label>Interest</label>

                      <h4>
                        {loan.interestRate}% /
                        {loan.interestFrequency}
                      </h4>

                    </div>

                  </div>

                  <div className="loan-footer">

                    <span
                      className={`status ${
                        loan.status.toLowerCase()
                      }`}
                    >
                      {loan.status}
                    </span>

                    <button
                      onClick={() =>
                        navigate(`/loan/${loan.loanId}`)
                      }
                    >
                      View Details
                      <FaArrowRight />
                    </button>

                  </div>

                </div>

              ))

            )

          }

        </div>

      </div>

    </div>

  );

};

export default LoanListBottomSheet;