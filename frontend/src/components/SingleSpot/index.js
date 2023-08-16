import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpotThunk } from "../../store/spots";
import { useParams } from "react-router-dom";
import { getReviewsThunk, updateReviewThunk } from "../../store/reviews";
import Reviews from "../Reviews";
import ReviewForm from "../ReviewForm";
import OpenModalButton from "../OpenModalButton";

import "./Spots.css";

function SingleSpot() {
  const sessionUser = useSelector((state) => state.session.user);
  const spot = useSelector((state) => state.spots.singleSpot);
  const reviews = useSelector((state) => state.reviews.spot);
  const { spotId } = useParams();
  const state = useSelector((state) => state);
  const [imageUrls, setImageUrls] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSpotThunk(spotId));
    dispatch(getReviewsThunk(spotId));
  }, [dispatch, spotId]);

  let spotImageUrls = [];
  if (spot && spot.SpotImages) {
    spot.SpotImages.forEach((image) => {
      spotImageUrls.push(image.url);
    });
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
            {galleryImages.length &&
              galleryImages.map((image, i ) => (
                <img className="gallery-image" key={i} alt={spot.name} src={image} />
              ))}
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
