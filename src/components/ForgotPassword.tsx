import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase"; // Adjust the import based on your Firebase setup
import { toast } from "react-toastify";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // Manage loading state
  const [submitted, setSubmitted] = useState(false); // Track form submission status
  const navigate = useNavigate();

  useEffect(() => {
    if (submitted) {
      navigate("/"); // Redirect to the root path after successful reset
    }
  }, [submitted, navigate]);

  const handleForgotPasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true); // Set loading state to true
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!");
      setSubmitted(true); // Set submitted state to true
    } catch (error) {
      toast.error("Failed to send password reset email.");
    } finally {
      setLoading(false); // Always set loading state to false
    }
  };

  return (
    <div className="forgot-password-container">
      <h1>Forgot Password</h1>
      <form onSubmit={handleForgotPasswordSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Email"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
