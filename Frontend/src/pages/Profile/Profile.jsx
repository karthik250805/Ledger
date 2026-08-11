import "./Profile.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaWallet,
    FaLock,
    FaEdit,
    FaSignOutAlt,
    FaTimes,
    FaCheck
} from "react-icons/fa";

import Sidebar from "../../components/SideBar";


const Profile = () => {

    const navigate = useNavigate();


    // =====================================================
    // TEMPORARY USER DATA
    // Later this will come from API
    // =====================================================

    const [user, setUser] = useState({

        name: "Karthik",

        email: "karthik@example.com",

        phone: "+91 9876543210",

        cashBalance: 25000

    });


    // =====================================================
    // EDIT PROFILE
    // =====================================================

    const [editMode, setEditMode] = useState(false);


    const [editData, setEditData] = useState({

        name: user.name,

        phone: user.phone

    });


    // =====================================================
    // CHANGE PASSWORD
    // =====================================================

    const [showPasswordForm, setShowPasswordForm] =
        useState(false);


    const [passwordData, setPasswordData] = useState({

        oldPassword: "",

        newPassword: "",

        confirmPassword: ""

    });


    // =====================================================
    // LOGOUT
    // =====================================================

    const [showLogoutPopup, setShowLogoutPopup] =
        useState(false);


    // =====================================================
    // EDIT PROFILE HANDLERS
    // =====================================================

    const handleEditChange = (e) => {

        const { name, value } = e.target;

        setEditData({

            ...editData,

            [name]: value

        });

    };


    const handleSaveProfile = async (e) => {

        e.preventDefault();


        // API will be connected later

        console.log(
            "Update profile:",
            editData
        );


        setUser({

            ...user,

            name: editData.name,

            phone: editData.phone

        });


        setEditMode(false);

    };


    // =====================================================
    // PASSWORD HANDLERS
    // =====================================================

    const handlePasswordChange = (e) => {

        const { name, value } = e.target;

        setPasswordData({

            ...passwordData,

            [name]: value

        });

    };


    const handleChangePassword = async (e) => {

        e.preventDefault();


        if (
            !passwordData.oldPassword ||
            !passwordData.newPassword ||
            !passwordData.confirmPassword
        ) {

            alert(
                "Please fill all password fields."
            );

            return;
        }


        if (
            passwordData.newPassword !==
            passwordData.confirmPassword
        ) {

            alert(
                "New password and confirm password do not match."
            );

            return;
        }


        // API will be connected later

        console.log(
            "Change password:",
            passwordData
        );


        alert(
            "Password change API will be connected here."
        );


        setPasswordData({

            oldPassword: "",

            newPassword: "",

            confirmPassword: ""

        });

    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        // Remove JWT token

        localStorage.removeItem("token");


        // Clear any login-related data if needed

        localStorage.removeItem("user");


        navigate("/");

    };


    // =====================================================
    // FORMAT MONEY
    // =====================================================

    const formatMoney = (value) => {

        return Number(
            value || 0
        ).toLocaleString("en-IN", {

            minimumFractionDigits: 2,

            maximumFractionDigits: 2

        });

    };


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="profile-layout">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <Sidebar />


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="profile-main-content">

                <div className="profile-page">


                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="profile-header">

                        <div>

                            <h1>
                                Profile
                            </h1>

                            <p>
                                Manage your account and preferences
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        PROFILE CARD
                    ================================================= */}

                    <div className="profile-card">


                        {/* PROFILE HEADER */}

                        <div className="profile-card-header">

                            <div className="profile-avatar">

                                {user.name
                                    ?.charAt(0)
                                    ?.toUpperCase()
                                }

                            </div>


                            <div className="profile-name-section">

                                <h2>
                                    {user.name}
                                </h2>

                                <span>
                                    Ledger Account
                                </span>

                            </div>


                            {!editMode && (

                                <button
                                    className="profile-edit-btn"
                                    onClick={() => {

                                        setEditData({

                                            name: user.name,

                                            phone: user.phone

                                        });

                                        setEditMode(true);

                                    }}
                                >

                                    <FaEdit />

                                    Edit Profile

                                </button>

                            )}

                        </div>


                        {/* =================================================
                            PROFILE INFORMATION
                        ================================================= */}

                        {!editMode ? (

                            <div className="profile-info-grid">


                                <div className="profile-info-item">

                                    <div className="profile-info-icon">

                                        <FaUser />

                                    </div>

                                    <div>

                                        <span>
                                            Full Name
                                        </span>

                                        <strong>
                                            {user.name}
                                        </strong>

                                    </div>

                                </div>


                                <div className="profile-info-item">

                                    <div className="profile-info-icon">

                                        <FaEnvelope />

                                    </div>

                                    <div>

                                        <span>
                                            Email Address
                                        </span>

                                        <strong>
                                            {user.email}
                                        </strong>

                                    </div>

                                </div>


                                <div className="profile-info-item">

                                    <div className="profile-info-icon">

                                        <FaPhone />

                                    </div>

                                    <div>

                                        <span>
                                            Phone Number
                                        </span>

                                        <strong>
                                            {user.phone}
                                        </strong>

                                    </div>

                                </div>


                                <div className="profile-info-item">

                                    <div className="profile-info-icon">

                                        <FaWallet />

                                    </div>

                                    <div>

                                        <span>
                                            Available Cash
                                        </span>

                                        <strong>
                                            ₹
                                            {formatMoney(
                                                user.cashBalance
                                            )}
                                        </strong>

                                    </div>

                                </div>


                            </div>

                        ) : (


                            /* =================================================
                               EDIT PROFILE FORM
                            ================================================= */

                            <form
                                className="profile-edit-form"
                                onSubmit={
                                    handleSaveProfile
                                }
                            >

                                <div className="profile-form-group">

                                    <label>
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={
                                            editData.name
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                        required
                                    />

                                </div>


                                <div className="profile-form-group">

                                    <label>
                                        Phone Number
                                    </label>

                                    <input
                                        type="text"
                                        name="phone"
                                        value={
                                            editData.phone
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                    />

                                </div>


                                <div className="profile-form-group">

                                    <label>
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        value={
                                            user.email
                                        }
                                        disabled
                                    />

                                    <small>
                                        Email cannot be changed here.
                                    </small>

                                </div>


                                <div className="profile-form-actions">

                                    <button
                                        type="button"
                                        className="profile-cancel-btn"
                                        onClick={() =>
                                            setEditMode(false)
                                        }
                                    >
                                        <FaTimes />

                                        Cancel
                                    </button>


                                    <button
                                        type="submit"
                                        className="profile-save-btn"
                                    >
                                        <FaCheck />

                                        Save Changes
                                    </button>

                                </div>

                            </form>

                        )}

                    </div>


                    {/* =================================================
                        SECURITY
                    ================================================= */}

                    <div className="profile-section-card">

                        <div className="profile-section-header">

                            <div>

                                <h2>
                                    Security
                                </h2>

                                <p>
                                    Manage your password and account security
                                </p>

                            </div>

                            <FaLock />

                        </div>


                        {!showPasswordForm ? (

                            <button
                                className="change-password-btn"
                                onClick={() =>
                                    setShowPasswordForm(true)
                                }
                            >

                                <FaLock />

                                Change Password

                            </button>

                        ) : (

                            <form
                                className="password-form"
                                onSubmit={
                                    handleChangePassword
                                }
                            >

                                <div className="profile-form-group">

                                    <label>
                                        Current Password
                                    </label>

                                    <input
                                        type="password"
                                        name="oldPassword"
                                        value={
                                            passwordData.oldPassword
                                        }
                                        onChange={
                                            handlePasswordChange
                                        }
                                        placeholder="Enter current password"
                                    />

                                </div>


                                <div className="profile-form-group">

                                    <label>
                                        New Password
                                    </label>

                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={
                                            passwordData.newPassword
                                        }
                                        onChange={
                                            handlePasswordChange
                                        }
                                        placeholder="Enter new password"
                                    />

                                </div>


                                <div className="profile-form-group">

                                    <label>
                                        Confirm New Password
                                    </label>

                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={
                                            passwordData.confirmPassword
                                        }
                                        onChange={
                                            handlePasswordChange
                                        }
                                        placeholder="Confirm new password"
                                    />

                                </div>


                                <div className="profile-form-actions">

                                    <button
                                        type="button"
                                        className="profile-cancel-btn"
                                        onClick={() => {

                                            setShowPasswordForm(
                                                false
                                            );

                                            setPasswordData({

                                                oldPassword: "",

                                                newPassword: "",

                                                confirmPassword: ""

                                            });

                                        }}
                                    >

                                        <FaTimes />

                                        Cancel

                                    </button>


                                    <button
                                        type="submit"
                                        className="profile-save-btn"
                                    >

                                        <FaCheck />

                                        Update Password

                                    </button>

                                </div>

                            </form>

                        )}

                    </div>


                    {/* =================================================
                        ACCOUNT
                    ================================================= */}

                    <div className="profile-section-card account-section">

                        <div className="profile-section-header">

                            <div>

                                <h2>
                                    Account
                                </h2>

                                <p>
                                    Manage your Ledger account
                                </p>

                            </div>

                            <FaUser />

                        </div>


                        <button
                            className="logout-btn"
                            onClick={() =>
                                setShowLogoutPopup(true)
                            }
                        >

                            <FaSignOutAlt />

                            Logout

                        </button>

                    </div>


                </div>

            </main>


            {/* =================================================
                LOGOUT CONFIRMATION
            ================================================= */}

            {showLogoutPopup && (

                <div className="profile-modal-overlay">

                    <div className="profile-logout-modal">

                        <div className="logout-modal-icon">

                            <FaSignOutAlt />

                        </div>


                        <h2>
                            Logout?
                        </h2>


                        <p>
                            Are you sure you want to logout
                            from your Ledger account?
                        </p>


                        <div className="logout-modal-actions">

                            <button
                                className="logout-cancel-btn"
                                onClick={() =>
                                    setShowLogoutPopup(false)
                                }
                            >
                                Cancel
                            </button>


                            <button
                                className="logout-confirm-btn"
                                onClick={handleLogout}
                            >

                                <FaSignOutAlt />

                                Logout

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};


export default Profile;