import "./Dashboard.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaWallet,
    FaArrowDown,
    FaArrowUp,
    FaChartLine,
    FaMoneyBillWave,
    FaPiggyBank,
    FaHandHoldingUsd,
    FaFileInvoiceDollar,
    FaCheckCircle,
    FaClock,
    FaSyncAlt
} from "react-icons/fa";

import { getDashboard } from "../../API/dashboardapi";
import { getLoanDashboard } from "../../API/loanDashboardapi";

import Sidebar from "../../components/SideBar";


const Dashboard = () => {

    const navigate = useNavigate();


    // =====================================================
    // DASHBOARD DATA
    // =====================================================

    const [dashboard, setDashboard] = useState(null);

    const [loanDashboard, setLoanDashboard] = useState(null);


    // =====================================================
    // LOADING / ERROR
    // =====================================================

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================================
    // FORMAT MONEY
    // =====================================================

    const formatMoney = (value) => {

        const amount = Number(value || 0);

        return `₹${amount.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };


    // =====================================================
    // LOAD DASHBOARD
    // =====================================================

    const loadDashboard = async () => {

        try {

            setLoading(true);

            setError("");


            console.log("Loading main dashboard...");

            const dashboardData =
                await getDashboard();

            console.log(
                "Main dashboard response:",
                dashboardData
            );


            setDashboard(dashboardData);


            console.log("Loading loan dashboard...");

            const loanData =
                await getLoanDashboard();

            console.log(
                "Loan dashboard response:",
                loanData
            );


            setLoanDashboard(loanData);


        } catch (error) {

            console.error(
                "Failed to load dashboard:",
                error
            );

            setError(
                error.message ||
                "Failed to load dashboard"
            );


        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // LOAD WHEN PAGE OPENS
    // =====================================================

    useEffect(() => {

        loadDashboard();

    }, []);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="dashboard-layout">

                <Sidebar />

                <main className="dashboard-main-content">

                    <div className="dashboard-loading">

                        <div className="dashboard-spinner"></div>

                        <p>
                            Loading dashboard...
                        </p>

                    </div>

                </main>

            </div>
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div className="dashboard-layout">

                <Sidebar />

                <main className="dashboard-main-content">

                    <div className="dashboard-error">

                        <div className="dashboard-error-card">

                            <h3>
                                Unable to load dashboard
                            </h3>

                            <p>
                                {error}
                            </p>

                            <button
                                onClick={loadDashboard}
                            >
                                Try Again
                            </button>

                        </div>

                    </div>

                </main>

            </div>
        );
    }


    // =====================================================
    // SAFETY CHECK
    // =====================================================

    if (!dashboard) {

        return (

            <div className="dashboard-layout">

                <Sidebar />

                <main className="dashboard-main-content">

                    <div className="dashboard-error">

                        <div className="dashboard-error-card">

                            <h3>
                                No dashboard data
                            </h3>

                            <button
                                onClick={loadDashboard}
                            >
                                Reload
                            </button>

                        </div>

                    </div>

                </main>

            </div>
        );
    }


    // =====================================================
    // MAIN DASHBOARD VALUES
    // =====================================================

    const cashBalance =
        Number(
            dashboard.cashBalance || 0
        );


    const moneyToReceive =
        Number(
            dashboard.moneyToReceive || 0
        );


    const moneyToPay =
        Number(
            dashboard.moneyToPay || 0
        );


    const netPosition =
        Number(
            dashboard.netPosition || 0
        );


    const totalIncome =
        Number(
            dashboard.totalIncome || 0
        );


    const totalExpense =
        Number(
            dashboard.totalExpense || 0
        );


    const totalSavings =
        Number(
            dashboard.totalSavings || 0
        );


    // =====================================================
    // LOAN DASHBOARD VALUES
    // =====================================================

    const activeLoans =
        Number(
            loanDashboard?.activeLoans || 0
        );


    const closedLoans =
        Number(
            loanDashboard?.closedLoans || 0
        );


    const totalInterestReceivable =
        Number(
            loanDashboard?.interestReceivable || 0
        );


    const totalInterestPayable =
        Number(
            loanDashboard?.interestPayable || 0
        );


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="dashboard-layout">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <Sidebar />


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="dashboard-main-content">

                <div className="dashboard-page">


                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="dashboard-header">

                        <div>

                            <h1>
                                Dashboard
                            </h1>

                            <p>
                                Here's your financial overview
                            </p>

                        </div>


                        <button
                            className="dashboard-refresh-btn"
                            onClick={loadDashboard}
                        >

                            <FaSyncAlt />

                            <span>
                                Refresh
                            </span>

                        </button>

                    </div>


                    {/* =================================================
                        MAIN BALANCE
                    ================================================= */}

                    <div className="dashboard-main-card">


                        <div className="dashboard-main-left">

                            <div className="dashboard-main-icon">

                                <FaWallet />

                            </div>


                            <div>

                                <span>
                                    Available Cash
                                </span>

                                <h2>
                                    {formatMoney(cashBalance)}
                                </h2>

                            </div>

                        </div>


                        <div className="dashboard-net-position">

                            <span>
                                Net Position
                            </span>

                            <strong
                                className={
                                    netPosition >= 0
                                        ? "positive"
                                        : "negative"
                                }
                            >

                                {formatMoney(netPosition)}

                            </strong>

                        </div>

                    </div>


                    {/* =================================================
                        CUSTOMER BALANCES
                    ================================================= */}

                    <div className="dashboard-section">

                        <div className="dashboard-section-title">

                            <div>

                                <h2>
                                    Customer Balances
                                </h2>

                                <span>
                                    Money coming in and going out
                                </span>

                            </div>

                        </div>


                        <div className="dashboard-card-grid">


                            {/* RECEIVE */}

                            <div className="dashboard-stat-card receive-card">

                                <div className="dashboard-stat-top">

                                    <div className="dashboard-stat-icon">

                                        <FaArrowDown />

                                    </div>

                                    <span>
                                        Money to Receive
                                    </span>

                                </div>


                                <h3>
                                    {formatMoney(moneyToReceive)}
                                </h3>


                                <p>
                                    Amount customers owe you
                                </p>

                            </div>


                            {/* PAY */}

                            <div className="dashboard-stat-card pay-card">

                                <div className="dashboard-stat-top">

                                    <div className="dashboard-stat-icon">

                                        <FaArrowUp />

                                    </div>

                                    <span>
                                        Money to Pay
                                    </span>

                                </div>


                                <h3>
                                    {formatMoney(moneyToPay)}
                                </h3>


                                <p>
                                    Amount you owe customers
                                </p>

                            </div>


                            {/* NET */}

                            <div className="dashboard-stat-card net-card">

                                <div className="dashboard-stat-top">

                                    <div className="dashboard-stat-icon">

                                        <FaChartLine />

                                    </div>

                                    <span>
                                        Net Position
                                    </span>

                                </div>


                                <h3
                                    className={
                                        netPosition >= 0
                                            ? "positive"
                                            : "negative"
                                    }
                                >

                                    {formatMoney(netPosition)}

                                </h3>


                                <p>
                                    Cash + receivables − payables
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        INCOME / EXPENSE / SAVINGS
                    ================================================= */}

                    <div className="dashboard-section">

                        <div className="dashboard-section-title">

                            <div>

                                <h2>
                                    Income & Expenses
                                </h2>

                                <span>
                                    Your overall financial performance
                                </span>

                            </div>

                        </div>


                        <div className="dashboard-finance-grid">


                            {/* INCOME */}

                            <div className="dashboard-finance-card">

                                <div className="finance-icon income-icon">

                                    <FaMoneyBillWave />

                                </div>


                                <div>

                                    <span>
                                        Total Income
                                    </span>

                                    <strong>
                                        {formatMoney(totalIncome)}
                                    </strong>

                                </div>

                            </div>


                            {/* EXPENSE */}

                            <div className="dashboard-finance-card">

                                <div className="finance-icon expense-icon">

                                    <FaArrowUp />

                                </div>


                                <div>

                                    <span>
                                        Total Expense
                                    </span>

                                    <strong>
                                        {formatMoney(totalExpense)}
                                    </strong>

                                </div>

                            </div>


                            {/* SAVINGS */}

                            <div className="dashboard-finance-card">

                                <div className="finance-icon savings-icon">

                                    <FaPiggyBank />

                                </div>


                                <div>

                                    <span>
                                        Total Savings
                                    </span>

                                    <strong
                                        className={
                                            totalSavings >= 0
                                                ? "positive"
                                                : "negative"
                                        }
                                    >
                                        {formatMoney(totalSavings)}
                                    </strong>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        LOAN OVERVIEW
                    ================================================= */}

                    <div className="dashboard-section">

                        <div className="dashboard-section-title">

                            <div>

                                <h2>
                                    Loan Overview
                                </h2>

                                <span>
                                    Current loan status and interest
                                </span>

                            </div>

                        </div>


                        <div className="dashboard-loan-grid">


                            {/* ACTIVE LOANS */}

                            <div className="dashboard-loan-card">

                                <div className="loan-dashboard-icon active-loan">

                                    <FaClock />

                                </div>


                                <div>

                                    <span>
                                        Active Loans
                                    </span>

                                    <strong>
                                        {activeLoans}
                                    </strong>

                                </div>

                            </div>


                            {/* CLOSED LOANS */}

                            <div className="dashboard-loan-card">

                                <div className="loan-dashboard-icon closed-loan">

                                    <FaCheckCircle />

                                </div>


                                <div>

                                    <span>
                                        Closed Loans
                                    </span>

                                    <strong>
                                        {closedLoans}
                                    </strong>

                                </div>

                            </div>


                            {/* INTEREST RECEIVABLE */}

                            <div className="dashboard-loan-card">

                                <div className="loan-dashboard-icon interest-receive">

                                    <FaHandHoldingUsd />

                                </div>


                                <div>

                                    <span>
                                        Interest Receivable
                                    </span>

                                    <strong>
                                        {formatMoney(
                                            totalInterestReceivable
                                        )}
                                    </strong>

                                </div>

                            </div>


                            {/* INTEREST PAYABLE */}

                            <div className="dashboard-loan-card">

                                <div className="loan-dashboard-icon interest-pay">

                                    <FaFileInvoiceDollar />

                                </div>


                                <div>

                                    <span>
                                        Interest Payable
                                    </span>

                                    <strong>
                                        {formatMoney(
                                            totalInterestPayable
                                        )}
                                    </strong>

                                </div>

                            </div>

                        </div>

                    </div>


                </div>

            </main>

        </div>
    );
};


export default Dashboard;