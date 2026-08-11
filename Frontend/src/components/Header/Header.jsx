import "./Header.css";
import { FiRefreshCw } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";

export default function Header({onAddCustomer}) {

    return (
      <header className="header">
        <h2 className="logo">Transaction Ledger</h2>

        <div className="header-icons">
          <button className="icon-btn">
            <FiRefreshCw />
          </button>

          <button className="icon-btn add-btn" onClick={onAddCustomer}>
            <FiPlus />
          </button>
        </div>
      </header>
    );

}