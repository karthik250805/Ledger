import "./LoanListBottomSheet.css";

import {
  FaTimes,
  FaUniversity,
  FaArrowRight,
  FaSyncAlt
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { refreshAllLoanInterest } from "../../API/loanapi";
// Change "../api/api" according to your actual api.js location


const LoanListBottomSheet = ({
  open,
  onClose,
  loans = [],
  customerId,
  onRefreshSuccess
}) => {

  const navigate = useNavigate();

  const [refreshing, setRefreshing] = useState(false);


  if (!open) return null;


const handleRefreshAll = async () => {

    if (!customerId) {
        alert("Customer ID not found");
        return;
    }

    try {

        setRefreshing(true);

        const today = new Date()
            .toISOString()
            .split("T")[0];

        await refreshAllLoanInterest(
            customerId,
            today
        );
        if (onRefreshSuccess) {
    await onRefreshSuccess();
}

        alert(
            "Interest refreshed successfully for all active loans"
        );

    } catch (error) {

        console.error(
            "Refresh interest error:",
            error
        );

        alert(
            error.message ||
            "Failed to refresh interest"
        );

    } finally {

        setRefreshing(false);

    }

};


  return (

    <div
      className="loan-sheet-overlay"
      onClick={onClose}
    >

      <div
        className="loan-sheet"
        onClick={(e) => e.stopPropagation()}
      >


        {/* HEADER */}

        <div className="loan-sheet-header">

          <h2>
            Active Loans
          </h2>


          <div className="loan-header-actions">


            {/* REFRESH ALL */}

            <button
              className="refresh-all-btn"
              onClick={handleRefreshAll}
              disabled={
                refreshing ||
                loans.length === 0
              }
              title="Refresh interest for all active loans"
            >

              <FaSyncAlt
                className={
                  refreshing
                    ? "refresh-icon spinning"
                    : "refresh-icon"
                }
              />

              <span>
                {refreshing
                  ? "Refreshing..."
                  : "Refresh All"
                }
              </span>

            </button>


            {/* CLOSE */}

            <button
              className="close-btn"
              onClick={onClose}
              title="Close"
            >

              <FaTimes />

            </button>


          </div>

        </div>


        {/* LOAN LIST */}

        <div className="loan-list">


          {
            loans.length === 0 ? (

              <div className="no-loans">

                <FaUniversity />

                <h3>
                  No Active Loans
                </h3>

                <p>
                  No active loans found.
                </p>

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


                  {/* LOAN HEADER */}

                  <div className="loan-card-top">

                    <div className="loan-icon">

                      <FaUniversity />

                    </div>


                    <div className="loan-info">

                      <h3>

                        {
                          loan.loanDirection === "LEND"
                            ? "Money Lent (You Get)"
                            : "Money Borrowed (You Pay)"
                        }

                      </h3>


                      <span>

                        {loan.loanDate}

                      </span>

                    </div>

                  </div>


                  {/* LOAN DETAILS */}

                  <div className="loan-details">


                    <div>

                      <label>
                        Outstanding
                      </label>

                      <h2>

                        ₹

                        {
                          Number(
                            loan.outstandingPrincipal
                          ).toLocaleString()
                        }

                      </h2>

                    </div>


                    <div>

                      <label>
                        Interest
                      </label>

                      <h4>

                        {loan.interestRate}%

                        {" / "}

                        {loan.interestFrequency}

                      </h4>

                    </div>


                  </div>


                  {/* LOAN FOOTER */}

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
                        navigate(
                          `/loan/${loan.loanId}`
                        )
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