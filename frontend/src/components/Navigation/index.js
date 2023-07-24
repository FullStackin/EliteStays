import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import "./Navigation.css";
import SignupFormModal from "../SignupFormModal";
import logoImage from "../../assets/HighClassBnb/Compass.png";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <div className="right-nav">
        <div className="nav-item">
          <NavLink
            exact
            to="/spots/new"
            style={{ textDecoration: "none" }}
            className="create-spot"
          >
            Create a New Spot
          </NavLink>
        </div>
        <ProfileButton user={sessionUser} className="profile-button" />
      </div>
    );
  } else {
    sessionLinks = (
      <div className="right-nav">
        <div className="nav-item">
          <OpenModalButton
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
          />
        </div>
        <div className="nav-item">
          <OpenModalButton
            buttonText="Sign Up"
            modalComponent={<SignupFormModal />}
          />
        </div>
      </div>
    );
  }


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
          {" "}
          <i>EliteStays</i>
        </NavLink>
      </div>
      {isLoaded && sessionLinks}
    </div>
  );
}

export default Navigation;
