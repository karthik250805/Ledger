// import "./CustomerBalance.css";

// export default function CustomerBalance({

//     summary,
//     onViewBalance

// }) {

//     return (

//         <div className="customer-balance-card">

//             <p className="balance-title">

//                 Overall Balance

//             </p>

//             <h1
//                 className={
//                     summary.balanceStatus === "RECEIVABLE"
//                         ? "positive-balance"
//                         : summary.balanceStatus === "PAYABLE"
//                         ? "negative-balance"
//                         : "neutral-balance"
//                 }
//             >

//                 ₹ {summary.overallBalance.toLocaleString()}

//             </h1>

//             <span
//                 className={
//                     summary.balanceStatus === "RECEIVABLE"
//                         ? "receive-text"
//                         : summary.balanceStatus === "PAYABLE"
//                         ? "pay-text"
//                         : "settled-text"
//                 }
//             >

//                 {
//                     summary.balanceStatus === "RECEIVABLE"
//                         ? "Need To Receive"
//                         : summary.balanceStatus === "PAYABLE"
//                         ? "Need To Pay"
//                         : "Settled"
//                 }

//             </span>

//             <button
//                 className="balance-details-btn"
//                 onClick={onViewBalance}
//             >

//                 Balance Details

//             </button>

//         </div>

//     );

// }