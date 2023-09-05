// Importing required modules and components
import { getReviewsThunk } from "../../store/reviews";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import DeleteReview from "../DeleteReview";
import UpdateReview from "../UpdateReview/updateReview";
import OpenModalButton from "../OpenModalButton";
import { getSpotThunk } from "../../store/spots";
import "./Reviews.css";

function Reviews({ reviews, spot, sessionUser }) {
  // Using the Redux useSelector hook to select reviews from the Redux store
  const reviewsObj = useSelector((state) => state.reviews.spot);

  // Converting the reviews object into an array for easier mapping in the JSX
  let reviewList = Object.values(reviewsObj);

  // Using the useDispatch hook from Redux to dispatch actions
  const dispatch = useDispatch();

  // Array containing month names for date formatting
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

  // Using the useEffect hook to dispatch the getReviewsThunk action when the component mounts
  useEffect(() => {
    dispatch(getReviewsThunk(spot.id));
  }, [dispatch, spot]);

  // Calculating the average star rating for the spot, defaulting to 0 if not available
  let avgStarRating = spot.avgStarRating ? spot.avgStarRating : 0;

  // Formatting the average star rating for display, or showing "new" if not available
  let ratingDisplay = spot.avgStarRating
    ? spot.avgStarRating.toFixed(1)
    : " new";

  return (
    <div className="reviews-container">
      <h2 className="spot-title">Reviews for {spot.name}</h2>

      <h2 className="prompt-text">
        {/* Conditional rendering: Showing a prompt for the session user to post the first review
              if they're not the owner of the spot and no reviews exist yet */}
        {sessionUser &&
        spot.Owner &&
        sessionUser.id !== spot.Owner.id &&
        reviewList.length === 0 ? (
          <>Initiate the dialogue; post the first review.</>
        ) : (
          ""
        )}
      </h2>

      {/* Rendering a list of reviews if they exist */}
      {reviewList.length > 0 &&
        reviewList.map((review) => {
          // Formatting the review date using the monthNames array
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
              {/* Conditional rendering: Showing update and delete buttons for the session user's own reviews */}
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

// Exporting the Reviews component for use in other parts of the application
export default Reviews;
