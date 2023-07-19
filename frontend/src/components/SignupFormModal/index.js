import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword:
        "Confirm Password field must be the same as the Password field",
    });
  };

  return (
    <div className="signup-form-container">
      <h1 className="signup-form-heading">Sign Up</h1>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="signup-form-row">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="signup-form-input"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <p className="signup-form-error">{errors.email}</p>}
        </div>
        <div className="signup-form-row">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            className="signup-form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {errors.username && <p className="signup-form-error">{errors.username}</p>}
        </div>
        <div className="signup-form-row">
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            className="signup-form-input"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          {errors.firstName && <p className="signup-form-error">{errors.firstName}</p>}
        </div>
        <div className="signup-form-row">
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            className="signup-form-input"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          {errors.lastName && <p className="signup-form-error">{errors.lastName}</p>}
        </div>
        <div className="signup-form-row">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            className="signup-form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && <p className="signup-form-error">{errors.password}</p>}
        </div>
        <div className="signup-form-row">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            className="signup-form-input"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {errors.confirmPassword && <p className="signup-form-error">{errors.confirmPassword}</p>}
        </div>
        <button className="signup-form-button" type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
