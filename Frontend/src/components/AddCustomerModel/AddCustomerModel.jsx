import "./AddCustomerModel.css";
import { useState } from "react";

export default function AddCustomerModal({ open, onClose, onSave }) {

    const [customer, setCustomer] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        notes: ""
    });

    const handleChange = (e) => {

        setCustomer({
            ...customer,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = () => {

        if (!customer.name.trim()) {
            alert("Customer name is required");
            return;
        }

        if (!customer.phone.trim()) {
            alert("Phone number is required");
            return;
        }

        onSave(customer);

        setCustomer({
            name: "",
            phone: "",
            email: "",
            address: "",
            notes: ""
        });

    };

    if (!open) return null;

    return (

        <div className="modal-overlay">

            <div className="customer-modal">

                <h2>Add Customer</h2>

                <input
                    type="text"
                    placeholder="Customer Name"
                    name="name"
                    value={customer.name}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    placeholder="Phone Number"
                    name="phone"
                    value={customer.phone}
                    onChange={handleChange}
                />

                <input
                    type="email"
                    placeholder="Email (Optional)"
                    name="email"
                    value={customer.email}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    placeholder="Address (Optional)"
                    name="address"
                    value={customer.address}
                    onChange={handleChange}
                />

                <textarea
                    placeholder="Notes (Optional)"
                    name="notes"
                    value={customer.notes}
                    onChange={handleChange}
                />

                <div className="modal-buttons">

                    <button
                        className="cancel-btn"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="save-btn"
                        onClick={handleSubmit}
                    >
                        Save
                    </button>

                </div>

            </div>

        </div>

    );

}