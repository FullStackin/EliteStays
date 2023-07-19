
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import { NavLink,  } from "react-router-dom";
import * as sessionActions from '../../store/session';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { useHistory } from "react-router-dom";
import MenuItemModal from "./MenuItemModal";

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

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    history.push('/');
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button
      onClick={openMenu}
      className='profile-button'
      >
        <i className="fas fa-user-circle" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li className='profile-li'>{`Hello, ${user.username}`}</li>
            <li className='profile-li'>{user.firstName} {user.lastName}</li>
            <li className='profile-li'>{user.email}</li>
            <div id='manage-spot-link'>
              <NavLink to='/spots/current'>
                Manage Spot
              </NavLink>
            </div>
            <div id='update-review-link'>
              <NavLink to='/reviews/current'>
                Manage Reviews
              </NavLink>
            </div>
            <div id='manage-bookings-link'>
              <NavLink to='/bookings/current'>
                Manage Bookings
              </NavLink>
            </div>
            <li>
              <button
              onClick={logout}
              id='logout-button'
              >
                Log Out</button>
            </li>
          </>
        ) : (
          <>
          <div className='openModalMenuItem'>

              <MenuItemModal
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />

              <MenuItemModal
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />

          </div>
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
