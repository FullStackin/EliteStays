import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import validator from "validator"; // Import the validator.js library

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
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    let newErrors = {};

    if (validator.isEmpty(email)) {
      newErrors.email = "Email is required";
    } else if (!validator.isEmail(email)) {
      newErrors.email = "Invalid email format";
    }

    if (validator.isEmpty(username)) {
      newErrors.username = "Username is required";
    } else if (username.length < 4) {
      newErrors.username = "Username can't be less than 4 characters";
    }

    if (validator.isEmpty(password)) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password can't be less than 6 characters";
    }

    if (validator.isEmpty(firstName)) {
      newErrors.firstName = "FirstName is required";
    }

    if (validator.isEmpty(lastName)) {
      newErrors.lastName = "LastName is required";
    }

    if (validator.isEmpty(confirmPassword)) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(newErrors);
  }, [email, username, password, firstName, lastName, confirmPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    let newErrors = {};

    if (validator.isEmpty(email)) {
      newErrors.email = "Email is required";
    } else if (!validator.isEmail(email)) {
      newErrors.email = "Invalid email format";
    }

    if (validator.isEmpty(username)) {
      newErrors.username = "Username is required";
    } else if (username.length < 4) {
      newErrors.username = "Username can't be less than 4 characters";
    }

    if (validator.isEmpty(password)) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password can't be less than 6 characters";
    }

    if (validator.isEmpty(firstName)) {
      newErrors.firstName = "FirstName is required";
    }

    if (validator.isEmpty(lastName)) {
      newErrors.lastName = "LastName is required";
    }

    if (validator.isEmpty(confirmPassword)) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch((res) => {
          if (res.data && res.data.errors) {
            setErrors(res.data.errors);
          }
        });
    }
  };

  return (
    <div className="form-container-wrapper">
      <div className="form-container">
        <h3>Sign Up</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          {errors.email && <div className="error">{errors.email}</div>}
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          {(isSubmitted || errors.username) && (
            <div className="error">
              {errors.username || "Username is required"}
            </div>
          )}
          <label>
            First Name
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>
          {errors.firstName && <div className="error">{errors.firstName}</div>}
          <label>
            Last Name
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>
          {errors.lastName && <div className="error">{errors.lastName}</div>}
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {errors.password && <div className="error">{errors.password}</div>}
          <label>
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
          {errors.confirmPassword && (
            <div className="error">{errors.confirmPassword}</div>
          )}
          <button type="submit" disabled={!!Object.keys(errors).length}>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupFormModal;
