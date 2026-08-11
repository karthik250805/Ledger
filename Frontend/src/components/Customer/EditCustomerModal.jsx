import "./EditCustomerModal.css";

import { useEffect, useState } from "react";

import {
    FaTimes,
    FaUserEdit
} from "react-icons/fa";


const EditCustomerModal = ({
    open,
    customer,
    onClose,
    onSave
}) => {

    if (!open) {
        return null;
    }

    const [formData, setFormData] =
        useState({
            name: "",
            phone: "",
            email: "",
            address: "",
            notes: ""
        });


    // Fill form when customer changes

    useEffect(() => {

        if (customer) {

            setFormData({

                name:
                    customer.name || "",

                phone:
                    customer.phone || "",

                email:
                    customer.email || "",

                address:
                    customer.address || "",

                notes:
                    customer.notes || ""

            });

        }

    }, [customer]);


    if (!open) {
        return null;
    }


    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]:
                e.target.value

        });

    };


    const handleSubmit = (e) => {

        e.preventDefault();


        if (!formData.name.trim()) {

            alert(
                "Customer name is required"
            );

            return;

        }


        if (!formData.phone.trim()) {

            alert(
                "Phone number is required"
            );

            return;

        }


        onSave({

            name:
                formData.name.trim(),

            phone:
                formData.phone.trim(),

            email:
                formData.email.trim(),

            address:
                formData.address.trim(),

            notes:
                formData.notes.trim()

        });

    };


    return (

        <div
            className="edit-customer-overlay"
            onClick={onClose}
        >

            <div
                className="edit-customer-modal"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >


                {/* Header */}

                <div className="edit-customer-header">

                    <div className="edit-customer-title">

                        <div className="edit-customer-icon">

                            <FaUserEdit />

                        </div>

                        <div>

                            <h2>
                                Edit Customer
                            </h2>

                            <p>
                                Update customer details
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        className="edit-customer-close"
                        onClick={onClose}
                    >

                        <FaTimes />

                    </button>

                </div>


                {/* Form */}

                <form
                    className="edit-customer-form"
                    onSubmit={handleSubmit}
                >


                    <div className="edit-field">

                        <label>
                            Customer Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={
                                formData.name
                            }
                            onChange={
                                handleChange
                            }
                        />

                    </div>


                    <div className="edit-field">

                        <label>
                            Phone Number
                        </label>

                        <input
                            type="text"
                            name="phone"
                            value={
                                formData.phone
                            }
                            onChange={
                                handleChange
                            }
                        />

                    </div>


                    <div className="edit-field">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={
                                formData.email
                            }
                            onChange={
                                handleChange
                            }
                        />

                    </div>


                    <div className="edit-field">

                        <label>
                            Address
                        </label>

                        <input
                            type="text"
                            name="address"
                            value={
                                formData.address
                            }
                            onChange={
                                handleChange
                            }
                        />

                    </div>


                    <div className="edit-field">

                        <label>
                            Notes
                        </label>

                        <textarea
                            name="notes"
                            rows="3"
                            value={
                                formData.notes
                            }
                            onChange={
                                handleChange
                            }
                        />

                    </div>


                    {/* Buttons */}

                    <div className="edit-customer-actions">

                        <button
                            type="button"
                            className="edit-cancel-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="edit-save-btn"
                        >
                            Save Changes
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};


export default EditCustomerModal;