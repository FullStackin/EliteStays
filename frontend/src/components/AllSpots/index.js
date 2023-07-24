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
    <div>
      <div className="all-spots">
        {allSpots.map((spot) => (
          <AllSpotsItem spot={spot} key={spot.id} />
        ))}
      </div>
      <div className="social-media-links">
      <a href="https://www.linkedin.com/in/omarelsahlah" target="_blank" rel="Socials">
          <FontAwesomeIcon icon={faLinkedin} size="lg" />
        </a>
        <a href="https://www.github.com/fullstackin" target="_blank" rel="Socials">
          <FontAwesomeIcon icon={faGithub} size="lg" />
        </a>
        <a href="https://www.twitter.com/TallTechTitan" target="_blank" rel="Socials">
          <FontAwesomeIcon icon={faTwitter} size="lg" />
        </a>
        <a href="https://www.instagram.com/TallTechTitan" target="_blank" rel="Socials">
          <FontAwesomeIcon icon={faInstagram} size="lg" />
        </a>
      </div>
    </div>
  );
}

export default AllSpots;
