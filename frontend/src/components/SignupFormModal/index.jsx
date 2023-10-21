import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import validator from "validator";

import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState({
    email: false,
    username: false,
    firstName: false,
    lastName: false,
    password: false,
    confirmPassword: false,
  });
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    let newErrors = {};

    if (validator.isEmpty(email)) {
      newErrors.email = "Email is required";
    } else if (!validator.isEmail(email)) {
      newErrors.email = "Invalid email format";
    }

    if (validator.isEmpty(username)) {
      newErrors.username = "Username is required";
    } else if (validator.isEmail(username)) {
      newErrors.username = "Username cannot be an email";
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

    if (Object.keys(errors).length === 0) {
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

  const handleBlur = (field) => {
    setTouched((prevTouched) => ({ ...prevTouched, [field]: true }));
  };

  return (
    <div className="form-container-wrapper">
      <div className="form-container">
        <h3 className="Sign-up">Sign Up</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur("email")}
              required
            />
          </label>
          {touched.email && errors.email && (
            <div className="error">{errors.email}</div>
          )}
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={() => handleBlur("username")}
              required
            />
          </label>
          {touched.username && errors.username && (
            <div className="error">{errors.username}</div>
          )}
          <label>
            First Name
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={() => handleBlur("firstName")}
              required
            />
          </label>
          {touched.firstName && errors.firstName && (
            <div className="error">{errors.firstName}</div>
          )}
          <label>
            Last Name
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onBlur={() => handleBlur("lastName")}
              required
            />
          </label>
          {touched.lastName && errors.lastName && (
            <div className="error">{errors.lastName}</div>
          )}
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur("password")}
              required
            />
          </label>
          {touched.password && errors.password && (
            <div className="error">{errors.password}</div>
          )}
          <label>
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => handleBlur("confirmPassword")}
              required
            />
          </label>
          {touched.confirmPassword && errors.confirmPassword && (
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
