import "./CustomerHeader.css";
import {
    FaArrowLeft,
    FaEdit,
    FaTrash
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";


const CustomerHeader = ({
    customer,
    onEdit,
    onDelete
}) => {

    const navigate = useNavigate();


    return (

        <div className="customer-header">

            {/* BACK BUTTON */}

            <div
                className="back-button"
                onClick={() => navigate(-1)}
            >
                <FaArrowLeft />
            </div>


            {/* CUSTOMER INFO */}

            <div className="customer-info">

                <h2>
                    {customer.name}
                </h2>

                <p>
                    {customer.phone}
                </p>

            </div>


            {/* ACTION BUTTONS */}

            <div className="customer-header-actions">

                {/* EDIT */}

                <div
                    className="edit-button"
                    onClick={onEdit}
                    title="Edit Customer"
                >
                    <FaEdit />
                </div>


                {/* DELETE */}

                <div
                    className="delete-button"
                    onClick={onDelete}
                    title="Delete Customer"
                >
                    <FaTrash />
                </div>

            </div>

        </div>

    );

};


export default CustomerHeader;