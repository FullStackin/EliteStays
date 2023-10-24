import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSpotsThunk } from "../../store/spots";
import "./AllSpots.css";
import AllSpotsItem from "../AllSpotsItem";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faInstagram, faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

function AllSpots() {
  const allSpots = Object.values(
    useSelector((state) => state.spots.allSpots)
  ).reverse();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllSpotsThunk());
  }, [dispatch]);

  return (
    <div className="page-container">
      <div className="all-spots">
        {allSpots.map((spot) => (
          <AllSpotsItem spot={spot} key={spot.id} />
        ))}
      </div>
    </div>
  );
}

export default AllSpots;