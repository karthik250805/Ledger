import "./LoanQuickAction.css";

import {
    FaSyncAlt,
    FaCoins,
    FaCheckCircle
} from "react-icons/fa";

const LoanQuickActions = ({
    onRefreshInterest,
    onPartialPayment,
    onFullPayment,
    disabled = false
}) => {

    return (

        <section className="loan-quick-actions">

            <h3>Quick Actions</h3>

            <div className="loan-action-grid">

                {/* Refresh Interest */}

                <button
                    className="loan-action-btn refresh-action"
                    onClick={onRefreshInterest}
                    disabled={disabled}
                >

                    <div className="loan-action-icon">
                        <FaSyncAlt />
                    </div>

                    <span>
                        Refresh
                    </span>

                    <small>
                        Interest
                    </small>

                </button>


                {/* Partial Payment */}

                <button
                    className="loan-action-btn partial-action"
                    onClick={onPartialPayment}
                    disabled={disabled}
                >

                    <div className="loan-action-icon">
                        <FaCoins />
                    </div>

                    <span>
                        Partial
                    </span>

                    <small>
                        Payment
                    </small>

                </button>


                {/* Full Payment */}

                <button
                    className="loan-action-btn full-action"
                    onClick={onFullPayment}
                    disabled={disabled}
                >

                    <div className="loan-action-icon">
                        <FaCheckCircle />
                    </div>

                    <span>
                        Full
                    </span>

                    <small>
                        Payment
                    </small>

                </button>

            </div>

        </section>
    );
};

export default LoanQuickActions;