import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserSpotsThunk } from "../../store/spots";
import AllSpotsItem from "../AllSpotsItem";
import DeleteSpot from "../DeleteSpotModal";
import OpenModalButton from "../OpenModalButton";
import { NavLink } from "react-router-dom";
import "./ManageSpots.css";

function ManageSpots() {
  const dispatch = useDispatch();
  const userSpots = Object.values(useSelector((state) => state.spots.allSpots));

  useEffect(() => {
    dispatch(getUserSpotsThunk());
  }, [dispatch]);

  return (
    <div className="center-content">
      <h2>Manage Spots</h2>
      {userSpots.length === 0 && (
        <NavLink exact to={"/spots/new"}>
          Create a new spot
        </NavLink>
      )}
      <section className="manage-spots-gallery">
        {userSpots.map((spot) => (
          <div key={spot.id}>
            <AllSpotsItem spot={spot} />
            <button className="update-button">
              <NavLink exact to={`/spots/${spot.id}/update`}>
                Update
              </NavLink>
            </button>
            <OpenModalButton
              buttonText="Delete"
              modalComponent={<DeleteSpot spot={spot} />}
              buttonClassName="delete-button"
            />
          </div>
        ))}
      </section>
    </div>
  );
}

export default ManageSpots;
