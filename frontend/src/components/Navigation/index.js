import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import MenuItemModal from "./MenuItemModal";
import FindListingModal from "../FindListingModal/FindListingModal";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul className="nav-ul">
      <li>
        <NavLink exact to="/" id="logo-link">
          <img
            src={require("../../assets/StrikeBnb-logos/StrikeBnb-logos.jpeg")}
            alt="StrikeBnb Logo"
            className="logo-image"
          />
        </NavLink>
      </li>

      <div id="spot-search">
        <MenuItemModal
          itemText="Search Listings"
          // onItemClick={closeMenu}
          modalComponent={<FindListingModal />}
        />
      </div>
      <div id="login-user">
        {(() => {
          if (sessionUser) {
            return (
              <NavLink to="/spots/new" id="create-new-spot-link">
                Create a New Listing
              </NavLink>
            );
          }
        })()}
        {isLoaded && (
          <li>
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </div>
    </ul>
  );
}

export default Navigation;
