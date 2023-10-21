import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import { NavLink, useHistory } from "react-router-dom";
import PopModalMenu from "./PopModalMenu";

import "./Navigation.css";

function ProfileButton({ user }) {  // Define a functional component named ProfileButton that receives a 'user' prop
  const dispatch = useDispatch();  // Get access to the dispatch function from the Redux store
  const [showMenu, setShowMenu] = useState(false);  // Define a state variable 'showMenu' with initial value false
  const ulRef = useRef();  // Create a ref for the 'ul' element
  const history = useHistory();  // Get access to the history object for navigation

  const openMenu = () => {  // Define a function to open the menu
    if (showMenu) return;
    setShowMenu(true);
  };

  const hideMenu = () => {  // Define a function to hide the menu
    setShowMenu(false);
  };

  useEffect(() => {  // Use the useEffect hook to handle menu open/close behavior
    if (!showMenu) return;

    const closeMenu = (e) => {  // Define a function to close the menu when clicking outside
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);  // Add a click event listener to close the menu

    return () => document.removeEventListener("click", closeMenu);  // Remove the event listener when the component unmounts
  }, [showMenu]);  // Specify the dependency array to trigger the effect when 'showMenu' changes

  const closeMenu = () => setShowMenu(false);  // Define a function to close the menu

  const logout = (e) => {  // Define a function to handle user logout
    e.preventDefault();  // Prevent the default behavior of the anchor element
    dispatch(sessionActions.logout());  // Dispatch the 'logout' action
    history.push(`/`);  // Navigate to the home page
    closeMenu();  // Close the menu
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");  // Determine the class name for the 'ul' element based on 'showMenu' state

  return (
    <div className="profile-menu-wrapper">  {/* Create a wrapper div */}
      <button onClick={openMenu} className="profile-menu">  {/* Create a button to open the menu */}
        <i className="fa-solid fa-bars" /> <i className="fas fa-user-circle" />
      </button>
      <div className={ulClassName} ref={ulRef}>  {/* Create the menu container with a dynamic class name */}
        <div className="menu-wrap">  {/* Create a wrapper div for menu content */}
          <div>Hello, {user.firstName}</div>  {/* Display user information */}
          <div>{user.username}</div>
          <div>{user.email}</div>

          <div>
            <NavLink exact to="/spots/current">  {/* Create a navigation link */}
              Manage Spots
            </NavLink>
          </div>
          <div id="manage-bookings-link">
            <NavLink to="/bookings/current">  {/* Create a navigation link */}
              Manage Bookings
            </NavLink>
          </div>

          <h3>
            <button onClick={logout}>Log Out</button>  {/* Create a button to trigger logout */}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default ProfileButton;  // Export the ProfileButton component
