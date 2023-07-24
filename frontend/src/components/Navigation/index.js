import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import logoImage from "../../assets/HighClassBnb/Compass.png";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div className="nav">
      <div className="left-nav">
        <NavLink
          exact
          to="/"
          className="home-logo"
          style={{ textDecoration: "none" }}
        >
          <img src={logoImage} alt="EliteStays" />
        </NavLink>
        <NavLink
          exact
          to="/"
          className="home-title"
          style={{ textDecoration: "none" }}
        >
          <i>EliteStays</i>
        </NavLink>
      </div>
      {isLoaded && (
        <div className="right-nav">
          {sessionUser ? (
            <>
              <NavLink
                exact
                to="/spots/new"
                className="create-spot"
              >
                Create a New Spot
              </NavLink>
              <ProfileButton user={sessionUser} className="profile-button" />
            </>
          ) : (
            <>
              <OpenModalButton
                buttonText="Log In"
                modalComponent={<LoginFormModal />}
                className="login-button"
              />
              <OpenModalButton
                buttonText="Sign Up"
                modalComponent={<SignupFormModal />}
                className="signup-button"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Navigation;
