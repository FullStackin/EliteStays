import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpotThunk } from "../../store/spots";
import "./Spots.css";
import { useParams } from "react-router-dom";
import { getReviewsThunk, updateReviewThunk } from "../../store/reviews";
import Reviews from "../Reviews";
import ReviewForm from "../ReviewForm";
import OpenModalButton from "../OpenModalButton";

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

function SingleSpot() {
  const sessionUser = useSelector((state) => state.session.user);
  const { spotId } = useParams();
  const spot = useSelector((state) => state.spots.singleSpot);
  const reviews = useSelector((state) => state.reviews.spot);
  const state = useSelector((state) => state);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSpotThunk(spotId));
    dispatch(getReviewsThunk(spotId));
  }, [dispatch, spotId]);

  let spotImageUrls = [];
  if (spot && spot.SpotImages) {
    for (let e in spot.SpotImages) {
      spotImageUrls.push(spot.SpotImages[e].url);
    }
  }

  let reviewList = Object.values(reviews);
  let ratingDisplay = spot.avgStarRating
    ? spot.avgStarRating.toFixed(1)
    : " New";

  if (Object.values(spot) < 1) {
    return <h1>Loading...</h1>;
  }

  const mainImg = spotImageUrls && spotImageUrls[0];
  const galleryImages = new Array(4).fill(null).map((_, i) => {
    return spotImageUrls && spotImageUrls[i + 1];
  });

  return (
    <div className="single-spot-wrapper">
      <div className="spot-header">
        <h1>{spot.name}</h1>
        <p className="location">
          {spot.city}, {spot.state}, {spot.country}
        </p>
      </div>
      <div className="spot-details">
        <div className="gallery">
          <img src={mainImg} className="main-img" alt="Main" />
          <div className="gallery-image-wrapper">
            <img
              className="gallery-image"
              alt={spot.name}
              src={galleryImages[0]}
            />
          </div>
        </div>
        <div className="single-spot-info-box">
          <div className="name-desc-box">
            <h2>
              Hosted by {spot.Owner ? spot.Owner.firstName : "Unknown"}{" "}
              {spot.Owner ? spot.Owner.lastName : "Host"}
            </h2>
            <p className="desc">{spot.description}</p>
          </div>
          <div className="callout-wrapper">
            <div className="callout-row1">
              <h2 className="price">${spot.price} per night</h2>
              <div className="rating-review">
                <h3>
                  <i className="fa-solid fa-star"></i> {ratingDisplay}
                </h3>
                <h3>{reviewList.length > 0 && " · "}</h3>
                <h3>
                  {reviewList.length > 0 &&
                    reviewList.length +
                      " review" +
                      (reviewList.length > 1 ? "s" : "")}
                </h3>
              </div>
            </div>
            <button onClick={() => alert("Feature coming soon.")}>
              Reserve
            </button>
          </div>
        </div>
      </div>

      <hr />

      <div className="review-section">
        <div>
          <div className="review-summary">
            <h3>
              <i className="fa-solid fa-star"></i> {ratingDisplay}
            </h3>
            <h3>{reviewList.length > 0 && " · "}</h3>
            <h3>
              {reviewList.length > 0 &&
                reviewList.length +
                  " review" +
                  (reviewList.length > 1 ? "s" : "")}
            </h3>
          </div>
          {sessionUser &&
            spot.Owner &&
            sessionUser.id !== spot.Owner.id &&
            !reviewList.find((review) => review.userId === sessionUser.id) && (
              <OpenModalButton
                buttonText="Post Your Review"
                modalComponent={<ReviewForm spotId={spot.id}></ReviewForm>}
              />
            )}
          <Reviews reviews={reviewList} spot={spot} sessionUser={sessionUser} />
        </div>
      </div>
    </div>
  );
}

export default SingleSpot;
