import { useDispatch } from "react-redux";
import "./AllSpotsItem.css";
import { NavLink } from "react-router-dom";

import LA1 from "../../assets/spot-images/LA1.png";
import LA2 from "../../assets/spot-images/LA2.png";
import MLB1 from "../../assets/spot-images/MLB1.png";
import MLB2 from "../../assets/spot-images/MLB2.png";
import SB1 from "../../assets/spot-images/SB1.png";
import SB2 from "../../assets/spot-images/SB2.png";
import SD1 from "../../assets/spot-images/SD1.png";
import SD2 from "../../assets/spot-images/SD2.png";

const imgKeys = {
  4: [LA1, LA2],
  3: [MLB1, MLB2],
  2: [SB1, SB2],
  1: [SD1, SD2],
};

function AllSpotsItem({ spot }) {
  // const dispatch = useDispatch();
  console.log("spot  from all spots item", spot);

  let priceDisplay = Math.round(spot.price);

  let rating = Math.round(Number(spot.avgRating) * 10) / 10;
  let ratingDisplay = " " + rating.toFixed(1);
  if (ratingDisplay == 0) {
    ratingDisplay = " New";
  } else {
    ratingDisplay = Number(ratingDisplay).toFixed(1);
  }

  return (
    <div title={spot.name} className="spot-item">
      <NavLink className="spot-item-link" exact to={`/spots/${spot.id}`}>
        {/* <h1>{spot.name}</h1> */}
        <img alt={spot.name} src={imgKeys[spot.id][1]} />
        <img src={imgKeys[spot.id][0]}></img>
        {/* {spot.previewImage} */}
        <div className="spot-info">
          <div className="spot-info-row1">
            <h3>
              {spot.city},{" " + spot.state}
            </h3>
            <h3>
              <i class="fa-solid fa-star"></i>
              {ratingDisplay}
            </h3>
          </div>
          <h4>
            <strong>${priceDisplay}</strong> a night
          </h4>
        </div>
      </NavLink>
    </div>
  );
}

export default AllSpotsItem;
