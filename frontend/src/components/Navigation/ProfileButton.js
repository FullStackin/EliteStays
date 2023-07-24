import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import { NavLink, useHistory } from "react-router-dom";
import "./Navigation.css";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useHistory();
  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    history.push(`/`);
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div className="profile-menu-wrapper">
      <button onClick={openMenu} className="profile-menu">
        <i className="fa-solid fa-bars" /> <i className="fas fa-user-circle" />
      </button>
      <div className={ulClassName} ref={ulRef}>
        <div className="menu-wrap">
          <div>Hello, {user.firstName}</div>
          <div>{user.username}</div>
          <div>{user.email}</div>
          {
            <div>
              <NavLink exact to="/spots/current">
                Manage Spots
              </NavLink>
            </div>
          }
          <h3>
            <button onClick={logout}>Log Out</button>
          </h3>
        </div>
      </div>
    </div>
  );
}

export default ProfileButton;
