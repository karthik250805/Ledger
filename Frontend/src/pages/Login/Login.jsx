import { useState } from "react";
import "./Login.css";
import { FaEye, FaEyeSlash, FaWallet } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/AuthService";

export default function Login() {

    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({

        email: "",
        password: ""

    });
    const handleChange = (e) => {

    setLoginData({

        ...loginData,

        [e.target.name]: e.target.value

    });

    };
    const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        const response = await loginUser(loginData);

        localStorage.setItem("token", response.data.token);

        alert("Login Successful");

        navigate("/home");

    }
    catch (error) {

        if (error.response) {

            alert(error.response.data.message);

        } else {

            alert("Backend Server Not Running");

        }

    }

};

    return (

        <div className="login-container">

            {/* Left Side */}

            <div className="left-panel">

                <div className="overlay">

                    <FaWallet className="wallet-icon" />

                    <h1>Transaction Ledger</h1>

                    <p>
                        Track every transaction,
                        manage your earnings,
                        control your expenses,
                        and grow your savings.
                    </p>

                </div>

            </div>

            {/* Right Side */}

            <div className="right-panel">

                <div className="login-card">

                    <h2>Welcome Back 👋</h2>

                    <p className="subtitle">
                        Login to continue managing your finances.
                    </p>

                    <form onSubmit={handleSubmit}>

                        <div className="input-group">

                            <label>Email</label>

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={loginData.email}
                                onChange={handleChange}
                            />

                        </div>

                        <div className="input-group">

                            <label>Password</label>

                            <div className="password-box">

                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter password"
                                    value={loginData.password}
                                    onChange={handleChange}
                                    />

                                <span
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>

                            </div>

                        </div>

                        <div className="options">

                            <label>

                                <input type="checkbox" />

                                Remember Me

                            </label>

                            <a href="#">Forgot Password?</a>

                        </div>

                        <button className="login-btn">

                            Login

                        </button>

                    </form>

                    <p className="signup-text">

                        Don't have an account?

                        <a href="/signup"> Sign Up</a>

                    </p>

                </div>

            </div>

        </div>

    );
}