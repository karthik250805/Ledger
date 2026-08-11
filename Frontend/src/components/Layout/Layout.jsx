import "./Layout.css";

import Sidebar from "../SideBar";
const Layout = ({ children }) => {

    return (

        <div className="app-layout">

            <Sidebar />

            <main className="main-content">

                {children}

            </main>

        </div>

    );

};

export default Layout;