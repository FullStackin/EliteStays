import { getReviewsThunk } from "../../store/reviews";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import DeleteReview from "../DeleteReview";
import UpdateReview from "../UpdateReview/updateReview";
import OpenModalButton from "../OpenModalButton";
import { getSpotThunk } from "../../store/spots";

import "./Reviews.css";

function Reviews({ reviews, spot, sessionUser }) {
  const reviewsObj = useSelector((state) => state.reviews.spot);
  let reviewList = Object.values(reviewsObj);
  const dispatch = useDispatch();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    dispatch(getReviewsThunk(spot.id));
  }, [dispatch, spot]);

  let avgStarRating = spot.avgStarRating ? spot.avgStarRating : 0;
  let ratingDisplay = spot.avgStarRating
    ? spot.avgStarRating.toFixed(1)
    : " new";

  return (
    <div className="reviews-container">
      <h2 className="spot-title">Reviews for {spot.name}</h2>

      <h2 className="prompt-text">
        {sessionUser &&
        spot.Owner &&
        sessionUser.id !== spot.Owner.id &&
        reviewList.length === 0 ? (
          <>Initiate the dialogue; post the first review.</>
        ) : (
          ""
        )}
      </h2>

      {reviewList.length > 0 &&
        reviewList.map((review) => {
          const revMonth =
            monthNames[parseInt(review.createdAt.substring(5, 7)) - 1];
          const revYear = review.createdAt.substring(0, 4);
          return (
            <div key={review.id} className="review-card">
              <h3 className="user-name">
                {review.User && review.User.firstName}
              </h3>
              <p className="date-label">
                {revMonth} {revYear}
              </p>
              <p className="review-text">{review.review}</p>
              {sessionUser && sessionUser.id === review.userId && (
                <div className="action-buttons">
                  <OpenModalButton
                    buttonText="Update"
                    modalComponent={
                      <UpdateReview spotId={spot.id} review={review} />
                    }
                  />
                  <OpenModalButton
                    buttonText="Delete"
                    modalComponent={<DeleteReview review={review} />}
                  />
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}

export default Reviews;
