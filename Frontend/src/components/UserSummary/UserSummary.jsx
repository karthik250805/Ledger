import "./UserSummary.css";

export default function UserSummary({ summary }) {

    return (

        <div className="summary-card">

            <div className="summary-header">

                <h2>Current Balance</h2>

                <h1
                    className={
                        summary.cashBalance >= 0
                            ? "positive-balance"
                            : "negative-balance"
                    }
                >
                    ₹{" "}
                    {Math.abs(
                        Number(summary.cashBalance)
                    ).toLocaleString()}
                </h1>

            </div>


            <div className="summary-grid">

                {/* Money To Receive */}

                <div className="summary-item receive">

                    <p>To Receive</p>

                    <h3>
                        ₹{" "}
                        {Number(
                            summary.moneyToReceive
                        ).toLocaleString()}
                    </h3>

                </div>


                {/* Net Position */}

                <div className="summary-item worth">

                    <p>To pay</p>

                    <h3>
                        ₹{" "}
                        {Number(
                            summary.moneyToPay
                        ).toLocaleString()}
                    </h3>

                </div>

                <div className="summary-item worth">

                    <p>Net Position</p>

                    <h3>
                        ₹{" "}
                        {Number(
                            summary.netPosition
                        ).toLocaleString()}
                    </h3>

                </div>

            </div>

        </div>

    );
}