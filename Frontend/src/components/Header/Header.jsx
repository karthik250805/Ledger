import "./Header.css";
import { FiRefreshCw } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";

export default function Header({
    onAddCustomer,
    onRefresh
}) {

    return (
        <header className="header">

            <h2 className="logo">
                Transaction Ledger
            </h2>

            <div className="header-icons">

                <button
                    className="icon-btn"
                    onClick={onRefresh}
                >
                    <FiRefreshCw />
                </button>

                <button
                    className="icon-btn add-btn"
                    onClick={onAddCustomer}
                >
                    <FiPlus />
                </button>

            </div>

        </header>
    );
}