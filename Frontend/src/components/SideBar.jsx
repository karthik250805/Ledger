import "./SideBar.css";

import {
    FaHome,
    FaChartPie,
    FaUser,
    FaSyncAlt
} from "react-icons/fa";

import { NavLink } from "react-router-dom";


const Sidebar = () => {

    return (

        <aside className="sidebar">

            <div className="sidebar-logo">
                <h2>Ledger</h2>
            </div>


            <nav className="sidebar-nav">

                <NavLink
                    to="/home"
                    className={({ isActive }) =>
                        `sidebar-link ${isActive ? "active" : ""}`
                    }
                >
                    <FaHome />
                    <span>Home</span>
                </NavLink>


                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `sidebar-link ${isActive ? "active" : ""}`
                    }
                >
                    <FaChartPie />
                    <span>Dashboard</span>
                </NavLink>


                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        `sidebar-link ${isActive ? "active" : ""}`
                    }
                >
                    <FaUser />
                    <span>Profile</span>
                </NavLink>


                <NavLink
                    to="/recurring"
                    className={({ isActive }) =>
                        `sidebar-link ${isActive ? "active" : ""}`
                    }
                >
                    <FaSyncAlt />
                    <span>Recurring</span>
                </NavLink>

            </nav>

        </aside>
    );
};


export default Sidebar;