import "./AllSpotsItem.css";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

function AllSpotsItem({ spot }) {
  let priceDisplay = Math.round(spot.price);
  let rating = Math.round(Number(spot.avgRating) * 10) / 10;
  let ratingDisplay = rating ? rating.toFixed(1) : "New";

  return (
    <div className="spot-item-container">
      <div title={spot.name} className="spot-item">
        <NavLink className="spot-item-link" exact to={`/spots/${spot.id}`}>
          <h2>{spot.name}</h2>
          <img src={spot.previewImage} />
          <div className="spot-info">
            <h3>{spot.city}, {spot.state}</h3>
            <div className="price-rating">
              <h4><strong>${priceDisplay}</strong> a night</h4>
              <div className="rating">
                <i className="fa-solid fa-star"><FontAwesomeIcon icon={faStar} />
</i>
                <span>{ratingDisplay}</span>
              </div>
            </div>
          </div>
        </NavLink>
      </div>
    </div>
  );
}

export default AllSpotsItem;
