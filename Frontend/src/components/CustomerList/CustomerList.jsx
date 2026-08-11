import CustomerCard from "../CustomerCard/CustomerCard";
import "./CustomerList.css";

export default function CustomerList({ customers, searchTerm }) {

    const filteredCustomers = customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
    );

    if (filteredCustomers.length === 0) {
        return (
            <div className="empty-list">
                No Customers Found
            </div>
        );
    }

    return (
        <div className="customer-list">

            {filteredCustomers.map((customer) => (

                <CustomerCard
                    key={customer.id}
                    customer={customer}
                />

            ))}

        </div>
    );

}