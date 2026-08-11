import "./CustomerHeader.css";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CustomerHeader = ({ customer, onEdit }) => {

    const navigate = useNavigate();

    return (

        <div className="customer-header">

            <div
                className="back-button"
                onClick={() => navigate(-1)}
            >
                <FaArrowLeft />
            </div>

            <div className="customer-info">

                <h2>
                    {customer.name}
                </h2>

                <p>
                    {customer.phone}
                </p>

            </div>

            <div
                className="edit-button"
                onClick={onEdit}
            >
                <FaEdit />
            </div>

        </div>

    );
};

export default CustomerHeader;