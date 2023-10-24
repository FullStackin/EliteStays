import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserSpotsThunk } from "../../store/spots";
import AllSpotsItem from "../AllSpotsItem";
import DeleteSpot from "../DeleteSpotModal";
import OpenModalButton from "../OpenModalButton";
import { NavLink } from "react-router-dom";
import "./ManageSpots.css";

export default function ManageSpots() {
  const userSpotsStore = useSelector((state) => state.spots.allSpots);
  const userSpots = Object.values(userSpotsStore);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserSpotsThunk());
  }, [dispatch]);

  if (userSpots.length === 0) {
    return (
      <div className="center-content">
        <h2>Manage Spots</h2>
        <NavLink exact to={"/spots/new"}>
          Create a new spot
        </NavLink>
      </div>
    );
  }

  return (
    <div className="center-content manage-spots-gallery">
      <h2 id="manage-booking-title">Manage Spots</h2>
      <div className="card-container">
        {userSpots.map((spot) => (
          <div key={spot.id} className="spot-card">
            <AllSpotsItem spot={spot} />
            <div className="button-row">
              <button className="update-button">
                <NavLink
                  exact
                  to={`/spots/${spot.id}/update`}
                  className="button-link"
                >
                  Update
                </NavLink>
              </button>
              <button className="delete-button">
                <OpenModalButton
                  buttonText="Delete"
                  modalComponent={<DeleteSpot spot={spot} />}
                  buttonClassName="button-link"
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
