import "./AllSpotsItem.css";
import { NavLink } from "react-router-dom";

function AllSpotsItem({ spot }) {
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
        <h2>{spot.name}</h2>
        <img src={spot.previewImage} />
        <div className="spot-info">
          <div className="spot-info-row1">
            <h3>
              {spot.city},{" " + spot.state}
            </h3>
            <h3>
              <i className="fa-solid fa-star"></i>
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
