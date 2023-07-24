import React, { useState } from "react";
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

  const handleDemo = (e) => {
    e.preventDefault();
    return dispatch(
      sessionActions.login({
        credential: "Demo-lition",
        password: "password",
      })
    ).then(closeModal);
  };

  return (
    <div className="login-modal">
      <h1 className="login-title">Log In</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
          placeholder="Username or Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
        />
        {errors.credential && <p>{errors.credential}</p>}
        <button
          disabled={credential.length < 4 || password.length < 6}
          type="submit"
        >
          Log In
        </button>
        <button onClick={handleDemo}>Log in as Demo User</button>
      </form>
    </div>
  );
}

export default LoginFormModal;
