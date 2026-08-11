import "./CustomerCard.css";
import { FaUserCircle } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function CustomerCard({ customer }) {

    const navigate = useNavigate();

    return (

        <div
            className="customer-card"
            onClick={() => navigate(`/customer/${customer.id}`)}
        >

            <div className="customer-left">

                <FaUserCircle className="customer-avatar"/>

                <div>

                    <h3>{customer.name}</h3>

                    <p>{customer.phone}</p>

                </div>

            </div>

            <div className="customer-right">

                <h2>
                    ₹
                    {Number(
                        customer.currentBalance || 0
                    ).toLocaleString()}
                </h2>

                <span
                    className={
                        customer.balanceStatus === "RECEIVABLE"
                            ? "receive"
                            : "pay"
                    }
                >

                    {
                        customer.balanceStatus === "RECEIVABLE"
                            ? "To Receive"
                            : customer.balanceStatus === "PAYABLE"
                                ? "To Pay"
                                : "Settled"
                    }

                </span>

            </div>

            <FiChevronRight className="arrow"/>

        </div>

    );

}