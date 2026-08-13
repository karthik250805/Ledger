import "./Layout.css";

import Chatbot from "../ChatBot/ChatBot";
import Sidebar from "../SideBar";
const Layout = ({ children }) => {

    return (

        <div className="app-layout">

            <Sidebar />

            <main className="main-content">

                {children}

            </main>

            <Chatbot/>
        </div>

    );

};

export default Layout;