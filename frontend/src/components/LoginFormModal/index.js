// frontend/src/components/LoginFormModal/index.js
import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [disabled, setDisabled] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  useEffect(() => {
    if (credential.length >= 4 && password.length >= 6) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [credential, password]);

  const loginDemo = () => {
    dispatch(
      sessionActions.login({ credential: "Demo-lition", password: "password" })
    ).then(closeModal);
  };

  return (
    <>
      <form className="signup-form-container" onSubmit={handleSubmit}>
        <h1 className="signup-form-heading">Log In</h1>
        <div className="signup-form-row">
          <label htmlFor="credential" className="signup-form-label">
            Username or Email
          </label>
          <input
            className="signup-form-input"
            id="credential"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </div>
        <div className="signup-form-row">
          <label htmlFor="password" className="signup-form-label">
            Password
          </label>
          <input
            className="signup-form-input"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errors.credential && <p className="signup-form-error">{errors.credential}</p>}
        <div className="login-button">
        <button
          className={
            disabled ? "signup-form-button-disabled" : "signup-form-button-active"
          }
          type="submit"
          disabled={disabled}
        >
          Log In
        </button></div>
        <button className="signup-form-demo-button" onClick={loginDemo}>
          DemoUser Login
        </button>
      </form>
    </>
  );
}

export default LoginFormModal;
