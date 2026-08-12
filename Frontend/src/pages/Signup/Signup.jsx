import { useState } from "react";
import "./signup.css";
import {
    FaWallet,
    FaEye,
    FaEyeSlash,
    FaUser,
    FaEnvelope,
    FaPhone
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import {
    signupUser,
    sendOtp,
    verifyOtp
} from "../../services/AuthService";

function Signup() {

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        terms: false
    });

    const [errors, setErrors] = useState({});

    const [otp, setOtp] = useState("");

    const [otpSent, setOtpSent] = useState(false);

    const [otpVerified, setOtpVerified] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [otpLoading, setOtpLoading] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [otpError, setOtpError] =
        useState("");

    const [resendTimer, setResendTimer] =
        useState(0);

    const navigate = useNavigate();

    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked
        } = e.target;

        setFormData({
            ...formData,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        });

        setErrors({
            ...errors,
            [name]: ""
        });
    };

    // =====================================================
    // VALIDATE SIGNUP FORM
    // =====================================================

    const validate = () => {

        let temp = {};

        if (!formData.fullName.trim()) {

            temp.fullName =
                "Full name is required.";

        }

        if (!formData.email.trim()) {

            temp.email =
                "Email is required.";

        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(formData.email)
        ) {

            temp.email =
                "Invalid email.";

        }

        if (!formData.phone.trim()) {

            temp.phone =
                "Phone number is required.";

        } else if (
            !/^[0-9]{10}$/
                .test(formData.phone)
        ) {

            temp.phone =
                "Enter valid phone number.";

        }

        if (!formData.password) {

            temp.password =
                "Password is required.";

        } else if (
            formData.password.length < 8
        ) {

            temp.password =
                "Minimum 8 characters.";

        }

        if (!formData.confirmPassword) {

            temp.confirmPassword =
                "Confirm your password.";

        } else if (
            formData.password !==
            formData.confirmPassword
        ) {

            temp.confirmPassword =
                "Passwords do not match.";

        }

        setErrors(temp);

        return Object.keys(temp).length === 0;
    };

    // =====================================================
    // START OTP TIMER
    // =====================================================

    const startResendTimer = () => {

        setResendTimer(60);

        const timer =
            setInterval(() => {

                setResendTimer(
                    previous => {

                        if (previous <= 1) {

                            clearInterval(timer);

                            return 0;
                        }

                        return previous - 1;
                    }
                );

            }, 1000);
    };

    // =====================================================
    // SEND OTP
    // =====================================================

    const handleSendOtp = async () => {

        if (!validate()) {
            return;
        }

        try {

            setOtpLoading(true);

            setMessage("");

            setOtpError("");

            await sendOtp(
                formData.email.trim()
                    .toLowerCase()
            );

            setOtpSent(true);

            setOtpVerified(false);

            setOtp("");

            setMessage(
                "OTP sent successfully to your email."
            );

            startResendTimer();

        } catch (error) {

            console.error(
                "Send OTP error:",
                error
            );

            const backendMessage =
                error?.response?.data?.message;

            setOtpError(
                backendMessage ||
                "Failed to send OTP."
            );

        } finally {

            setOtpLoading(false);
        }
    };

    // =====================================================
    // VERIFY OTP
    // =====================================================

    const handleVerifyOtp = async () => {

        if (!otp.trim()) {

            setOtpError(
                "Please enter the OTP."
            );

            return;
        }

        if (!/^[0-9]{6}$/.test(otp)) {

            setOtpError(
                "OTP must contain 6 digits."
            );

            return;
        }

        try {

            setOtpLoading(true);

            setOtpError("");

            setMessage("");

            await verifyOtp(
                formData.email.trim()
                    .toLowerCase(),
                otp
            );

            setOtpVerified(true);

            setMessage(
                "Email verified successfully."
            );

        } catch (error) {

            console.error(
                "OTP verification error:",
                error
            );

            const backendMessage =
                error?.response?.data?.message;

            setOtpError(
                backendMessage ||
                "Invalid OTP."
            );

        } finally {

            setOtpLoading(false);
        }
    };

    // =====================================================
    // FINAL SIGNUP
    // =====================================================

    const handleSignup = async () => {

        if (!otpVerified) {

            setOtpError(
                "Please verify your email first."
            );

            return;
        }

        try {

            setLoading(true);

            setMessage("");

            const signupData = {

                name:
                    formData.fullName.trim(),

                email:
                    formData.email.trim()
                        .toLowerCase(),

                phone:
                    formData.phone.trim(),

                password:
                    formData.password
            };

            await signupUser(
                signupData
            );

            alert(
                "Account created successfully!"
            );

            navigate("/");

        } catch (error) {

            console.error(
                "Signup error:",
                error
            );

            const backendMessage =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.response?.data ||
    error?.message;

setOtpError(
    typeof backendMessage === "string"
        ? backendMessage
        : "Failed to send OTP."
);

        } finally {

            setLoading(false);
        }
    };

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validate()) {
            return;
        }

        if (!otpSent) {

            await handleSendOtp();

            return;
        }

        if (!otpVerified) {

            await handleVerifyOtp();

            return;
        }

        await handleSignup();
    };

    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="signup-container">

            {/* LEFT PANEL */}

            <div className="signup-left">

                <div className="overlay">

                    <FaWallet className="wallet-icon" />

                    <h1>
                        Transaction Ledger
                    </h1>

                    <p>
                        Start managing your income,
                        expenses, customers and
                        recurring payments all in
                        one place.
                    </p>

                </div>

            </div>

            {/* RIGHT PANEL */}

            <div className="signup-right">

                <div className="signup-card">

                    <h2>
                        Create Account
                    </h2>

                    <p className="subtitle">

                        {!otpSent
                            ? "Create your account to get started."
                            : "Verify your email to continue."}

                    </p>

                    <form onSubmit={handleSubmit}>

                        {/* ================================================= */}
                        {/* SIGNUP FORM */}
                        {/* ================================================= */}

                        {!otpSent && (

                            <>

                                {/* FULL NAME */}

                                <div className="input-group">

                                    <label>
                                        Full Name
                                    </label>

                                    <div className="input-box">

                                        <FaUser />

                                        <input
                                            type="text"
                                            name="fullName"
                                            placeholder="Enter Full Name"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    <span className="error">
                                        {errors.fullName}
                                    </span>

                                </div>

                                {/* EMAIL */}

                                <div className="input-group">

                                    <label>
                                        Email
                                    </label>

                                    <div className="input-box">

                                        <FaEnvelope />

                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Enter Email"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    <span className="error">
                                        {errors.email}
                                    </span>

                                </div>

                                {/* PHONE */}

                                <div className="input-group">

                                    <label>
                                        Phone
                                    </label>

                                    <div className="input-box">

                                        <FaPhone />

                                        <input
                                            type="text"
                                            name="phone"
                                            placeholder="Enter Phone Number"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    <span className="error">
                                        {errors.phone}
                                    </span>

                                </div>

                                {/* PASSWORD */}

                                <div className="input-group">

                                    <label>
                                        Password
                                    </label>

                                    <div className="password-box">

                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            placeholder="Enter Password"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />

                                        <span
                                            onClick={() =>
                                                setShowPassword(
                                                    !showPassword
                                                )
                                            }
                                        >

                                            {showPassword
                                                ? <FaEyeSlash />
                                                : <FaEye />
                                            }

                                        </span>

                                    </div>

                                    <span className="error">
                                        {errors.password}
                                    </span>

                                </div>

                                {/* CONFIRM PASSWORD */}

                                <div className="input-group">

                                    <label>
                                        Confirm Password
                                    </label>

                                    <div className="password-box">

                                        <input
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="confirmPassword"
                                            placeholder="Confirm Password"
                                            value={
                                                formData.confirmPassword
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                        <span
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }
                                        >

                                            {showConfirmPassword
                                                ? <FaEyeSlash />
                                                : <FaEye />
                                            }

                                        </span>

                                    </div>

                                    <span className="error">
                                        {
                                            errors.confirmPassword
                                        }
                                    </span>

                                </div>

                            </>
                        )}

                        {/* ================================================= */}
                        {/* OTP */}
                        {/* ================================================= */}

                        {otpSent && (

                            <div className="otp-section">

                                <div className="input-group">

                                    <label>
                                        Enter OTP
                                    </label>

                                    <div className="input-box">

                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            maxLength="6"
                                            placeholder="Enter 6 digit OTP"
                                            value={otp}
                                            onChange={(e) => {

                                                const value =
                                                    e.target.value
                                                        .replace(
                                                            /\D/g,
                                                            ""
                                                        );

                                                setOtp(value);

                                                setOtpError("");
                                            }}
                                            disabled={
                                                otpVerified
                                            }
                                        />

                                    </div>

                                    <span className="error">
                                        {otpError}
                                    </span>

                                </div>

                                {message && (

                                    <p className="otp-success">
                                        {message}
                                    </p>

                                )}

                                {!otpVerified && (

                                    <button
                                        type="button"
                                        className="signup-btn"
                                        onClick={
                                            handleVerifyOtp
                                        }
                                        disabled={
                                            otpLoading
                                        }
                                    >

                                        {otpLoading
                                            ? "Verifying..."
                                            : "Verify OTP"}

                                    </button>

                                )}

                                {!otpVerified &&
                                    resendTimer === 0 && (

                                        <button
                                            type="button"
                                            className="resend-btn"
                                            onClick={
                                                handleSendOtp
                                            }
                                            disabled={
                                                otpLoading
                                            }
                                        >

                                            Resend OTP

                                        </button>

                                    )}

                                {!otpVerified &&
                                    resendTimer > 0 && (

                                        <p className="resend-timer">

                                            Resend OTP in{" "}
                                            {resendTimer}s

                                        </p>

                                    )}

                                {otpVerified && (

                                    <button
                                        type="button"
                                        className="signup-btn"
                                        onClick={
                                            handleSignup
                                        }
                                        disabled={
                                            loading
                                        }
                                    >

                                        {loading
                                            ? "Creating Account..."
                                            : "Create Account"}

                                    </button>

                                )}

                            </div>
                        )}

                        {/* INITIAL BUTTON */}

                        {!otpSent && (

                            <button
                                type="submit"
                                className="signup-btn"
                                disabled={otpLoading}
                            >

                                {otpLoading
                                    ? "Sending OTP..."
                                    : "Send OTP"}

                            </button>

                        )}

                        {errors.signup && (

                            <span className="error">
                                {errors.signup}
                            </span>

                        )}

                    </form>

                    <p className="login-link">

                        Already have an account?

                        <Link to="/">
                            {" "}Login
                        </Link>

                    </p>

                </div>

            </div>

        </div>
    );
}

export default Signup;