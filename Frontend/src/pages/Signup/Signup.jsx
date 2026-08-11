import { useState } from "react";
import "./signup.css";
import {
  FaWallet,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import { Link,useNavigate } from "react-router-dom";
import { signupUser } from "../../services/AuthService";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validate = () => {
    let temp = {};

    if (!formData.fullName.trim())
      temp.fullName = "Full name is required.";

    if (!formData.email.trim())
      temp.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      temp.email = "Invalid email.";

    if (!formData.phone.trim())
      temp.phone = "Phone number is required.";
    else if (!/^[0-9]{10}$/.test(formData.phone))
      temp.phone = "Enter valid phone number.";

    if (!formData.password)
      temp.password = "Password is required.";
    else if (formData.password.length < 8)
      temp.password = "Minimum 8 characters.";

    if (!formData.confirmPassword)
      temp.confirmPassword = "Confirm your password.";
    else if (formData.password !== formData.confirmPassword)
      temp.confirmPassword = "Passwords do not match.";

    if (!formData.terms)
      temp.terms = "Accept Terms & Conditions.";

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   if (validate()) {
  //     console.log(formData);

  //     alert("Signup Successful (Frontend Only)");
  //   }
  // };
  const handleSubmit = async (e) => {

    e.preventDefault();

    // if (!validate()) return;

    try {

        const signupData = {

            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password

        };

        const response = await signupUser(signupData);

        alert("one step ahead");

        navigate("/");

    }
    catch (error) {

        if (error.response) {

            alert(error.response.data.message);

        } else {

            alert("Backend Server is not running");

        }

    }

};

  return (
    <div className="signup-container">

      {/* LEFT PANEL */}

      <div className="signup-left">

        <div className="overlay">

          <FaWallet className="wallet-icon" />

          <h1>Transaction Ledger</h1>

          <p>
            Start managing your income, expenses,
            customers and recurring payments
            all in one place.
          </p>

        </div>

      </div>

      {/* RIGHT PANEL */}

      <div className="signup-right">

        <div className="signup-card">

          <h2>Create Account</h2>

          <p className="subtitle">
            Create your account to get started.
          </p>

          <form onSubmit={handleSubmit}>

            {/* FULL NAME */}

            <div className="input-group">

              <label>Full Name</label>

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

              <span className="error">{errors.fullName}</span>

            </div>

            {/* EMAIL */}

            <div className="input-group">

              <label>Email</label>

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

              <span className="error">{errors.email}</span>

            </div>

            {/* PHONE */}

            <div className="input-group">

              <label>Phone</label>

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

              <span className="error">{errors.phone}</span>

            </div>

            {/* PASSWORD */}

            <div className="input-group">

              <label>Password</label>

              <div className="password-box">

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                />

                <span
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </span>

              </div>

              <span className="error">
                {errors.password}
              </span>

            </div>

            {/* CONFIRM PASSWORD */}

            <div className="input-group">

              <label>Confirm Password</label>

              <div className="password-box">

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />

                <span
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </span>

              </div>

              <span className="error">
                {errors.confirmPassword}
              </span>

            </div>

            {/* TERMS */}

            {/* <div className="terms">

              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
              />

              <label>
                I agree to Terms & Conditions
              </label>

            </div> */}

            {/* <span className="error">{errors.terms}</span> */}

            <button
              type="submit"
              className="signup-btn"
            >
              Create Account
            </button>

          </form>

          <p className="login-link">

            Already have an account?

            <Link to="/login"> Login</Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Signup;