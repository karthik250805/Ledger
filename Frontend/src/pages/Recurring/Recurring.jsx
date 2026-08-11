import "./Recurring.css";

import { FaSyncAlt, FaClock } from "react-icons/fa";

import Sidebar from "../../components/SideBar";

const Recurring = () => {

    return (

        <div className="recurring-layout">

            {/* Sidebar */}

            <Sidebar />


            {/* Main Content */}

            <main className="recurring-main-content">

                <div className="recurring-page">

                    <div className="recurring-content">

                        <div className="recurring-icon">

                            <FaSyncAlt />

                        </div>


                        <h1>
                            Recurring Transactions
                        </h1>


                        <h2>
                            Functionality in Progress
                        </h2>


                        <p>
                            We are currently working on recurring
                            transactions. Soon you will be able to
                            manage recurring income, expenses, EMIs,
                            salaries, and interest payments automatically.
                        </p>


                        <div className="recurring-features">

                            <div>

                                <FaClock />

                                <span>
                                    Scheduled Transactions
                                </span>

                            </div>


                            <div>

                                <FaSyncAlt />

                                <span>
                                    Automatic Recurring Payments
                                </span>

                            </div>

                        </div>


                        <span className="recurring-status">
                            Coming Soon
                        </span>

                    </div>

                </div>

            </main>

        </div>
    );
};

export default Recurring;