import "./BottomActionBar.css";

import {
  FaArrowUp,
  FaArrowDown,
  FaUniversity,
  FaHandHoldingUsd,
} from "react-icons/fa";

const BottomActionBar = ({
  onGive,
  onReceive,
  onLend,
  onBorrow,
}) => {
  return (
    <div className="bottom-action-bar">

      <button
        className="action-btn"
        onClick={onGive}
      >
        <div className="action-icon give-icon">
          <FaArrowUp />
        </div>

        <span>Give</span>
      </button>

      <button
        className="action-btn"
        onClick={onReceive}
      >
        <div className="action-icon receive-icon">
          <FaArrowDown />
        </div>

        <span>Receive</span>
      </button>

      <button
        className="action-btn"
        onClick={onLend}
      >
        <div className="action-icon lend-icon">
          <FaUniversity />
        </div>

        <span>Lend</span>
      </button>

      <button
        className="action-btn"
        onClick={onBorrow}
      >
        <div className="action-icon borrow-icon">
          <FaHandHoldingUsd />
        </div>

        <span>Borrow</span>
      </button>

    </div>
  );
};

export default BottomActionBar;